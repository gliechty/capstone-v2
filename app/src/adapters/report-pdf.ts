import { chromium, type BrowserServer } from "playwright-core";

// One job per application process, no queue. Covers validation, rendering and cleanup.
const state = globalThis as typeof globalThis & { mosaicPdfBusy?: boolean };
export function acquirePdfJob(): (() => void) | null {
 if (state.mosaicPdfBusy) return null;
 state.mosaicPdfBusy = true;
 return () => { state.mosaicPdfBusy = false; };
}
export const PDF_TIMEOUT_MS = 30000;
export async function renderReportPdf(html: string): Promise<Buffer> {
 let server: BrowserServer | undefined;
 let timer: ReturnType<typeof setTimeout> | undefined;
 try {
  server = await chromium.launchServer({
   headless: true, timeout: 10000,
   // Container is non-root, read-only and capability-dropped; installed reports only.
   args: ["--disable-dev-shm-usage"],
   env: { PATH: process.env.PATH ?? "", HOME: process.env.TEMP ?? "/tmp",
    TMPDIR: process.env.TEMP ?? "/tmp", SYSTEMROOT: process.env.SYSTEMROOT ?? "" },
  });
  const ownedServer = server;
  const render = async () => {
   const browser = await chromium.connect(ownedServer.wsEndpoint());
   const context = await browser.newContext({ javaScriptEnabled: false, serviceWorkers: "block" });
   // Data assets are embedded; hyperlinks remain in the PDF but are never fetched.
   await context.route("**/*", route => route.abort("blockedbyclient"));
   const page = await context.newPage();
   page.setDefaultTimeout(10000);
   await page.setContent(html, { waitUntil: "load", timeout: 10000 });
   await page.evaluate(async () => {
    await document.fonts.ready;
    if (!document.fonts.check('16px Manrope') ||
     ![...document.images].every(image => image.complete && image.naturalWidth > 0))
     throw new Error("Report assets did not load");
   });
   return page.pdf({ format: "A4", preferCSSPageSize: true, printBackground: true,
    displayHeaderFooter: false });
  };
  return await Promise.race([
   render(),
   new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error("PDF render timed out")), PDF_TIMEOUT_MS - 10000);
   }),
  ]);
 } finally {
  if (timer) clearTimeout(timer);
  // kill() terminates the owned browser process tree and removes its temporary profile,
  // including when rendering times out; no shared browser/user profile is used.
  if (server) await server.kill();
 }
}

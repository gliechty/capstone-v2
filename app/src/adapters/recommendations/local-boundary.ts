// Local research boundary, not a substitute for production authentication or quotas.
export function isLocalRequest(request: Request, requireOrigin: boolean) {
  const url = new URL(request.url);
  const loopback = ["localhost", "127.0.0.1", "[::1]"];
  if (!loopback.includes(url.hostname) || !["http:", "https:"].includes(url.protocol)) return false;
  if (request.headers.has("forwarded")) return false;
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded && forwarded.split(",").some(value => !["127.0.0.1", "::1", "::ffff:127.0.0.1"].includes(value.trim()))) return false;
  // Next normalizes 127.0.0.1 in Request.url to localhost. The validated Host
  // header retains the browser's actual origin; never accept a non-loopback host.
  const host = request.headers.get("host");
  let external = url;
  if (host) {
    try { external = new URL(`${url.protocol}//${host}`); } catch { return false; }
    if (external.host.toLowerCase() !== host.toLowerCase() || !loopback.includes(external.hostname) || external.port !== url.port) return false;
  }
  const origin = request.headers.get("origin");
  if (origin ? origin !== external.origin : requireOrigin) return false;
  const fetchSite = request.headers.get("sec-fetch-site");
  return !fetchSite || fetchSite === "same-origin" || fetchSite === "none";
}
export function createLocalAdmission(now = Date.now) {
  let active = false; let attempts: number[] = [];
  return () => {
    const time = now(); attempts = attempts.filter(t => time - t < 60000);
    if (active) return { ok: false as const, code: "busy" };
    if (attempts.length >= 5) return { ok: false as const, code: "rate_limited" };
    active = true; attempts.push(time);
    return { ok: true as const, release: () => { active = false; } };
  };
}

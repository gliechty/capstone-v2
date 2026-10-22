import { previewEnabled } from "../adapters/preview-mode";
import type { Metadata } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import { landingCopy } from "../content/landing";
import "./globals.css";

const manrope = localFont({
  src: "../styles/fonts/Manrope-variable.ttf",
  variable: "--font-manrope",
  display: "swap",
  weight: "200 800",
});

const sourceSans = localFont({ src: [
  { path: "../styles/fonts/SourceSans3-Variable.woff2", style: "normal" },
  { path: "../styles/fonts/SourceSans3-Italic-Variable.woff2", style: "italic" },
], variable: "--font-source-sans", weight: "200 900", display: "swap" });
const sourceSerif = localFont({ src: [
  { path: "../styles/fonts/SourceSerif4-Variable.woff2", style: "normal" },
  { path: "../styles/fonts/SourceSerif4-Italic-Variable.woff2", style: "italic" },
], variable: "--font-source-serif", weight: "200 900", display: "swap" });

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: landingCopy.metadata.title,
  description: landingCopy.metadata.description,
  robots: { index: false, follow: false },
  icons: { icon: [{ url: "/brand/favicon.svg", type: "image/svg+xml" }, { url: "/brand/favicon.ico" }], apple: "/brand/apple-touch-icon.png" },
  openGraph: { title: "MOSAIC", description: landingCopy.metadata.description, images: [{ url: "/brand/og-image-1200x630.png", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: "MOSAIC", description: landingCopy.metadata.description, images: ["/brand/og-image-1200x630.png"] },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${sourceSans.variable} ${sourceSerif.variable}`}>
      <body>{previewEnabled() && <aside className="preview-notice" aria-label="Private preview"><strong>Private offline preview — synthetic recommendation examples</strong><p>No AI provider calls. Use synthetic data only. <a href="/preview">Preview controls</a></p></aside>}{children}</body>
    </html>
  );
}

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

export const metadata: Metadata = {
  title: landingCopy.metadata.title,
  description: landingCopy.metadata.description,
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={manrope.variable}>
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import "../../../styles/landing-brand.css";

const title = "Guy Liechty — Building MOSAIC";
const description = "Guy Liechty’s application design and development work on MOSAIC, building on Columbia University sustainability capstone research for S.E.E.";
const url = "https://preview.flowagentai.website/about/guy-liechty";
export const metadata: Metadata = {
  title, description,
  authors: [{ name: "Guy Liechty", url }],
  alternates: { canonical: url },
  robots: { index: true, follow: true },
  openGraph: { title, description, url, type: "website", images: [{ url: "/brand/og-image-1200x630.png", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title, description, images: ["/brand/og-image-1200x630.png"] },
};
const profile = {
  "@context": "https://schema.org",
  "@type": "ProfilePage", url, name: title,
  mainEntity: { "@type": "Person", "@id": url + "#person", name: "Guy Liechty", url, description: "Application design and development for MOSAIC." },
};
export default function AuthorshipPage() {
  return <div className="mosaic-landing">
    <a className="skip-link" href="#main-content">Skip to content</a>
    <header className="border-b border-line"><nav className="page-container py-8" aria-label="Main navigation"><Link className="nav-link" href="/">MOSAIC home</Link></nav></header>
    <main id="main-content" tabIndex={-1} className="page-container py-section">
      <div className="max-w-copy">
        <span className="section-label">The people behind the application</span>
        <h1 className="text-heading">Guy Liechty — Building MOSAIC</h1>
        <p className="mt-6 text-subheading">MOSAIC application design and development by Guy Liechty.</p>
        <p className="mt-6 text-muted">My work brings the project’s sustainability assessment into a working web application: business-context setup, questionnaire flows, deterministic scoring, recommendation and report delivery, and an accessible interface for small and medium enterprises.</p>
        <h2 className="mt-12 text-subheading">Built on a shared research foundation</h2>
        <p className="mt-6 text-muted">MOSAIC began as a Columbia University M.S. in Sustainability Management capstone project for the Society of Entrepreneurs and Ecology (S.E.E.). The original student team’s research, assessment methodology and calculator work are part of that foundation.</p>
        <p className="mt-6 text-muted">This application credit describes Guy Liechty’s design and development contribution. It does not claim sole authorship of the team’s research, methodology, calculator or source materials, or institutional endorsement.</p>
        <p className="mt-6"><a className="nav-link" href="https://conservationen.see.org.cn/">About S.E.E.</a></p>
        <Link className="button-primary mt-8" href="/">Explore MOSAIC</Link>
      </div>
    </main>
    <footer className="border-t border-line py-8"><div className="page-container text-small text-muted"><p>Columbia Climate School · SEE</p><p className="mt-4">Developed by students in Columbia University’s M.S. in Sustainability Management.</p></div></footer>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(profile) }} />
  </div>;
}

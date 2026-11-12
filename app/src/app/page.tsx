import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import "../styles/landing-brand.css";
import { LandingHeader } from "../components/landing-header";
import { landingCopy } from "../content/landing";
import { LandingScreenshot } from "../components/landing-screenshot";
import { LandingDisclosure } from "../components/landing-disclosure";
import { originExplanation, resultsExplanation, resultCards, methods, researchExplanations } from "../content/landing-details";

export const metadata: Metadata = {
  description: "MOSAIC sustainability assessment for small and medium enterprises. Application design and development by Guy Liechty, building on Columbia/S.E.E. capstone team research.",
  authors: [{ name: "Guy Liechty", url: "/about/guy-liechty" }],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

function ContextIllustration() {
  return (
    <svg viewBox="0 0 440 320" fill="none" aria-hidden="true" focusable="false" className="w-full">
      <image href="/brand/mosaic-mark.svg" x="110" y="50" width="220" height="220" preserveAspectRatio="xMidYMid meet" />
    </svg>
  );
}

export default function LandingPage() {
  return (
    <div id="top" className="mosaic-landing">
      <a href="#main-content" className="skip-link">{landingCopy.navigation.skip}</a>
      <LandingHeader>
        <a href="#main-content" className="flex min-h-12 items-center gap-3 font-semibold" aria-label={landingCopy.navigation.homeLabel}>
          <Image src="/brand/mosaic-mark-straight.svg" alt="" width={28} height={28} />
          <Image src="/brand/mosaic-wordmark.svg" alt="" width={94} height={20} />
        </a>
        <nav id="landing-navigation" aria-label={landingCopy.navigation.label} className="flex flex-wrap gap-x-6">
          <a className="nav-link" href="#context">{landingCopy.navigation.context}</a>
          <a className="nav-link" href="#outputs">What you receive</a>
          <a className="nav-link" href="#approach">{landingCopy.navigation.approach}</a>
          <a className="nav-link" href="#research">{landingCopy.navigation.research}</a>
        </nav>
      </LandingHeader>

      <main id="main-content" tabIndex={-1}>
        <section className="landing-hero page-container grid items-center gap-8 pb-section pt-12 md:grid-cols-[1.35fr_1fr] md:pt-16" aria-labelledby="hero-heading">
          <div className="intro-enter">
            <p className="section-label">{landingCopy.hero.identity}<br /><em className="font-normal">{landingCopy.hero.attribution}</em></p>
            <hgroup><h1 id="hero-heading" className="max-w-copy text-display">{landingCopy.hero.headingFirstLine}</h1><p className="mt-4 max-w-copy text-subheading italic">{landingCopy.hero.headingSecondLine}</p></hgroup>
            <p className="mt-6 max-w-copy text-muted">{landingCopy.hero.description}</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
              <Link className="button-primary" href="/assessment">{landingCopy.hero.primaryCta}<span aria-hidden="true">↗</span>
              </Link>
              <Link className="button-secondary" href="/assessment/quick">Start quick assessment</Link>
              <a href="#outputs" className="text-link">{landingCopy.hero.secondaryCta}<span className="ml-2" aria-hidden="true">↓</span></a>
            </div>
          </div>
          <figure className="landing-hero-art mx-auto w-full max-w-md text-foreground">
            <ContextIllustration />
          </figure>
        </section>

        <section id="demo" className="page-container pb-section" aria-labelledby="demo-heading">
          <div className="grid overflow-hidden rounded-panel border border-line bg-surface shadow-panel md:grid-cols-[1fr_1.2fr]">
            <div className="p-8 md:p-12">
              <span className="section-label">{landingCopy.demo.label}</span>
              <h2 id="demo-heading" className="text-heading">{landingCopy.demo.headingFirstLine}<br />{landingCopy.demo.headingSecondLine}</h2>
              <p className="mt-6 max-w-copy text-muted">{landingCopy.demo.description}</p>
            </div>
            <div className="relative flex min-h-64 flex-col items-center justify-center border-t border-line bg-[#faf8f3] text-center md:border-t-0 md:border-l">
              <div className="absolute inset-0">
              <video controls preload="metadata" playsInline poster="/media/mosaic-explainer-poster.jpg" aria-label="MOSAIC explainer film, 92 seconds" className="h-full w-full object-contain">
                <source src="/media/mosaic-explainer-narrated-2026-11-03-1080p.mp4" type="video/mp4" media="(max-width: 639px)" />
                <source src="/media/mosaic-explainer-narrated-2026-11-03-1080p.mp4" type="video/mp4" />
                <track kind="captions" srcLang="en" label="English" src="/media/mosaic-explainer-narrated-2026-11-03.en.vtt" default />
                Your browser cannot play this video. <a href="/media/mosaic-explainer-narrated-2026-11-03-1080p.mp4">Download the MOSAIC explainer</a>.
              </video>
              </div>
            </div>
          </div>
        </section>

        <section id="context" className="border-y border-line bg-muted-surface py-section" aria-labelledby="context-heading">
          <div className="page-container">
            <div className="grid gap-8 md:grid-cols-[1fr_1.4fr] md:gap-16">
              <div><span className="section-label">01 / The context behind MOSAIC</span><h2 id="context-heading" className="text-heading">One global ambition.<br />Many local realities.</h2></div>
              <div className="max-w-copy"><p>Small businesses face reporting frameworks, buyer questionnaires and local expectations that don’t always ask for the same things. What matters varies by industry, market and business.</p><p className="mt-6 text-muted">MOSAIC draws on these sources to select relevant questions, score your answers and recommend next steps for your business.</p><p className="mt-6 text-muted">MOSAIC began as a Columbia M.S. in Sustainability Management capstone project for the <a className="text-link landing-inline-link" href="https://conservationen.see.org.cn/">Society of Entrepreneurs and Ecology (S.E.E.)</a>, with a brief to create a global sustainability rating system for small and medium enterprises.</p></div>
            </div>
            <div className="mt-8"><LandingDisclosure explanation={originExplanation} /></div>
          </div>
        </section>

        <section id="outputs" className="page-container py-section" aria-labelledby="outputs-heading">
          <span className="section-label">02 / What you receive</span>
          <h2 id="outputs-heading" className="text-heading">A score is the beginning.</h2>
          <p className="mt-6 max-w-copy text-muted">Complete the assessment and explore your scores, approach, and next steps.</p><p className="mt-3 text-small text-muted">Examples from the real app, using a fictional company. Select an image to enlarge it.</p>
          <div className="mt-8 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {resultCards.map(card => <article className="border-t border-line pt-6" key={card.title}>
              <LandingScreenshot title={card.title} screenshot={card.screenshot} alt={card.alt} /><Image src={"/portraits/" + card.icon} alt="" width={32} height={32} />
              <h3 className="mt-4 text-subheading">{card.title}</h3><p className="mt-3 text-muted">{card.text}</p>
            </article>)}
          </div>
          <div className="mt-8"><LandingDisclosure explanation={resultsExplanation} /></div>
          <Link className="button-primary mt-8" href="/assessment">Start your assessment <span aria-hidden="true">↗</span></Link>
        </section>

        <section id="approach" className="border-y border-line bg-muted-surface py-section" aria-labelledby="approach-heading">
          <div className="page-container">
            <span className="section-label">03 / How the method works</span>
            <div className="grid gap-6 md:grid-cols-2 md:gap-16"><h2 id="approach-heading" className="text-heading">AI where it helps.<br />Explicit rules where it counts.</h2><p className="max-w-copy text-muted">Standards and buyer requirements are turned into questions before you start. Fixed rules score your answers. AI uses your results and selected source passages to recommend next steps.</p></div>
            <div className="mt-12 space-y-8">
              {methods.map((method, index) => <article id={method.id} className="landing-method" key={method.id}>
                <div className="flex items-start gap-4"><Image src={"/portraits/" + method.icon} alt="" width={32} height={32} /><div><span className="text-small text-accent" aria-hidden="true">0{index + 1}</span><h3 className="mt-2 text-subheading">{method.title}</h3><p className="mt-3 max-w-copy text-muted">{method.description}</p></div></div>
                <div className="mt-6"><LandingDisclosure explanation={method.explanation} headingLevel={4} /></div>
              </article>)}
            </div>
          </div>
        </section>

        <section id="research" className="page-container py-section" aria-labelledby="research-heading">
          <span className="section-label">04 / Research behind the work</span>
          <h2 id="research-heading" className="text-heading">Explore the work.<br />Inspect the evidence.</h2>
          <p className="mt-6 max-w-copy text-muted">Explore the origins and subsequent 3rd-party research behind MOSAIC</p>
          <div className="mt-8 grid items-start gap-8 md:grid-cols-2">
            {researchExplanations.map(research => <article key={research.title}><h3 className="text-subheading">{research.title}</h3><p className="mt-4 mb-6 text-muted">{research.description}</p><LandingDisclosure explanation={research.explanation} headingLevel={4} /></article>)}
          </div>
          <div className="mt-8">
            <details className="research-detail landing-disclosure"><summary>{landingCopy.research.verificationHeading}</summary><div className="landing-detail-body"><p>{landingCopy.research.verificationBody}</p></div></details>
            <details className="research-detail landing-disclosure"><summary>{landingCopy.research.limitationsHeading}</summary><div className="landing-detail-body"><p>The authors compare ratings of listed companies, not verified outcomes for SMEs. They report extraction noise (κ = 0.62–0.76), A-share-derived factor weights transferred across markets, and no validation against subsequent firm outcomes. Their intensity-proportion workbook still uses the prior weighting method. MOSAIC’s scores and AI advice remain separate from assurance; historical factors and benchmarks have geography, year and source limits.</p></div></details>
          </div>
        </section>

        <section className="border-t border-line bg-muted-surface py-section" aria-labelledby="closing-heading">
          <div className="page-container"><span className="section-label">Your context. Your next steps.</span><h2 id="closing-heading" className="text-heading">The pieces that matter.</h2><p className="mt-6 text-muted">Start with what you know. Explore where to focus.</p><Link className="button-primary mt-8" href="/assessment">Start your assessment <span aria-hidden="true">↗</span></Link><p className="mt-6 max-w-copy text-small text-muted">{landingCopy.footer.credit} {landingCopy.footer.scope}</p></div>
        </section>

      </main>

      <footer className="border-t border-line py-8">
        <div className="page-container flex flex-wrap items-center justify-between gap-6 text-small text-muted">
          <p><span className="font-semibold text-foreground">{landingCopy.navigation.brand}</span>{landingCopy.footer.tagline}</p>
          <p>{landingCopy.footer.attribution}</p>
          <p>MOSAIC application design and development by <Link className="nav-link" href="/about/guy-liechty">Guy Liechty</Link>.</p>
          <a href="#main-content" className="nav-link">{landingCopy.footer.backToTop}</a>
        </div>
      </footer>
    </div>
  );
}

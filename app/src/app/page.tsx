import Link from "next/link";
import Image from "next/image";
import "../styles/landing-brand.css";
import { LandingHeader } from "../components/landing-header";
import { landingCopy } from "../content/landing";

export default function LandingPage() {
  return (
    <div className="mosaic-landing">
      <a href="#main-content" className="skip-link">{landingCopy.navigation.skip}</a>
      <LandingHeader>
        <a href="#main-content" className="flex min-h-12 items-center gap-3 font-semibold" aria-label={landingCopy.navigation.homeLabel}>
          <Image src="/brand/mosaic-mark-straight.svg" alt="" width={28} height={28} className="brand-header-mark" />
          <Image src="/brand/mosaic-wordmark.svg" alt="" width={94} height={20} className="brand-header-wordmark" />
        </a>
        <nav aria-label={landingCopy.navigation.label} className="flex flex-wrap gap-x-6">
          <a className="nav-link" href="#context">{landingCopy.navigation.context}</a>
          <a className="nav-link" href="#approach">{landingCopy.navigation.approach}</a>
          <a className="nav-link" href="#research">{landingCopy.navigation.research}</a>
        </nav>
      </LandingHeader>

      <main id="main-content" tabIndex={-1}>
        <section className="page-container grid items-center gap-8 pb-section pt-12 md:grid-cols-[1.35fr_1fr] md:pt-16" aria-labelledby="hero-heading">
          <div className="intro-enter">
            <p className="section-label">{landingCopy.hero.attribution}</p>
            <h1 id="hero-heading" className="max-w-copy text-display">{landingCopy.hero.headingFirstLine}<br />{landingCopy.hero.headingSecondLine}</h1>
            <p className="brand-subtitle mt-6 max-w-copy">{landingCopy.hero.subtitle}</p>
            <p className="mt-6 max-w-copy text-muted">{landingCopy.hero.description}</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
              <Link className="button-primary" href="/assessment" aria-describedby="assessment-availability">{landingCopy.hero.primaryCta}<span aria-hidden="true">↗</span>
              </Link>
              <a href="#approach" className="text-link">{landingCopy.hero.secondaryCta}<span className="ml-2" aria-hidden="true">↓</span></a>
            </div>
            <p id="assessment-availability" className="mt-3 text-small text-muted">{landingCopy.hero.availability}</p>
          </div>
          <div className="brand-hero-mark" aria-hidden="true">
            <Image src="/brand/mosaic-mark.svg" alt="" width={220} height={220} priority />
          </div>
        </section>

        <section id="demo" className="page-container pb-section" aria-labelledby="demo-heading">
          <div className="max-w-copy">
            <span className="section-label">{landingCopy.demo.label}</span>
            <h2 id="demo-heading" className="text-heading">{landingCopy.demo.headingFirstLine}<br />{landingCopy.demo.headingSecondLine}</h2>
            <p className="mt-6 text-muted">{landingCopy.demo.description}</p>
          </div>
          <figure className="brand-film mt-8">
            <video controls preload="metadata" playsInline poster="/media/mosaic-explainer-poster.jpg" aria-label="MOSAIC explainer film, 90 seconds" className="aspect-video w-full rounded-panel border border-line">
              <source src="/media/mosaic-explainer-720p.mp4" type="video/mp4" media="(max-width: 639px)" />
              <source src="/media/mosaic-explainer-1080p.mp4" type="video/mp4" />
              <track kind="captions" srcLang="en" label="English" src="/media/mosaic-explainer.en.vtt" default />
              Your browser cannot play this video. <a href="/media/mosaic-explainer-720p.mp4">Download the MOSAIC explainer</a>.
            </video>
            <figcaption className="mt-3 text-small text-muted">{landingCopy.demo.caption}</figcaption>
            <p className="mt-2 text-small text-muted">{landingCopy.demo.limitation}</p>
          </figure>
        </section>

        <section id="context" className="border-y border-line bg-muted-surface py-section" aria-labelledby="context-heading">
          <div className="page-container grid gap-8 md:grid-cols-[1fr_1.4fr] md:gap-16">
            <div>
              <span className="section-label">{landingCopy.context.label}</span>
              <h2 id="context-heading" className="text-heading">{landingCopy.context.headingFirstLine}<br />{landingCopy.context.headingSecondLine}</h2>
            </div>
            <div className="max-w-copy">
              <p>{landingCopy.context.intro}</p>
              <p className="mt-6 text-muted">{landingCopy.context.body}</p>
            </div>
          </div>
        </section>

        <section id="approach" className="page-container py-section" aria-labelledby="approach-heading">
          <span className="section-label">{landingCopy.approach.label}</span>
          <div className="grid gap-6 md:grid-cols-2 md:gap-16">
            <h2 id="approach-heading" className="text-heading">{landingCopy.approach.heading}</h2>
            <p className="max-w-copy text-muted">{landingCopy.approach.description}</p>
          </div>
          <ol className="mt-12 grid gap-8 md:grid-cols-3">
            <li className="border-t border-line-strong pt-6">
              <span className="text-small text-accent" aria-hidden="true">01</span>
              <h3 className="mt-4 text-subheading">{landingCopy.approach.firstHeading}</h3>
              <p className="mt-4 text-muted">{landingCopy.approach.firstBody}</p>
            </li>
            <li className="border-t border-line-strong pt-6">
              <span className="text-small text-accent" aria-hidden="true">02</span>
              <h3 className="mt-4 text-subheading">{landingCopy.approach.secondHeading}</h3>
              <p className="mt-4 text-muted">{landingCopy.approach.secondBody}</p>
            </li>
            <li className="border-t border-line-strong pt-6">
              <span className="text-small text-accent" aria-hidden="true">03</span>
              <h3 className="mt-4 text-subheading">{landingCopy.approach.thirdHeading}</h3>
              <p className="mt-4 text-muted">{landingCopy.approach.thirdBody}</p>
            </li>
          </ol>
        </section>

        <section id="research" className="border-t border-line py-section" aria-labelledby="research-heading">
          <div className="page-container grid gap-8 md:grid-cols-[1fr_1.4fr] md:gap-16">
            <div>
              <span className="section-label">{landingCopy.research.label}</span>
              <h2 id="research-heading" className="text-heading">{landingCopy.research.headingFirstLine}<br />{landingCopy.research.headingSecondLine}</h2>
              <p className="mt-6 max-w-copy text-muted">{landingCopy.research.intro}</p>
              <h3 className="mt-6 text-subheading">{landingCopy.research.expansion}</h3>
              <p className="mt-4 text-small text-muted">{landingCopy.research.methodName}: bringing requirements from multiple organizations together, adapting their relevance to the business context.</p>
            </div>
            <div>
              <details className="research-detail" open>
                <summary>{landingCopy.research.methodHeading}</summary>
                <p>{landingCopy.research.methodBody}</p>
              </details>
              <details className="research-detail">
                <summary>{landingCopy.research.verificationHeading}</summary>
                <p>{landingCopy.research.verificationBody}</p>
              </details>
              <details className="research-detail">
                <summary>{landingCopy.research.limitationsHeading}</summary>
                <p>{landingCopy.research.limitationsBody}</p>
              </details>
            </div>
          </div>
        </section>
        <section className="border-t border-line bg-muted-surface py-section" aria-labelledby="closing-heading">
          <div className="page-container text-center">
            <h2 id="closing-heading" className="text-heading"><span className="sr-only">Start your assessment. </span>{landingCopy.closing.heading}</h2>
            <Link className="button-primary mt-8" href="/assessment">{landingCopy.hero.primaryCta}</Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-line py-8">
        <div className="page-container flex flex-wrap items-center justify-between gap-6 text-small text-muted">
          <div className="max-w-copy">
            <Image src="/brand/mosaic-wordmark.svg" alt="MOSAIC" width={85} height={18} />
            <p className="mt-4">{landingCopy.footer.expansion}</p>
            <p className="mt-3">{landingCopy.footer.credit}</p>
            <p className="mt-2">{landingCopy.footer.attribution}</p>
            <p className="mt-3">{landingCopy.footer.scope}</p>
          </div>
          <a href="#main-content" className="nav-link">{landingCopy.footer.backToTop}</a>
        </div>
      </footer>
    </div>
  );
}

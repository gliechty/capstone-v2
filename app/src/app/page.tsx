import { landingCopy } from "../content/landing";

function ContextIllustration() {
  return (
    <svg viewBox="0 0 440 320" fill="none" aria-hidden="true" focusable="false" className="w-full">
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M40 254C122 251 286 257 402 252" />
        <path d="M76 250L78 151L146 151L145 252M84 151L83 132L136 131L137 151" />
        <path d="M94 172H108V188H94ZM117 172H131V188H117ZM94 202H108V218H94ZM118 202H131V218H118ZM106 252V233H122V252" />
        <path d="M293 251L294 137L360 132L361 251M304 151H318M333 150H348M304 175H318M333 174H348M304 199H318M333 198H348M319 251V226H337V251" />
        <path d="M151 220C180 182 249 179 288 219M151 227C191 203 250 203 288 228" />
        <path d="M167 207L168 248M186 193L186 250M206 187L206 251M229 187L229 251M250 194L250 249M270 205L270 251" />
      </g>
      <g stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round">
        <path d="M133 108C171 72 251 71 288 105M276 91L290 106L271 109" />
        <path d="M184 60L182 51M212 56L213 44M240 62L245 52" />
      </g>
      <circle cx="217" cy="116" r="5" fill="var(--accent)" />
    </svg>
  );
}

export default function LandingPage() {
  return (
    <>
      <a href="#main-content" className="skip-link">{landingCopy.navigation.skip}</a>
      <header className="page-container flex flex-wrap items-center justify-between gap-x-8 gap-y-2 py-6">
        <a href="#main-content" className="flex min-h-12 items-center gap-3 font-semibold" aria-label={landingCopy.navigation.homeLabel}>
          <span className="text-accent" aria-hidden="true">↗</span>
          <span>{landingCopy.navigation.brand}<span className="ml-2 text-small font-normal text-muted">{landingCopy.navigation.tagline}</span></span>
        </a>
        <nav aria-label={landingCopy.navigation.label} className="flex flex-wrap gap-x-6">
          <a className="nav-link" href="#context">{landingCopy.navigation.context}</a>
          <a className="nav-link" href="#approach">{landingCopy.navigation.approach}</a>
          <a className="nav-link" href="#research">{landingCopy.navigation.research}</a>
        </nav>
      </header>

      <main id="main-content" tabIndex={-1}>
        <section className="page-container grid items-center gap-8 pb-section pt-12 md:grid-cols-[1.35fr_1fr] md:pt-16" aria-labelledby="hero-heading">
          <div className="intro-enter">
            <p className="section-label">{landingCopy.hero.attribution}</p>
            <h1 id="hero-heading" className="max-w-copy text-display">{landingCopy.hero.headingFirstLine}<br />{landingCopy.hero.headingSecondLine}</h1>
            <p className="mt-6 max-w-copy text-muted">{landingCopy.hero.description}</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
              <button className="button-primary" type="button" disabled aria-describedby="assessment-availability">{landingCopy.hero.primaryCta}<span aria-hidden="true">↗</span>
              </button>
              <a href="#approach" className="text-link">{landingCopy.hero.secondaryCta}<span className="ml-2" aria-hidden="true">↓</span></a>
            </div>
            <p id="assessment-availability" className="mt-3 text-small text-muted">{landingCopy.hero.availability}</p>
          </div>
          <figure className="mx-auto w-full max-w-md text-foreground">
            <ContextIllustration />
            <figcaption className="flex justify-between border-t border-line pt-4 text-small text-muted">
              <span>{landingCopy.hero.illustrationLeft}</span><span>{landingCopy.hero.illustrationRight}</span>
            </figcaption>
          </figure>
        </section>

        <section id="demo" className="page-container pb-section" aria-labelledby="demo-heading">
          <div className="grid overflow-hidden rounded-panel border border-line bg-surface shadow-panel md:grid-cols-[1fr_1.2fr]">
            <div className="p-8 md:p-12">
              <span className="section-label">{landingCopy.demo.label}</span>
              <h2 id="demo-heading" className="text-heading">{landingCopy.demo.headingFirstLine}<br />{landingCopy.demo.headingSecondLine}</h2>
              <p className="mt-6 max-w-copy text-muted">{landingCopy.demo.description}</p>
            </div>
            <div className="flex min-h-64 flex-col items-center justify-center gap-4 border-t border-line bg-accent-soft p-8 text-center md:border-t-0 md:border-l">
              <svg aria-hidden="true" focusable="false" viewBox="0 0 96 64" className="h-16 w-24 text-accent" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M7 8L89 6L90 56L6 57ZM7 18L89 16M16 12H18M23 12H25M30 12H32M37 31L61 30M37 40L67 39M37 48L54 47M17 31H26V47H17Z" />
              </svg>
              <p className="font-semibold">{landingCopy.demo.status}</p>
              <p className="max-w-copy text-small text-muted">{landingCopy.demo.placeholder}</p>
            </div>
          </div>
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
      </main>

      <footer className="border-t border-line py-8">
        <div className="page-container flex flex-wrap items-center justify-between gap-6 text-small text-muted">
          <p><span className="font-semibold text-foreground">{landingCopy.navigation.brand}</span>{landingCopy.footer.tagline}</p>
          <p>{landingCopy.footer.attribution}</p>
          <a href="#main-content" className="nav-link">{landingCopy.footer.backToTop}</a>
        </div>
      </footer>
    </>
  );
}

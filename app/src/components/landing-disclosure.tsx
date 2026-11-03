import type { Explanation } from "../content/landing-details";

export function LandingDisclosure({ explanation, headingLevel = 3 }: { explanation: Explanation; headingLevel?: 3 | 4 }) {
  const Heading = headingLevel === 3 ? "h3" : "h4";
  return <details className="research-detail landing-disclosure">
    <summary>{explanation.summary}</summary>
    <div className="landing-detail-body">
      {explanation.blocks.map(block => <div className="landing-detail-block" key={block.heading}>
        <Heading className="text-subheading">{block.heading}</Heading>
        {block.formula && <pre className="landing-formula"><code>{block.formula}</code></pre>}
        {block.paragraphs?.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
        {block.links && <ul className="landing-source-links">{block.links.map(link => <li key={link.label}><a className="text-link landing-inline-link" href={link.href} download={link.download || undefined}>{link.label}</a></li>)}</ul>}
        {block.items && <ul>{block.items.map(item => <li key={item}>{item}</li>)}</ul>}
      </div>)}
      {explanation.media && <aside className="landing-planned-media" aria-label={"Planned video: " + explanation.media.title}>
        <span className="text-small font-semibold text-accent">Planned video · not yet available</span>
        <Heading className="mt-2 text-subheading">{explanation.media.title}</Heading>
        <p>{explanation.media.description}</p>
      </aside>}
    </div>
  </details>;
}

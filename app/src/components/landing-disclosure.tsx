import { landingVideos } from "../content/landing-videos";
import type { Explanation } from "../content/landing-details";

export function LandingDisclosure({ explanation, headingLevel = 3 }: { explanation: Explanation; headingLevel?: 3 | 4 }) {
  const video = explanation.media ? landingVideos[explanation.media.title] : undefined;
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
      {video && <figure className="media mt-6">
        <video controls preload="none" playsInline poster={`/media/${video.stem}_poster.jpg`} width={1920} height={1080} aria-label={explanation.media?.title} className="block aspect-video h-auto w-full">
          <source src={`/media/${video.stem}_1080p.mp4`} type="video/mp4" />
          <track kind="captions" src={`/media/${video.stem}.en.vtt`} srcLang="en" label="English" default />
        </video>
        <figcaption className="mt-2 text-small">{video.caption} <a className="text-link landing-inline-link" href={`/media/${video.stem}_transcript.txt`}>Transcript</a></figcaption>
      </figure>}
    </div>
  </details>;
}

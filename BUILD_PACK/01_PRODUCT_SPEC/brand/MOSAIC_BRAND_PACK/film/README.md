# MOSAIC explainer film (v3, narrated)

| File | Spec |
|---|---|
| `mosaic-explainer-1080p.mp4` | 1920×1080, 30 fps, H.264 High + AAC, 1:30, about 18.7 MB. Desktop and tablet. |
| `mosaic-explainer-720p.mp4` | 1280×720, same audio, about 8.9 MB. Mobile. |
| `mosaic-explainer.en.vtt` | English captions (WebVTT), timed to the narration. |
| `mosaic-explainer-poster.jpg` | 1920×1080 poster frame: the end card (mark, MOSAIC, "The pieces that matter. A clearer way forward."). |

Made 2026-10-21 from the approved v3 film (`VIDEO_V3/mosaic_explainer_v3.html`) and the ElevenLabs narration (`VIDEO_V3/narration_elevenlabs_v1.mp3`), rendered frame by frame so no frames are dropped. The narration is placed scene by scene with the same timing the in-browser player uses. Captions are not burned into the picture; the VTT file carries them.

If the film changes, re-render these files rather than editing them.

Embed (see `PLACEMENT.md`, film section):

```html
<video controls preload="metadata" playsinline poster="/media/mosaic-explainer-poster.jpg"
       style="width:100%;aspect-ratio:16/9" aria-label="MOSAIC explainer film, 90 seconds">
  <source src="/media/mosaic-explainer-720p.mp4" type="video/mp4" media="(max-width: 639px)">
  <source src="/media/mosaic-explainer-1080p.mp4" type="video/mp4">
  <track kind="captions" srclang="en" label="English" src="/media/mosaic-explainer.en.vtt" default>
</video>
```

Some browsers ignore `media` on `<source>`; they play the 1080p file, which is fine on mobile too.

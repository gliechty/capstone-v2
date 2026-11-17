import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/about/guy-liechty"].map(path => ({ url: "https://preview.flowagentai.website" + path }));
}

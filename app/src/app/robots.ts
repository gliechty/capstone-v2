import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/preview"] }, sitemap: "https://preview.flowagentai.website/sitemap.xml" };
}

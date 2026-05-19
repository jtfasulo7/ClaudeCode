import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://regentgoodsliquidation.com";
  const lastModified = new Date();
  return [
    {
      url: `${base}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${base}/inquire`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];
}

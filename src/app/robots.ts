import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://tcm.my.id/sitemap.xml",
    host: "https://tcm.my.id",
  };
}

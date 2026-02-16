import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseURL = "https://suksan-massage.ch";
  
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${baseURL}/sitemap.xml`,
  };
}

import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseURL = "https://suksan-massage.com";
  const locales = ["de", "en"];
  const paths = ["/", "/services", "/contact"];

  const sitemap: MetadataRoute.Sitemap = [];

  paths.forEach((path) => {
    locales.forEach((locale) => {
      // For default locale 'de', we might want to list it as /de/ path or just / if we redirect?
      // With localePrefix: 'always', it's /de, /en.
      // So let's list both.
      
      const url = `${baseURL}/${locale}${path === "/" ? "" : path}`;
      
      sitemap.push({
        url,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: path === "/" ? 1.0 : 0.8,
      });
    });
  });

  return sitemap;
}

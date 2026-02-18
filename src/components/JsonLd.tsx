import { WithContext, LocalBusiness } from "schema-dts";
import fs from "fs";
import path from "path";

export default async function JsonLd() {
  const configPath = path.join(process.cwd(), "src", "resources", "config.json");
  let config = { openingHours: { start: "10:00", end: "20:00" } };
  
  try {
    if (fs.existsSync(configPath)) {
        config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    }
  } catch (e) {
    console.error("Failed to read config", e);
  }

  const jsonLd: WithContext<LocalBusiness> = {
    "@context": "https://schema.org",
    "@type": "MassageShop" as any,
    "name": "Suksan Massage",
    "image": "https://suksan-massage.com/images/og/home.jpg",
    "telephone": "+41 76 259 05 33",
    "email": "info@suksan-massage.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Weingartstrasse 57",
      "addressLocality": "Bern",
      "postalCode": "3014",
      "addressCountry": "CH"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 46.958, 
      "longitude": 7.458
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": config.openingHours.start,
        "closes": config.openingHours.end
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": config.openingHours.start,
        "closes": config.openingHours.end
      }
    ],
    "priceRange": "$$",
    "sameAs": [
      "https://www.instagram.com/suksanmassage",
      "https://www.facebook.com/suksanmassage"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

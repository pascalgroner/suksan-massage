import { WithContext, LocalBusiness } from "schema-dts";

const jsonLd: WithContext<LocalBusiness> = {
  "@context": "https://schema.org",
  "@type": "MassageShop" as any,
  "name": "Suksan Massage",
  "image": "https://suksan-massage.ch/images/og/home.jpg",
  "telephone": "+41 31 123 45 67",
  "email": "info@suksan-massage.ch",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Musterstrasse 12",
    "addressLocality": "Bern",
    "postalCode": "3000",
    "addressCountry": "CH"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 46.947974,
    "longitude": 7.444975
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "10:00",
      "closes": "20:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Saturday",
      "opens": "10:00",
      "closes": "18:00"
    }
  ],
  "priceRange": "$$",
  "sameAs": [
    "https://www.instagram.com/suksanmassage",
    "https://www.facebook.com/suksanmassage"
  ]
};

export default function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

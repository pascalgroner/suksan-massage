// IMPORTANT: Replace with your own domain address - it's used for SEO in meta tags and schema
const baseURL = "https://suksan-massage.com";

// Import and set font for each variant
import { Playfair_Display, Prompt, Geist_Mono } from "next/font/google";

const heading = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const body = Prompt({
  variable: "--font-body",
  weight: ["300", "400", "500", "600"],
  subsets: ["latin", "thai"],
  display: "swap",
});

const label = Prompt({
  variable: "--font-label",
  weight: ["400", "600"],
  subsets: ["latin", "thai"],
  display: "swap",
});

const code = Geist_Mono({
  variable: "--font-code",
  subsets: ["latin"],
  display: "swap",
});

const fonts = {
  heading: heading,
  body: body,
  label: label,
  code: code,
};

// default customization applied to the HTML in the main layout.tsx
const style = {
  theme: "light", // dark | light | system
  neutral: "rose", // sand | gray | slate | mint | rose | dusk | custom
  brand: "emerald", // blue | indigo | violet | magenta | pink | red | orange | yellow | moss | green | emerald | aqua | cyan
  accent: "rose", // blue | indigo | violet | magenta | pink | red | orange | yellow | moss | green | emerald | aqua | cyan
  solid: "contrast", // color | contrast | inverse
  solidStyle: "flat", // flat | plastic
  border: "playful", // rounded | playful | conservative | sharp
  surface: "filled", // filled | translucent
  transition: "all", // all | micro | macro
  scaling: "100", // 90 | 95 | 100 | 105 | 110
};

const dataStyle = {
  variant: "gradient", // flat | gradient | outline
  mode: "categorical", // categorical | divergent | sequential
  height: 24, // default chart height
  axis: {
    stroke: "var(--neutral-alpha-weak)",
  },
  tick: {
    fill: "var(--neutral-on-background-weak)",
    fontSize: 11,
    line: false
  },
};

// metadata for pages
const meta = {
  home: {
    path: "/",
    title: "Suksan Massage - Authentic Thai Massage in Bern City",
    description:
      "Experience professional Nuad Thai and Oil Massage in Bern, Switzerland. Certified therapists for back pain relief and relaxation.",
    image: "/images/og/home.jpg",
    canonical: "https://suksan-massage.com",
    robots: "index,follow",
    alternates: [{ href: "https://suksan-massage.com", hrefLang: "de" }],
  },
  // add more routes and reference them in page.tsx
};

// default schema data
const schema = {
  logo: "",
  type: "LocalBusiness",
  name: "Suksan Massage",
  description: meta.home.description,
  email: "info@suksan-massage.com",
};

// social links
const social = {
  twitter: "",
  linkedin: "",
  discord: "",
  instagram: "https://www.instagram.com/suksanmassage",
  facebook: "https://www.facebook.com/suksanmassage"
};

export { baseURL, fonts, style, meta, schema, social, dataStyle };

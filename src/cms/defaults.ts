// Central source of truth for all editable site content.
// Frontend components read merged values from useContent(); admin edits fields.

import { productsTwoWheelerDefault, type TwoWheelerContent } from "./products2w";

export const SECTIONS = [
  "global",
  "footer",
  "buy_dialog",
  "emails",
  "hero",
  "trust",
  "features",
  "range",
  "stats",
  "why_lohix",
  "warranty",
  "dealer_cta",
  "products_page",
  "product",
  "products_2w",
  "specs",
  "about",
  "dealer",
] as const;

export type SectionKey = (typeof SECTIONS)[number];

export const SECTION_LABELS: Record<SectionKey, string> = {
  global: "Global settings",
  footer: "Footer",
  buy_dialog: "Where to buy pop-up",
  emails: "Auto-reply emails",
  hero: "Hero",
  trust: "Certification strip",
  features: "Engineered specs",
  range: "The range",
  stats: "By the numbers",
  why_lohix: "Why LOHIX",
  warranty: "Warranty registration",
  dealer_cta: "Dealer CTA",
  products_page: "All products page",
  product: "LOHIX 48 · e-rickshaw",
  products_2w: "2W batteries",
  specs: "Specs page",
  about: "About page",
  dealer: "Dealer page",
};

// Sidebar grouping in the admin studio.
export const SECTION_GROUPS: { label: string; sections: SectionKey[] }[] = [
  { label: "Site-wide", sections: ["global", "footer", "buy_dialog", "emails"] },
  {
    label: "Landing page",
    sections: [
      "hero",
      "trust",
      "features",
      "range",
      "stats",
      "why_lohix",
      "warranty",
      "dealer_cta",
    ],
  },
  { label: "Products", sections: ["products_page", "product", "products_2w", "specs"] },
  { label: "Company", sections: ["about", "dealer"] },
];

// Where each section can be seen on the public site ("View on site" in the studio).
export const SECTION_PATHS: Record<SectionKey, string> = {
  global: "/",
  footer: "/",
  buy_dialog: "/#buy",
  emails: "/#warranty",
  hero: "/",
  trust: "/",
  features: "/#features",
  range: "/",
  stats: "/",
  why_lohix: "/",
  warranty: "/#warranty",
  dealer_cta: "/#dealer",
  products_page: "/products",
  product: "/product",
  products_2w: "/products#2w",
  specs: "/specs",
  about: "/about",
  dealer: "/dealer",
};

export const SECTION_DESCRIPTIONS: Record<SectionKey, string> = {
  global: "Logo, brand colour, contact email and phone — used site-wide.",
  footer: "Tagline, dealer button, Explore links, contact lines, copyright.",
  buy_dialog:
    "The pop-up every 'Where to buy' / #buy link opens. Phone numbers come from the footer contact lines and the global phone.",
  emails:
    "Automatic replies sent after a warranty registration or dealer application. Use {name}, {serial} and {city} as placeholders.",
  hero: "Chip, headline, subline, CTAs, background video, trust strip.",
  trust:
    "Scrolling certification strip. Only list claims you can evidence — every item here is a public product claim.",
  features: "Nine spec tiles with category filters.",
  range: "Two category cards linking to the products page.",
  stats:
    "Counters that animate up on scroll — write values as a number with a unit, e.g. '3500+' or '5.12kWh'.",
  why_lohix: "Eyebrow, headline, four value cards.",
  warranty: "Heading, intro copy, and the coverage checklist.",
  dealer_cta: "Copy, bullet points, form labels.",
  products_page:
    "/products — SEO, hero, category copy, comparison, estimator, CTA. Also the section titles shared by every product page.",
  product: "/product — showcase media, name, key figures, overview, features, spec sheet, CTA.",
  products_2w: "Shared copy, feature cards and CTA, plus one entry per model (/products/<slug>).",
  specs: "/specs — SEO, hero, spec explorer, comparison table, CTA.",
  about: "/about — SEO, hero & CTAs, mission & stats, timeline, values, facility.",
  dealer: "/dealer — SEO, hero, benefits, onboarding steps, city step, FAQs.",
};

export type GlobalContent = {
  logoUrl: string;
  brandName: string;
  primaryColor: string;
  contactEmail: string;
  contactPhone: string;
};

export type HeroContent = {
  videoUrl: string;
  videoUrlMobile: string;
  chipBadge: string;
  chipText: string;
  headlineLine1: string;
  headlineHighlight: string;
  headlineLine2: string;
  subline: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
  trustItems: string[];
};

export type TrustContent = {
  eyebrow: string;
  items: string[];
};

export type StatItem = { value: string; label: string; sub?: string };
export type StatsContent = {
  eyebrow: string;
  headingPrefix: string;
  headingHighlight: string;
  items: StatItem[];
};

export type WarrantyContent = {
  eyebrow: string;
  headingPrefix: string;
  headingHighlight: string;
  headingSuffix: string;
  body: string;
  bullets: string[];
};

export type FeatureItem = {
  id: string;
  label: string;
  value: string;
  unit?: string;
  title: string;
  body: string;
  icon: string;
  category: "Power" | "Lifecycle" | "Safety" | "Origin";
};

export type FeaturesContent = {
  eyebrow: string;
  headingPrefix: string;
  headingHighlight: string;
  headingSuffix: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  items: FeatureItem[];
};

export type WhyLohixCard = { icon: string; title: string; body: string };
export type WhyLohixContent = {
  eyebrow: string;
  headingPrefix: string;
  headingHighlight: string;
  headingSuffix: string;
  body: string;
  cards: WhyLohixCard[];
};

export type DealerCtaContent = {
  eyebrow: string;
  headingPrefix: string;
  headingHighlight: string;
  body: string;
  benefits: string[];
  buttonLabel: string;
  footnote: string;
};

export type FooterContent = {
  tagline: string;
  dealerButton: { label: string; href: string };
  exploreHeading: string;
  contactHeading: string;
  copyright: string;
  slogan: string;
  productLinks: { label: string; href: string }[];
  contactLines: string[];
};

export type ProductContent = {
  heroImage: string;
  eyebrow: string;
  titleMain: string;
  titleAccent: string;
  tagline: string;
  quickStats: { k: string; v: string }[];
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
  overviewHeading: string;
  overviewParagraphs: string[];
  useCases: string[];
  featuresHeading: string;
  featuresBody: string;
  features: { icon: string; title: string; body: string }[];
  specsHeading: string;
  specBadges: { icon: string; label: string }[];
  specGroups: { title: string; rows: { label: string; value: string }[] }[];
  ctaEyebrow: string;
  ctaHeading: string;
  ctaHighlight: string;
  ctaBody: string;
  datasheetUrl: string;
};

export type SeoMeta = {
  title: string;
  description: string;
  ogImage: string;
  canonical: string;
};

export type AboutContent = {
  seo: SeoMeta;
  heroEyebrow: string;
  heroTitlePrefix: string;
  heroTitleHighlight: string;
  heroTitleSuffix: string;
  heroBody: string;
  heroCtaPrimary: { label: string; href: string };
  heroCtaSecondary: { label: string; href: string };
  missionEyebrow: string;
  missionHeadingPrefix: string;
  missionHeadingHighlight: string;
  missionParagraphs: string[];
  stats: { k: string; v: string }[];
  timelineEyebrow: string;
  timelineHeading: string;
  timeline: { year: string; title: string; body: string }[];
  valuesEyebrow: string;
  valuesHeading: string;
  values: { icon: string; title: string; body: string }[];
  facilityEyebrow: string;
  facilityHeading: string;
  facilityBody: string;
  facilityImage: string;
  facilityCity: string;
  facilityRegion: string;
  facilityCoordinates: string;
  facilityCompany: string;
  facilityCtaPrimary: { label: string; href: string };
  facilityCtaSecondary: { label: string; href: string };
};

export type DealerContent = {
  seo: SeoMeta;
  heroEyebrow: string;
  heroTitlePrefix: string;
  heroTitleHighlight: string;
  heroBody: string;
  ctaPrimary: { label: string; href: string };
  showPhoneCta: boolean;
  benefitsEyebrow: string;
  benefitsHeading: string;
  benefitsSubtext: string;
  benefits: { icon: string; title: string; body: string }[];
  stepsEyebrow: string;
  stepsHeading: string;
  steps: { n: string; t: string; b: string }[];
  cityEyebrow: string;
  cityHeading: string;
  cityBody: string;
  cityQuestion: string;
  cityHint: string;
  cityPlaceholder: string;
  cityButton: string;
  faqEyebrow: string;
  faqHeading: string;
  faqs: { q: string; a: string }[];
};

export type SpecsContent = {
  seo: SeoMeta;
  heroEyebrow: string;
  heroTitlePrefix: string;
  heroTitleHighlight: string;
  heroTitleSuffix: string;
  heroBody: string;
  explorerHint: string;
  datasheetEyebrow: string;
  datasheetHeading: string;
  datasheetBody: string;
  datasheetDownloadLabel: string;
  datasheetDownloadHref: string;
  datasheetViewLabel: string;
  twoWheelerCtaLabel: string;
  comparisonEyebrow: string;
  comparisonHeading: string;
  comparisonColA: string;
  comparisonColB: string;
  comparisonRows: { k: string; a: string; b: string }[];
  ctaEyebrow: string;
  ctaHeading: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
};

export const globalDefault: GlobalContent = {
  logoUrl: "/logo_lohix.png",
  brandName: "LOHIX",
  primaryColor: "#B7E26D",
  contactEmail: "hello@lohixenergy.com",
  contactPhone: "+91 00000 00000",
};

export const heroDefault: HeroContent = {
  videoUrl: "",
  videoUrlMobile: "",
  chipBadge: "NEW",
  chipText: "Register your LOHIX warranty",
  headlineLine1: "Power that moves",
  headlineHighlight: "a billion",
  headlineLine2: "journeys.",
  subline:
    "Smart LiFePO4 packs built in India — 51.2V for e-rickshaws, 60.8V and 64V for electric two-wheelers. Real BMS protection. Local service.",
  ctaPrimary: { label: "Register warranty", href: "#warranty" },
  ctaSecondary: { label: "Explore the range", href: "/products" },
  trustItems: [
    "Live BMS · 24/7",
    "Sealed design · certification pending",
    "5 models",
    "Made in India",
  ],
};

export const trustDefault: TrustContent = {
  eyebrow: "Built in India, on certified cells",
  items: ["BIS Certified Cells (R-41147877)", "Made in India", "Grade A+ LFP"],
};

export const statsDefault: StatsContent = {
  eyebrow: "By the numbers",
  headingPrefix: "Engineered to outlast",
  headingHighlight: "every charge.",
  items: [
    { value: "5", label: "Battery models", sub: "One e-rickshaw pack, four for 2W" },
    { value: "2500+", label: "Charge cycles", sub: "3500+ on the LOHIX 48" },
    { value: "64V", label: "Top platform voltage", sub: "51.2V, 60.8V and 64V packs" },
    { value: "5.12kWh", label: "Largest pack", sub: "From 1824Wh on the 2W range" },
  ],
};

export const warrantyDefault: WarrantyContent = {
  eyebrow: "Warranty registration",
  headingPrefix: "Activate your",
  headingHighlight: "LOHIX",
  headingSuffix: "warranty.",
  body: "Register within 30 days of purchase to unlock your full warranty coverage and priority service.",
  bullets: [
    "3-year coverage on cells and BMS — standard variant",
    "4-year coverage on cells and BMS — GPS variant",
    "Priority on-ground service in East India",
  ],
};

export const featuresDefault: FeaturesContent = {
  eyebrow: "Engineered specs",
  headingPrefix: "Everything that makes",
  headingHighlight: "every LOHIX pack",
  headingSuffix: "relentless.",
  body: "Nine engineering decisions shared across the range — from the 51.2V e-rickshaw pack to the 60.8V and 64V two-wheeler packs.",
  ctaLabel: "Talk to engineering",
  ctaHref: "#dealer",
  items: [
    {
      id: "voltage",
      label: "Voltage",
      value: "64",
      unit: "V · from 51.2V",
      title: "A platform for every drivetrain",
      body: "51.2V for e-rickshaw drive systems, 60.8V and 64V for electric two-wheelers.",
      icon: "Zap",
      category: "Power",
    },
    {
      id: "capacity",
      label: "Capacity",
      value: "100",
      unit: "Ah · from 30Ah",
      title: "Commuter to full shift",
      body: "30Ah and 45Ah packs for two-wheelers, 100Ah for a full e-rickshaw shift.",
      icon: "Battery",
      category: "Power",
    },
    {
      id: "energy",
      label: "Energy",
      value: "5.12",
      unit: "kWh · from 1.8kWh",
      title: "Dense, efficient packs",
      body: "From 1824Wh in the compact 2W pack to 5.12kWh on the LOHIX 48.",
      icon: "Activity",
      category: "Power",
    },
    {
      id: "cycles",
      label: "Cycles",
      value: "2500+",
      unit: "every pack",
      title: "Years of daily duty",
      body: "2500+ cycles across the 2W range, 3500+ on the LOHIX 48 — lead-acid manages about 500.",
      icon: "RefreshCw",
      category: "Lifecycle",
    },
    {
      id: "ip",
      label: "Ingress",
      value: "Sealed",
      unit: "design",
      title: "Built for monsoon roads",
      body: "An IP67 design standard on the LOHIX 48, dust- and splash-resistant enclosures across the 2W range. Third-party certification is pending.",
      icon: "Shield",
      category: "Safety",
    },
    {
      id: "bms",
      label: "BMS",
      value: "Smart",
      unit: "multi-layer",
      title: "Real-time protection, every pack",
      body: "Multi-layer BMS on all five models: cell balancing, thermal cutoff, and fault telemetry — live.",
      icon: "Cpu",
      category: "Safety",
    },
    {
      id: "models",
      label: "Range",
      value: "5",
      unit: "models",
      title: "One range, two vehicle classes",
      body: "The LOHIX 48 for e-rickshaws, plus 60.8V and 64V packs in 30Ah and 45Ah for two-wheelers.",
      icon: "TrendingUp",
      category: "Power",
    },
    {
      id: "maintenance",
      label: "Upkeep",
      value: "Zero",
      unit: "maintenance",
      title: "Nothing to top up",
      body: "Sealed LFP packs across the range — no watering, no acid checks, no seasonal servicing.",
      icon: "BadgeCheck",
      category: "Lifecycle",
    },
    {
      id: "origin",
      label: "Origin",
      value: "Made",
      unit: "in India",
      title: "Engineered in Kolkata",
      body: "Every pack assembled in West Bengal and serviced by a team that knows the routes it runs on.",
      icon: "MapPin",
      category: "Origin",
    },
  ],
};

export const whyLohixDefault: WhyLohixContent = {
  eyebrow: "Why LOHIX",
  headingPrefix: "Built to",
  headingHighlight: "outlast",
  headingSuffix: ".",
  body: "Every choice — chemistry, BMS, enclosure, service — is shared across the range and tuned for Indian duty cycles. Not theory. Field-proven.",
  cards: [
    {
      icon: "Shield",
      title: "Smart BMS protection",
      body: "Cell balancing, over-charge, over-discharge, and thermal cutoff — automatic and always-on.",
    },
    {
      icon: "Repeat",
      title: "2500–3500+ cycle life",
      body: "Outlasts lead-acid several times over on every pack — dramatically lower cost per kilometer.",
    },
    {
      icon: "MapPin",
      title: "Local service, Kolkata",
      body: "Based in West Bengal. Fast replacement and on-ground support across the East.",
    },
    {
      icon: "Flag",
      title: "Made in India",
      body: "Proudly manufactured under stringent quality and safety standards.",
    },
  ],
};

export const dealerCtaDefault: DealerCtaContent = {
  eyebrow: "Become a dealer",
  headingPrefix: "Grow with",
  headingHighlight: "LOHIX",
  body: "Partner with LOHIX to sell smart LFP batteries in your city. Training, healthy margins, and on-ground support — built in.",
  benefits: ["Healthy unit economics", "Dedicated regional manager", "Co-marketing & training"],
  buttonLabel: "Request dealership",
  footnote: "We'll reach out within 48 hours.",
};

export const footerDefault: FooterContent = {
  tagline:
    "Power. Performance. Possibilities. Smart LFP batteries built for the roads of Eastern India.",
  dealerButton: { label: "Become a dealer", href: "/dealer" },
  exploreHeading: "Explore",
  contactHeading: "Contact",
  copyright: "© 2026 Aishwarya Nirman Private Limited. All rights reserved.",
  slogan: "Built Smart. Built Safe. Built LOHIX.",
  productLinks: [
    { label: "Lohix Energy", href: "/product" },
    { label: "Specs", href: "/#features" },
    { label: "Warranty", href: "/#warranty" },
  ],
  contactLines: ["Kolkata, West Bengal", "lohixenergy.com"],
};

export const productDefault: ProductContent = {
  heroImage: "",
  eyebrow: "Lithium energy system · LiFePO4",
  titleMain: "LOHIX",
  titleAccent: "48",
  tagline:
    "51.2V · 100Ah · 3500+ cycles. A premium LFP energy system engineered for India's electric mobility.",
  quickStats: [
    { k: "51.2 V", v: "Output" },
    { k: "100 Ah", v: "Capacity" },
    { k: "3500+", v: "Life cycles" },
    { k: "IP67", v: "Design" },
  ],
  ctaPrimary: { label: "Register warranty", href: "/#warranty" },
  ctaSecondary: { label: "Find a dealer", href: "/#dealer" },
  overviewHeading: "A premium LFP system, built for daily duty.",
  overviewParagraphs: [
    "Lohix Energy is a high-performance Lithium Iron Phosphate (LiFePO4) battery system engineered specifically for India's evolving electric mobility ecosystem. Built for e-rickshaw applications, the battery delivers a 48V nominal voltage with a powerful 51.2V output and 100Ah capacity — ensuring reliable performance, longer operational life, and efficient energy delivery.",
    "Equipped with advanced Smart BMS protection, fast charging compatibility, and high-temperature resilience, the system is designed for durability, safety, and consistent power management under demanding conditions. Built to an IP67 design standard (certification pending) on BIS-certified Grade A+ cells, Lohix Energy is maintenance-free and capable of delivering 3500+ life cycles.",
  ],
  useCases: [
    "E-Rickshaw fleets",
    "Last-mile EV cargo",
    "Smart electric transportation",
    "Indian mobility ecosystem",
  ],
  featuresHeading: "Every cell, every circuit, engineered for Indian roads.",
  featuresBody:
    "Chosen for reliability under heat, dust, vibration, and the uncompromising rhythm of daily duty cycles.",
  features: [
    {
      icon: "Cpu",
      title: "Smart BMS Protection",
      body: "Multi-layer Battery Management System monitors voltage, current, temperature, and cell balance in real time.",
    },
    {
      icon: "Zap",
      title: "Fast Charging Compatible",
      body: "Engineered for rapid energy replenishment without compromising long-term cell health.",
    },
    {
      icon: "RefreshCw",
      title: "3500+ Life Cycles",
      body: "LFP chemistry delivers years of reliable daily-duty operation with minimal degradation.",
    },
    {
      icon: "Thermometer",
      title: "High-temp Protection",
      body: "Stable performance across the punishing climate conditions of Eastern and Northern India.",
    },
    {
      icon: "Droplets",
      title: "IP67 Design",
      body: "Sealed industrial enclosure engineered to an IP67 design standard for rain, dust, and rough roads. Certification pending.",
    },
    {
      icon: "Factory",
      title: "Built in India",
      body: "Designed, assembled, and serviced locally for India's evolving EV mobility ecosystem.",
    },
  ],
  specsHeading: "The full sheet.",
  specBadges: [
    { icon: "Battery", label: "LFP Chemistry" },
    { icon: "Gauge", label: "Smart Monitoring" },
    { icon: "ShieldCheck", label: "BIS Certified Cells" },
  ],
  specGroups: [
    {
      title: "Electrical",
      rows: [
        { label: "Nominal voltage", value: "48 V" },
        { label: "Output voltage", value: "51.2 V" },
        { label: "Capacity", value: "100 Ah" },
        { label: "Energy", value: "5.12 kWh" },
      ],
    },
    {
      title: "Chemistry & life",
      rows: [
        { label: "Chemistry", value: "LiFePO4" },
        { label: "Life cycles", value: "3500+" },
        { label: "Maintenance", value: "Zero" },
        { label: "Charging", value: "Fast charge ready" },
      ],
    },
    {
      title: "Build & safety",
      rows: [
        { label: "Protection", value: "IP67 design (cert. pending)" },
        { label: "BMS", value: "Smart, multi-layer" },
        { label: "Cell certification", value: "BIS R-41147877" },
        { label: "Operating temp", value: "−10° to 60°C" },
        { label: "Origin", value: "Made in India" },
      ],
    },
  ],
  ctaEyebrow: "Ready when you are",
  ctaHeading: "Built Smart. Built Safe.",
  ctaHighlight: "Built LOHIX.",
  ctaBody:
    "Register your Lohix Energy warranty or connect with an authorized dealer to power your fleet today.",
  datasheetUrl: "",
};

export const aboutDefault: AboutContent = {
  seo: {
    title: "About — LOHIX Energy",
    description:
      "Built in Kolkata, engineered for India. The story, mission, and people behind LOHIX smart LFP batteries.",
    ogImage: "/og-image.jpg",
    canonical: "https://lohixenergy.com/about",
  },
  heroEyebrow: "About LOHIX",
  heroTitlePrefix: "Built for the",
  heroTitleHighlight: "roads",
  heroTitleSuffix: "we ride on.",
  heroBody:
    "LOHIX is a Kolkata-born energy company building smart LFP batteries for India's electric mobility — engineered, assembled, and serviced locally.",
  heroCtaPrimary: { label: "Explore our batteries", href: "/products" },
  heroCtaSecondary: { label: "Become a dealer", href: "/dealer" },
  missionEyebrow: "Mission",
  missionHeadingPrefix: "Power that earns its keep —",
  missionHeadingHighlight: "every cycle, every shift.",
  missionParagraphs: [
    "India's electric transition runs on small fleets — drivers, owner-operators, last-mile cargo. Their margin lives and dies by the battery under the seat.",
    "We started LOHIX because the batteries on those routes didn't deserve those drivers. Lead-acid, unmanaged Lithium, mystery imports. We chose LFP, built our own BMS, sealed the enclosure to IP67, and put service two hours from the route.",
  ],
  stats: [
    { k: "3", v: "Years of R&D" },
    { k: "100%", v: "Made in India" },
    { k: "50+", v: "Cities served" },
    { k: "24/7", v: "Live BMS" },
  ],
  timelineEyebrow: "The road so far",
  timelineHeading: "Three years from a parking-lot prototype to a production line.",
  timeline: [
    {
      year: "2022",
      title: "Field research begins",
      body: "Months on the ground with e-rickshaw drivers across Kolkata, Howrah, and Asansol. Real duty cycles, real failures.",
    },
    {
      year: "2023",
      title: "First LFP prototype",
      body: "A 48V LFP pack survives an Eastern Indian monsoon. The thesis becomes a product.",
    },
    {
      year: "2024",
      title: "Smart BMS shipped",
      body: "In-house BMS with live telemetry, thermal cutoff, and cell balancing — production-ready.",
    },
    {
      year: "2025",
      title: "Lohix Energy launches",
      body: "Full production from our Kolkata facility. 3500+ cycles, IP67, on-ground service across the East.",
    },
  ],
  valuesEyebrow: "What we believe",
  valuesHeading: "Four principles, etched into every pack.",
  values: [
    {
      icon: "ShieldCheck",
      title: "We never compromise on quality",
      body: "Compromise isn't something we believe in. LFP chemistry, a multi-layer BMS and a sealed enclosure design are engineered defaults, not upsells.",
    },
    {
      icon: "Compass",
      title: "Designed for the daily duty",
      body: "We build for the real route — heat, dust, monsoon, overload. Not for a lab bench.",
    },
    {
      icon: "Leaf",
      title: "Cleaner per kilometer",
      body: "5× cycle life over lead-acid means less landfill, less acid leakage, more clean kilometers.",
    },
    {
      icon: "Users",
      title: "Local, accountable service",
      body: "Our team is two hours from most of our fleets. We pick up the phone. We show up.",
    },
  ],
  facilityEyebrow: "Facility · Kolkata",
  facilityHeading: "Assembled and tested two hours from your route.",
  facilityBody:
    "Every LOHIX pack is assembled, cell-matched, and pressure-tested at our facility in West Bengal — and serviced by a team that knows the roads it'll run on.",
  facilityImage: "",
  facilityCity: "Kolkata,",
  facilityRegion: "West Bengal",
  facilityCoordinates: "22.5726° N · 88.3639° E",
  facilityCompany: "Aishwarya Nirman Private Limited",
  facilityCtaPrimary: { label: "Become a dealer", href: "/dealer" },
  facilityCtaSecondary: { label: "See the specs", href: "/specs" },
};

export const dealerDefault: DealerContent = {
  seo: {
    title: "Become a LOHIX Dealer — Partner Program",
    description:
      "Become a LOHIX channel partner. Healthy margins, regional support, warranty serviced locally from Kolkata.",
    ogImage: "/og-image.jpg",
    canonical: "https://lohixenergy.com/dealer",
  },
  heroEyebrow: "Dealer partnership",
  heroTitlePrefix: "Grow with",
  heroTitleHighlight: "LOHIX",
  heroBody:
    "Become a LOHIX channel partner in your city. Healthy margins, regional support, warranty serviced two hours from your route.",
  ctaPrimary: { label: "Request dealership", href: "#apply" },
  showPhoneCta: true,
  benefitsEyebrow: "Why partner with LOHIX",
  benefitsHeading: "A channel program built around the people selling it.",
  benefitsSubtext:
    "We treat the dealer as the product. Every decision — pricing, training, claims — runs through that filter.",
  benefits: [
    {
      icon: "HandCoins",
      title: "Healthy unit economics",
      body: "Transparent slabs, protected territories, and margins built for repeat-fleet business.",
    },
    {
      icon: "Users",
      title: "Dedicated regional manager",
      body: "A single human accountable for your zone — onboarding, demand, claims, and growth.",
    },
    {
      icon: "LineChart",
      title: "Co-marketing & training",
      body: "Driver-facing collateral, hands-on BMS training, and joint outreach to fleet operators.",
    },
    {
      icon: "ShieldCheck",
      title: "Warranty backed locally",
      body: "3-year warranty (4 years on GPS variants) serviced from Kolkata. Fast claim turnaround, parts on the shelf.",
    },
  ],
  stepsEyebrow: "How it works",
  stepsHeading: "From first message to first sale, in four steps.",
  steps: [
    {
      n: "01",
      t: "Submit interest",
      b: "Tell us your city, current product mix, and rough monthly volume. Two minutes.",
    },
    {
      n: "02",
      t: "Regional call",
      b: "A 30-minute conversation with our regional manager for your zone.",
    },
    {
      n: "03",
      t: "Onboard & train",
      b: "Documentation, product training, BMS diagnostics, and your first stock shipment.",
    },
    {
      n: "04",
      t: "Go live",
      b: "We co-launch in your market with collateral, demo packs, and lead support.",
    },
  ],
  cityEyebrow: "Your city",
  cityHeading: "Tell us where you operate.",
  cityBody: "Add your city and it carries straight into the application form below.",
  cityQuestion: "Which city do you operate in?",
  cityHint: "We'll carry it straight into your application below.",
  cityPlaceholder: "Your city",
  cityButton: "Apply for",
  faqEyebrow: "Frequently asked",
  faqHeading: "Questions, answered.",
  faqs: [
    {
      q: "What kind of dealer are you looking for?",
      a: "Established battery, e-rickshaw spares, or EV component dealers with on-ground service capability and a real presence in their city.",
    },
    {
      q: "Do I need to carry stock?",
      a: "Yes — we work with stocking partners. Initial stock requirements depend on your zone and projected volume, discussed during onboarding.",
    },
    {
      q: "How are territories handled?",
      a: "We agree the area you'll serve with you during onboarding, so both sides are clear before you go live.",
    },
    {
      q: "How fast is warranty service?",
      a: "Claims raised through your dashboard are typically resolved within 5–7 working days, with parts shipped from Kolkata.",
    },
    {
      q: "What's the typical payback for a dealer?",
      a: "Most partners reach steady-state margins within the first quarter of going live, depending on city and outreach intensity.",
    },
  ],
};

export const specsDefault: SpecsContent = {
  seo: {
    title: "LOHIX Specs — E-Rickshaw & 2W LiFePO4 Battery Datasheets",
    description:
      "Full specifications for every LOHIX battery: the LOHIX 48 e-rickshaw pack and the 60.8V / 64V two-wheeler range. Smart BMS, LiFePO4 chemistry, LFP vs lead-acid compared.",
    ogImage: "/og-image.jpg",
    canonical: "https://lohixenergy.com/specs",
  },
  heroEyebrow: "Datasheets · The LOHIX range",
  heroTitlePrefix: "The full",
  heroTitleHighlight: "spec",
  heroTitleSuffix: "sheet.",
  heroBody:
    "Every LOHIX pack, parameter by parameter — the LOHIX 48 for e-rickshaws and the 60.8V and 64V packs for two-wheelers.",
  explorerHint: "Hover a tile",
  datasheetEyebrow: "Complete datasheet",
  datasheetHeading: "Every model, every parameter.",
  datasheetBody:
    "Pick a battery to see its full spec sheet. Charging and discharge ratings are in the downloadable datasheet for dealers and fleet buyers.",
  datasheetDownloadLabel: "Download PDF",
  datasheetDownloadHref: "#download",
  datasheetViewLabel: "View",
  twoWheelerCtaLabel: "2W battery specs",
  comparisonEyebrow: "LFP vs Lead-acid",
  comparisonHeading: "Why fleets are switching, one number at a time.",
  comparisonColA: "Lead-acid",
  comparisonColB: "Lohix Energy (LFP)",
  comparisonRows: [
    { k: "Life cycles", a: "~500", b: "3500+" },
    { k: "Weight (per kWh)", a: "≈ 30 kg", b: "≈ 7 kg" },
    { k: "Maintenance", a: "Monthly top-up", b: "Zero" },
    { k: "Charge time", a: "8–10 hrs", b: "2–3 hrs" },
    { k: "Thermal safety", a: "Vented acid", b: "Smart BMS + LFP" },
    { k: "Ingress rating", a: "—", b: "IP67 design (cert. pending)" },
  ],
  ctaEyebrow: "Ready for the field",
  ctaHeading: "See the Lohix Energy in your fleet.",
  ctaPrimary: { label: "Where to buy", href: "#buy" },
  ctaSecondary: { label: "Product overview", href: "/product" },
};

export type Link = { label: string; href: string };

export type RangeContent = {
  eyebrow: string;
  heading: string;
  highlight: string;
  body: string;
  linkPrefix: string;
  /** Link on the "coming soon" card under the category cards. */
  comingSoonLink: Link;
};

export const rangeDefault: RangeContent = {
  eyebrow: "The range",
  heading: "One pack for the e-rickshaw.",
  highlight: "Four for two wheels.",
  body: "From full-shift e-rickshaw packs to everyday two-wheeler power — every LOHIX battery is built on LiFePO4 chemistry and a smart BMS.",
  linkPrefix: "Explore",
  comingSoonLink: { label: "See what's coming", href: "/products#coming-soon" },
};

export type BuyDialogContent = {
  eyebrow: string;
  heading: string;
  body: string;
  callLabel: string;
  emailLabel: string;
  emailSubject: string;
  dealerPrompt: string;
  dealerLink: Link;
};

export const buyDialogDefault: BuyDialogContent = {
  eyebrow: "Buy LOHIX",
  heading: "Talk to our sales team",
  body: "Call or email us and we'll connect you with the nearest authorized dealer for pricing and availability.",
  callLabel: "Call sales",
  emailLabel: "Email",
  emailSubject: "Buying LOHIX batteries",
  dealerPrompt: "Want to sell LOHIX?",
  dealerLink: { label: "Become a dealer", href: "/dealer" },
};

export type ProductsPageContent = {
  seo: SeoMeta;
  heroEyebrow: string;
  heroTitle: string;
  heroAccent: string;
  heroBody: string;
  estimatorChip: { k: string; v: string };
  erickshawLabel: string;
  erickshawHeading: string;
  compareHeading: string;
  compareNote: string;
  estimatorEyebrow: string;
  estimatorHeading: string;
  estimatorBody: string;
  ctaEyebrow: string;
  ctaHeading: string;
  ctaHighlight: string;
  ctaBody: string;
  ctaPrimary: Link;
  ctaSecondary: Link;
  // Section titles shared by /product and every /products/<slug> page.
  overviewEyebrow: string;
  featuresEyebrow: string;
  builtForLabel: string;
  galleryEyebrow: string;
  galleryHeading: string;
  specsEyebrow: string;
  datasheetHeading: string;
  datasheetDownloadLabel: string;
  datasheetRequestLabel: string;
  productEstimatorHeading: string;
  productEstimatorBody: string;
  rangeEyebrow: string;
  viewAllLabel: string;
  stickyBuyLabel: string;
  // Announcement band for packs that are not on sale yet. Blank heading hides it.
  comingSoon: {
    label: string;
    heading: string;
    body: string;
    packs: { voltage: string; capacities: string }[];
    note: string;
    cta: Link;
  };
};

export const productsPageDefault: ProductsPageContent = {
  seo: {
    title: "Products — LOHIX Smart LiFePO4 Batteries | E-Rickshaw & 2W",
    description:
      "The LOHIX range: the LOHIX 48 e-rickshaw battery and 60.8V / 64V LiFePO4 packs for electric two-wheelers. Smart BMS, long cycle life, built in India.",
    ogImage: "/og-image.jpg",
    canonical: "https://lohixenergy.com/products",
  },
  heroEyebrow: "The LOHIX range",
  heroTitle: "Pick the pack",
  heroAccent: "for your vehicle.",
  heroBody:
    "Smart LiFePO4 batteries for India's electric mobility — from full-shift e-rickshaw packs to everyday two-wheeler power.",
  estimatorChip: { k: "Range estimator", v: "Which pack fits?" },
  erickshawLabel: "E-Rickshaw Batteries",
  erickshawHeading: "Built for the daily duty of Indian fleets.",
  compareHeading: "Compare the range",
  compareNote: "Full datasheets are available for dealers and fleet buyers.",
  estimatorEyebrow: "Range estimator",
  estimatorHeading: "Which pack covers your day?",
  estimatorBody:
    "Pick a battery, set your daily distance and your vehicle's energy use. We'll show the range per charge and how long the rated cycle life lasts.",
  ctaEyebrow: "Need help choosing?",
  ctaHeading: "Not sure which pack fits?",
  ctaHighlight: "Talk to our team.",
  ctaBody:
    "We'll help you choose the right voltage and capacity for your vehicle and daily duty cycle, and point you to the nearest authorized dealer.",
  ctaPrimary: { label: "Where to buy", href: "#buy" },
  ctaSecondary: { label: "Register warranty", href: "/#warranty" },
  overviewEyebrow: "Overview",
  featuresEyebrow: "Engineering",
  builtForLabel: "Built for",
  galleryEyebrow: "Gallery",
  galleryHeading: "Every angle.",
  specsEyebrow: "Specifications",
  datasheetHeading: "Full datasheet",
  datasheetDownloadLabel: "Download full datasheet",
  datasheetRequestLabel: "Request the datasheet",
  productEstimatorHeading: "How far will it take you?",
  productEstimatorBody:
    "Set your daily distance and your vehicle's energy use to see the range per charge and how long the rated cycle life lasts at that pace.",
  rangeEyebrow: "The range",
  viewAllLabel: "View all products",
  stickyBuyLabel: "Where to buy",
  comingSoon: {
    label: "Coming soon",
    heading: "E-Loader battery packs.",
    body: "Higher-voltage LiFePO4 packs for electric loaders are on the way, built on the same smart BMS and cell quality as the rest of the LOHIX range.",
    packs: [
      { voltage: "60V", capacities: "125 · 150 · 200 Ah" },
      { voltage: "72V", capacities: "125 · 150 · 200 Ah" },
    ],
    note: "Specifications are being finalised. Dealers and fleet buyers can register interest now.",
    cta: { label: "Talk to our team", href: "#buy" },
  },
};

export type EmailsContent = {
  warrantySubject: string;
  warrantyHeading: string;
  warrantyBody: string;
  dealerSubject: string;
  dealerHeading: string;
  dealerBody: string;
  signOff: string;
  footer: string;
};

export const emailsDefault: EmailsContent = {
  warrantySubject: "Your LOHIX warranty is registered — {serial}",
  warrantyHeading: "Thanks, {name}. Your warranty is registered.",
  warrantyBody:
    "We've recorded the battery below against your name. Keep this email with your purchase invoice — you'll need both for any service or warranty claim.\n\nIf anything here looks wrong, reply to this email and our team will correct it.",
  dealerSubject: "We've received your LOHIX dealership application",
  dealerHeading: "Thanks, {name}. Your application is in.",
  dealerBody:
    "Our team reviews every application personally and will call you within 48 hours to talk through {city}, your current business and the next steps.\n\nIn the meantime, reply to this email if there's anything you'd like us to know.",
  signOff: "Team LOHIX",
  footer:
    "LOHIX Energy · Aishwarya Nirman Private Limited · Kolkata, West Bengal · lohixenergy.com",
};

export const DEFAULTS = {
  global: globalDefault,
  hero: heroDefault,
  trust: trustDefault,
  features: featuresDefault,
  stats: statsDefault,
  why_lohix: whyLohixDefault,
  warranty: warrantyDefault,
  dealer_cta: dealerCtaDefault,
  footer: footerDefault,
  buy_dialog: buyDialogDefault,
  emails: emailsDefault,
  range: rangeDefault,
  products_page: productsPageDefault,
  product: productDefault,
  products_2w: productsTwoWheelerDefault,
  about: aboutDefault,
  dealer: dealerDefault,
  specs: specsDefault,
} as const;

// Full-bleed first-screen media for /product. Optional: falls back to the product cut-out.
export type ShowcaseMedia = {
  showcaseImage?: string;
  showcaseImageMobile?: string;
  showcaseVideo?: string;
};

export type ContentMap = {
  global: GlobalContent;
  hero: HeroContent;
  trust: TrustContent;
  features: FeaturesContent;
  stats: StatsContent;
  why_lohix: WhyLohixContent;
  warranty: WarrantyContent;
  dealer_cta: DealerCtaContent;
  footer: FooterContent;
  buy_dialog: BuyDialogContent;
  emails: EmailsContent;
  range: RangeContent;
  products_page: ProductsPageContent;
  product: ProductContent & ShowcaseMedia;
  products_2w: TwoWheelerContent;
  about: AboutContent;
  dealer: DealerContent;
  specs: SpecsContent;
};

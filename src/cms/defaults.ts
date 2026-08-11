// Central source of truth for all editable site content.
// Frontend components read merged values from useContent(); admin edits fields.

export const SECTIONS = [
  "global",
  "hero",
  "trust",
  "features",
  "stats",
  "why_lohix",
  "warranty",
  "dealer_cta",
  "footer",
  "product",
  "about",
  "dealer",
  "specs",
] as const;

export type SectionKey = (typeof SECTIONS)[number];

export const SECTION_LABELS: Record<SectionKey, string> = {
  global: "Global settings",
  hero: "Landing · Hero",
  trust: "Landing · Certification strip",
  features: "Landing · Engineered specs",
  stats: "Landing · By the numbers",
  why_lohix: "Landing · Why LOHIX",
  warranty: "Landing · Warranty registration",
  dealer_cta: "Landing · Dealer CTA",
  footer: "Footer",
  product: "Product page · Lohix Energy",
  about: "About page",
  dealer: "Dealer page",
  specs: "Specs page",
};

export const SECTION_DESCRIPTIONS: Record<SectionKey, string> = {
  global: "Logo, brand colour, contact details — used site-wide.",
  hero: "Landing hero — chip, headline, subline, CTAs, background video, trust strip.",
  trust:
    "Scrolling certification strip. Only list claims you can evidence — every item here is a public product claim.",
  features: "Engineered specs section — 9 spec tiles with category filters.",
  stats:
    "'By the numbers' counters. Values animate up on scroll — write them as plain numbers with a unit, e.g. '3500+' or '5.12kWh'.",
  why_lohix: "Why LOHIX section — eyebrow, headline, four value cards.",
  warranty: "Warranty registration block — heading, intro copy, and the coverage checklist.",
  dealer_cta: "Become a dealer block — copy, bullet points, form labels.",
  footer: "Footer — tagline, link groups, copyright, slogan.",
  product: "/product page — hero image, overview, features, specs, CTA.",
  about: "/about page — hero, mission, stats, timeline, values, facility.",
  dealer: "/dealer page — hero, benefits, steps, cities marquee, FAQs.",
  specs: "/specs page — hero, comparison table, bottom CTA.",
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
  copyright: string;
  slogan: string;
  productLinks: { label: string; href: string }[];
  contactLines: string[];
};

export type ProductContent = {
  heroImage: string;
  breadcrumb: string;
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
};

export type SeoMeta = {
  title: string;
  description: string;
  ogImage: string;
  canonical: string;
};

export type AboutContent = {
  seo: SeoMeta;
  breadcrumb: string;
  heroEyebrow: string;
  heroTitlePrefix: string;
  heroTitleHighlight: string;
  heroTitleSuffix: string;
  heroBody: string;
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
  breadcrumb: string;
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
  citiesLabel: string;
  cities: string[];
  faqEyebrow: string;
  faqHeading: string;
  faqs: { q: string; a: string }[];
};

export type SpecsContent = {
  seo: SeoMeta;
  breadcrumb: string;
  heroEyebrow: string;
  heroTitlePrefix: string;
  heroTitleHighlight: string;
  heroTitleSuffix: string;
  heroBody: string;
  explorerHint: string;
  datasheetEyebrow: string;
  datasheetHeading: string;
  datasheetDownloadLabel: string;
  datasheetDownloadHref: string;
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
  chipBadge: "NEW",
  chipText: "Register your Lohix Energy warranty",
  headlineLine1: "Power that moves",
  headlineHighlight: "a billion",
  headlineLine2: "journeys.",
  subline:
    "A smart 51.2V LFP battery engineered for e-rickshaws and EVs across Eastern India. 3500+ cycles. Real BMS protection. Local service.",
  ctaPrimary: { label: "Register warranty", href: "#warranty" },
  ctaSecondary: { label: "Explore specs", href: "#features" },
  trustItems: [
    "Live BMS · 24/7",
    "IP67 design · certification pending",
    "3500+ cycles",
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
    { value: "3500+", label: "Charge cycles", sub: "LFP chemistry, long life" },
    { value: "5.12kWh", label: "Usable energy", sub: "51.2V × 100Ah" },
    { value: "51.2V", label: "Nominal voltage", sub: "100Ah smart pack" },
    { value: "100Ah", label: "Rated capacity", sub: "Grade A+ LFP cells" },
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
  headingHighlight: "Lohix Energy",
  headingSuffix: "relentless.",
  body: "Nine engineering decisions. One battery built to outlast every shift, monsoon, and pothole between here and the next city.",
  ctaLabel: "Talk to engineering",
  ctaHref: "#dealer",
  items: [
    {
      id: "voltage",
      label: "Voltage",
      value: "51.2",
      unit: "V",
      title: "Optimized nominal voltage",
      body: "Tuned for e-rickshaw drive systems — efficient torque without thermal stress.",
      icon: "Zap",
      category: "Power",
    },
    {
      id: "capacity",
      label: "Capacity",
      value: "100",
      unit: "Ah",
      title: "All-day urban range",
      body: "100Ah of usable capacity per cycle — built for full shifts on Indian roads.",
      icon: "Battery",
      category: "Power",
    },
    {
      id: "energy",
      label: "Energy",
      value: "5.12",
      unit: "kWh",
      title: "Dense, efficient packs",
      body: "5120Wh of usable energy in a compact, swappable LFP form factor.",
      icon: "Activity",
      category: "Power",
    },
    {
      id: "cycles",
      label: "Cycles",
      value: "3500",
      unit: "+",
      title: "Decade-long lifespan",
      body: "Over 3,500 charge cycles. Outlasts lead-acid five times over.",
      icon: "RefreshCw",
      category: "Lifecycle",
    },
    {
      id: "ip",
      label: "Ingress",
      value: "IP67",
      unit: "design",
      title: "Sealed for monsoon roads",
      body: "Enclosure engineered to an IP67 design standard for dust and water ingress. Third-party certification is pending.",
      icon: "Shield",
      category: "Safety",
    },
    {
      id: "bms",
      label: "BMS",
      value: "Smart",
      title: "Real-time protection",
      body: "Cell balancing, thermal cutoff, and fault telemetry — live.",
      icon: "Cpu",
      category: "Safety",
    },
    {
      id: "peak",
      label: "Peak",
      value: "200",
      unit: "A",
      title: "High-torque discharge",
      body: "200A momentary peak discharge for hill starts and overload — not a continuous rating.",
      icon: "TrendingUp",
      category: "Power",
    },
    {
      id: "warranty",
      label: "Warranty",
      value: "3–4",
      unit: "yr",
      title: "Backed for the long haul",
      body: "3 years on the standard pack, 4 years on GPS variants — serviced locally from our Kolkata facility.",
      icon: "BadgeCheck",
      category: "Origin",
    },
    {
      id: "origin",
      label: "Origin",
      value: "Made",
      unit: "in India",
      title: "Engineered in Kolkata",
      body: "Assembled in West Bengal. Tested for Eastern India duty cycles.",
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
  body: "Every choice — chemistry, BMS, enclosure, service — is tuned for the duty cycles of Indian fleets. Not theory. Field-proven.",
  cards: [
    {
      icon: "Shield",
      title: "Smart BMS protection",
      body: "Cell balancing, over-charge, over-discharge, and thermal cutoff — automatic and always-on.",
    },
    {
      icon: "Repeat",
      title: "3500+ cycle life",
      body: "Outlasts lead-acid 5×. Dramatically lower cost per kilometer over the battery's lifetime.",
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
  body: "Join our distributor network across Eastern India. Training, healthy margins, and on-ground support — built in.",
  benefits: ["Healthy unit economics", "Dedicated regional manager", "Co-marketing & training"],
  buttonLabel: "Request dealership",
  footnote: "We'll reach out within 48 hours.",
};

export const footerDefault: FooterContent = {
  tagline:
    "Power. Performance. Possibilities. Smart LFP batteries built for the roads of Eastern India.",
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
  breadcrumb: "Lohix Energy",
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
};

export const aboutDefault: AboutContent = {
  seo: {
    title: "About — LOHIX Energy",
    description:
      "Built in Kolkata, engineered for India. The story, mission, and people behind LOHIX smart LFP batteries.",
    ogImage: "/logo_lohix.png",
    canonical: "https://lohix.lovable.app/about",
  },
  breadcrumb: "About",
  heroEyebrow: "About LOHIX",
  heroTitlePrefix: "Built for the",
  heroTitleHighlight: "roads",
  heroTitleSuffix: "we ride on.",
  heroBody:
    "LOHIX is a Kolkata-born energy company building smart LFP batteries for India's electric mobility — engineered, assembled, and serviced locally.",
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
      title: "Safety, never compromised",
      body: "LFP chemistry, multi-layer BMS, sealed IP67 enclosure — engineered defaults, not upsells.",
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
    title: "Become a LOHIX Dealer — Distributor Network",
    description:
      "Become a LOHIX channel partner. Healthy margins, regional support, warranty serviced locally from Kolkata.",
    ogImage: "/logo_lohix.png",
    canonical: "https://lohix.lovable.app/dealer",
  },
  breadcrumb: "Dealer",
  heroEyebrow: "Distributor network · Eastern India",
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
  citiesLabel: "Active & opening soon",
  cities: [
    "Kolkata",
    "Howrah",
    "Asansol",
    "Durgapur",
    "Siliguri",
    "Patna",
    "Ranchi",
    "Bhubaneswar",
    "Cuttack",
    "Guwahati",
    "Jamshedpur",
    "Berhampur",
  ],
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
      q: "Are territories protected?",
      a: "We allocate primary zones to avoid channel conflict. Sub-dealer expansion happens with your involvement.",
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
    title: "Lohix Energy Specs — Full Datasheet & LFP vs Lead-acid Comparison",
    description:
      "Complete Lohix Energy datasheet: 51.2V, 100Ah, 3500+ cycles, smart BMS, BIS-certified Grade A+ LFP cells. Compare LFP vs lead-acid side-by-side.",
    ogImage: "/logo_lohix.png",
    canonical: "https://lohix.lovable.app/specs",
  },
  breadcrumb: "Specs",
  heroEyebrow: "Datasheet · Lohix Energy",
  heroTitlePrefix: "The full",
  heroTitleHighlight: "spec",
  heroTitleSuffix: "sheet.",
  heroBody:
    "Nine engineering decisions, three discipline groups, one battery designed for daily Indian duty cycles. Filter, hover, explore.",
  explorerHint: "Hover a tile",
  datasheetEyebrow: "Complete datasheet",
  datasheetHeading: "Every parameter, on one page.",
  datasheetDownloadLabel: "Download PDF",
  datasheetDownloadHref: "#download",
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
  ctaPrimary: { label: "Find a dealer", href: "/dealer" },
  ctaSecondary: { label: "Product overview", href: "/product" },
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
  product: productDefault,
  about: aboutDefault,
  dealer: dealerDefault,
  specs: specsDefault,
} as const;

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
  product: ProductContent;
  about: AboutContent;
  dealer: DealerContent;
  specs: SpecsContent;
};

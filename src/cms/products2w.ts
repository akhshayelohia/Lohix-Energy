// 2W battery range — CMS types + defaults.
// Model names are always built from nominal voltage + capacity (see skuName).
// Never add internal cell configuration to any field here.

export type Cta = { label: string; href: string };
export type SpecRow = { label: string; value: string };
export type SpecGroup = { title: string; rows: SpecRow[] };
export type ProductFeature = { icon: string; title: string; body: string };
export type KeyFigure = { k: string; v: string };
export type GalleryImage = { src: string; alt: string };

export type TwoWheelerSku = {
  slug: string;
  voltage: string;
  capacity: string;
  overview: string;
  badges: string[];
  keyFigures: KeyFigure[];
  showcaseImage?: string;
  showcaseImageMobile?: string;
  showcaseVideo?: string;
  heroImage: string;
  gallery: GalleryImage[];
  datasheetUrl: string;
  specGroups: SpecGroup[];
};

export type TwoWheelerContent = {
  categoryLabel: string;
  categoryEyebrow: string;
  categoryHeading: string;
  categoryBody: string;
  useCases: string[];
  featuresHeading: string;
  featuresBody: string;
  features: ProductFeature[];
  specsHeading: string;
  specBadges: { icon: string; label: string }[];
  datasheetNote: string;
  ctaEyebrow: string;
  ctaHeading: string;
  ctaHighlight: string;
  ctaBody: string;
  ctaPrimary: Cta;
  ctaSecondary: Cta;
  skus: TwoWheelerSku[];
};

export function skuModel(sku: Pick<TwoWheelerSku, "voltage" | "capacity">): string {
  return `${sku.voltage} ${sku.capacity}`.trim();
}

export function skuName(sku: Pick<TwoWheelerSku, "voltage" | "capacity">): string {
  return `LOHIX ${skuModel(sku)}`;
}

function sku(
  slug: string,
  voltage: string,
  capacity: string,
  energy: string,
  overview: string,
): TwoWheelerSku {
  return {
    slug,
    voltage,
    capacity,
    overview,
    badges: [voltage, capacity, "2500+ cycles", "Dust & Splash Resistant"],
    keyFigures: [
      { k: voltage, v: "Nominal voltage" },
      { k: capacity, v: "Capacity" },
      { k: energy, v: "Energy" },
      { k: "2500+", v: "Life cycles" },
    ],
    heroImage: "",
    gallery: [],
    datasheetUrl: "",
    specGroups: [
      {
        title: "Electrical",
        rows: [
          { label: "Nominal voltage", value: voltage },
          { label: "Capacity", value: capacity },
          { label: "Energy", value: energy },
        ],
      },
      {
        title: "Chemistry & life",
        rows: [
          { label: "Chemistry", value: "LiFePO4" },
          { label: "Life cycles", value: "2500+" },
          { label: "Maintenance", value: "Zero" },
          { label: "Charging", value: "Fast charge ready" },
        ],
      },
      {
        title: "Build & safety",
        rows: [
          { label: "Protection", value: "Dust & Splash Resistant (IP cert. pending)" },
          { label: "BMS", value: "Smart, multi-layer" },
          { label: "Cell format", value: "32140 Cylindrical LFP" },
          { label: "Operating temp", value: "−20°C to 55°C" },
        ],
      },
    ],
  };
}

export const productsTwoWheelerDefault: TwoWheelerContent = {
  categoryLabel: "2W Batteries",
  categoryEyebrow: "Electric two-wheeler batteries · LiFePO4",
  categoryHeading: "Packs for electric scooters and motorcycles.",
  categoryBody:
    "60.8V and 64V LiFePO4 packs in 30Ah and 45Ah — smart BMS protection and 2500+ cycle chemistry for India's electric scooters and motorcycles.",
  useCases: ["Electric scooters", "Electric motorcycles", "Last-mile delivery fleets"],
  featuresHeading: "What every 2W pack shares.",
  featuresBody:
    "Every pack in the 2W range shares the same protection, chemistry, and build standard — choose the voltage and capacity your vehicle needs.",
  features: [
    {
      icon: "Cpu",
      title: "Smart BMS Protection",
      body: "Multi-layer Battery Management System monitors voltage, current, temperature, and cell balance in real time.",
    },
    {
      icon: "Zap",
      title: "Fast Charging Compatible",
      body: "Engineered for rapid top-ups between rides without compromising long-term cell health.",
    },
    {
      icon: "RefreshCw",
      title: "2500+ Life Cycles",
      body: "LFP chemistry delivers years of daily riding with minimal capacity fade.",
    },
    {
      icon: "Thermometer",
      title: "High-temp Protection",
      body: "Rated for −20°C to 55°C operation, with thermal monitoring built for Indian summers.",
    },
    {
      icon: "Droplets",
      title: "Dust & Splash Design",
      body: "Enclosure designed to resist dust and road splash in everyday riding. IP certification pending.",
    },
    {
      icon: "Factory",
      title: "Built in India",
      body: "Designed, assembled, and serviced locally for India's electric two-wheeler ecosystem.",
    },
  ],
  specsHeading: "Specifications.",
  specBadges: [
    { icon: "Battery", label: "LiFePO4 Chemistry" },
    { icon: "Cpu", label: "Smart BMS" },
    { icon: "Factory", label: "Built in India" },
  ],
  datasheetNote:
    "Charging and discharge ratings live in the full datasheet — a PDF for dealers and fleet buyers who need the deeper numbers.",
  ctaEyebrow: "Ready to ride",
  ctaHeading: "Built Smart. Built Safe.",
  ctaHighlight: "Built LOHIX.",
  ctaBody: "Talk to our team about pricing and fleet supply for the 2W range.",
  ctaPrimary: { label: "Where to buy", href: "#buy" },
  ctaSecondary: { label: "Compare the range", href: "/products#2w" },
  skus: [
    sku(
      "lohix-60-8v-30ah",
      "60.8V",
      "30Ah",
      "1824Wh",
      "A compact 60.8V LiFePO4 pack for electric scooters — 1824Wh of energy, 2500+ cycles, and zero maintenance.",
    ),
    sku(
      "lohix-60-8v-45ah",
      "60.8V",
      "45Ah",
      "2736Wh",
      "More range from the same 60.8V platform — 2736Wh of LiFePO4 energy for longer daily routes and delivery shifts.",
    ),
    sku(
      "lohix-64v-30ah",
      "64V",
      "30Ah",
      "1920Wh",
      "A 64V LiFePO4 pack for higher-voltage two-wheeler drivetrains — 1920Wh of energy, 2500+ cycles, and zero maintenance.",
    ),
    sku(
      "lohix-64v-45ah",
      "64V",
      "45Ah",
      "2880Wh",
      "The flagship of the 2W range — 2880Wh at 64V for high-performance scooters and long-shift fleets.",
    ),
  ],
};

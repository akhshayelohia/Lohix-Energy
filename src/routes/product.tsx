import { createFileRoute } from "@tanstack/react-router";
import heroImg from "@/assets/lohix-48-hero.webp";
import { ProductTemplate } from "@/components/product/ProductTemplate";
import { DATASHEET_NOTE, datasheetRequestHref } from "@/cms/datasheet";
import { useContent } from "@/cms/useContent";
import { useCatalog } from "@/cms/catalog";
import { safeMediaSrc } from "@/lib/safe-url";

export const Route = createFileRoute("/product")({
  component: ProductPage,
  head: () => ({
    meta: [
      { title: "LOHIX 48 — 51.2V 100Ah E-Rickshaw LiFePO4 Battery | LOHIX Energy" },
      {
        name: "description",
        content:
          "LOHIX 48 — a 51.2V 100Ah Lithium Iron Phosphate battery engineered for e-rickshaws and India's electric mobility. 3500+ cycles, smart multi-layer BMS, made in India.",
      },
      { property: "og:title", content: "LOHIX 48 — Smart LFP E-Rickshaw Battery" },
      {
        property: "og:description",
        content:
          "Built Smart. Built Safe. Built LOHIX. 51.2V · 100Ah · 3500+ cycles · Made in India.",
      },
      { property: "og:url", content: "https://lohixenergy.com/product" },
      { property: "og:type", content: "product" },
    ],
    links: [{ rel: "canonical", href: "https://lohixenergy.com/product" }],
  }),
});

function ProductPage() {
  const c = useContent("product");
  const g = useContent("global");
  const twoW = useCatalog().find((cat) => cat.id === "2w");
  const name = `${c.titleMain} ${c.titleAccent}`.trim();

  return (
    <ProductTemplate
      estimatorModelId="lohix-48"
      showcase={{
        image: c.showcaseImage?.trim()
          ? safeMediaSrc(c.showcaseImage)
          : c.heroImage?.trim()
            ? safeMediaSrc(c.heroImage)
            : heroImg,
        mobileImage: c.showcaseImageMobile?.trim() ? safeMediaSrc(c.showcaseImageMobile) : null,
        video: c.showcaseVideo?.trim() ? safeMediaSrc(c.showcaseVideo) : null,
        // A CMS cut-out (transparent PNG) sits on the stage; real photography runs full-bleed.
        fit: !c.showcaseImage?.trim() && c.heroImage?.trim() ? "contain" : "cover",
        alt: `${name} e-rickshaw battery`,
        nextId: "details",
      }}
      hero={{
        id: "details",
        eyebrow: c.eyebrow,
        brand: c.titleMain,
        model: c.titleAccent,
        tagline: c.tagline,
        badges: c.specBadges.map((b) => b.label),
        keyFigures: c.quickStats,
        primaryCta: c.ctaPrimary,
        datasheetUrl: c.datasheetUrl,
      }}
      overview={{
        heading: c.overviewHeading,
        paragraphs: c.overviewParagraphs,
        useCases: c.useCases,
      }}
      features={{ heading: c.featuresHeading, body: c.featuresBody, items: c.features }}
      gallery={[]}
      specs={{
        heading: c.specsHeading,
        badges: [],
        groups: c.specGroups,
        datasheet: {
          url: c.datasheetUrl ?? "",
          requestHref: datasheetRequestHref(g.contactEmail, name),
          note: DATASHEET_NOTE,
        },
      }}
      range={{
        heading: "Also in the LOHIX range.",
        products: twoW?.products ?? [],
        tag: twoW?.label,
      }}
      cta={{
        eyebrow: c.ctaEyebrow,
        heading: c.ctaHeading,
        highlight: c.ctaHighlight,
        body: c.ctaBody,
        primary: c.ctaPrimary,
        secondary: c.ctaSecondary,
      }}
    />
  );
}

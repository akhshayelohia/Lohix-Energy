import { createFileRoute, notFound } from "@tanstack/react-router";
import { ProductTemplate } from "@/components/product/ProductTemplate";
import { PackStage } from "@/components/product/PackStage";
import { datasheetRequestHref } from "@/cms/datasheet";
import { fetchSection } from "@/cms/fetchSection";
import { useContent } from "@/cms/useContent";
import { useCatalog } from "@/cms/catalog";
import { productsTwoWheelerDefault, skuModel, skuName } from "@/cms/products2w";
import { safeMediaSrc } from "@/lib/safe-url";

const BASE_URL = "https://lohixenergy.com";

export const Route = createFileRoute("/products/$slug")({
  loader: async ({ params }) => {
    const content = await fetchSection("products_2w");
    const live = content.skus.find((s) => s.slug === params.slug);
    if (live) return { sku: live, skus: content.skus };
    const fallback = productsTwoWheelerDefault.skus.find((s) => s.slug === params.slug);
    if (fallback) return { sku: fallback, skus: productsTwoWheelerDefault.skus };
    throw notFound();
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { sku } = loaderData;
    const name = skuName(sku);
    const url = `${BASE_URL}/products/${sku.slug}`;
    const title = `${name} — 2W LiFePO4 Battery | LOHIX Energy`;
    const description = `${sku.overview} Smart multi-layer BMS. Built in India.`;
    const image =
      [sku.showcaseImage, sku.heroImage].find((s) => s?.trim()) ?? `${BASE_URL}/og-image.jpg`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: url },
        { property: "og:image", content: image },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name,
            brand: { "@type": "Brand", name: "LOHIX" },
            description: sku.overview,
            image,
            category: "Electric two-wheeler battery",
            countryOfOrigin: "IN",
            additionalProperty: [
              { "@type": "PropertyValue", name: "Nominal voltage", value: sku.voltage },
              { "@type": "PropertyValue", name: "Capacity", value: sku.capacity },
              { "@type": "PropertyValue", name: "Chemistry", value: "LiFePO4" },
            ],
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${BASE_URL}/` },
              { "@type": "ListItem", position: 2, name: "Products", item: `${BASE_URL}/products` },
              { "@type": "ListItem", position: 3, name, item: url },
            ],
          }),
        },
      ],
    };
  },
  component: SkuPage,
});

function SkuPage() {
  const { slug } = Route.useParams();
  const loaded = Route.useLoaderData();
  const tw = useContent("products_2w");
  const g = useContent("global");
  const catalog = useCatalog();

  const liveSku = tw.skus.find((s) => s.slug === slug);
  const sku = liveSku ?? loaded.sku;
  const skus = liveSku ? tw.skus : loaded.skus;
  const name = skuName(sku);
  const siblings = (catalog.find((c) => c.id === "2w")?.products ?? []).filter(
    (p) => p.id !== sku.slug,
  );

  return (
    <ProductTemplate
      estimatorModelId={sku.slug}
      showcase={{
        image: sku.showcaseImage?.trim()
          ? safeMediaSrc(sku.showcaseImage)
          : sku.heroImage?.trim()
            ? safeMediaSrc(sku.heroImage)
            : null,
        mobileImage: sku.showcaseImageMobile?.trim() ? safeMediaSrc(sku.showcaseImageMobile) : null,
        video: sku.showcaseVideo?.trim() ? safeMediaSrc(sku.showcaseVideo) : null,
        fit: sku.showcaseImage?.trim() ? "cover" : "contain",
        alt: `${name} battery`,
        placeholder: <PackStage voltage={sku.voltage} capacity={sku.capacity} />,
        nextId: "details",
      }}
      hero={{
        id: "details",
        eyebrow: tw.categoryEyebrow,
        brand: "LOHIX",
        model: skuModel(sku),
        tagline: sku.overview,
        badges: sku.badges,
        keyFigures: sku.keyFigures,
        variants: skus.length > 1 ? { skus, current: sku } : undefined,
        primaryCta: tw.ctaPrimary,
        datasheetUrl: sku.datasheetUrl,
      }}
      features={{
        heading: tw.featuresHeading,
        body: tw.featuresBody,
        items: tw.features,
        useCases: tw.useCases,
      }}
      gallery={sku.gallery ?? []}
      specs={{
        heading: tw.specsHeading,
        badges: tw.specBadges,
        groups: sku.specGroups,
        datasheet: {
          url: sku.datasheetUrl ?? "",
          requestHref: datasheetRequestHref(g.contactEmail, name),
          note: tw.datasheetNote,
        },
      }}
      range={{
        heading: `More from ${tw.categoryLabel}.`,
        products: siblings,
        tag: tw.categoryLabel,
      }}
      cta={{
        eyebrow: tw.ctaEyebrow,
        heading: tw.ctaHeading,
        highlight: tw.ctaHighlight,
        body: tw.ctaBody,
        primary: tw.ctaPrimary,
        secondary: tw.ctaSecondary,
      }}
    />
  );
}

import heroImg from "@/assets/lohix-48-hero.webp";
import heroThumb from "@/assets/lohix-48-thumb.webp";
import { useContent } from "./useContent";
import { skuModel, skuName, type KeyFigure } from "./products2w";
import { safeMediaSrc } from "@/lib/safe-url";

export type CatalogProduct = {
  id: string;
  href: string;
  name: string;
  brand: string;
  model: string;
  voltage?: string;
  capacity?: string;
  image: string | null;
  /** Small version for menus; falls back to `image`. */
  thumb?: string | null;
  figures: KeyFigure[];
  blurb: string;
};

export type CatalogCategory = {
  id: "e-rickshaw" | "2w";
  label: string;
  eyebrow: string;
  heading: string;
  body: string;
  products: CatalogProduct[];
};

// Product cut-out if there is one, otherwise the showcase photo.
function firstMedia(...sources: (string | undefined)[]): string | null {
  const src = sources.find((s) => s?.trim());
  return src ? safeMediaSrc(src) : null;
}

export function useCatalog(): CatalogCategory[] {
  const p = useContent("product");
  const tw = useContent("products_2w");
  const page = useContent("products_page");

  return [
    {
      id: "e-rickshaw",
      label: page.erickshawLabel,
      eyebrow: p.eyebrow,
      heading: page.erickshawHeading,
      body: p.tagline,
      products: [
        {
          id: "lohix-48",
          href: "/product",
          name: `${p.titleMain} ${p.titleAccent}`.trim(),
          brand: p.titleMain,
          model: p.titleAccent,
          image: firstMedia(p.heroImage, p.showcaseImage) ?? heroImg,
          thumb: firstMedia(p.heroImage, p.showcaseImage) ? null : heroThumb,
          figures: p.quickStats.slice(0, 3),
          blurb: p.tagline,
        },
      ],
    },
    {
      id: "2w",
      label: tw.categoryLabel,
      eyebrow: tw.categoryEyebrow,
      heading: tw.categoryHeading,
      body: tw.categoryBody,
      products: tw.skus.map((s) => ({
        id: s.slug,
        href: `/products/${s.slug}`,
        name: skuName(s),
        brand: "LOHIX",
        model: skuModel(s),
        voltage: s.voltage,
        capacity: s.capacity,
        image: firstMedia(s.heroImage, s.showcaseImage),
        figures: s.keyFigures.slice(2, 4),
        blurb: s.overview,
      })),
    },
  ];
}

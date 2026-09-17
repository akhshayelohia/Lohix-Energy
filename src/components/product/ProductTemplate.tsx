import { Fragment, type ReactNode } from "react";
import { CheckCircle2, FileText } from "lucide-react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/system/SectionHeader";
import { ButtonLink } from "@/components/system/ButtonLink";
import { CtaBand } from "@/components/system/CtaBand";
import { getIcon } from "@/cms/icons";
import { cn } from "@/lib/utils";
import { safeMediaSrc } from "@/lib/safe-url";
import type { CatalogProduct } from "@/cms/catalog";
import type { Cta, GalleryImage, ProductFeature, SpecGroup } from "@/cms/products2w";
import { ShowcaseHero, type ShowcaseHeroProps } from "@/components/system/ShowcaseHero";
import { ProductIntro, type ProductIntroProps } from "./ProductIntro";
import { FeatureGrid } from "./FeatureGrid";
import { MobileBuyBar } from "./MobileBuyBar";
import { SpecTable } from "./SpecTable";
import { ProductCard } from "./ProductCard";
import { RangeEstimator } from "@/components/RangeEstimator";
import { useContent } from "@/cms/useContent";

export type ProductTemplateProps = {
  showcase: ShowcaseHeroProps;
  hero: ProductIntroProps;
  /** Adds the range estimator, preset to this model. */
  estimatorModelId?: string;
  overview?: { heading: string; paragraphs: string[]; useCases: string[] };
  features: { heading: string; body: string; items: ProductFeature[]; useCases?: string[] };
  gallery: GalleryImage[];
  specs: {
    heading: string;
    badges: { icon: string; label: string }[];
    groups: SpecGroup[];
    datasheet: { url: string; requestHref: string; note: string };
  };
  range: { heading: string; body?: string; products: CatalogProduct[]; tag?: string };
  cta: {
    eyebrow: string;
    heading: string;
    highlight: string;
    body: string;
    primary: Cta;
    secondary: Cta;
  };
};

function UseCases({ items, label }: { items: string[]; label?: string }) {
  if (items.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-2">
      {label && <span className="t-label mr-2 text-muted-ink">{label}</span>}
      {items.map((u) => (
        <span key={u} className="chip">
          <CheckCircle2 className="h-3.5 w-3.5 text-lohix-lime-deep" />
          {u}
        </span>
      ))}
    </div>
  );
}

type Block = { key: string; render: (bg: string) => ReactNode };

export function ProductTemplate({
  showcase,
  hero,
  estimatorModelId,
  overview,
  features,
  gallery,
  specs,
  range,
  cta,
}: ProductTemplateProps) {
  const t = useContent("products_page");
  const photos = gallery.filter((g) => g.src?.trim());
  const blocks: Block[] = [];

  if (overview) {
    blocks.push({
      key: "overview",
      render: (bg) => (
        <section className={cn("section", bg)}>
          <div className="container-x grid gap-10 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-5">
              <SectionHeader layout="stack" eyebrow={t.overviewEyebrow} title={overview.heading} />
            </div>
            <Reveal delay={0.08} className="t-body space-y-5 text-muted-ink md:col-span-7 md:pt-12">
              {overview.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              <div className="pt-3">
                <UseCases items={overview.useCases} />
              </div>
            </Reveal>
          </div>
        </section>
      ),
    });
  }

  blocks.push({
    key: "features",
    render: (bg) => (
      <section className={cn("section", bg)}>
        <div className="container-x">
          <SectionHeader
            eyebrow={t.featuresEyebrow}
            title={features.heading}
            aside={features.body}
          />
          {features.useCases && features.useCases.length > 0 && (
            <Reveal className="mt-8">
              <UseCases items={features.useCases} label={t.builtForLabel} />
            </Reveal>
          )}
          <div className="mt-12 md:mt-16">
            <FeatureGrid items={features.items} />
          </div>
        </div>
      </section>
    ),
  });

  if (photos.length > 0) {
    blocks.push({
      key: "gallery",
      render: (bg) => (
        <section className={cn("section", bg)}>
          <div className="container-x">
            <SectionHeader eyebrow={t.galleryEyebrow} title={t.galleryHeading} layout="stack" />
            <div className="mt-12 grid grid-cols-2 gap-3 md:mt-16 md:grid-cols-4 md:gap-4">
              {photos.map((g, i) => (
                <Reveal
                  key={`${g.src}-${i}`}
                  delay={i * 0.05}
                  className={cn(
                    "overflow-hidden rounded-[12px] bg-night",
                    i === 0 ? "col-span-2 row-span-2" : "aspect-[4/3]",
                  )}
                >
                  <img
                    src={safeMediaSrc(g.src)}
                    alt={g.alt || hero.brand + " " + hero.model}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ),
    });
  }

  blocks.push({
    key: "specs",
    render: (bg) => (
      <section id="specs" className={cn("section", bg)}>
        <div className="container-x">
          <SectionHeader
            eyebrow={t.specsEyebrow}
            title={specs.heading}
            aside={
              specs.badges.length > 0 ? (
                <div className="flex flex-wrap gap-2 md:justify-end">
                  {specs.badges.map((b) => {
                    const Icon = getIcon(b.icon);
                    return (
                      <span key={b.label} className="chip text-ink">
                        <Icon className="h-3.5 w-3.5 text-lohix-lime-deep" />
                        {b.label}
                      </span>
                    );
                  })}
                </div>
              ) : undefined
            }
          />
          <div className="mt-12 md:mt-16">
            <SpecTable groups={specs.groups} />
          </div>
          <Reveal className="card mt-12 flex flex-col gap-6 bg-paper p-6 sm:p-8 md:mt-16 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-night-2 text-lohix-lime">
                <FileText className="h-4 w-4" />
              </span>
              <div>
                <h3 className="t-h3 text-ink">{t.datasheetHeading}</h3>
                <p className="t-small mt-1 max-w-xl text-muted-ink">{specs.datasheet.note}</p>
              </div>
            </div>
            {specs.datasheet.url.trim() ? (
              <ButtonLink href={specs.datasheet.url} icon="download" newTab className="shrink-0">
                {t.datasheetDownloadLabel}
              </ButtonLink>
            ) : (
              <ButtonLink
                href={specs.datasheet.requestHref}
                variant="outline"
                icon="external"
                className="shrink-0"
              >
                {t.datasheetRequestLabel}
              </ButtonLink>
            )}
          </Reveal>
        </div>
      </section>
    ),
  });

  if (estimatorModelId) {
    blocks.push({
      key: "estimator",
      render: (bg) => (
        <section className={cn("section", bg)}>
          <div className="container-x">
            <SectionHeader
              eyebrow={t.estimatorEyebrow}
              title={t.productEstimatorHeading}
              aside={t.productEstimatorBody}
            />
            <Reveal className="mt-12 md:mt-16">
              <RangeEstimator initialModelId={estimatorModelId} />
            </Reveal>
          </div>
        </section>
      ),
    });
  }

  if (range.products.length > 0) {
    blocks.push({
      key: "range",
      render: (bg) => (
        <section className={cn("section", bg)}>
          <div className="container-x">
            <SectionHeader
              eyebrow={t.rangeEyebrow}
              title={range.heading}
              aside={
                <ButtonLink href="/products" variant="outline" size="sm">
                  {t.viewAllLabel}
                </ButtonLink>
              }
            />
            <div
              className={cn(
                // Swipeable row on phones, grid from tablet up.
                "no-scrollbar -mx-5 mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-5 px-5 pb-1 sm:mx-0 sm:mt-12 sm:grid sm:snap-none sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0 md:mt-16",
                range.products.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3",
              )}
            >
              {range.products.map((p, i) => (
                <Reveal
                  key={p.id}
                  delay={i * 0.06}
                  className="h-auto w-[78%] shrink-0 snap-start sm:h-full sm:w-auto"
                >
                  <ProductCard product={p} tag={range.tag} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ),
    });
  }

  return (
    <main className="min-h-screen bg-paper text-ink antialiased">
      <Nav />
      <ShowcaseHero {...showcase} />
      <ProductIntro {...hero} />
      {blocks.map((b, i) => (
        <Fragment key={b.key}>
          {b.render(i % 2 === 0 ? "bg-paper" : "border-y border-line bg-paper-2")}
        </Fragment>
      ))}
      <CtaBand
        eyebrow={cta.eyebrow}
        title={cta.heading}
        accent={cta.highlight}
        body={cta.body}
        primary={cta.primary}
        secondary={cta.secondary}
      />
      <Footer />
      <MobileBuyBar
        introId={hero.id}
        name={`${hero.brand} ${hero.model}`}
        detail={hero.keyFigures
          .slice(0, 2)
          .map((f) => f.k)
          .join(" · ")}
        label={t.stickyBuyLabel}
      />
    </main>
  );
}

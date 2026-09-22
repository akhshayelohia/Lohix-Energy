import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { SpecExplorer } from "@/components/SpecExplorer";
import heroImg from "@/assets/lohix-48-hero.webp";
import { PageHero } from "@/components/system/PageHero";
import { ProductSpotlight } from "@/components/hero/ProductSpotlight";
import { safeMediaSrc } from "@/lib/safe-url";
import { SectionHeader } from "@/components/system/SectionHeader";
import { ButtonLink } from "@/components/system/ButtonLink";
import { CtaBand } from "@/components/system/CtaBand";
import { DatasheetSwitcher, type DatasheetModel } from "@/components/product/DatasheetSwitcher";
import { skuModel, skuName } from "@/cms/products2w";
import { datasheetRequestHref } from "@/cms/datasheet";
import { useContent } from "@/cms/useContent";
import { absoluteUrl } from "@/lib/site";
import { fetchSection } from "@/cms/fetchSection";

export const Route = createFileRoute("/specs")({
  loader: () => fetchSection("specs"),
  component: SpecsPage,
  head: ({ loaderData }) => {
    const seo = loaderData?.seo;
    return {
      meta: [
        { title: seo?.title || "Specs — Lohix Energy Smart LFP Battery" },
        {
          name: "description",
          content:
            seo?.description ||
            "Every electrical, chemistry, and safety parameter of the Lohix Energy — explore the full datasheet interactively.",
        },
        { property: "og:title", content: seo?.title || "Lohix Energy — Full Specifications" },
        {
          property: "og:description",
          content:
            seo?.description ||
            "51.2V · 100Ah · 3500+ cycles · Grade A+ LFP. The complete spec sheet.",
        },
        { property: "og:type", content: "product" },
        { property: "og:url", content: seo?.canonical || "https://lohixenergy.com/specs" },
        ...(seo?.ogImage ? [{ property: "og:image", content: absoluteUrl(seo.ogImage) }] : []),
      ],
      links: [{ rel: "canonical", href: seo?.canonical || "https://lohixenergy.com/specs" }],
    };
  },
});

function isRealLink(href: string) {
  const h = href.trim();
  return h.length > 0 && !h.startsWith("#");
}

function SpecsPage() {
  const f = useContent("features");
  const p = useContent("product");
  const c = useContent("specs");
  const g = useContent("global");
  const tw = useContent("products_2w");
  const page = useContent("products_page");
  const productName = `${p.titleMain} ${p.titleAccent}`.trim();

  const models: DatasheetModel[] = [
    {
      id: "lohix-48",
      name: productName,
      label: productName,
      category: page.erickshawLabel,
      href: "/product",
      figures: p.quickStats.slice(0, 3),
      groups: p.specGroups,
      datasheetUrl: isRealLink(c.datasheetDownloadHref) ? c.datasheetDownloadHref : p.datasheetUrl,
      requestHref: datasheetRequestHref(g.contactEmail, productName),
    },
    ...tw.skus.map((s) => ({
      id: s.slug,
      name: skuName(s),
      label: skuModel(s),
      category: tw.categoryLabel,
      href: `/products/${s.slug}`,
      figures: s.keyFigures.slice(2, 4),
      groups: s.specGroups,
      datasheetUrl: s.datasheetUrl,
      requestHref: datasheetRequestHref(g.contactEmail, skuName(s)),
    })),
  ];
  const first2w = tw.skus[0]?.slug;

  return (
    <main className="min-h-screen bg-paper text-ink antialiased">
      <Nav />

      <PageHero
        scrollCue
        visual={
          <ProductSpotlight
            image={p.heroImage?.trim() ? safeMediaSrc(p.heroImage) : heroImg}
            alt={productName}
            chips={p.quickStats.slice(0, 3)}
          />
        }
        eyebrow={c.heroEyebrow}
        title={c.heroTitlePrefix}
        accent={c.heroTitleHighlight}
        suffix={c.heroTitleSuffix}
        body={c.heroBody}
        actions={
          <>
            <ButtonLink href="/product" variant="lime">
              View {productName}
            </ButtonLink>
            <ButtonLink
              href={first2w ? `#datasheet-${first2w}` : "/products#2w"}
              variant="ghost-dark"
              icon="down"
            >
              {c.twoWheelerCtaLabel}
            </ButtonLink>
          </>
        }
      />

      <section className="section border-b border-line bg-paper-2">
        <div className="container-x">
          <SectionHeader
            eyebrow="Explorer"
            title={f.headingPrefix}
            accent={`${f.headingHighlight} ${f.headingSuffix}`}
            aside={f.body}
          />
          <div className="mt-10 md:mt-12">
            <SpecExplorer items={f.items} hint={c.explorerHint} />
          </div>
        </div>
      </section>

      <section id="datasheets" className="section bg-paper">
        <div className="container-x">
          <SectionHeader
            eyebrow={c.datasheetEyebrow}
            title={c.datasheetHeading}
            aside={c.datasheetBody}
          />
          <div className="mt-10 md:mt-12">
            <DatasheetSwitcher
              models={models}
              downloadLabel={c.datasheetDownloadLabel}
              requestLabel={page.datasheetRequestLabel}
              viewLabel={c.datasheetViewLabel}
            />
          </div>
        </div>
      </section>

      <section className="section border-y border-line bg-paper-2">
        <div className="container-x">
          <SectionHeader eyebrow={c.comparisonEyebrow} title={c.comparisonHeading} />
          {/* Phones: one card per parameter so the LOHIX value is never scrolled out of view. */}
          <Reveal className="card mt-10 divide-y divide-line overflow-hidden bg-paper md:hidden">
            {c.comparisonRows.map((row, i) => (
              <div key={`${row.k}-${i}`} className="p-5">
                <div className="t-label text-muted-ink">{row.k}</div>
                <dl className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-[8px] border border-line px-3.5 py-3">
                    <dt className="text-[11px] text-muted-ink">{c.comparisonColA}</dt>
                    <dd className="tnum mt-1 text-[14px] text-ink">{row.a}</dd>
                  </div>
                  <div className="rounded-[8px] bg-night-2 px-3.5 py-3">
                    <dt className="inline-flex items-center gap-1.5 text-[11px] text-white">
                      <span className="h-1.5 w-1.5 rounded-full bg-lohix-lime" />
                      {c.comparisonColB}
                    </dt>
                    <dd className="tnum mt-1 text-[14px] font-semibold text-white">{row.b}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </Reveal>
          <Reveal className="card mt-12 hidden overflow-x-auto bg-paper md:mt-16 md:block">
            <table className="w-full min-w-[560px] text-left">
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className="t-label px-6 py-4 font-medium text-muted-ink">
                    Parameter
                  </th>
                  <th
                    scope="col"
                    className="t-label border-l border-line px-6 py-4 font-medium text-muted-ink"
                  >
                    {c.comparisonColA}
                  </th>
                  <th
                    scope="col"
                    className="t-label border-l border-line bg-night-2 px-6 py-4 font-medium text-white"
                  >
                    <span className="inline-flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-lohix-lime" />
                      {c.comparisonColB}
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {c.comparisonRows.map((row, i) => (
                  <tr key={`${row.k}-${i}`} className="border-b border-line last:border-0">
                    <th scope="row" className="px-6 py-4 text-[13px] font-normal text-muted-ink">
                      {row.k}
                    </th>
                    <td className="tnum border-l border-line px-6 py-4 text-[14px] text-ink">
                      {row.a}
                    </td>
                    <td className="tnum border-l border-line bg-lohix-lime/[0.08] px-6 py-4 text-[14px] font-semibold text-ink">
                      {row.b}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </div>
      </section>

      <CtaBand
        eyebrow={c.ctaEyebrow}
        title={c.ctaHeading}
        primary={c.ctaPrimary}
        secondary={c.ctaSecondary}
      />

      <Footer />
    </main>
  );
}

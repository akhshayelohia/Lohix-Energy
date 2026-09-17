import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { PageHero } from "@/components/system/PageHero";
import { ProductSpotlight } from "@/components/hero/ProductSpotlight";
import { SectionHeader } from "@/components/system/SectionHeader";
import { ButtonLink } from "@/components/system/ButtonLink";
import { CtaBand } from "@/components/system/CtaBand";
import { ProductCard } from "@/components/product/ProductCard";
import { RangeEstimator } from "@/components/RangeEstimator";
import { useCatalog } from "@/cms/catalog";
import { useContent } from "@/cms/useContent";
import { skuModel } from "@/cms/products2w";
import { fetchSection } from "@/cms/fetchSection";
import { productsPageDefault } from "@/cms/defaults";
import { absoluteUrl } from "@/lib/site";

export const Route = createFileRoute("/products/")({
  loader: () => fetchSection("products_page"),
  component: ProductsPage,
  head: ({ loaderData }) => {
    const fallback = productsPageDefault.seo;
    const seo = { ...fallback, ...loaderData?.seo };
    const title = seo.title || fallback.title;
    const description = seo.description || fallback.description;
    const url = seo.canonical || fallback.canonical;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        ...(seo.ogImage ? [{ property: "og:image", content: absoluteUrl(seo.ogImage) }] : []),
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
});

function ProductsPage() {
  const catalog = useCatalog();
  const tw = useContent("products_2w");
  const c = useContent("products_page");
  const erick = catalog.find((c) => c.id === "e-rickshaw")!;
  const twoW = catalog.find((c) => c.id === "2w")!;
  const featured = erick.products[0];

  return (
    <main className="min-h-screen bg-paper text-ink antialiased">
      <Nav />

      <PageHero
        eyebrow={c.heroEyebrow}
        title={c.heroTitle}
        accent={c.heroAccent}
        body={c.heroBody}
        actions={
          <>
            <ButtonLink href="#2w" variant="lime" icon="down">
              {twoW.label}
            </ButtonLink>
            <ButtonLink href="#e-rickshaw" variant="ghost-dark" icon="down">
              {erick.label}
            </ButtonLink>
          </>
        }
        scrollCue
        visual={
          featured?.image ? (
            <ProductSpotlight
              image={featured.image}
              alt={featured.name}
              chips={[
                {
                  k: featured.figures
                    .slice(0, 2)
                    .map((f) => f.k)
                    .join(" · "),
                  v: erick.label,
                  href: "#e-rickshaw",
                },
                {
                  k: Array.from(new Set(twoW.products.map((x) => x.voltage))).join(" · "),
                  v: `${twoW.products.length} two-wheeler packs`,
                  href: "#2w",
                },
                ...(c.estimatorChip?.k
                  ? [{ k: c.estimatorChip.k, v: c.estimatorChip.v, href: "#estimator" }]
                  : []),
              ]}
            />
          ) : undefined
        }
      />

      {/* E-RICKSHAW */}
      <section id="e-rickshaw" className="section bg-paper">
        <div className="container-x">
          <SectionHeader eyebrow={erick.label} title={erick.heading} />
          {featured && (
            <Reveal className="mt-12 md:mt-16">
              <a
                href={featured.href}
                className="card group grid overflow-hidden transition-shadow duration-500 hover:shadow-[0_40px_80px_-40px_rgba(11,15,16,0.45)] md:grid-cols-12"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-night md:col-span-7 md:aspect-auto md:min-h-[460px]">
                  {featured.image && (
                    <img
                      src={featured.image}
                      alt={featured.name}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  )}
                  <span className="chip-dark absolute left-5 top-5">{erick.label}</span>
                </div>
                <div className="flex flex-col p-7 sm:p-10 md:col-span-5">
                  <div className="t-label text-muted-ink">{featured.brand}</div>
                  <h3 className="tnum mt-2 text-[64px] font-bold leading-none tracking-[-0.045em] text-ink">
                    {featured.model}
                  </h3>
                  <p className="t-body mt-5 text-muted-ink">{featured.blurb}</p>
                  <dl className="mt-8 grid grid-cols-3 border-t border-line pt-5">
                    {featured.figures.map((f, i) => (
                      <div key={`${f.v}-${i}`} className={i > 0 ? "border-l border-line pl-4" : ""}>
                        <dd className="tnum text-[17px] font-semibold tracking-[-0.015em]">
                          {f.k}
                        </dd>
                        <dt className="mt-0.5 text-[11px] text-muted-ink">{f.v}</dt>
                      </div>
                    ))}
                  </dl>
                  <span className="btn btn-ink mt-10 self-start md:mt-auto">
                    View {featured.name}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </a>
            </Reveal>
          )}
        </div>
      </section>

      {/* 2W */}
      <section id="2w" className="section border-y border-line bg-paper-2">
        <div className="container-x">
          <SectionHeader eyebrow={twoW.label} title={twoW.heading} aside={twoW.body} />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 md:mt-16 lg:grid-cols-4">
            {twoW.products.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.06} className="h-full">
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-16 md:mt-20">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <h3 className="t-h3 text-ink">{c.compareHeading}</h3>
              {c.compareNote && <p className="t-small text-muted-ink">{c.compareNote}</p>}
            </div>
            <ul className="card mt-5 divide-y divide-line overflow-hidden md:hidden">
              {tw.skus.map((s) => (
                <li key={s.slug}>
                  <a
                    href={`/products/${s.slug}`}
                    className="group flex items-center gap-4 px-5 py-4 transition-colors active:bg-paper"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="tnum block text-[15px] font-semibold text-ink">
                        LOHIX {skuModel(s)}
                      </span>
                      <span className="tnum mt-1 block text-[12.5px] text-muted-ink">
                        {[s.keyFigures[2]?.k, s.keyFigures[3]?.k && `${s.keyFigures[3].k} cycles`]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                    </span>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-lohix-lime-deep transition-colors group-hover:border-lohix-lime">
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <div className="card mt-5 hidden overflow-x-auto md:block">
              <table className="w-full min-w-[680px] text-left">
                <thead>
                  <tr className="border-b border-line">
                    {["Model", "Nominal voltage", "Capacity", "Energy", "Life cycles", ""].map(
                      (h) => (
                        <th
                          key={h}
                          scope="col"
                          className="t-label px-6 py-4 font-medium text-muted-ink"
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {tw.skus.map((s) => (
                    <tr
                      key={s.slug}
                      className="group border-b border-line transition-colors last:border-0 hover:bg-paper"
                    >
                      <th scope="row" className="px-6 py-4 text-[14px] font-semibold text-ink">
                        <a href={`/products/${s.slug}`} className="tnum">
                          LOHIX {skuModel(s)}
                        </a>
                      </th>
                      <td className="tnum px-6 py-4 text-[14px] text-ink">{s.voltage}</td>
                      <td className="tnum px-6 py-4 text-[14px] text-ink">{s.capacity}</td>
                      <td className="tnum px-6 py-4 text-[14px] text-ink">{s.keyFigures[2]?.k}</td>
                      <td className="tnum px-6 py-4 text-[14px] text-ink">{s.keyFigures[3]?.k}</td>
                      <td className="px-6 py-4 text-right">
                        <a
                          href={`/products/${s.slug}`}
                          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink transition-colors group-hover:text-lohix-lime-deep"
                          aria-label={`View LOHIX ${skuModel(s)}`}
                        >
                          View
                          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ESTIMATOR */}
      <section id="estimator" className="section bg-paper">
        <div className="container-x">
          <SectionHeader
            eyebrow={c.estimatorEyebrow}
            title={c.estimatorHeading}
            aside={c.estimatorBody}
          />
          <Reveal className="mt-12 md:mt-16">
            <RangeEstimator />
          </Reveal>
        </div>
      </section>

      <CtaBand
        eyebrow={c.ctaEyebrow}
        title={c.ctaHeading}
        accent={c.ctaHighlight}
        body={c.ctaBody}
        primary={c.ctaPrimary}
        secondary={c.ctaSecondary}
      />

      <Footer />
    </main>
  );
}

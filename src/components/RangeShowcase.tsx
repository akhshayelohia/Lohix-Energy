import { ArrowRight } from "lucide-react";
import { useCatalog } from "@/cms/catalog";
import { useContent } from "@/cms/useContent";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/system/SectionHeader";
import { PackRender } from "@/components/product/PackRender";

function uniq(values: (string | undefined)[]) {
  return Array.from(new Set(values.filter(Boolean))) as string[];
}

export function RangeShowcase() {
  const catalog = useCatalog();
  const c = useContent("range");

  return (
    <section className="section border-y border-line bg-paper-2">
      <div className="container-x">
        <SectionHeader
          eyebrow={c.eyebrow}
          title={c.heading}
          accent={c.highlight || undefined}
          aside={c.body}
        />

        <div className="mt-12 grid gap-4 md:mt-16 md:grid-cols-2">
          {catalog.map((cat, ci) => {
            const lead = cat.products[0];
            const voltages = uniq(cat.products.map((p) => p.voltage));
            const capacities = uniq(cat.products.map((p) => p.capacity));
            const headline = voltages.length > 0 ? voltages.join(" · ") : lead?.name;
            const sub =
              capacities.length > 0
                ? `${capacities.join(" & ")} · ${cat.products.length} models`
                : lead?.figures.map((f) => f.k).join(" · ");
            const renders = cat.products.filter((p) => !p.image).slice(0, 3);

            return (
              <Reveal key={cat.id} delay={ci * 0.08} className="h-full">
                <a
                  href={`/products#${cat.id}`}
                  className="group relative flex aspect-[4/5] h-full flex-col justify-end overflow-hidden rounded-[16px] bg-night p-7 text-white sm:aspect-[5/4] sm:p-10"
                >
                  <div aria-hidden className="absolute inset-0">
                    <div className="stage-grid absolute inset-0 opacity-70" />
                    <div className="absolute left-1/2 top-[38%] h-[60%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-lohix-lime/[0.16] blur-[90px]" />
                  </div>

                  {lead?.image ? (
                    <img
                      src={lead.image}
                      alt={lead.name}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="absolute inset-x-0 top-[6%] flex h-[62%] items-end justify-center transition-transform duration-1000 ease-out group-hover:scale-[1.04]">
                      {renders.map((p, i) => (
                        <PackRender
                          key={p.id}
                          voltage={p.voltage ?? ""}
                          capacity={p.capacity ?? ""}
                          className={[
                            "h-full w-auto",
                            renders.length > 1 && i !== 1
                              ? "-mx-10 scale-[0.82] opacity-70"
                              : "relative z-10",
                          ].join(" ")}
                        />
                      ))}
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-night via-night/40 to-transparent" />

                  <div className="relative">
                    <span className="chip-dark">{cat.label}</span>
                    <h3 className="tnum mt-5 text-[34px] font-semibold leading-[1.02] tracking-[-0.035em] sm:text-[44px]">
                      {headline}
                    </h3>
                    <p className="tnum t-small mt-2 text-white">{sub}</p>
                    <span className="mt-6 inline-flex items-center gap-2 text-[13px] font-medium text-lohix-lime">
                      {c.linkPrefix} {cat.label}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </a>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

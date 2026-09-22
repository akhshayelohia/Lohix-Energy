import { ArrowUpRight } from "lucide-react";
import { useContent } from "@/cms/useContent";
import { useCatalog } from "@/cms/catalog";
import { safeHref, safeMediaSrc } from "@/lib/safe-url";

function contactHref(line: string): string | null {
  const trimmed = line.trim();
  if (/^\+?[\d\s-]{7,}$/.test(trimmed)) return `tel:${trimmed.replace(/[\s-]/g, "")}`;
  if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(trimmed)) return `mailto:${trimmed}`;
  return null;
}

export function Footer() {
  const c = useContent("footer");
  const g = useContent("global");
  const catalog = useCatalog();
  const productHrefs = new Set(catalog.flatMap((cat) => cat.products.map((p) => p.href)));
  const explore = c.productLinks.filter((l) => !productHrefs.has(l.href));

  return (
    <footer className="border-t border-line bg-paper">
      <div className="container-x pb-10 pt-16 md:pt-20">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-4 lg:grid-cols-12">
          <div className="col-span-2 md:col-span-4">
            <img src={safeMediaSrc(g.logoUrl)} alt={g.brandName} className="h-7 w-auto" />
            <p className="t-small mt-5 max-w-xs text-muted-ink">{c.tagline}</p>
            {c.dealerButton?.label && (
              <a href={safeHref(c.dealerButton.href)} className="btn btn-ink btn-sm mt-7">
                {c.dealerButton.label}
                <ArrowUpRight className="h-3 w-3" />
              </a>
            )}
          </div>

          {catalog.map((cat) => (
            <div key={cat.id} className="lg:col-span-2">
              <h4 className="t-label min-h-[3em] text-muted-ink sm:min-h-0">{cat.label}</h4>
              <ul className="mt-4 space-y-0.5 md:mt-5 md:space-y-2.5">
                {cat.products.map((p) => (
                  <li key={p.id}>
                    <a
                      href={p.href}
                      className="tnum text-[13px] link-accent inline-block py-1.5 text-ink hover:text-ink md:py-0"
                    >
                      {p.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="lg:col-span-2">
            <h4 className="t-label text-muted-ink">{c.exploreHeading}</h4>
            <ul className="mt-4 space-y-0.5 md:mt-5 md:space-y-2.5">
              <li>
                <a
                  href="/products"
                  className="text-[13px] link-accent inline-block py-1.5 text-ink hover:text-ink md:py-0"
                >
                  All products
                </a>
              </li>
              {explore.map((l) => (
                <li key={`${l.label}-${l.href}`}>
                  <a
                    href={safeHref(l.href)}
                    className="text-[13px] link-accent inline-block py-1.5 text-ink hover:text-ink md:py-0"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="t-label text-muted-ink">{c.contactHeading}</h4>
            <ul className="mt-4 space-y-0.5 text-[13px] text-ink md:mt-5 md:space-y-2.5">
              {c.contactLines.map((line) => {
                const href = contactHref(line);
                return (
                  <li key={line}>
                    {href ? (
                      <a
                        href={href}
                        className="tnum link-accent inline-block py-1.5 hover:text-ink md:py-0"
                      >
                        {line}
                      </a>
                    ) : (
                      <span className="inline-block py-1.5 md:py-0">{line}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-3 border-t border-line pt-6 md:flex-row md:items-center">
          <p className="text-[12px] text-muted-ink">{c.copyright}</p>
          <p className="inline-flex items-center gap-2 text-[12px] font-medium text-ink">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-lohix-lime" />
            {c.slogan}
          </p>
        </div>
      </div>
    </footer>
  );
}

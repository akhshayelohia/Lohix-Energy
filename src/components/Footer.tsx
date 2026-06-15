import { useContent } from "@/cms/useContent";
import { safeHref, safeMediaSrc } from "@/lib/safe-url";

export function Footer() {
  const c = useContent("footer");
  const g = useContent("global");
  return (
    <footer className="w-full bg-paper px-5 sm:px-6 pt-12 sm:pt-14 pb-8 border-t border-line">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2">
            <img src={safeMediaSrc(g.logoUrl)} alt={g.brandName} className="h-7 w-auto" />
            <p className="mt-4 text-[13px] text-muted-ink max-w-xs">{c.tagline}</p>
          </div>
          <div>
            <h4 className="text-xxs uppercase tracking-[0.2em] text-muted-ink">Product</h4>
            <ul className="mt-4 space-y-2">
              {c.productLinks.map((l) => (
                <li key={l.label}>
                  <a
                    href={safeHref(l.href)}
                    className="text-[13px] text-ink hover:text-lohix-green transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xxs uppercase tracking-[0.2em] text-muted-ink">Contact</h4>
            <ul className="mt-4 space-y-2 text-[13px] text-ink">
              {c.contactLines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-line flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-mini text-muted-ink">{c.copyright}</p>
          <p className="text-mini font-medium text-ink">{c.slogan}</p>
        </div>
      </div>
    </footer>
  );
}

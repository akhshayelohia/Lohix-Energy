import { ArrowRight } from "lucide-react";
import type { CatalogProduct } from "@/cms/catalog";
import { trackSpotlight } from "@/lib/spotlight";
import { PackRender } from "./PackRender";

export function ProductCard({ product, tag }: { product: CatalogProduct; tag?: string }) {
  return (
    <a
      href={product.href}
      onPointerMove={trackSpotlight}
      className="card spotlight group flex h-full flex-col overflow-hidden transition-[transform,box-shadow,border-color] duration-500 hover:-translate-y-1 hover:border-lohix-lime/60 hover:shadow-[0_40px_80px_-40px_rgba(11,15,16,0.45)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-night">
        <div aria-hidden className="absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[70%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-lohix-lime/[0.12] blur-[60px] transition-opacity duration-700 group-hover:opacity-100" />
          <div className="stage-grid absolute inset-0 opacity-60" />
        </div>
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <PackRender
            voltage={product.voltage ?? ""}
            capacity={product.capacity ?? ""}
            className="absolute inset-0 m-auto h-[94%] w-auto transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        )}
        {tag && <span className="chip-dark absolute left-4 top-4">{tag}</span>}
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="t-label text-muted-ink">{product.brand}</div>
        <h3 className="tnum mt-1.5 text-[24px] font-semibold tracking-[-0.025em] text-ink">
          {product.model}
        </h3>
        <p className="t-small mt-2 line-clamp-2 text-muted-ink">{product.blurb}</p>

        {product.figures.length > 0 && (
          <dl className="mt-6 grid grid-cols-2 border-t border-line pt-4">
            {product.figures.slice(0, 2).map((f, i) => (
              <div key={`${f.v}-${i}`} className={i === 1 ? "border-l border-line pl-4" : ""}>
                <dd className="tnum text-[15px] font-semibold tracking-[-0.01em] text-ink">
                  {f.k}
                </dd>
                <dt className="mt-0.5 text-[11px] text-muted-ink">{f.v}</dt>
              </div>
            ))}
          </dl>
        )}

        <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-[13px] font-medium text-ink">
          View product
          <ArrowRight className="h-3.5 w-3.5 text-lohix-lime-deep transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </a>
  );
}

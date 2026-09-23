import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Eyebrow } from "@/components/system/Eyebrow";
import { ButtonLink } from "@/components/system/ButtonLink";
import { useContent } from "@/cms/useContent";
import type { Link as CmsLink } from "@/cms/defaults";

// Packs that are announced but not on sale yet. The copy lives in the
// "All products page" CMS section so both placements stay in sync.
//  - full: the band on /products.
//  - compact: one horizontal card under the range cards on the landing page,
//    which links through to the full band instead of repeating the CTA.
type Props = {
  compact?: boolean;
  /** compact only: where "see more" points. */
  link?: CmsLink;
  className?: string;
};

function PackTile({
  voltage,
  capacities,
  compact,
}: {
  voltage: string;
  capacities: string;
  compact?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-[16px] border border-dashed border-white/25",
        compact ? "px-5 py-4" : "p-6 sm:p-7",
      ].join(" ")}
    >
      <div
        className={[
          "tnum font-semibold leading-none tracking-[-0.035em] text-white",
          compact ? "text-[26px]" : "text-[40px]",
        ].join(" ")}
      >
        {voltage}
      </div>
      <div className={["tnum t-small text-white", compact ? "mt-2" : "mt-3"].join(" ")}>
        {capacities}
      </div>
    </div>
  );
}

export function ComingSoonBand({ compact = false, link, className }: Props) {
  const c = useContent("products_page").comingSoon;
  if (!c?.heading) return null;
  const packs = c.packs ?? [];

  if (compact) {
    return (
      <Reveal className={["panel-dark px-6 py-8 sm:px-10 sm:py-10", className].join(" ")}>
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="stage-grid absolute inset-0 opacity-70" />
          <div className="absolute -right-24 -top-32 h-[360px] w-[420px] rounded-full bg-lohix-lime/[0.14] blur-[120px]" />
        </div>
        <div className="relative grid gap-8 md:grid-cols-12 md:items-center">
          <div className="md:col-span-6">
            <Eyebrow tone="dark" dot>
              {c.label}
            </Eyebrow>
            <h3 className="t-h3 mt-4 text-balance text-white">{c.heading}</h3>
            {c.note && <p className="t-small mt-3 max-w-md text-white">{c.note}</p>}
          </div>

          <div className="md:col-span-6">
            <div className="grid gap-3 sm:grid-cols-2">
              {packs.map((p, i) => (
                <PackTile key={`${p.voltage}-${i}`} {...p} compact />
              ))}
            </div>
            {link?.label && (
              <a
                href={link.href}
                className="group mt-5 inline-flex items-center gap-2 text-[13px] font-medium text-lohix-lime"
              >
                {link.label}
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            )}
          </div>
        </div>
      </Reveal>
    );
  }

  return (
    <Reveal
      className={["panel-dark px-6 py-10 sm:px-10 sm:py-14 md:px-16 md:py-20", className].join(" ")}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="stage-grid absolute inset-0 opacity-70" />
        <div className="absolute -right-32 -top-40 h-[480px] w-[520px] rounded-full bg-lohix-lime/[0.16] blur-[140px]" />
      </div>
      <div className="relative grid gap-10 md:grid-cols-12 md:items-start">
        <div className="md:col-span-6">
          <Eyebrow tone="dark" dot>
            {c.label}
          </Eyebrow>
          <h2 className="t-h2 mt-5 max-w-xl text-balance text-white">{c.heading}</h2>
          {c.body && <p className="t-body mt-5 max-w-lg text-white">{c.body}</p>}
          {c.cta?.label && (
            <div className="mt-8">
              <ButtonLink href={c.cta.href} variant="lime" icon="arrow">
                {c.cta.label}
              </ButtonLink>
            </div>
          )}
        </div>

        <div className="md:col-span-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {packs.map((p, i) => (
              <PackTile key={`${p.voltage}-${i}`} {...p} />
            ))}
          </div>
          {c.note && <p className="t-small mt-5 text-white">{c.note}</p>}
        </div>
      </div>
    </Reveal>
  );
}

import type { CSSProperties } from "react";
import { Download } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Eyebrow } from "@/components/system/Eyebrow";
import { ButtonLink } from "@/components/system/ButtonLink";
import { StageBackdrop } from "@/components/system/StageBackdrop";
import { StatRail } from "@/components/system/StatRail";
import { safeHref } from "@/lib/safe-url";
import type { Cta, KeyFigure, TwoWheelerSku } from "@/cms/products2w";
import { VariantPicker } from "./VariantPicker";

export type ProductIntroProps = {
  id: string;
  eyebrow: string;
  brand: string;
  model: string;
  /** Put the brand and model on two lines (long model names). */
  stacked?: boolean;
  tagline: string;
  badges: string[];
  keyFigures: KeyFigure[];
  variants?: { skus: TwoWheelerSku[]; current: TwoWheelerSku };
  primaryCta: Cta;
  datasheetUrl?: string;
};

export function ProductIntro({
  id,
  eyebrow,
  brand,
  model,
  stacked = false,
  tagline,
  badges,
  keyFigures,
  variants,
  primaryCta,
  datasheetUrl,
}: ProductIntroProps) {
  // "LOHIX 48" sets the full size; longer names shrink so the line always fits.
  const fit = Math.min(
    1,
    8 / (stacked ? Math.max(brand.length, model.length) : brand.length + 1 + model.length),
  );

  return (
    <section id={id} className="relative isolate overflow-hidden bg-night text-white">
      <StageBackdrop glow="none" base="flat" />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-48 top-0 h-[560px] w-[760px] rounded-full bg-lohix-lime/[0.07] blur-[150px]" />
        <div className="absolute -right-40 bottom-10 h-[420px] w-[560px] rounded-full bg-lohix-lime/[0.05] blur-[140px]" />
      </div>

      <div className="container-x relative pt-8 md:pt-12">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end lg:gap-16">
          <Reveal className="lg:col-span-7">
            <Eyebrow tone="dark">{eyebrow}</Eyebrow>
            <h1
              style={{ "--fit": fit } as CSSProperties}
              className="t-display mt-7 whitespace-nowrap text-[clamp(28px,calc(17vw*var(--fit)),calc(148px*var(--fit)))] lg:text-[min(calc(11vw*var(--fit)),calc(148px*var(--fit)))]"
            >
              {brand}
              {stacked ? <br /> : " "}
              <span
                key={model}
                className="animate-rise tnum inline-block normal-case text-lohix-lime"
              >
                {model}
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-5 lg:pb-4">
            <p className="t-lead text-white">{tagline}</p>

            {badges.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-2">
                {badges.map((b, i) => (
                  <li key={`${b}-${i}`} className="chip-dark">
                    {i === 0 && <span className="h-1.5 w-1.5 rounded-full bg-lohix-lime" />}
                    {b}
                  </li>
                ))}
              </ul>
            )}

            {variants && (
              <div className="mt-8 border-t border-white/10 pt-6">
                <VariantPicker skus={variants.skus} current={variants.current} />
              </div>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <ButtonLink href={primaryCta.href} variant="lime">
                {primaryCta.label}
              </ButtonLink>
              <ButtonLink href="#specs" variant="ghost-dark" icon="down">
                View specifications
              </ButtonLink>
            </div>

            {datasheetUrl?.trim() && (
              <a
                href={safeHref(datasheetUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 text-[12.5px] text-white transition-colors hover:text-lohix-lime"
              >
                <Download className="h-3.5 w-3.5" />
                Download full datasheet
              </a>
            )}
          </Reveal>
        </div>

        <Reveal delay={0.15} className="mt-14 md:mt-20">
          <StatRail items={keyFigures} />
        </Reveal>
      </div>
    </section>
  );
}

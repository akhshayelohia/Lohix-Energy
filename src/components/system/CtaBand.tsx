import type { ReactNode } from "react";
import { Reveal } from "@/components/Reveal";
import { ButtonLink } from "./ButtonLink";
import { Eyebrow } from "./Eyebrow";

type Cta = { label: string; href: string };

type Props = {
  eyebrow: string;
  title: ReactNode;
  accent?: ReactNode;
  body?: ReactNode;
  primary?: Cta;
  secondary?: Cta;
};

export function CtaBand({ eyebrow, title, accent, body, primary, secondary }: Props) {
  return (
    <section className="bg-paper py-12 sm:py-20 md:py-28">
      <div className="container-x">
        <Reveal className="panel-dark px-6 py-10 sm:px-10 sm:py-14 md:px-16 md:py-20">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="stage-grid absolute inset-0 opacity-70" />
            <div className="absolute -right-32 -top-40 h-[480px] w-[520px] rounded-full bg-lohix-lime/[0.16] blur-[140px]" />
            <div className="absolute -bottom-40 -left-24 h-[360px] w-[420px] rounded-full bg-lohix-lime/[0.06] blur-[120px]" />
          </div>
          <div className="relative grid gap-10 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <Eyebrow tone="dark" dot>
                {eyebrow}
              </Eyebrow>
              <h2 className="t-h2 mt-5 max-w-2xl text-balance text-white">
                {title}
                {accent && (
                  <>
                    {" "}
                    <span className="text-lohix-lime">{accent}</span>
                  </>
                )}
              </h2>
              {body && <p className="t-body mt-5 max-w-lg text-white/55">{body}</p>}
            </div>
            {(primary || secondary) && (
              <div className="flex flex-col gap-3 sm:flex-row md:col-span-4 md:flex-col md:items-end">
                {primary && (
                  <ButtonLink href={primary.href} variant="lime" className="w-full md:w-auto">
                    {primary.label}
                  </ButtonLink>
                )}
                {secondary && (
                  <ButtonLink
                    href={secondary.href}
                    variant="ghost-dark"
                    icon="external"
                    className="w-full md:w-auto"
                  >
                    {secondary.label}
                  </ButtonLink>
                )}
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

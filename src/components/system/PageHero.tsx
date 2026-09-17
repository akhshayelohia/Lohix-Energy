import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Eyebrow } from "./Eyebrow";
import { ScrollCue } from "./ScrollCue";
import { StageBackdrop } from "./StageBackdrop";

type Props = {
  eyebrow: string;
  title: ReactNode;
  accent?: ReactNode;
  /** Put the accent on its own line instead of running on after the title. */
  accentOnNewLine?: boolean;
  suffix?: ReactNode;
  body?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
  /** Page-specific illustration shown beside the headline on large screens. */
  visual?: ReactNode;
  /** Show the "Scroll" indicator at the bottom (skip it when a stat rail sits there). */
  scrollCue?: boolean;
};

const CONTENT_ANCHOR = "page-content";

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

// Viewport-height text hero: headline block centred under the nav, optional
// illustration on the right and stat rail pinned to the bottom edge.
export function PageHero({
  eyebrow,
  title,
  accent,
  accentOnNewLine,
  suffix,
  body,
  actions,
  children,
  visual,
  scrollCue,
}: Props) {
  const heading = (
    <h1
      className={cn(
        "animate-rise t-h1 text-balance",
        visual
          ? "text-[clamp(44px,min(5.8vw,11svh),100px)] short:text-[40px]"
          : "text-[clamp(44px,min(8.6vw,12svh),124px)] short:text-[40px] md:col-span-8",
      )}
      style={delay(80)}
    >
      {title}
      {accent && (
        <>
          {accentOnNewLine ? <br /> : " "}
          <span className="text-lohix-lime">{accent}</span>
        </>
      )}
      {suffix && <> {suffix}</>}
    </h1>
  );

  const actionsEl = actions && (
    <div
      className="animate-rise mt-10 flex flex-col gap-3 short:mt-5 sm:flex-row"
      style={delay(260)}
    >
      {actions}
    </div>
  );

  return (
    <>
      <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-night text-white">
        <StageBackdrop glow="right" />
        <div className="container-x relative flex flex-1 flex-col pb-8 pt-24 short:pb-6 short:pt-20 sm:pt-28 md:pb-10">
          {visual ? (
            <div className="grid flex-1 items-center gap-10 pb-[12svh] pt-4 short:pb-0 short:pt-0 md:pt-6 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-6">
                <div className="animate-rise" style={delay(0)}>
                  <Eyebrow tone="dark">{eyebrow}</Eyebrow>
                </div>
                <div className="mt-6">{heading}</div>
                {body && (
                  <p
                    className="animate-rise t-lead mt-6 max-w-xl text-white/60 short:mt-3"
                    style={delay(180)}
                  >
                    {body}
                  </p>
                )}
                {actionsEl}
              </div>
              <div
                className="animate-reveal relative hidden h-[min(62svh,600px)] items-center short:!hidden lg:col-span-6 lg:flex"
                style={delay(200)}
              >
                {visual}
              </div>
            </div>
          ) : (
            <div className="flex flex-1 flex-col justify-center pb-[16svh] pt-10 short:pb-4 short:pt-2 md:pt-12">
              <div className="animate-rise" style={delay(0)}>
                <Eyebrow tone="dark">{eyebrow}</Eyebrow>
              </div>
              <div className="mt-6 grid gap-6 md:grid-cols-12 md:items-end md:gap-10">
                {heading}
                {body && (
                  <p className="animate-rise t-lead text-white/60 md:col-span-4" style={delay(180)}>
                    {body}
                  </p>
                )}
              </div>
              {actionsEl}
            </div>
          )}

          {children && (
            <div className="animate-rise" style={delay(340)}>
              {children}
            </div>
          )}
        </div>
        {scrollCue && <ScrollCue href={`#${CONTENT_ANCHOR}`} />}
      </section>
      {scrollCue && (
        // Offset by the fixed nav's scroll-padding so the jump lands exactly at the hero's end.
        <div aria-hidden className="relative h-0">
          <span id={CONTENT_ANCHOR} className="absolute top-24" />
        </div>
      )}
    </>
  );
}

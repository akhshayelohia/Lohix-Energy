import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/Reveal";
import { Eyebrow, type Tone } from "./Eyebrow";

type Props = {
  eyebrow?: ReactNode;
  title: ReactNode;
  accent?: ReactNode;
  aside?: ReactNode;
  tone?: Tone;
  layout?: "split" | "stack" | "center";
  as?: "h1" | "h2";
  className?: string;
};

export function Accent({ children, tone = "light" }: { children: ReactNode; tone?: Tone }) {
  return <span className={tone === "dark" ? "text-lohix-lime" : "text-muted-ink"}>{children}</span>;
}

export function SectionHeader({
  eyebrow,
  title,
  accent,
  aside,
  tone = "light",
  layout = "split",
  as: H = "h2",
  className,
}: Props) {
  const dark = tone === "dark";
  const heading = (
    <>
      {eyebrow && <Eyebrow tone={tone}>{eyebrow}</Eyebrow>}
      <H className={cn("t-h2 mt-4 text-balance", dark ? "text-white" : "text-ink")}>
        {title}
        {accent && (
          <>
            {" "}
            <Accent tone={tone}>{accent}</Accent>
          </>
        )}
      </H>
    </>
  );
  const asideEl = aside ? (
    <div className={cn("t-body max-w-md", dark ? "text-white/60" : "text-muted-ink")}>{aside}</div>
  ) : null;

  if (layout === "center") {
    return (
      <Reveal className={cn("mx-auto flex max-w-3xl flex-col items-center text-center", className)}>
        {heading}
        {asideEl && <div className="mt-5">{asideEl}</div>}
      </Reveal>
    );
  }

  if (layout === "stack") {
    return (
      <Reveal className={cn("max-w-3xl", className)}>
        {heading}
        {asideEl && <div className="mt-5">{asideEl}</div>}
      </Reveal>
    );
  }

  return (
    <Reveal className={cn("grid gap-6 md:grid-cols-12 md:items-end md:gap-10", className)}>
      <div className="md:col-span-7">{heading}</div>
      {asideEl && <div className="md:col-span-5 md:justify-self-end">{asideEl}</div>}
    </Reveal>
  );
}

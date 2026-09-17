import { cn } from "@/lib/utils";
import type { Tone } from "./Eyebrow";

type Item = { k: string; v: string };

function railCell(i: number, line: string, mdLine: string) {
  return cn(
    "px-4 py-6 md:px-6 md:py-9",
    i % 2 === 1 && `border-l ${line}`,
    i % 2 === 0 && i > 0 && `md:border-l ${mdLine}`,
    i >= 2 && `border-t ${line} md:border-t-0`,
    i % 2 === 0 && "pl-0",
    i === 2 && "md:pl-6",
  );
}

export function StatRail({
  items,
  tone = "dark",
  className,
}: {
  items: Item[];
  tone?: Tone;
  className?: string;
}) {
  if (items.length === 0) return null;
  const dark = tone === "dark";
  const line = dark ? "border-white/10" : "border-line";
  const mdLine = dark ? "md:border-white/10" : "md:border-line";
  return (
    <dl className={cn("grid grid-cols-2 border-t md:grid-cols-4", line, className)}>
      {items.map((f, i) => (
        <div key={`${f.v}-${i}`} className={railCell(i, line, mdLine)}>
          {!dark && <span aria-hidden className="accent-tick mb-4" />}
          <dd
            className={cn(
              "tnum text-[26px] font-semibold tracking-[-0.03em] md:text-[34px]",
              dark ? "text-white" : "text-ink",
            )}
          >
            {f.k}
          </dd>
          <dt className={cn("t-label mt-2", dark ? "text-white/45" : "text-muted-ink")}>{f.v}</dt>
        </div>
      ))}
    </dl>
  );
}

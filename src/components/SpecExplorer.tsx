import { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import { ButtonLink } from "@/components/system/ButtonLink";
import { getIcon } from "@/cms/icons";
import { cn } from "@/lib/utils";
import type { FeatureItem } from "@/cms/defaults";

const CATEGORIES = ["All", "Power", "Lifecycle", "Safety", "Origin"] as const;

type Props = {
  items: FeatureItem[];
  hint?: string;
  cta?: { label: string; href: string };
};

export function SpecExplorer({ items, hint, cta }: Props) {
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("All");
  const [active, setActive] = useState<string>(items[0]?.id ?? "");

  const filtered = useMemo(
    () => (cat === "All" ? items : items.filter((i) => i.category === cat)),
    [cat, items],
  );
  const panelRef = useRef<HTMLDivElement>(null);
  // On stacked layouts the detail panel sits below the grid; bring it into view on tap.
  const select = (id: string) => {
    setActive(id);
    const panel = panelRef.current;
    if (!panel || window.matchMedia("(min-width: 1024px)").matches) return;
    const r = panel.getBoundingClientRect();
    if (r.top < 0 || r.bottom > window.innerHeight) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      panel.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest" });
    }
  };
  const activeItem = items.find((i) => i.id === active) ?? items[0];
  if (!activeItem) return null;
  const ActiveIcon = getIcon(activeItem.icon);
  const activeIndex = items.findIndex((i) => i.id === activeItem.id);

  return (
    <div>
      <Reveal className="flex flex-wrap items-center gap-2">
        {CATEGORIES.map((cc) => (
          <button
            key={cc}
            type="button"
            onClick={() => setCat(cc)}
            aria-pressed={cat === cc}
            className={cn(
              "tap rounded-full border px-4 py-1.5 text-[12px] font-medium transition-colors",
              cat === cc
                ? "border-ink bg-ink text-lohix-lime"
                : "border-line bg-paper-2 text-muted-ink hover:border-ink/30 hover:text-ink",
            )}
          >
            {cc}
          </button>
        ))}
        {hint && <span className="t-label ml-auto hidden text-muted-ink md:inline">{hint}</span>}
      </Reveal>

      <div className="mt-8 grid gap-4 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-7">
          <div className="mosaic grid-cols-2 sm:grid-cols-3 max-sm:[&>*:last-child:nth-child(odd)]:col-span-2">
            <AnimatePresence mode="popLayout">
              {filtered.map((item, i) => {
                const Icon = getIcon(item.icon);
                const isActive = activeItem.id === item.id;
                return (
                  <motion.button
                    key={item.id}
                    type="button"
                    layout
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.25, delay: i * 0.03 }}
                    onMouseEnter={() => setActive(item.id)}
                    onFocus={() => setActive(item.id)}
                    onClick={() => select(item.id)}
                    className={cn(
                      "relative p-5 text-left transition-colors duration-300 sm:p-6",
                      isActive ? "bg-night-2 text-white" : "bg-paper-2 hover:bg-paper",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <Icon className={cn("h-4 w-4", isActive ? "text-lohix-lime" : "text-ink")} />
                      <span className={cn("t-label", isActive ? "text-white" : "text-muted-ink")}>
                        {item.label}
                      </span>
                    </div>
                    <div className="mt-8 flex flex-wrap items-baseline gap-x-1">
                      <span className="tnum text-[30px] font-semibold leading-none tracking-[-0.03em] sm:text-[36px]">
                        {item.value}
                      </span>
                      {item.unit && (
                        <span
                          className={cn(
                            "text-[12px] leading-tight",
                            isActive ? "text-white" : "text-muted-ink",
                          )}
                        >
                          {item.unit}
                        </span>
                      )}
                    </div>
                    {isActive && (
                      <motion.span
                        layoutId="spec-explorer-active"
                        className="absolute inset-x-0 bottom-0 h-0.5 bg-lohix-lime"
                      />
                    )}
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div
            ref={panelRef}
            className="panel-dark flex min-h-[380px] scroll-mt-24 flex-col p-7 sm:p-9 lg:sticky lg:top-24"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-lohix-lime/[0.18] blur-[90px]"
            />
            <AnimatePresence mode="wait">
              <motion.div
                key={activeItem.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="relative flex flex-1 flex-col"
              >
                <div className="flex items-center justify-between">
                  <span className="chip-dark">{activeItem.category}</span>
                  <span className="t-label tnum text-white">
                    {String(activeIndex + 1).padStart(2, "0")} /{" "}
                    {String(items.length).padStart(2, "0")}
                  </span>
                </div>
                <span className="mt-10 flex h-10 w-10 items-center justify-center rounded-full bg-lohix-lime text-ink">
                  <ActiveIcon className="h-4 w-4" />
                </span>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="tnum text-[64px] font-semibold leading-none tracking-[-0.045em] sm:text-[84px]">
                    {activeItem.value}
                  </span>
                  {activeItem.unit && (
                    <span className="text-[16px] text-white">{activeItem.unit}</span>
                  )}
                </div>
                <h3 className="mt-6 text-[20px] font-semibold tracking-[-0.015em]">
                  {activeItem.title}
                </h3>
                <p className="t-small mt-2 max-w-sm text-white">{activeItem.body}</p>
                <div className="mt-auto pt-8">
                  {cta ? (
                    <ButtonLink href={cta.href} variant="lime" size="sm" icon="external">
                      {cta.label}
                    </ButtonLink>
                  ) : (
                    <div className="flex items-center justify-between border-t border-white/10 pt-5">
                      <span className="t-label text-white">Parameter</span>
                      <span className="text-[12.5px] font-medium">{activeItem.label}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

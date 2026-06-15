import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useContent } from "@/cms/useContent";
import { getIcon } from "@/cms/icons";
import { safeHref } from "@/lib/safe-url";

const categories = ["All", "Power", "Lifecycle", "Safety", "Origin"] as const;

export function FeatureSection() {
  const content = useContent("features");
  const features = content.items;

  const [activeCat, setActiveCat] = useState<(typeof categories)[number]>("All");
  const [activeId, setActiveId] = useState<string>(features[0]?.id ?? "");

  const filtered = useMemo(
    () => (activeCat === "All" ? features : features.filter((f) => f.category === activeCat)),
    [activeCat, features],
  );
  const active = features.find((f) => f.id === activeId) ?? features[0];
  if (!active) return null;
  const ActiveIcon = getIcon(active.icon);

  return (
    <section
      id="features"
      className="relative w-full bg-paper px-5 sm:px-6 py-16 sm:py-24 md:py-32"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="inline-flex items-center gap-2 pill hairline bg-paper-2 px-3 py-1 text-xxs uppercase tracking-[0.2em] text-muted-ink">
              <span className="w-1 h-1 rounded-full bg-lohix-green" />
              {content.eyebrow}
            </div>
            <h2 className="mt-5 font-sans text-[34px] sm:text-[44px] md:text-[64px] leading-[1] tracking-[-0.03em] text-ink max-w-2xl">
              {content.headingPrefix}{" "}
              <em className="italic text-lohix-green">{content.headingHighlight}</em>{" "}
              {content.headingSuffix}
            </h2>
            <p className="mt-4 max-w-lg text-[14px] text-muted-ink">{content.body}</p>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCat(c)}
              className={`pill text-mini font-medium px-3.5 py-1.5 transition-all ${
                activeCat === c
                  ? "bg-ink text-paper-2"
                  : "hairline bg-paper-2 text-ink/70 hover:text-ink"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-12 gap-3 md:gap-4">
          <div className="col-span-12 lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((f, i) => {
                const Icon = getIcon(f.icon);
                const isActive = activeId === f.id;
                return (
                  <motion.button
                    layout
                    key={f.id}
                    onClick={() => setActiveId(f.id)}
                    onMouseEnter={() => setActiveId(f.id)}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3, delay: i * 0.03 }}
                    className={`group relative text-left rounded-2xl p-4 md:p-5 transition-all overflow-hidden ${
                      isActive
                        ? "bg-ink text-paper-2 shadow-[0_20px_40px_-20px_rgba(11,15,16,0.3)]"
                        : "bg-paper-2 hairline hover:border-ink/30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                          isActive ? "bg-lohix-lime text-ink" : "bg-paper text-ink/70"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span
                        className={`text-xxs uppercase tracking-[0.15em] ${isActive ? "text-paper-2/60" : "text-muted-ink"}`}
                      >
                        {f.label}
                      </span>
                    </div>
                    <div className="mt-6 flex items-baseline gap-1">
                      <span className="font-sans text-[36px] md:text-[44px] leading-none tracking-[-0.03em]">
                        {f.value}
                      </span>
                      {f.unit && (
                        <span
                          className={`text-mini ${isActive ? "text-paper-2/70" : "text-muted-ink"}`}
                        >
                          {f.unit}
                        </span>
                      )}
                    </div>
                    {isActive && (
                      <motion.div
                        layoutId="active-underline"
                        className="absolute bottom-0 left-0 right-0 h-px bg-lohix-lime"
                      />
                    )}
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>

          <div className="col-span-12 lg:col-span-5">
            <div className="lg:sticky lg:top-24 rounded-2xl bg-ink text-paper-2 p-6 md:p-8 overflow-hidden relative min-h-[380px] sm:min-h-[420px] flex flex-col">
              <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-lohix-green/20 blur-3xl" />
              <div className="absolute -bottom-24 -left-12 w-64 h-64 rounded-full bg-lohix-lime/10 blur-3xl" />

              <div className="relative flex items-center justify-between">
                <span className="pill bg-paper-2/10 backdrop-blur text-xxs uppercase tracking-[0.2em] px-3 py-1 text-paper-2/80">
                  {active.category}
                </span>
                <span className="text-xxs text-paper-2/40 font-mono">
                  0{features.findIndex((f) => f.id === active.id) + 1} / 0{features.length}
                </span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="relative flex-1 flex flex-col mt-8"
                >
                  <div className="w-10 h-10 rounded-full bg-lohix-lime text-ink flex items-center justify-center">
                    <ActiveIcon className="w-4.5 h-4.5" />
                  </div>

                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="font-sans text-[56px] sm:text-[72px] md:text-[96px] leading-none tracking-[-0.04em]">
                      {active.value}
                    </span>
                    {active.unit && (
                      <span className="text-[18px] text-paper-2/70">{active.unit}</span>
                    )}
                  </div>

                  <h3 className="mt-4 text-[20px] font-medium tracking-[-0.01em]">
                    {active.title}
                  </h3>
                  <p className="mt-2 text-[13px] text-paper-2/70 leading-relaxed max-w-sm">
                    {active.body}
                  </p>

                  <div className="mt-auto pt-8">
                    <a
                      href={safeHref(content.ctaHref)}
                      className="pill inline-flex items-center gap-2 bg-lohix-lime text-ink text-[13px] font-medium px-4 py-2 hover:bg-paper-2 transition-colors"
                    >
                      {content.ctaLabel}
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

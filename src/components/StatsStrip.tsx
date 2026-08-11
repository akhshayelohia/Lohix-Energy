import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Reveal } from "./Reveal";
import { useContent } from "@/cms/useContent";

/**
 * Splits a CMS value like "5.12kWh" into the number that animates (5.12),
 * the unit that stays put ("kWh"), and how many decimals to hold while
 * counting so 5.12 never renders as "5.1".
 */
function parseStatValue(raw: string): { target: number; suffix: string; decimals: number } {
  const match = /^\s*(-?\d[\d,]*(?:\.\d+)?)(.*)$/.exec(raw ?? "");
  if (!match) return { target: 0, suffix: raw ?? "", decimals: 0 };
  const [, numeric, rest] = match;
  const target = Number(numeric.replace(/,/g, ""));
  if (!Number.isFinite(target)) return { target: 0, suffix: raw, decimals: 0 };
  return { target, suffix: rest, decimals: (numeric.split(".")[1] ?? "").length };
}

function CountUp({ to, suffix, decimals }: { to: number; suffix: string; decimals: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setN(to);
      return;
    }
    const start = performance.now();
    const dur = 1400;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(to * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, reduce]);

  const display = n.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

export function StatsStrip() {
  const c = useContent("stats");

  return (
    <section className="w-full bg-ink text-paper-2 px-5 sm:px-6 py-16 sm:py-20 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, #B7E26D 1px, transparent 1px), linear-gradient(to bottom, #B7E26D 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[680px] h-[420px] rounded-full bg-lohix-lime/10 blur-[140px]" />
      <div className="relative max-w-6xl mx-auto">
        <Reveal className="max-w-2xl">
          <div className="inline-flex items-center gap-2 pill border border-white/15 bg-white/[0.04] px-3 py-1 text-xxs uppercase tracking-[0.2em] text-white/60">
            <span className="w-1 h-1 rounded-full bg-lohix-lime pulse-dot" />
            {c.eyebrow}
          </div>
          <h2 className="mt-5 font-sans text-[32px] sm:text-[44px] md:text-[56px] leading-[1.02] tracking-[-0.03em]">
            {c.headingPrefix} <em className="italic text-lohix-lime">{c.headingHighlight}</em>
          </h2>
        </Reveal>
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 rounded-2xl overflow-hidden border border-white/10">
          {c.items.map((s, i) => {
            const { target, suffix, decimals } = parseStatValue(s.value);
            return (
              <motion.div
                key={`${s.label}-${i}`}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-ink p-6 sm:p-8"
              >
                <div className="font-sans text-[34px] sm:text-[44px] leading-none tracking-[-0.03em] text-lohix-lime">
                  <CountUp to={target} suffix={suffix} decimals={decimals} />
                </div>
                <div className="mt-3 text-[13px] font-medium">{s.label}</div>
                {s.sub && <div className="mt-1 text-[11px] text-white/50">{s.sub}</div>}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

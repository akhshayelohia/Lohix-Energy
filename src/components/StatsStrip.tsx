import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useContent } from "@/cms/useContent";
import { SectionHeader } from "@/components/system/SectionHeader";
import { StageBackdrop } from "@/components/system/StageBackdrop";

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
    <section className="section relative isolate overflow-hidden bg-night text-white">
      <StageBackdrop glow="top" />
      <div className="container-x relative">
        <SectionHeader
          tone="dark"
          layout="stack"
          eyebrow={c.eyebrow}
          title={c.headingPrefix}
          accent={c.headingHighlight}
        />
        <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-[12px] border border-white/10 bg-white/10 md:mt-16 md:grid-cols-4">
          {c.items.map((s, i) => {
            const { target, suffix, decimals } = parseStatValue(s.value);
            return (
              <motion.div
                key={`${s.label}-${i}`}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="bg-night-2 p-6 sm:p-8"
              >
                <div className="tnum text-[34px] font-semibold leading-none tracking-[-0.035em] text-lohix-lime sm:text-[46px]">
                  <CountUp to={target} suffix={suffix} decimals={decimals} />
                </div>
                <div className="mt-4 text-[14px] font-medium">{s.label}</div>
                {s.sub && <div className="t-small mt-1 text-white">{s.sub}</div>}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Reveal } from "./Reveal";

type Stat = { value: number; suffix?: string; label: string; sub?: string };

const STATS: Stat[] = [
  { value: 3500, suffix: "+", label: "Charge cycles", sub: "LFP chemistry, long life" },
  { value: 99.2, suffix: "%", label: "Uptime in field", sub: "Across 18 cities" },
  { value: 51.2, suffix: "V", label: "Nominal voltage", sub: "100Ah smart pack" },
  { value: 8, suffix: "yr", label: "Design life", sub: "Backed by warranty" },
];

function CountUp({ to, suffix }: { to: number; suffix?: string }) {
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

  const display = Number.isInteger(to) ? Math.round(n).toLocaleString() : n.toFixed(1);
  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

export function StatsStrip() {
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
            By the numbers
          </div>
          <h2 className="mt-5 font-sans text-[32px] sm:text-[44px] md:text-[56px] leading-[1.02] tracking-[-0.03em]">
            Engineered to outlast <em className="italic text-lohix-lime">every charge.</em>
          </h2>
        </Reveal>
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 rounded-2xl overflow-hidden border border-white/10">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-ink p-6 sm:p-8"
            >
              <div className="font-sans text-[34px] sm:text-[44px] leading-none tracking-[-0.03em] text-lohix-lime">
                <CountUp to={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-3 text-[13px] font-medium">{s.label}</div>
              {s.sub && <div className="mt-1 text-[11px] text-white/50">{s.sub}</div>}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

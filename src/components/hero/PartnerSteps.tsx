import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Step = { n: string; t: string; b: string };

const STEP_MS = 3000;
const ease = [0.22, 1, 0.36, 1] as const;

// The partner onboarding steps as a self-advancing stepper; hover or focus a
// step to hold it.
export function PartnerSteps({ label, steps }: { label?: string; steps: Step[] }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const auto = !reduce && !paused && steps.length > 1;

  useEffect(() => {
    if (!auto) return;
    const t = window.setTimeout(() => setActive((a) => (a + 1) % steps.length), STEP_MS);
    return () => window.clearTimeout(t);
  }, [auto, active, steps.length]);

  if (steps.length === 0) return null;
  const progress = steps.length > 1 ? active / (steps.length - 1) : 1;
  const select = (i: number) => {
    setPaused(true);
    setActive(i);
  };

  return (
    <div className="relative mx-auto w-full max-w-[520px]" onMouseLeave={() => setPaused(false)}>
      {label && <p className="t-label mb-5 text-white">{label}</p>}

      <div className="relative">
        <div aria-hidden className="absolute bottom-9 left-[35px] top-9 w-px bg-white/10">
          <motion.div
            className="w-full origin-top bg-lohix-lime"
            animate={{ height: `${progress * 100}%` }}
            transition={{ duration: 0.6, ease }}
          />
        </div>

        <ol className="space-y-2">
          {steps.map((s, i) => {
            const on = i === active;
            const done = i < active;
            return (
              <li key={`${s.n}-${i}`}>
                <button
                  type="button"
                  aria-current={on ? "step" : undefined}
                  onMouseEnter={() => select(i)}
                  onFocus={() => select(i)}
                  onClick={() => select(i)}
                  onBlur={() => setPaused(false)}
                  className={cn(
                    "relative flex w-full items-start gap-5 overflow-hidden rounded-[12px] border p-4 text-left transition-colors duration-300",
                    on
                      ? "border-white/15 bg-white/[0.06] backdrop-blur-md"
                      : "border-transparent hover:bg-white/[0.03]",
                  )}
                >
                  <span
                    className={cn(
                      "tnum relative z-10 flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full border text-[12px] font-semibold transition-colors duration-300",
                      on || done
                        ? "border-lohix-lime bg-lohix-lime text-ink"
                        : "border-white/20 bg-night text-white",
                    )}
                  >
                    {done ? <Check className="h-4 w-4" /> : s.n}
                  </span>
                  <span className="min-w-0 flex-1 pt-2">
                    <span
                      className={cn(
                        "block text-[16px] font-semibold tracking-[-0.01em] transition-colors",
                        on ? "text-white" : "text-white",
                      )}
                    >
                      {s.t}
                    </span>
                    <AnimatePresence initial={false}>
                      {on && (
                        <motion.span
                          key="body"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease }}
                          className="block overflow-hidden"
                        >
                          <span className="t-small block pb-1 pt-1.5 text-white">{s.b}</span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                  {on && auto && (
                    <motion.span
                      key={`timer-${active}`}
                      aria-hidden
                      className="absolute bottom-0 left-0 h-0.5 bg-lohix-lime/70"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: STEP_MS / 1000, ease: "linear" }}
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

import { useEffect, useId, useMemo, useState, type CSSProperties } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { useContent } from "@/cms/useContent";
import { skuModel } from "@/cms/products2w";
import { cn } from "@/lib/utils";

type Kind = "e-rickshaw" | "2w";

type Model = {
  id: string;
  label: string;
  kind: Kind;
  voltage: number;
  capacity: number;
  cycles: number;
};

// Slider bounds per vehicle type. Consumption defaults are a rough guide only;
// riders set their own figure.
const PRESETS: Record<Kind, { use: [number, number, number]; km: [number, number, number] }> = {
  "e-rickshaw": { use: [40, 120, 70], km: [20, 200, 100] },
  "2w": { use: [20, 60, 32], km: [10, 150, 40] },
};

const DAYS = [5, 6, 7];

function num(value: string | undefined, fallback: number) {
  const n = parseFloat((value ?? "").replace(/[^\d.]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function useModels(): Model[] {
  const p = useContent("product");
  const tw = useContent("products_2w");
  return useMemo(() => {
    const stat = (test: (k: string, v: string) => boolean) =>
      p.quickStats.find((q) => test(q.k.trim(), q.v))?.k;
    const erick: Model = {
      id: "lohix-48",
      label: p.titleAccent || p.titleMain,
      kind: "e-rickshaw",
      voltage: num(
        stat((k) => /\d\s*V$/i.test(k)),
        51.2,
      ),
      capacity: num(
        stat((k) => /Ah$/i.test(k)),
        100,
      ),
      cycles: num(
        stat((_, v) => /cycle/i.test(v)),
        3500,
      ),
    };
    const twoWheel: Model[] = tw.skus.map((s) => ({
      id: s.slug,
      label: skuModel(s),
      kind: "2w",
      voltage: num(s.voltage, 60),
      capacity: num(s.capacity, 30),
      cycles: num(s.keyFigures.find((f) => /cycle/i.test(f.v))?.k, 2500),
    }));
    return [erick, ...twoWheel];
  }, [p, tw]);
}

function Figure({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const spring = useSpring(value, { stiffness: 160, damping: 24 });
  useEffect(() => {
    spring.set(value);
  }, [spring, value]);
  const text = useTransform(spring, (v) =>
    v.toLocaleString("en-IN", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }),
  );
  return <motion.span className="tnum">{text}</motion.span>;
}

function Slider({
  label,
  unit,
  value,
  min,
  max,
  step = 1,
  onChange,
  hint,
}: {
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  hint?: string;
}) {
  const id = useId();
  const fill = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-[13px] font-medium text-white">
          {label}
        </label>
        <span className="tnum text-[15px] font-semibold text-white">
          {value} <span className="text-[12px] font-normal text-white">{unit}</span>
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range-input mt-4"
        style={{ "--fill": `${fill}%` } as CSSProperties}
      />
      {hint && <p className="mt-2.5 text-[12px] text-white">{hint}</p>}
    </div>
  );
}

export function RangeEstimator({
  initialModelId,
  className,
}: {
  initialModelId?: string;
  className?: string;
}) {
  const models = useModels();
  const [modelId, setModelId] = useState(initialModelId ?? models[0]?.id);
  const model = models.find((m) => m.id === modelId) ?? models[0];
  const preset = PRESETS[model.kind];
  const [kind, setKind] = useState<Kind>(model.kind);
  const [use, setUse] = useState(preset.use[2]);
  const [km, setKm] = useState(preset.km[2]);
  const [days, setDays] = useState(6);

  useEffect(() => {
    if (initialModelId) setModelId(initialModelId);
  }, [initialModelId]);

  // Switching between an e-rickshaw and a 2W pack resets the sliders to that vehicle's scale.
  if (kind !== model.kind) {
    setKind(model.kind);
    setUse(preset.use[2]);
    setKm(preset.km[2]);
  }

  const energy = model.voltage * model.capacity;
  const range = energy / use;
  const chargesPerDay = km / range;
  const cyclesPerYear = chargesPerDay * days * 52;
  const years = model.cycles / cyclesPerYear;
  const coverage = Math.min(range / km, 1);
  const needsTopUp = chargesPerDay > 1;

  const groups: { kind: Kind; title: string }[] = [
    { kind: "e-rickshaw", title: "E-rickshaw" },
    { kind: "2w", title: "Two-wheeler" },
  ];

  return (
    <div className={cn("panel-dark", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-32 h-80 w-[28rem] rounded-full bg-lohix-lime/[0.12] blur-[110px]"
      />
      <div className="relative grid lg:grid-cols-12">
        <div className="space-y-9 p-7 sm:p-10 lg:col-span-7 lg:border-r lg:border-white/10">
          <fieldset>
            <legend className="text-[13px] font-medium text-white">Battery</legend>
            <div className="mt-4 space-y-3">
              {groups.map((g) => (
                <div key={g.kind} className="flex flex-wrap items-center gap-2">
                  <span className="t-label w-full whitespace-nowrap text-white sm:w-32 sm:shrink-0">
                    {g.title}
                  </span>
                  {models
                    .filter((m) => m.kind === g.kind)
                    .map((m) => {
                      const active = m.id === model.id;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          aria-pressed={active}
                          onClick={() => setModelId(m.id)}
                          className={cn(
                            "tap tnum rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium transition-colors duration-200",
                            active
                              ? "border-lohix-lime bg-lohix-lime text-ink"
                              : "border-white/12 text-white hover:border-white/30 hover:text-white",
                          )}
                        >
                          {m.label}
                        </button>
                      );
                    })}
                </div>
              ))}
            </div>
          </fieldset>

          <Slider
            label="Distance per day"
            unit="km"
            value={km}
            min={preset.km[0]}
            max={preset.km[1]}
            step={5}
            onChange={setKm}
          />

          <Slider
            label="Your vehicle's energy use"
            unit="Wh/km"
            value={use}
            min={preset.use[0]}
            max={preset.use[1]}
            onChange={setUse}
            hint={
              model.kind === "2w"
                ? "Rough guide: most e-scooters use 25–40 Wh/km. Check your vehicle's manual."
                : "Rough guide: loaded e-rickshaws often use 50–90 Wh/km. Check your vehicle's manual."
            }
          />

          <fieldset>
            <legend className="text-[13px] font-medium text-white">Days on the road</legend>
            <div className="mt-4 inline-flex rounded-full border border-white/10 bg-white/[0.04] p-1">
              {DAYS.map((d) => (
                <button
                  key={d}
                  type="button"
                  aria-pressed={days === d}
                  onClick={() => setDays(d)}
                  className={cn(
                    "tap rounded-full px-4 py-1.5 text-[12.5px] font-medium transition-colors",
                    days === d ? "bg-white text-ink" : "text-white hover:text-white",
                  )}
                >
                  {d} / week
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <div
          aria-live="polite"
          className="flex flex-col border-t border-white/10 p-7 sm:p-10 lg:col-span-5 lg:border-t-0"
        >
          <p className="t-label text-white">Estimated range per charge</p>
          <p className="mt-3 text-[64px] font-semibold leading-none tracking-[-0.045em] text-white sm:text-[80px]">
            <Figure value={range} />
            <span className="ml-2 text-[20px] font-medium tracking-normal text-white">km</span>
          </p>

          <div className="mt-8">
            <div className="flex justify-between text-[12px] text-white">
              <span>Your day: {km} km</span>
              <span>{needsTopUp ? "Needs a mid-day top-up" : "Covered on one charge"}</span>
            </div>
            <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className={cn("h-full rounded-full", needsTopUp ? "bg-white/70" : "bg-lohix-lime")}
                animate={{ width: `${coverage * 100}%` }}
                transition={{ type: "spring", stiffness: 160, damping: 26 }}
              />
            </div>
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-[10px] border border-white/10 bg-white/10">
            <div className="bg-night-2 p-4">
              <dt className="text-[12px] text-white">Pack energy</dt>
              <dd className="mt-1 text-[20px] font-semibold text-white">
                <Figure value={energy} />
                <span className="ml-1 text-[12px] font-normal text-white">Wh</span>
              </dd>
            </div>
            <div className="bg-night-2 p-4">
              <dt className="text-[12px] text-white">Charges per day</dt>
              <dd className="mt-1 text-[20px] font-semibold text-white">
                <Figure value={chargesPerDay} decimals={1} />
              </dd>
            </div>
            <div className="col-span-2 bg-night-2 p-4">
              <dt className="text-[12px] text-white">
                Rated {model.cycles.toLocaleString("en-IN")}+ cycles at this pace
              </dt>
              <dd className="mt-1 text-[20px] font-semibold text-white">
                {years > 15 ? (
                  "15+ years"
                ) : (
                  <>
                    <Figure value={years} decimals={1} />
                    <span className="ml-1 text-[12px] font-normal text-white">years</span>
                  </>
                )}
              </dd>
            </div>
          </dl>

          <p className="mt-auto pt-8 text-[11.5px] leading-relaxed text-white">
            Estimate only: rated pack energy ÷ the energy use you set. Real range depends on load,
            speed, terrain, temperature and battery age. Cycle life is a rated figure, not a
            warranty term.
          </p>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MapPin } from "lucide-react";

type Milestone = { year: string; title: string; body: string };

const W = 560;
const H = 560;
const ease = [0.22, 1, 0.36, 1] as const;

// Milestones laid out as stops along a winding road, auto-advancing until hovered.
export function RoadTimeline({
  items,
  place,
  coordinates,
}: {
  items: Milestone[];
  place?: string;
  coordinates?: string;
}) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(Math.max(items.length - 1, 0));
  const [paused, setPaused] = useState(false);

  const { points, d } = useMemo(() => {
    const n = Math.max(items.length, 1);
    const step = n > 1 ? 1 / (n - 1) : 0;
    const points = items.map((_, i) => {
      const t = i * step;
      const wobble = i === 0 || i === n - 1 ? 0 : i % 2 ? -34 : 34;
      return { x: 70 + t * 420, y: 480 - t * 330 + wobble };
    });
    const d = points.reduce((path, p, i) => {
      if (i === 0) return `M${p.x},${p.y}`;
      const prev = points[i - 1];
      const dx = (p.x - prev.x) * 0.55;
      return `${path} C${prev.x + dx},${prev.y} ${p.x - dx},${p.y} ${p.x},${p.y}`;
    }, "");
    return { points, d };
  }, [items]);

  useEffect(() => {
    if (reduce || paused || items.length < 2) return;
    const t = window.setInterval(() => setActive((a) => (a + 1) % items.length), 3200);
    return () => window.clearInterval(t);
  }, [reduce, paused, items.length]);

  if (items.length === 0) return null;
  const current = items[active] ?? items[0];
  const progress = items.length > 1 ? active / (items.length - 1) : 1;
  const select = (i: number) => {
    setPaused(true);
    setActive(i);
  };

  return (
    <div
      className="relative mx-auto aspect-square w-[min(100%,62svh,600px)]"
      onMouseLeave={() => setPaused(false)}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="absolute inset-0 h-full w-full overflow-visible"
        aria-hidden
      >
        <path
          d={d}
          fill="none"
          stroke="#fff"
          strokeOpacity="0.06"
          strokeWidth="30"
          strokeLinecap="round"
        />
        <path
          d={d}
          fill="none"
          className="animate-road stroke-white"
          strokeOpacity="0.28"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <motion.path
          d={d}
          fill="none"
          className="stroke-lohix-lime"
          strokeWidth="3"
          strokeLinecap="round"
          initial={reduce ? false : { pathLength: 0 }}
          animate={{ pathLength: Math.max(progress, 0.001) }}
          transition={{ duration: 0.9, ease }}
        />
        {points.map((p, i) => {
          const passed = i <= active;
          const on = i === active;
          return (
            <g key={items[i].year + i}>
              <circle
                cx={p.x}
                cy={p.y}
                r={on ? 20 : 0}
                className="fill-lohix-lime transition-all duration-500"
                fillOpacity="0.14"
              />
              <circle
                cx={p.x}
                cy={p.y}
                r={on ? 9 : 7}
                strokeWidth="2"
                className={
                  passed
                    ? "fill-lohix-lime stroke-lohix-lime transition-all duration-300"
                    : "fill-night stroke-white/30 transition-all duration-300"
                }
              />
              <text
                x={p.x}
                y={p.y + (i % 2 ? -26 : 34)}
                textAnchor="middle"
                fontSize="14"
                fontWeight="600"
                className={on ? "fill-lohix-lime" : "fill-white/55"}
              >
                {items[i].year}
              </text>
            </g>
          );
        })}
      </svg>

      {points.map((p, i) => (
        <button
          key={`hit-${items[i].year}-${i}`}
          type="button"
          aria-label={`${items[i].year}: ${items[i].title}`}
          aria-pressed={i === active}
          onMouseEnter={() => select(i)}
          onFocus={() => select(i)}
          onClick={() => select(i)}
          onBlur={() => setPaused(false)}
          className="absolute h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ left: `${(p.x / W) * 100}%`, top: `${(p.y / H) * 100}%` }}
        />
      ))}

      <div className="absolute left-0 top-0 w-[min(320px,60%)]" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease }}
            className="rounded-[12px] border border-white/10 bg-night/70 p-5 backdrop-blur-md"
          >
            <p className="t-label tnum text-lohix-lime">{current.year}</p>
            <p className="mt-2 text-[17px] font-semibold leading-snug text-white">
              {current.title}
            </p>
            <p className="t-small mt-1.5 line-clamp-3 text-white/60">{current.body}</p>
          </motion.div>
        </AnimatePresence>
        <div className="mt-3 flex gap-1.5">
          {items.map((it, i) => (
            <span
              key={`dot-${it.year}-${i}`}
              className={
                i === active
                  ? "h-1 w-6 rounded-full bg-lohix-lime transition-all duration-300"
                  : "h-1 w-2 rounded-full bg-white/20 transition-all duration-300"
              }
            />
          ))}
        </div>
      </div>

      {(place || coordinates) && (
        <div className="absolute bottom-0 right-0 text-right">
          {place && (
            <p className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-white">
              <MapPin className="h-3.5 w-3.5 text-lohix-lime" />
              {place}
            </p>
          )}
          {coordinates && <p className="t-label tnum mt-1 text-white/45">{coordinates}</p>}
        </div>
      )}
    </div>
  );
}

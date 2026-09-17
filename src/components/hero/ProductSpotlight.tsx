import type { PointerEvent } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Chip = { k: string; v: string; href?: string };

const POSITIONS = ["left-0 top-[6%]", "right-0 top-[30%]", "bottom-[6%] left-[8%]"] as const;

// Product photo on the stage with floating key figures; the layers drift
// against each other with the pointer.
export function ProductSpotlight({
  image,
  alt,
  chips,
}: {
  image: string;
  alt: string;
  chips: Chip[];
}) {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 120, damping: 20 });
  const sy = useSpring(my, { stiffness: 120, damping: 20 });
  const imgX = useTransform(sx, (v) => v * 14);
  const imgY = useTransform(sy, (v) => v * 10);
  const chipX = useTransform(sx, (v) => v * -10);
  const chipY = useTransform(sy, (v) => v * -8);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <div
      className="relative h-full w-full"
      onPointerMove={onMove}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 h-[70%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-lohix-lime/[0.14] blur-[90px]"
      />
      <motion.img
        src={image}
        alt={alt}
        style={{ x: imgX, y: imgY }}
        className="fade-frame absolute inset-[4%] h-[92%] w-[92%] object-contain"
      />

      {chips.slice(0, POSITIONS.length).map((c, i) => {
        const body = (
          <>
            <span className="tnum block text-[22px] font-semibold leading-none tracking-[-0.02em] text-white">
              {c.k}
            </span>
            <span className="t-label mt-2 flex items-center gap-1.5 text-white/55">
              {c.v}
              {c.href && (
                <ArrowDown className="h-3 w-3 transition-transform duration-300 group-hover:translate-y-0.5" />
              )}
            </span>
          </>
        );
        const cls = cn(
          "group block rounded-[10px] border border-white/12 bg-night/65 px-4 py-3.5 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)] backdrop-blur-md transition-colors duration-300",
          c.href && "hover:border-lohix-lime/60",
        );
        return (
          <motion.div
            key={`${c.k}-${i}`}
            className={cn("absolute", POSITIONS[i])}
            style={{ x: chipX, y: chipY }}
          >
            <div className="animate-float" style={{ animationDelay: `${i * -2.2}s` }}>
              {c.href ? (
                <a href={c.href} className={cls}>
                  {body}
                </a>
              ) : (
                <div className={cls}>{body}</div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

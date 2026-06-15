import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, animate } from "framer-motion";

export type RulerItem = { id: number; title: string };

const ITEM_WIDTH = 180;

export function createInfiniteItems<T>(items: T[], copies = 5): T[] {
  return Array.from({ length: copies }, () => items).flat();
}

export function RulerLines({
  count = 24,
  activeColor = "#B7E26D",
  inactiveColor = "#6B737C",
  activeIndex = -1,
}: {
  count?: number;
  activeColor?: string;
  inactiveColor?: string;
  activeIndex?: number;
}) {
  return (
    <div className="flex items-end justify-between w-full h-10 px-2">
      {Array.from({ length: count }).map((_, i) => {
        const isMajor = i % 4 === 0;
        const distance = Math.abs(i - count / 2);
        const isActive = distance < 3 && activeIndex >= 0;
        return (
          <span
            key={i}
            style={{
              width: 1,
              height: isMajor ? 24 : 12,
              backgroundColor: isActive ? activeColor : inactiveColor,
              opacity: isActive ? 1 : 0.5,
            }}
          />
        );
      })}
    </div>
  );
}

export function RulerCarousel({
  items,
  onActiveChange,
}: {
  items: RulerItem[];
  onActiveChange?: (index: number) => void;
}) {
  const infinite = createInfiniteItems(items, 5);
  const baseOffset = items.length * 2; // start in middle copy
  const [activeIdx, setActiveIdx] = useState(0);
  const x = useMotionValue(-baseOffset * ITEM_WIDTH);
  const containerRef = useRef<HTMLDivElement>(null);

  const snapTo = (logicalIndex: number) => {
    const target = -(baseOffset + logicalIndex) * ITEM_WIDTH;
    animate(x, target, { type: "spring", stiffness: 200, damping: 30 });
    setActiveIdx(((logicalIndex % items.length) + items.length) % items.length);
    onActiveChange?.(((logicalIndex % items.length) + items.length) % items.length);
  };

  useEffect(() => {
    onActiveChange?.(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative w-full overflow-hidden py-12" ref={containerRef}>
      {/* center indicator */}
      <div className="pointer-events-none absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-px bg-[#B7E26D]/40 z-10" />

      <motion.div
        drag="x"
        dragConstraints={{ left: -infinite.length * ITEM_WIDTH, right: 0 }}
        style={{ x }}
        onDragEnd={() => {
          const current = x.get();
          const idx = Math.round(-current / ITEM_WIDTH) - baseOffset;
          snapTo(idx);
        }}
        className="flex cursor-grab active:cursor-grabbing"
      >
        {infinite.map((item, i) => {
          const logicalIdx = (i - baseOffset) % items.length;
          const normalized = ((logicalIdx % items.length) + items.length) % items.length;
          const isActive = normalized === activeIdx;
          return (
            <button
              key={i}
              onClick={() => snapTo(i - baseOffset)}
              style={{ width: ITEM_WIDTH }}
              className="flex-shrink-0 flex items-center justify-center font-sans font-bold text-2xl uppercase tracking-tight transition-colors py-6"
            >
              <span style={{ color: isActive ? "#FFFFFF" : "#6B737C" }}>{item.title}</span>
            </button>
          );
        })}
      </motion.div>

      {/* ruler lines below */}
      <div className="mt-4">
        <RulerLines activeIndex={activeIdx} />
      </div>

      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0B0F10] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0B0F10] to-transparent" />
    </div>
  );
}

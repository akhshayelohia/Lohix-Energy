import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getIcon } from "@/cms/icons";
import { trackSpotlight } from "@/lib/spotlight";

type Item = { icon: string; title: string; body: string };

const COLS = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
} as const;

export function FeatureGrid({
  items,
  columns = 3,
}: {
  items: Item[];
  columns?: keyof typeof COLS;
}) {
  const reduce = useReducedMotion();
  return (
    <div className={cn("mosaic grid-cols-1", COLS[columns])}>
      {items.map((f, i) => {
        const Icon = getIcon(f.icon);
        return (
          <motion.div
            key={`${f.title}-${i}`}
            initial={reduce ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            onPointerMove={trackSpotlight}
            className="spotlight group bg-paper-2 p-7 sm:p-8"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-[8px] border border-lohix-lime/40 bg-lohix-lime/15 text-lohix-lime-deep transition-colors duration-300 group-hover:border-transparent group-hover:bg-lohix-lime group-hover:text-ink">
              <Icon className="h-[18px] w-[18px]" />
            </span>
            <h3 className="t-h3 mt-8 text-ink">{f.title}</h3>
            <p className="t-small mt-2.5 text-muted-ink">{f.body}</p>
          </motion.div>
        );
      })}
    </div>
  );
}

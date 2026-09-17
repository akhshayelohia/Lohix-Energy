import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { TwoWheelerSku } from "@/cms/products2w";

type Dim = "voltage" | "capacity";

function unique(skus: TwoWheelerSku[], dim: Dim) {
  return Array.from(new Set(skus.map((s) => s[dim])));
}

export function VariantPicker({
  skus,
  current,
}: {
  skus: TwoWheelerSku[];
  current: TwoWheelerSku;
}) {
  const rows: { dim: Dim; label: string }[] = [
    { dim: "voltage", label: "Voltage" },
    { dim: "capacity", label: "Capacity" },
  ];

  return (
    <div className="space-y-2.5">
      {rows.map(({ dim, label }) => {
        const other: Dim = dim === "voltage" ? "capacity" : "voltage";
        const options = unique(skus, dim);
        if (options.length < 2) return null;
        return (
          <div key={dim} className="flex items-center gap-4">
            <span className="t-label w-[72px] shrink-0 text-white/40">{label}</span>
            <div className="inline-flex rounded-full border border-white/10 bg-white/[0.04] p-1 backdrop-blur">
              {options.map((opt) => {
                const target =
                  skus.find((s) => s[dim] === opt && s[other] === current[other]) ??
                  skus.find((s) => s[dim] === opt)!;
                const active = current[dim] === opt;
                return (
                  <Link
                    key={opt}
                    to="/products/$slug"
                    params={{ slug: target.slug }}
                    resetScroll={false}
                    aria-current={active ? "true" : undefined}
                    className={cn(
                      "tap tnum relative rounded-full px-4 py-1.5 text-[12.5px] font-medium transition-colors duration-300",
                      active ? "text-ink" : "text-white/60 hover:text-white",
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId={`variant-${dim}`}
                        transition={{ type: "spring", stiffness: 420, damping: 36 }}
                        className="absolute inset-0 rounded-full bg-white"
                      />
                    )}
                    <span className="relative">{opt}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

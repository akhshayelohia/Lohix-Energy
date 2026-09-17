import { cn } from "@/lib/utils";

export function StageBackdrop({
  glow = "top",
  base = "gradient",
  edge = true,
  className,
}: {
  glow?: "top" | "right" | "none";
  base?: "gradient" | "flat";
  edge?: boolean;
  className?: string;
}) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0", className)}>
      <div
        className={cn(
          "absolute inset-0",
          base === "gradient"
            ? "bg-[linear-gradient(180deg,#0b1012_0%,var(--night)_62%)]"
            : "bg-night",
        )}
      />
      <div className="stage-grid absolute inset-0" />
      {glow === "top" && (
        <div className="absolute -top-48 left-1/2 h-[560px] w-[900px] max-w-[140%] -translate-x-1/2 rounded-full bg-lohix-lime/[0.13] blur-[140px]" />
      )}
      {glow === "right" && (
        <div className="absolute -top-24 right-[-10%] h-[620px] w-[720px] max-w-[120%] rounded-full bg-lohix-lime/[0.14] blur-[150px]" />
      )}
      <div className="grain absolute inset-0 mix-blend-screen" />
      {edge && (
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      )}
    </div>
  );
}

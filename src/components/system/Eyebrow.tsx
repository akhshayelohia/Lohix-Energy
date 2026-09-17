import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type Tone = "light" | "dark";

type Props = {
  children: ReactNode;
  tone?: Tone;
  className?: string;
  /** Leading lime dot. On by default for light surfaces. */
  dot?: boolean;
};

export function Eyebrow({ children, tone = "light", className, dot = tone === "light" }: Props) {
  return (
    <div
      className={cn(
        "t-label inline-flex items-center gap-2",
        tone === "dark" ? "text-white/60" : "text-lohix-lime-deep",
        className,
      )}
    >
      {dot && <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-lohix-lime" />}
      {children}
    </div>
  );
}

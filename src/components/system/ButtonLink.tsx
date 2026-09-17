import type { ReactNode } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { safeHref } from "@/lib/safe-url";

const VARIANTS = {
  ink: "btn-ink",
  lime: "btn-lime",
  outline: "btn-outline",
  "ghost-dark": "btn-ghost-dark",
} as const;

const ICONS = {
  arrow: ArrowRight,
  external: ArrowUpRight,
  download: Download,
  down: ArrowDown,
} as const;

type Props = {
  href: string;
  children: ReactNode;
  variant?: keyof typeof VARIANTS;
  size?: "md" | "sm";
  icon?: keyof typeof ICONS | null;
  className?: string;
  newTab?: boolean;
};

export function ButtonLink({
  href,
  children,
  variant = "ink",
  size = "md",
  icon = "arrow",
  className,
  newTab,
}: Props) {
  const Icon = icon ? ICONS[icon] : null;
  const leading = icon === "download";
  return (
    <a
      href={safeHref(href)}
      target={newTab ? "_blank" : undefined}
      rel={newTab ? "noopener noreferrer" : undefined}
      className={cn("btn group", VARIANTS[variant], size === "sm" && "btn-sm", className)}
    >
      {Icon && leading && <Icon className="h-3.5 w-3.5" />}
      {children}
      {Icon && !leading && (
        <Icon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
      )}
    </a>
  );
}

import { cn } from "@/lib/utils";

export function ScrollCue({
  href,
  label = "Scroll",
  onMedia = false,
  className,
}: {
  href: string;
  label?: string;
  /** Sits over photography: carry its own small dark chip instead of relying on a dark stage. */
  onMedia?: boolean;
  className?: string;
}) {
  return (
    <a
      href={href}
      aria-label="Scroll to details"
      className={cn(
        "group absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 transition-colors hover:text-white short:hidden sm:bottom-8",
        onMedia ? "text-white/85" : "text-white/45",
        className,
      )}
    >
      <span
        className={cn(
          "t-label",
          onMedia && "rounded-full bg-night/55 px-3 py-1.5 backdrop-blur-md",
        )}
      >
        {label}
      </span>
      <span className={cn("relative h-10 w-px overflow-hidden bg-white/15", onMedia && "hidden")}>
        <span className="animate-scroll-cue absolute inset-x-0 top-0 h-1/2 bg-lohix-lime" />
      </span>
    </a>
  );
}

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ScrollCue } from "./ScrollCue";

export type ShowcaseHeroProps = {
  image?: string | null;
  /** Optional portrait photo for phones (4:5 or 9:16). */
  mobileImage?: string | null;
  video?: string | null;
  /**
   * cover   — product photography / video, full-bleed
   * contain — transparent cut-out on the dark stage
   */
  fit?: "cover" | "contain";
  alt: string;
  placeholder?: ReactNode;
  nextId: string;
};

const PHONE = "(max-width: 767px)";

// Desktop (md+): exactly one screen tall; photography and video fill it edge to
// edge — untouched, with no fades, blur, bands or zoom.
// Phones: normal flow — the photo runs full width at its own proportions below
// the nav, and the product intro follows straight after.
export function ShowcaseHero({
  image,
  mobileImage,
  video,
  fit = "cover",
  alt,
  placeholder,
  nextId,
}: ShowcaseHeroProps) {
  const bleed = Boolean(video) || (Boolean(image) && fit === "cover");

  return (
    <section
      aria-label={alt}
      className="relative isolate w-full overflow-hidden bg-night pt-[68px] md:h-[100svh] md:pt-0"
    >
      <div
        className={cn(
          "animate-fade relative",
          bleed
            ? "md:absolute md:inset-0"
            : "h-[78svh] md:absolute md:inset-x-0 md:bottom-[56px] md:top-[72px] md:h-auto md:short:bottom-2 md:short:top-[64px]",
          !bleed && image && "px-[6%]",
        )}
      >
        {video ? (
          <video
            key={video}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster={image ?? undefined}
            aria-hidden
            className="block h-auto w-full md:h-full md:object-cover"
          >
            <source src={video} type="video/mp4" />
          </video>
        ) : image ? (
          <picture className={cn("block w-full md:h-full", !bleed && "h-full")}>
            {mobileImage && <source media={PHONE} srcSet={mobileImage} />}
            <img
              src={image}
              alt={alt}
              fetchPriority="high"
              decoding="async"
              className={cn(
                "block w-full md:h-full",
                bleed ? "h-auto md:object-cover md:object-center" : "h-full object-contain",
              )}
            />
          </picture>
        ) : (
          placeholder
        )}
      </div>

      <ScrollCue
        href={`#${nextId}`}
        onMedia={bleed}
        className="bottom-3 max-md:hidden sm:bottom-4"
      />
    </section>
  );
}

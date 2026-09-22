import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useContent } from "@/cms/useContent";
import { safeHref, safeMediaSrc } from "@/lib/safe-url";
import { ButtonLink } from "@/components/system/ButtonLink";
import { cn } from "@/lib/utils";

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

// Bundled, web-compressed hero footage (used when the CMS fields are blank).
const DEFAULT_VIDEO = {
  desktop: { src: "/media/hero-1080.mp4", poster: "/media/hero-poster.webp" },
  phone: { src: "/media/hero-mobile.mp4", poster: "/media/hero-poster-mobile.webp" },
};

type Clip = { src: string; poster?: string };

export function Hero() {
  const c = useContent("hero");
  const reduce = useReducedMotion();
  const cmsDesktop = c.videoUrl?.trim() ? safeMediaSrc(c.videoUrl) : "";
  const cmsPhone = c.videoUrlMobile?.trim() ? safeMediaSrc(c.videoUrlMobile) : "";
  const videoRef = useRef<HTMLVideoElement>(null);
  // Decided after mount: phones get the lighter file, and nobody on data-saver,
  // a slow connection or reduced motion downloads video at all.
  const [clip, setClip] = useState<Clip | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const conn = (
      navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }
    ).connection;
    if (reduce || conn?.saveData || /(^|-)2g|3g/.test(conn?.effectiveType ?? "")) {
      setClip(null);
      return;
    }
    const phone = window.matchMedia("(max-width: 767px)").matches;
    let next: Clip;
    if (phone && cmsPhone) next = { src: cmsPhone };
    else if (cmsDesktop) next = { src: cmsDesktop };
    else next = phone ? DEFAULT_VIDEO.phone : DEFAULT_VIDEO.desktop;
    setReady(false);
    setClip(next);
  }, [reduce, cmsDesktop, cmsPhone]);

  // Stop decoding once the hero is scrolled away.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !clip) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) void v.play().catch(() => {});
      else v.pause();
    });
    io.observe(v);
    return () => io.disconnect();
  }, [clip]);

  return (
    <section className="relative isolate h-[100svh] min-h-[640px] w-full overflow-hidden bg-night text-white">
      {/* Static backdrop sits behind the video so there's never a blank flash before it loads */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(60%_45%_at_50%_35%,rgba(183,226,109,0.16),transparent_70%),linear-gradient(180deg,#0a0f12_0%,var(--night)_100%)]"
      />
      {clip && (
        <video
          ref={videoRef}
          key={clip.src}
          poster={clip.poster}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
          onCanPlay={() => setReady(true)}
          className={cn(
            "pointer-events-none absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700",
            ready ? "opacity-70" : "opacity-0",
          )}
        >
          <source src={clip.src} type="video/mp4" />
        </video>
      )}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-night/80 via-night/40 to-night"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(70%_55%_at_50%_45%,transparent_0%,rgba(5,7,10,0.9)_100%)]"
      />
      <div aria-hidden className="stage-grid absolute inset-0 opacity-60" />
      <div aria-hidden className="grain pointer-events-none absolute inset-0 mix-blend-screen" />

      <div className="container-x relative z-10 flex h-full flex-col items-center justify-center pb-16 pt-24 text-center">
        <a
          href={safeHref(c.ctaPrimary.href)}
          className="animate-rise group inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] py-1 pl-1 pr-3.5 text-[12px] text-white backdrop-blur transition-colors hover:bg-white/[0.1]"
          style={delay(0)}
        >
          <span className="rounded-full bg-lohix-lime px-2 py-0.5 text-[10px] font-semibold tracking-wider text-ink">
            {c.chipBadge}
          </span>
          {c.chipText}
          <ArrowRight className="h-3 w-3 text-white transition-transform group-hover:translate-x-0.5" />
        </a>

        <h1
          className="animate-rise t-display mt-7 max-w-[16ch] text-balance text-[clamp(42px,6.8vw,92px)]"
          style={delay(80)}
        >
          {c.headlineLine1}
          <br />
          <span className="text-lohix-lime">{c.headlineHighlight}</span> {c.headlineLine2}
        </h1>

        <p className="animate-rise t-lead mt-6 max-w-[52ch] text-white" style={delay(180)}>
          {c.subline}
        </p>

        <div
          className="animate-rise mt-9 flex flex-col items-center gap-3 sm:flex-row"
          style={delay(280)}
        >
          <ButtonLink href={c.ctaPrimary.href} variant="lime">
            {c.ctaPrimary.label}
          </ButtonLink>
          <ButtonLink href={c.ctaSecondary.href} variant="ghost-dark" icon="down">
            {c.ctaSecondary.label}
          </ButtonLink>
        </div>

        <ul
          className="animate-rise mt-10 hidden flex-wrap items-center justify-center gap-x-6 gap-y-2 sm:flex"
          style={delay(400)}
        >
          {c.trustItems.map((t, i) => (
            <li key={`${t}-${i}`} className="t-label inline-flex items-center gap-2 text-white">
              <span
                className={
                  i === 0
                    ? "pulse-dot h-1.5 w-1.5 rounded-full bg-lohix-lime"
                    : "h-1 w-1 rounded-full bg-white/25"
                }
              />
              {t}
            </li>
          ))}
        </ul>
      </div>

      <div
        aria-hidden
        className="absolute bottom-6 left-1/2 hidden h-10 w-px -translate-x-1/2 overflow-hidden bg-white/10 md:block"
      >
        {!reduce && (
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-lohix-lime"
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </div>
    </section>
  );
}

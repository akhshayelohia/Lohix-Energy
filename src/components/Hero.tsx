import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import heroVideo from "../../public/hero-battery.mp4.asset.json";
import { useContent } from "@/cms/useContent";
import { safeHref, safeMediaSrc } from "@/lib/safe-url";

export function Hero() {
  const c = useContent("hero");
  const videoSrc = safeMediaSrc(c.videoUrl?.trim() ? c.videoUrl : heroVideo.url);
  const primaryHref = safeHref(c.ctaPrimary.href);
  const secondaryHref = safeHref(c.ctaSecondary.href);

  return (
    <section className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-[#05070A] text-white">
      {/* Static backdrop sits behind the video so there's never a blank flash before it loads */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(60%_45%_at_50%_35%,rgba(183,226,109,0.18),transparent_70%),linear-gradient(180deg,#0a0f12_0%,#05070A_100%)]"
      />
      <video
        key={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center opacity-70"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-[#05070A]/80 via-[#05070A]/45 to-[#05070A]" />
      <div className="absolute inset-0 bg-[radial-gradient(70%_55%_at_50%_45%,transparent_0%,rgba(5,7,10,0.9)_100%)]" />
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-screen"
        style={{
          backgroundImage:
            "linear-gradient(to right, #B7E26D 1px, transparent 1px), linear-gradient(to bottom, #B7E26D 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />
      <div className="absolute inset-0 grain pointer-events-none" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[680px] h-[520px] rounded-full bg-lohix-lime/10 blur-[160px]" />

      <div className="relative z-10 h-full w-full px-5 sm:px-6 pt-24 pb-10 md:pt-28 md:pb-14 flex flex-col items-center justify-center text-center">
        <motion.a
          href={primaryHref}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="pill group inline-flex items-center gap-2 pl-1 pr-3 py-1 text-[11px] text-white/80 border border-white/15 bg-white/[0.04] backdrop-blur hover:bg-white/[0.08] transition-colors"
        >
          <span className="pill bg-lohix-lime text-ink px-2 py-0.5 text-[10px] font-semibold tracking-wider">
            {c.chipBadge}
          </span>
          <span className="tracking-wide">{c.chipText}</span>
          <ArrowRight className="w-3 h-3 text-white/60 group-hover:translate-x-0.5 transition-transform" />
        </motion.a>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-5 md:mt-6 font-sans font-bold uppercase tracking-[-0.03em] leading-[0.95] text-[clamp(34px,7.2vw,74px)] max-w-[14ch]"
        >
          {c.headlineLine1}
          <br />
          <span className="text-lohix-lime">{c.headlineHighlight}</span> {c.headlineLine2}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-4 md:mt-5 max-w-[52ch] text-[13px] md:text-[15px] text-white/55 leading-relaxed font-sans normal-case tracking-normal"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {c.subline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 md:mt-7 flex flex-col sm:flex-row items-center gap-3"
        >
          <a
            href={primaryHref}
            className="pill inline-flex items-center gap-2 bg-lohix-lime text-ink text-[13px] font-semibold px-5 py-3 hover:bg-white transition-colors shadow-[0_10px_40px_-12px_rgba(183,226,109,0.6)]"
          >
            {c.ctaPrimary.label}
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
          <a
            href={secondaryHref}
            className="pill inline-flex items-center gap-2 border border-white/15 bg-white/[0.04] text-white/90 text-[13px] font-medium px-5 py-3 backdrop-blur hover:bg-white/[0.1] transition-colors"
          >
            {c.ctaSecondary.label}
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-7 md:mt-8 flex items-center gap-5 text-[11px] text-white/40 tracking-wide flex-wrap justify-center"
        >
          {c.trustItems.map((t, i) => (
            <span key={t} className="flex items-center gap-1.5">
              {i === 0 && <span className="w-1.5 h-1.5 rounded-full bg-lohix-lime pulse-dot" />}
              {t}
              {i < c.trustItems.length - 1 && <span className="hidden sm:inline ml-5">·</span>}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

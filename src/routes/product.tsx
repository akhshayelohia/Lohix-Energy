import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, CheckCircle2, ChevronRight } from "lucide-react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import heroImg from "@/assets/lohix-48-hero.png";
import { useContent } from "@/cms/useContent";
import { safeHref, safeMediaSrc } from "@/lib/safe-url";
import { getIcon } from "@/cms/icons";

export const Route = createFileRoute("/product")({
  component: ProductPage,
  head: () => ({
    meta: [
      { title: "Lohix Energy — 51.2V 100Ah Smart LFP Battery" },
      {
        name: "description",
        content:
          "Lohix Energy — A 51.2V 100Ah Lithium Iron Phosphate battery engineered for e-rickshaws and India's electric mobility ecosystem. 3500+ cycles, smart BMS, IP67.",
      },
      { property: "og:title", content: "Lohix Energy — Smart LFP Battery" },
      {
        property: "og:description",
        content:
          "Built Smart. Built Safe. Built LOHIX. 51.2V · 100Ah · 3500+ cycles · IP67 · Made in India.",
      },
      { property: "og:url", content: "https://lohix.lovable.app/product" },
      { property: "og:type", content: "product" },
    ],
    links: [{ rel: "canonical", href: "https://lohix.lovable.app/product" }],
  }),
});

function ProductPage() {
  const c = useContent("product");

  return (
    <main className="bg-paper text-ink min-h-screen antialiased">
      <Nav />

      {/* HERO */}
      <section className="relative w-full overflow-hidden bg-paper">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 pt-24 sm:pt-28 md:pt-32">
          <nav className="flex items-center gap-1.5 text-[11px] text-muted-ink">
            <Link to="/" className="hover:text-ink transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 opacity-50" />
            <span>Products</span>
            <ChevronRight className="w-3 h-3 opacity-50" />
            <span className="text-ink">{c.breadcrumb}</span>
          </nav>
        </div>

        <div className="max-w-7xl mx-auto px-5 sm:px-6 pt-8 sm:pt-10 md:pt-14">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-muted-ink">
            <span className="w-1.5 h-1.5 rounded-full bg-lohix-lime" />
            {c.eyebrow}
          </div>
          <div className="mt-4 flex flex-col md:flex-row md:items-end md:justify-between gap-5 md:gap-6 md:flex-wrap">
            <h1 className="font-sans font-bold uppercase tracking-[-0.035em] leading-[0.92] text-[clamp(48px,13vw,140px)]">
              {c.titleMain} <span className="text-lohix-lime">{c.titleAccent}</span>
            </h1>
            <p className="text-[13px] text-muted-ink md:max-w-xs leading-relaxed">{c.tagline}</p>
          </div>
        </div>

        <div className="relative mt-8 sm:mt-10 md:mt-16">
          <div className="relative max-w-7xl mx-auto px-5 sm:px-6">
            <div className="relative aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/8] rounded-[20px] sm:rounded-[28px] overflow-hidden bg-[#05070A]">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[80%] h-[60%] rounded-full bg-lohix-lime/25 blur-[140px]" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[50%] h-[30%] rounded-full bg-lohix-lime/10 blur-[100px]" />
              </div>
              <div
                className="absolute inset-0 opacity-[0.07]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
                  backgroundSize: "56px 56px",
                }}
              />
              <motion.img
                src={c.heroImage?.trim() ? safeMediaSrc(c.heroImage) : heroImg}
                alt={`${c.titleMain} ${c.titleAccent} — ${c.eyebrow}`}
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 w-full h-full object-contain p-2 sm:p-4 md:p-6 drop-shadow-[0_40px_80px_rgba(0,0,0,0.5)]"
              />
              <div className="absolute top-3 left-3 sm:top-5 sm:left-5 text-[9px] sm:text-[10px] tracking-[0.22em] uppercase text-white/50">
                SYS / LOHIX-48
              </div>
              <div className="absolute top-3 right-3 sm:top-5 sm:right-5 text-[9px] sm:text-[10px] tracking-[0.22em] uppercase text-white/50">
                v1.0 · 2025
              </div>
              <div className="absolute bottom-3 left-3 sm:bottom-5 sm:left-5 text-[9px] sm:text-[10px] tracking-[0.22em] uppercase text-white/50">
                LiFePO4 · IP67
              </div>
              <div className="absolute bottom-3 right-3 sm:bottom-5 sm:right-5 flex items-center gap-1.5 text-[9px] sm:text-[10px] tracking-[0.22em] uppercase text-white/50">
                <span className="w-1.5 h-1.5 rounded-full bg-lohix-lime pulse-dot" />
                In production
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-5 sm:px-6 mt-8 sm:mt-10 md:mt-14">
          <div className="grid grid-cols-2 md:grid-cols-4 border-y border-line">
            {c.quickStats.map((s, i) => {
              const isRightCol = i % 2 === 1;
              const isBottomRow = i >= 2;
              return (
                <div
                  key={`${s.k}-${i}`}
                  className={[
                    "py-4 sm:py-5 md:py-6 px-4 sm:px-5",
                    !isRightCol ? "border-r border-line" : "",
                    !isBottomRow ? "border-b border-line md:border-b-0" : "",
                    i !== 3 ? "md:border-r md:border-line" : "",
                  ].join(" ")}
                >
                  <div className="font-sans text-[22px] sm:text-[24px] md:text-[28px] font-bold tracking-[-0.02em] text-ink">
                    {s.k}
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-muted-ink mt-1">
                    {s.v}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-5 sm:px-6 mt-8 sm:mt-10 md:mt-12 pb-16 sm:pb-20 md:pb-28">
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={safeHref(c.ctaPrimary.href)}
              className="pill inline-flex items-center justify-center gap-2 bg-ink text-paper-2 text-[13px] font-medium px-5 py-3 hover:bg-lohix-lime hover:text-ink transition-colors"
            >
              {c.ctaPrimary.label}
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
            <a
              href={safeHref(c.ctaSecondary.href)}
              className="pill inline-flex items-center justify-center gap-2 border border-line bg-paper-2 text-ink text-[13px] font-medium px-5 py-3 hover:border-ink transition-colors"
            >
              {c.ctaSecondary.label}
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* OVERVIEW */}
      <section className="w-full bg-paper-2 border-y border-line px-5 sm:px-6 py-16 sm:py-20 md:py-28">
        <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-10 md:gap-16">
          <div className="md:col-span-4">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-muted-ink">
              <span className="w-6 h-px bg-ink/30" />
              01 — Overview
            </div>
            <h2 className="mt-5 text-[24px] sm:text-[28px] md:text-[34px] font-semibold tracking-[-0.02em] leading-[1.15] text-ink">
              {c.overviewHeading}
            </h2>
          </div>
          <div className="md:col-span-8 space-y-5 text-[14px] md:text-[15px] leading-[1.75] text-muted-ink">
            {c.overviewParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <div className="pt-3 flex flex-wrap gap-2">
              {c.useCases.map((u) => (
                <span
                  key={u}
                  className="pill border border-line bg-paper px-3 py-1.5 text-[11px] text-ink/80 inline-flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3 h-3 text-lohix-lime" />
                  {u}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="w-full bg-paper px-5 sm:px-6 py-16 sm:py-20 md:py-28">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 md:gap-6 md:flex-wrap mb-10 sm:mb-12">
            <div>
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-muted-ink">
                <span className="w-6 h-px bg-ink/30" />
                02 — Engineering
              </div>
              <h2 className="mt-5 text-[24px] sm:text-[28px] md:text-[34px] font-semibold tracking-[-0.02em] leading-[1.15] text-ink max-w-xl">
                {c.featuresHeading}
              </h2>
            </div>
            <p className="text-[13px] text-muted-ink md:max-w-xs leading-relaxed">
              {c.featuresBody}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-line rounded-[18px] sm:rounded-[20px] overflow-hidden border border-line">
            {c.features.map((f, i) => {
              const Icon = getIcon(f.icon);
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                  className="group bg-paper-2 p-6 sm:p-7 hover:bg-ink hover:text-paper-2 transition-colors duration-300"
                >
                  <Icon className="w-4 h-4 text-ink group-hover:text-lohix-lime transition-colors" />
                  <h3 className="mt-6 text-[15px] font-semibold tracking-[-0.01em] text-ink group-hover:text-paper-2 transition-colors">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-[1.65] text-muted-ink group-hover:text-paper-2/60 transition-colors">
                    {f.body}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SPECS */}
      <section
        id="specs"
        className="w-full bg-paper-2 border-y border-line px-5 sm:px-6 py-16 sm:py-20 md:py-28"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 md:gap-6 md:flex-wrap mb-10 sm:mb-12">
            <div>
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-muted-ink">
                <span className="w-6 h-px bg-ink/30" />
                03 — Specifications
              </div>
              <h2 className="mt-5 text-[24px] sm:text-[28px] md:text-[34px] font-semibold tracking-[-0.02em] leading-[1.15] text-ink">
                {c.specsHeading}
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {c.specBadges.map((b) => {
                const Icon = getIcon(b.icon);
                return (
                  <span
                    key={b.label}
                    className="pill border border-line bg-paper px-3 py-1.5 text-[11px] text-ink inline-flex items-center gap-1.5"
                  >
                    <Icon className="w-3 h-3 text-lohix-lime" />
                    {b.label}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12">
            {c.specGroups.map((g) => (
              <div key={g.title}>
                <div className="text-[10px] uppercase tracking-[0.22em] text-muted-ink pb-4 border-b border-line">
                  {g.title}
                </div>
                <dl className="mt-2">
                  {g.rows.map((r) => (
                    <div
                      key={r.label}
                      className="flex items-center justify-between py-3.5 border-b border-line/70"
                    >
                      <dt className="text-[12px] text-muted-ink">{r.label}</dt>
                      <dd className="text-[13px] font-medium text-ink tracking-[-0.005em]">
                        {r.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full bg-paper px-5 sm:px-6 py-16 sm:py-20 md:py-28">
        <div className="max-w-6xl mx-auto rounded-[22px] sm:rounded-[28px] bg-[#0B0F10] text-white p-7 sm:p-10 md:p-16 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full bg-lohix-lime/15 blur-[140px]" />
          <div className="relative grid md:grid-cols-12 gap-6 md:gap-8 md:items-end">
            <div className="md:col-span-8">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-white/50">
                <span className="w-6 h-px bg-white/30" />
                {c.ctaEyebrow}
              </div>
              <h2 className="mt-5 text-[26px] sm:text-[32px] md:text-[44px] font-semibold tracking-[-0.025em] leading-[1.1] max-w-2xl">
                {c.ctaHeading} <span className="text-lohix-lime">{c.ctaHighlight}</span>
              </h2>
              <p className="mt-5 max-w-lg text-[14px] text-white/60 leading-relaxed">{c.ctaBody}</p>
            </div>
            <div className="md:col-span-4 flex flex-col gap-3 md:items-end">
              <a
                href={safeHref(c.ctaPrimary.href)}
                className="pill inline-flex items-center justify-center gap-2 bg-lohix-lime text-ink text-[13px] font-semibold px-5 py-3 hover:bg-white transition-colors w-full md:w-auto"
              >
                {c.ctaPrimary.label}
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <a
                href={safeHref(c.ctaSecondary.href)}
                className="pill inline-flex items-center justify-center gap-2 border border-white/15 bg-white/[0.04] text-white/90 text-[13px] font-medium px-5 py-3 hover:bg-white/10 transition-colors w-full md:w-auto"
              >
                {c.ctaSecondary.label}
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

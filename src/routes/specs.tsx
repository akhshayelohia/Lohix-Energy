import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowUpRight, ChevronRight, Download, Sparkles } from "lucide-react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { useContent } from "@/cms/useContent";
import { safeHref } from "@/lib/safe-url";
import { fetchSection } from "@/cms/fetchSection";
import { getIcon } from "@/cms/icons";

export const Route = createFileRoute("/specs")({
  loader: () => fetchSection("specs"),
  component: SpecsPage,
  head: ({ loaderData }) => {
    const seo = loaderData?.seo;
    return {
      meta: [
        { title: seo?.title || "Specs — Lohix Energy Smart LFP Battery" },
        {
          name: "description",
          content:
            seo?.description ||
            "Every electrical, chemistry, and safety parameter of the Lohix Energy — explore the full datasheet interactively.",
        },
        { property: "og:title", content: seo?.title || "Lohix Energy — Full Specifications" },
        {
          property: "og:description",
          content:
            seo?.description ||
            "51.2V · 100Ah · 3500+ cycles · Grade A+ LFP. The complete spec sheet.",
        },
        { property: "og:type", content: "product" },
        { property: "og:url", content: seo?.canonical || "https://lohix.lovable.app/specs" },
        ...(seo?.ogImage ? [{ property: "og:image", content: seo.ogImage }] : []),
      ],
      links: [{ rel: "canonical", href: seo?.canonical || "https://lohix.lovable.app/specs" }],
    };
  },
});

const CATEGORIES = ["All", "Power", "Lifecycle", "Safety", "Origin"] as const;

function SpecsPage() {
  const f = useContent("features");
  const p = useContent("product");
  const c = useContent("specs");
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("All");
  const [active, setActive] = useState<string>(f.items[0]?.id ?? "");

  const filtered = useMemo(
    () => (cat === "All" ? f.items : f.items.filter((i) => i.category === cat)),
    [cat, f.items],
  );
  const activeItem = f.items.find((i) => i.id === active) ?? f.items[0];

  return (
    <main className="bg-paper text-ink min-h-screen antialiased">
      <Nav />

      {/* HERO */}
      <section className="relative w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 pt-24 sm:pt-28 md:pt-32">
          <nav className="flex items-center gap-1.5 text-[11px] text-muted-ink">
            <Link to="/" className="hover:text-ink transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 opacity-50" />
            <span className="text-ink">{c.breadcrumb}</span>
          </nav>
        </div>

        <div className="max-w-7xl mx-auto px-5 sm:px-6 pt-8 sm:pt-10 md:pt-14 pb-12 md:pb-16">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-muted-ink">
            <span className="w-1.5 h-1.5 rounded-full bg-lohix-lime" />
            {c.heroEyebrow}
          </div>
          <div className="mt-4 grid md:grid-cols-12 gap-6 md:gap-10 md:items-end">
            <h1 className="md:col-span-8 font-sans font-bold uppercase tracking-[-0.035em] leading-[0.92] text-[clamp(40px,9.5vw,112px)]">
              {c.heroTitlePrefix} <span className="text-lohix-lime">{c.heroTitleHighlight}</span>{" "}
              {c.heroTitleSuffix}
            </h1>
            <p className="md:col-span-4 text-[13px] text-muted-ink leading-relaxed">{c.heroBody}</p>
          </div>
        </div>
      </section>

      {/* INTERACTIVE SPEC EXPLORER */}
      <section className="w-full bg-paper-2 border-y border-line">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 py-12 sm:py-16 md:py-20">
          {/* Category filter */}
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((cc) => (
              <button
                key={cc}
                onClick={() => setCat(cc)}
                className={[
                  "pill border text-[11px] px-3.5 py-1.5 transition-all",
                  cat === cc
                    ? "bg-ink text-paper-2 border-ink"
                    : "bg-paper border-line text-muted-ink hover:text-ink hover:border-ink/30",
                ].join(" ")}
              >
                {cc}
              </button>
            ))}
            <div className="ml-auto hidden md:flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-muted-ink">
              <Sparkles className="w-3 h-3 text-lohix-lime" />
              {c.explorerHint}
            </div>
          </div>

          <div className="mt-8 grid lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Grid */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-line rounded-[18px] overflow-hidden border border-line">
                <AnimatePresence mode="popLayout">
                  {filtered.map((item, i) => {
                    const Icon = getIcon(item.icon);
                    const isActive = active === item.id;
                    return (
                      <motion.button
                        key={item.id}
                        layout
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.25, delay: i * 0.03 }}
                        onMouseEnter={() => setActive(item.id)}
                        onFocus={() => setActive(item.id)}
                        onClick={() => setActive(item.id)}
                        className={[
                          "relative text-left p-5 sm:p-6 transition-colors duration-300 group",
                          isActive ? "bg-ink text-paper-2" : "bg-paper-2 hover:bg-paper",
                        ].join(" ")}
                      >
                        <div className="flex items-center justify-between">
                          <Icon
                            className={[
                              "w-4 h-4 transition-colors",
                              isActive ? "text-lohix-lime" : "text-ink",
                            ].join(" ")}
                          />
                          <span
                            className={[
                              "text-[9px] uppercase tracking-[0.22em]",
                              isActive ? "text-paper-2/50" : "text-muted-ink",
                            ].join(" ")}
                          >
                            {item.category}
                          </span>
                        </div>
                        <div className="mt-8 flex items-baseline gap-1">
                          <span className="font-sans text-[28px] sm:text-[34px] font-bold tracking-[-0.02em] leading-none">
                            {item.value}
                          </span>
                          {item.unit && (
                            <span
                              className={[
                                "text-[11px] font-medium",
                                isActive ? "text-paper-2/60" : "text-muted-ink",
                              ].join(" ")}
                            >
                              {item.unit}
                            </span>
                          )}
                        </div>
                        <div
                          className={[
                            "mt-2 text-[10px] uppercase tracking-[0.2em]",
                            isActive ? "text-paper-2/60" : "text-muted-ink",
                          ].join(" ")}
                        >
                          {item.label}
                        </div>
                      </motion.button>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>

            {/* Detail panel */}
            <div className="lg:col-span-5">
              <div className="sticky top-24 rounded-[20px] border border-line bg-paper p-6 sm:p-8 min-h-[320px]">
                <AnimatePresence mode="wait">
                  {activeItem && (
                    <motion.div
                      key={activeItem.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-muted-ink">
                        <span className="w-6 h-px bg-ink/30" />
                        {activeItem.category}
                      </div>
                      <div className="mt-4 flex items-baseline gap-1.5">
                        <span className="font-sans text-[56px] sm:text-[72px] font-bold tracking-[-0.03em] leading-none">
                          {activeItem.value}
                        </span>
                        {activeItem.unit && (
                          <span className="text-[14px] text-muted-ink">{activeItem.unit}</span>
                        )}
                      </div>
                      <h3 className="mt-6 text-[18px] font-semibold tracking-[-0.01em]">
                        {activeItem.title}
                      </h3>
                      <p className="mt-2 text-[13px] text-muted-ink leading-[1.7]">
                        {activeItem.body}
                      </p>
                      <div className="mt-6 pt-5 border-t border-line flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-[0.22em] text-muted-ink">
                          Parameter
                        </span>
                        <span className="text-[12px] font-medium">{activeItem.label}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FULL DATASHEET (grouped) */}
      <section className="w-full bg-paper px-5 sm:px-6 py-16 sm:py-20 md:py-28">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10 sm:mb-12">
            <div>
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-muted-ink">
                <span className="w-6 h-px bg-ink/30" />
                {c.datasheetEyebrow}
              </div>
              <h2 className="mt-5 text-[24px] sm:text-[28px] md:text-[34px] font-semibold tracking-[-0.02em] leading-[1.15]">
                {c.datasheetHeading}
              </h2>
            </div>
            <a
              href={safeHref(c.datasheetDownloadHref)}
              className="pill inline-flex items-center gap-2 border border-line bg-paper-2 text-ink text-[12px] font-medium px-4 py-2 hover:border-ink transition-colors self-start"
            >
              <Download className="w-3.5 h-3.5" />
              {c.datasheetDownloadLabel}
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12">
            {p.specGroups.map((grp) => (
              <div key={grp.title}>
                <div className="text-[10px] uppercase tracking-[0.22em] text-muted-ink pb-4 border-b border-line">
                  {grp.title}
                </div>
                <dl className="mt-2">
                  {grp.rows.map((r) => (
                    <div
                      key={r.label}
                      className="flex items-center justify-between py-3.5 border-b border-line/70"
                    >
                      <dt className="text-[12px] text-muted-ink">{r.label}</dt>
                      <dd className="text-[13px] font-medium tracking-[-0.005em]">{r.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="w-full bg-paper-2 border-y border-line px-5 sm:px-6 py-16 sm:py-20 md:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-muted-ink">
            <span className="w-6 h-px bg-ink/30" />
            {c.comparisonEyebrow}
          </div>
          <h2 className="mt-5 text-[24px] sm:text-[28px] md:text-[34px] font-semibold tracking-[-0.02em] leading-[1.15] max-w-2xl">
            {c.comparisonHeading}
          </h2>

          <div className="mt-10 rounded-[18px] border border-line overflow-hidden bg-paper">
            <div className="grid grid-cols-3 text-[10px] uppercase tracking-[0.22em] text-muted-ink bg-paper-2 border-b border-line">
              <div className="p-4">Parameter</div>
              <div className="p-4 border-l border-line">{c.comparisonColA}</div>
              <div className="p-4 border-l border-line text-ink">{c.comparisonColB}</div>
            </div>
            {c.comparisonRows.map((row, i) => (
              <div
                key={`${row.k}-${i}`}
                className={[
                  "grid grid-cols-3 text-[13px]",
                  i % 2 === 1 ? "bg-paper-2/60" : "",
                ].join(" ")}
              >
                <div className="p-4 text-muted-ink">{row.k}</div>
                <div className="p-4 border-l border-line">{row.a}</div>
                <div className="p-4 border-l border-line font-medium text-ink">
                  <span className="inline-flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-lohix-lime" />
                    {row.b}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full bg-paper px-5 sm:px-6 py-16 sm:py-20 md:py-24">
        <div className="max-w-5xl mx-auto rounded-[22px] sm:rounded-[28px] bg-[#0B0F10] text-white p-7 sm:p-10 md:p-14 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full bg-lohix-lime/15 blur-[140px]" />
          <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-white/50">
                <span className="w-6 h-px bg-white/30" /> {c.ctaEyebrow}
              </div>
              <h2 className="mt-5 text-[26px] sm:text-[32px] md:text-[40px] font-semibold tracking-[-0.025em] leading-[1.1] max-w-xl">
                {c.ctaHeading}
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={safeHref(c.ctaPrimary.href)}
                className="pill inline-flex items-center justify-center gap-2 bg-lohix-lime text-ink text-[13px] font-semibold px-5 py-3 hover:bg-white transition-colors"
              >
                {c.ctaPrimary.label}
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <a
                href={safeHref(c.ctaSecondary.href)}
                className="pill inline-flex items-center justify-center gap-2 border border-white/15 bg-white/[0.04] text-white/90 text-[13px] font-medium px-5 py-3 hover:bg-white/10 transition-colors"
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

import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown, ChevronRight, MapPin, Phone, Sparkles } from "lucide-react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { DealerCTA } from "@/components/DealerCTA";
import { useContent } from "@/cms/useContent";
import { safeHref } from "@/lib/safe-url";
import { fetchSection } from "@/cms/fetchSection";
import { getIcon } from "@/cms/icons";

export const Route = createFileRoute("/dealer")({
  loader: () => fetchSection("dealer"),
  component: DealerPage,
  head: ({ loaderData }) => {
    const seo = loaderData?.seo;
    return {
      meta: [
        { title: seo?.title || "Become a Dealer — LOHIX Energy" },
        {
          name: "description",
          content:
            seo?.description ||
            "Partner with LOHIX to distribute smart LFP batteries across Eastern India.",
        },
        { property: "og:title", content: seo?.title || "Become a LOHIX Dealer" },
        {
          property: "og:description",
          content:
            seo?.description ||
            "Join the LOHIX distributor network. Training, margin, on-ground service — built in.",
        },
        { property: "og:type", content: "website" },
        { property: "og:url", content: seo?.canonical || "https://lohix.lovable.app/dealer" },
        ...(seo?.ogImage ? [{ property: "og:image", content: seo.ogImage }] : []),
      ],
      links: [{ rel: "canonical", href: seo?.canonical || "https://lohix.lovable.app/dealer" }],
    };
  },
});

function DealerPage() {
  const g = useContent("global");
  const c = useContent("dealer");
  const [open, setOpen] = useState<number | null>(0);

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
              {c.heroTitlePrefix} <span className="text-lohix-lime">{c.heroTitleHighlight}</span>.
            </h1>
            <p className="md:col-span-4 text-[13px] text-muted-ink leading-relaxed">{c.heroBody}</p>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a
              href={safeHref(c.ctaPrimary.href)}
              className="pill inline-flex items-center justify-center gap-2 bg-ink text-paper-2 text-[13px] font-medium px-5 py-3 hover:bg-lohix-lime hover:text-ink transition-colors"
            >
              {c.ctaPrimary.label}
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
            {c.showPhoneCta && (
              <a
                href={`tel:${(g.contactPhone || "").replace(/\s+/g, "")}`}
                className="pill inline-flex items-center justify-center gap-2 border border-line bg-paper-2 text-ink text-[13px] font-medium px-5 py-3 hover:border-ink transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                {g.contactPhone}
              </a>
            )}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="w-full bg-paper-2 border-y border-line px-5 sm:px-6 py-16 sm:py-20 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10">
            <div>
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-muted-ink">
                <span className="w-6 h-px bg-ink/30" /> {c.benefitsEyebrow}
              </div>
              <h2 className="mt-5 text-[24px] sm:text-[28px] md:text-[34px] font-semibold tracking-[-0.02em] leading-[1.15] max-w-xl">
                {c.benefitsHeading}
              </h2>
            </div>
            <p className="text-[13px] text-muted-ink md:max-w-xs leading-relaxed">
              {c.benefitsSubtext}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-line rounded-[18px] overflow-hidden border border-line">
            {c.benefits.map((b, i) => {
              const Icon = getIcon(b.icon);
              return (
                <motion.div
                  key={`${b.title}-${i}`}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="group bg-paper-2 p-6 sm:p-7 hover:bg-ink hover:text-paper-2 transition-colors duration-300"
                >
                  <Icon className="w-4 h-4 text-ink group-hover:text-lohix-lime transition-colors" />
                  <h3 className="mt-8 text-[15px] font-semibold tracking-[-0.01em] group-hover:text-paper-2">
                    {b.title}
                  </h3>
                  <p className="mt-2 text-[13px] text-muted-ink leading-[1.7] group-hover:text-paper-2/60">
                    {b.body}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* STEPS */}
      <section className="w-full bg-paper px-5 sm:px-6 py-16 sm:py-20 md:py-28">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-muted-ink">
            <span className="w-6 h-px bg-ink/30" /> {c.stepsEyebrow}
          </div>
          <h2 className="mt-5 text-[24px] sm:text-[28px] md:text-[34px] font-semibold tracking-[-0.02em] leading-[1.15] max-w-2xl">
            {c.stepsHeading}
          </h2>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-px bg-line border border-line rounded-[18px] overflow-hidden">
            {c.steps.map((s, i) => (
              <motion.div
                key={`${s.n}-${i}`}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="bg-paper-2 p-6 sm:p-7 relative"
              >
                <div className="font-sans text-[36px] sm:text-[44px] font-bold tracking-[-0.03em] leading-none text-lohix-lime">
                  {s.n}
                </div>
                <h3 className="mt-5 text-[15px] font-semibold tracking-[-0.01em]">{s.t}</h3>
                <p className="mt-1.5 text-[13px] text-muted-ink leading-[1.7]">{s.b}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CITY MARQUEE */}
      <section className="w-full bg-paper-2 border-y border-line py-10 sm:py-14 overflow-hidden">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-muted-ink">
            <MapPin className="w-3 h-3 text-lohix-lime" /> {c.citiesLabel}
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-muted-ink">
            <Sparkles className="w-3 h-3" /> {c.cities.length}+ cities
          </div>
        </div>
        <div className="relative">
          <div className="flex gap-3 animate-marquee whitespace-nowrap w-max">
            {[...c.cities, ...c.cities].map((city, i) => (
              <span
                key={`${city}-${i}`}
                className="pill border border-line bg-paper px-4 py-2 text-[12px] text-ink/80 inline-flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-lohix-lime" />
                {city}
              </span>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-paper-2 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-paper-2 to-transparent" />
        </div>
      </section>

      {/* FAQ */}
      <section className="w-full bg-paper px-5 sm:px-6 py-16 sm:py-20 md:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-muted-ink">
            <span className="w-6 h-px bg-ink/30" /> {c.faqEyebrow}
          </div>
          <h2 className="mt-5 text-[24px] sm:text-[28px] md:text-[34px] font-semibold tracking-[-0.02em] leading-[1.15]">
            {c.faqHeading}
          </h2>

          <div className="mt-10 rounded-[18px] border border-line overflow-hidden bg-paper-2 divide-y divide-line">
            {c.faqs.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={`${f.q}-${i}`}>
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 text-left px-5 sm:px-7 py-5 hover:bg-paper transition-colors"
                  >
                    <span className="text-[14px] sm:text-[15px] font-medium tracking-[-0.005em]">
                      {f.q}
                    </span>
                    <ChevronDown
                      className={[
                        "w-4 h-4 text-muted-ink shrink-0 transition-transform duration-300",
                        isOpen ? "rotate-180 text-ink" : "",
                      ].join(" ")}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 sm:px-7 pb-5 text-[13px] sm:text-[14px] text-muted-ink leading-[1.75] max-w-2xl">
                          {f.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* APPLY */}
      <div id="apply">
        <DealerCTA />
      </div>

      <Footer />
    </main>
  );
}

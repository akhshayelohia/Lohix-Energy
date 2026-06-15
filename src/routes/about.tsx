import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, ChevronRight, Factory } from "lucide-react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { useContent } from "@/cms/useContent";
import { safeHref, safeMediaSrc } from "@/lib/safe-url";
import { fetchSection } from "@/cms/fetchSection";
import { getIcon } from "@/cms/icons";

export const Route = createFileRoute("/about")({
  loader: () => fetchSection("about"),
  component: AboutPage,
  head: ({ loaderData }) => {
    const seo = loaderData?.seo;
    return {
      meta: [
        { title: seo?.title || "About — LOHIX Energy" },
        {
          name: "description",
          content:
            seo?.description ||
            "Built in Kolkata, engineered for India. The story, mission, and people behind LOHIX smart LFP batteries.",
        },
        { property: "og:title", content: seo?.title || "About — LOHIX Energy" },
        {
          property: "og:description",
          content: seo?.description || "Built in Kolkata, engineered for India.",
        },
        { property: "og:type", content: "website" },
        { property: "og:url", content: seo?.canonical || "https://lohix.lovable.app/about" },
        ...(seo?.ogImage ? [{ property: "og:image", content: seo.ogImage }] : []),
      ],
      links: [{ rel: "canonical", href: seo?.canonical || "https://lohix.lovable.app/about" }],
    };
  },
});

function AboutPage() {
  const g = useContent("global");
  const c = useContent("about");
  const [hovered, setHovered] = useState<number | null>(null);

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

      {/* MISSION + STATS */}
      <section className="w-full bg-paper-2 border-y border-line">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 py-16 sm:py-20 md:py-24 grid md:grid-cols-12 gap-10 md:gap-14">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-muted-ink">
              <span className="w-6 h-px bg-ink/30" /> {c.missionEyebrow}
            </div>
            <h2 className="mt-5 text-[26px] sm:text-[32px] md:text-[42px] font-semibold tracking-[-0.025em] leading-[1.1]">
              {c.missionHeadingPrefix}{" "}
              <em className="italic text-lohix-lime not-italic md:italic">
                {c.missionHeadingHighlight}
              </em>
            </h2>
          </div>
          <div className="md:col-span-7 space-y-5 text-[14px] md:text-[15px] leading-[1.75] text-muted-ink">
            {c.missionParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <div className="grid grid-cols-2 md:grid-cols-4 border-y border-line mt-8">
              {c.stats.map((s, i) => (
                <div
                  key={`${s.v}-${i}`}
                  className={[
                    "py-5 px-4",
                    i % 2 === 0 ? "border-r border-line" : "",
                    i < 2 ? "border-b border-line md:border-b-0" : "",
                    i < 3 ? "md:border-r md:border-line" : "",
                  ].join(" ")}
                >
                  <div className="font-sans text-[22px] md:text-[26px] font-bold tracking-[-0.02em] text-ink">
                    {s.k}
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-muted-ink mt-1">
                    {s.v}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="w-full bg-paper px-5 sm:px-6 py-16 sm:py-20 md:py-28">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-muted-ink">
            <span className="w-6 h-px bg-ink/30" /> {c.timelineEyebrow}
          </div>
          <h2 className="mt-5 text-[24px] sm:text-[28px] md:text-[34px] font-semibold tracking-[-0.02em] leading-[1.15] max-w-2xl">
            {c.timelineHeading}
          </h2>

          <ol className="mt-12 relative border-l border-line ml-2 sm:ml-4">
            {c.timeline.map((t, i) => (
              <motion.li
                key={`${t.year}-${i}`}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className="relative pl-6 sm:pl-10 pb-10 last:pb-0 group"
              >
                <span
                  className={[
                    "absolute -left-[6px] top-1.5 w-3 h-3 rounded-full border-2 border-paper transition-all",
                    hovered === i ? "bg-lohix-lime scale-125" : "bg-ink",
                  ].join(" ")}
                />
                <div className="flex flex-col md:flex-row md:items-baseline md:gap-6">
                  <div className="font-sans text-[28px] md:text-[36px] font-bold tracking-[-0.02em] text-ink md:w-32 shrink-0">
                    {t.year}
                  </div>
                  <div className="md:flex-1">
                    <h3 className="text-[16px] sm:text-[18px] font-semibold tracking-[-0.01em]">
                      {t.title}
                    </h3>
                    <p className="mt-1.5 text-[13px] sm:text-[14px] text-muted-ink leading-[1.7] max-w-2xl">
                      {t.body}
                    </p>
                  </div>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* VALUES */}
      <section className="w-full bg-paper-2 border-y border-line px-5 sm:px-6 py-16 sm:py-20 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-muted-ink">
            <span className="w-6 h-px bg-ink/30" /> {c.valuesEyebrow}
          </div>
          <h2 className="mt-5 text-[24px] sm:text-[28px] md:text-[34px] font-semibold tracking-[-0.02em] leading-[1.15] max-w-2xl">
            {c.valuesHeading}
          </h2>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-px bg-line rounded-[18px] overflow-hidden border border-line">
            {c.values.map((v, i) => {
              const Icon = getIcon(v.icon);
              return (
                <motion.div
                  key={`${v.title}-${i}`}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="group bg-paper-2 p-6 sm:p-8 hover:bg-ink hover:text-paper-2 transition-colors duration-300"
                >
                  <div className="flex items-center justify-between">
                    <Icon className="w-4 h-4 text-ink group-hover:text-lohix-lime transition-colors" />
                    <span className="text-[9px] uppercase tracking-[0.22em] text-muted-ink group-hover:text-paper-2/50">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="mt-8 text-[16px] sm:text-[18px] font-semibold tracking-[-0.01em] group-hover:text-paper-2">
                    {v.title}
                  </h3>
                  <p className="mt-2 text-[13px] text-muted-ink leading-[1.7] group-hover:text-paper-2/60">
                    {v.body}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FACILITY */}
      <section className="w-full bg-paper px-5 sm:px-6 py-16 sm:py-20 md:py-28">
        <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-10 md:gap-14 items-center">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-muted-ink">
              <Factory className="w-3 h-3 text-lohix-lime" /> {c.facilityEyebrow}
            </div>
            <h2 className="mt-5 text-[24px] sm:text-[28px] md:text-[34px] font-semibold tracking-[-0.02em] leading-[1.15]">
              {c.facilityHeading}
            </h2>
            <p className="mt-5 text-[14px] text-muted-ink leading-[1.75]">{c.facilityBody}</p>
            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <a
                href={safeHref(c.facilityCtaPrimary.href)}
                className="pill inline-flex items-center justify-center gap-2 bg-ink text-paper-2 text-[13px] font-medium px-5 py-3 hover:bg-lohix-lime hover:text-ink transition-colors"
              >
                {c.facilityCtaPrimary.label}
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <a
                href={safeHref(c.facilityCtaSecondary.href)}
                className="pill inline-flex items-center justify-center gap-2 border border-line bg-paper-2 text-ink text-[13px] font-medium px-5 py-3 hover:border-ink transition-colors"
              >
                {c.facilityCtaSecondary.label}
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="md:col-span-7">
            <div className="relative aspect-[5/4] rounded-[22px] overflow-hidden bg-[#05070A]">
              {c.facilityImage ? (
                <img
                  src={safeMediaSrc(c.facilityImage)}
                  alt={`${c.facilityCity} ${c.facilityRegion}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <>
                  <div className="absolute inset-0 gradient-mesh opacity-80" />
                  <div
                    className="absolute inset-0 opacity-[0.08]"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
                      backgroundSize: "48px 48px",
                    }}
                  />
                </>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 text-white">
                <div className="text-[10px] uppercase tracking-[0.22em] text-white/60">
                  {c.facilityCoordinates}
                </div>
                <div className="mt-2 font-sans text-[26px] sm:text-[36px] font-bold tracking-[-0.025em] leading-[1.05]">
                  {c.facilityCity} <span className="text-lohix-lime">{c.facilityRegion}</span>
                </div>
                <div className="mt-2 text-[12px] text-white/70">
                  {c.facilityCompany} · {g.contactEmail}
                </div>
              </div>
              <div className="absolute top-5 right-5 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-white/60">
                <span className="w-1.5 h-1.5 rounded-full bg-lohix-lime pulse-dot" />
                Production live
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

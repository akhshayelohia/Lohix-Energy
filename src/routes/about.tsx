import { createFileRoute } from "@tanstack/react-router";
import { Factory } from "lucide-react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { PageHero } from "@/components/system/PageHero";
import { RoadTimeline } from "@/components/hero/RoadTimeline";
import { SectionHeader } from "@/components/system/SectionHeader";
import { ButtonLink } from "@/components/system/ButtonLink";
import { StatRail } from "@/components/system/StatRail";
import { StageBackdrop } from "@/components/system/StageBackdrop";
import { FeatureGrid } from "@/components/product/FeatureGrid";
import { useContent } from "@/cms/useContent";
import { safeMediaSrc } from "@/lib/safe-url";
import { cn } from "@/lib/utils";
import { absoluteUrl } from "@/lib/site";
import { fetchSection } from "@/cms/fetchSection";

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
        { property: "og:url", content: seo?.canonical || "https://lohixenergy.com/about" },
        ...(seo?.ogImage ? [{ property: "og:image", content: absoluteUrl(seo.ogImage) }] : []),
      ],
      links: [{ rel: "canonical", href: seo?.canonical || "https://lohixenergy.com/about" }],
    };
  },
});

function AboutPage() {
  const g = useContent("global");
  const c = useContent("about");

  return (
    <main className="min-h-screen bg-paper text-ink antialiased">
      <Nav />

      <PageHero
        scrollCue
        visual={
          <RoadTimeline
            items={c.timeline}
            place={`${c.facilityCity} ${c.facilityRegion}`.trim()}
            coordinates={c.facilityCoordinates}
          />
        }
        eyebrow={c.heroEyebrow}
        title={c.heroTitlePrefix}
        accent={c.heroTitleHighlight}
        suffix={c.heroTitleSuffix}
        body={c.heroBody}
        actions={
          <>
            <ButtonLink href={c.heroCtaPrimary.href} variant="lime">
              {c.heroCtaPrimary.label}
            </ButtonLink>
            <ButtonLink href={c.heroCtaSecondary.href} variant="ghost-dark" icon="external">
              {c.heroCtaSecondary.label}
            </ButtonLink>
          </>
        }
      />

      {/* MISSION */}
      <section className="section bg-paper">
        <div className="container-x grid gap-10 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5">
            <SectionHeader
              layout="stack"
              eyebrow={c.missionEyebrow}
              title={c.missionHeadingPrefix}
              accent={c.missionHeadingHighlight}
            />
          </div>
          <Reveal delay={0.08} className="t-body space-y-5 text-muted-ink md:col-span-7 md:pt-12">
            {c.missionParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </Reveal>
          <Reveal delay={0.12} className="md:col-span-12 md:mt-6">
            <StatRail items={c.stats} tone="light" />
          </Reveal>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="section border-y border-line bg-paper-2">
        <div className="container-x">
          <SectionHeader eyebrow={c.timelineEyebrow} title={c.timelineHeading} />
          <ol className="mt-12 border-b border-line md:mt-16">
            {c.timeline.map((t, i) => (
              <Reveal
                as="li"
                key={`${t.year}-${i}`}
                delay={i * 0.06}
                className="group grid gap-3 border-t border-line py-8 md:grid-cols-12 md:gap-10 md:py-10"
              >
                <div className="flex items-center gap-3 md:col-span-3">
                  <span
                    className={cn(
                      "h-2 w-2 rounded-full transition-colors duration-500 group-hover:bg-lohix-lime",
                      // The latest milestone stays lit.
                      i === c.timeline.length - 1
                        ? "bg-lohix-lime ring-4 ring-lohix-lime/25"
                        : "bg-ink/20",
                    )}
                  />
                  <span className="tnum text-[32px] font-semibold tracking-[-0.03em] text-ink md:text-[40px]">
                    {t.year}
                  </span>
                </div>
                <div className="md:col-span-9 md:pt-2">
                  <h3 className="t-h3 text-[18px] text-ink">{t.title}</h3>
                  <p className="t-body mt-2 max-w-2xl text-muted-ink">{t.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* VALUES */}
      <section className="section bg-paper">
        <div className="container-x">
          <SectionHeader eyebrow={c.valuesEyebrow} title={c.valuesHeading} />
          <div className="mt-12 md:mt-16">
            <FeatureGrid items={c.values} columns={c.values.length >= 4 ? 4 : 3} />
          </div>
        </div>
      </section>

      {/* FACILITY */}
      <section className="section border-t border-line bg-paper-2">
        <div className="container-x grid items-center gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5">
            <SectionHeader
              layout="stack"
              eyebrow={c.facilityEyebrow}
              title={c.facilityHeading}
              aside={c.facilityBody}
            />
            <Reveal delay={0.1} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={c.facilityCtaPrimary.href}>{c.facilityCtaPrimary.label}</ButtonLink>
              <ButtonLink href={c.facilityCtaSecondary.href} variant="outline" icon="external">
                {c.facilityCtaSecondary.label}
              </ButtonLink>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="md:col-span-7">
            <div className="relative aspect-[5/4] overflow-hidden rounded-[16px] bg-night text-white">
              {c.facilityImage ? (
                <img
                  src={safeMediaSrc(c.facilityImage)}
                  alt={`${c.facilityCity} ${c.facilityRegion}`}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <StageBackdrop glow="right" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <div className="absolute left-6 top-6 flex items-center gap-2 sm:left-8 sm:top-8">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-lohix-lime text-ink">
                  <Factory className="h-4 w-4" />
                </span>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
                <div className="t-label tnum text-white">{c.facilityCoordinates}</div>
                <div className="mt-3 text-[30px] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-[42px]">
                  {c.facilityCity} <span className="text-lohix-lime">{c.facilityRegion}</span>
                </div>
                <div className="t-small mt-2 text-white">
                  {c.facilityCompany} · {g.contactEmail}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}

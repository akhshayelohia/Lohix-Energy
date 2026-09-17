import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Plus } from "lucide-react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { DealerCTA } from "@/components/DealerCTA";
import { CityFinder } from "@/components/CityFinder";
import { Reveal } from "@/components/Reveal";
import { PageHero } from "@/components/system/PageHero";
import { PartnerSteps } from "@/components/hero/PartnerSteps";
import { SectionHeader } from "@/components/system/SectionHeader";
import { ButtonLink } from "@/components/system/ButtonLink";
import { FeatureGrid } from "@/components/product/FeatureGrid";
import { useContent } from "@/cms/useContent";
import { fetchSection } from "@/cms/fetchSection";
import { cn } from "@/lib/utils";
import { absoluteUrl } from "@/lib/site";
import { recordCityInterest } from "@/lib/cityInterest";

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
            seo?.description || "Partner with LOHIX to sell smart LFP batteries in your city.",
        },
        { property: "og:title", content: seo?.title || "Become a LOHIX Dealer" },
        {
          property: "og:description",
          content:
            seo?.description ||
            "Partner with LOHIX. Training, margin, on-ground service — built in.",
        },
        { property: "og:type", content: "website" },
        { property: "og:url", content: seo?.canonical || "https://lohixenergy.com/dealer" },
        ...(seo?.ogImage ? [{ property: "og:image", content: absoluteUrl(seo.ogImage) }] : []),
      ],
      links: [{ rel: "canonical", href: seo?.canonical || "https://lohixenergy.com/dealer" }],
    };
  },
});

function DealerPage() {
  const g = useContent("global");
  const c = useContent("dealer");
  const [open, setOpen] = useState<number | null>(0);
  const [applyCity, setApplyCity] = useState<string>();

  const requestCity = (city: string) => {
    recordCityInterest(city);
    setApplyCity(city);
    document.getElementById("apply")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="min-h-screen bg-paper text-ink antialiased">
      <Nav />

      <PageHero
        scrollCue
        visual={<PartnerSteps label={c.stepsEyebrow} steps={c.steps} />}
        eyebrow={c.heroEyebrow}
        title={c.heroTitlePrefix}
        accent={c.heroTitleHighlight}
        accentOnNewLine
        body={c.heroBody}
        actions={
          <>
            <ButtonLink href={c.ctaPrimary.href} variant="lime">
              {c.ctaPrimary.label}
            </ButtonLink>
            {String(c.showPhoneCta) !== "false" &&
              /[1-9]/.test(g.contactPhone.replace(/^\s*\+?91/, "")) && (
                <a
                  href={`tel:${g.contactPhone.replace(/\s+/g, "")}`}
                  className="btn btn-ghost-dark tnum"
                >
                  <Phone className="h-3.5 w-3.5" />
                  {g.contactPhone}
                </a>
              )}
          </>
        }
      />

      {/* BENEFITS */}
      <section className="section bg-paper">
        <div className="container-x">
          <SectionHeader
            eyebrow={c.benefitsEyebrow}
            title={c.benefitsHeading}
            aside={c.benefitsSubtext}
          />
          <div className="mt-12 md:mt-16">
            <FeatureGrid items={c.benefits} columns={c.benefits.length >= 4 ? 4 : 3} />
          </div>
        </div>
      </section>

      {/* STEPS — shown in the hero on large screens */}
      <section className="section border-y border-line bg-paper-2 lg:hidden">
        <div className="container-x">
          <SectionHeader eyebrow={c.stepsEyebrow} title={c.stepsHeading} />
          <div className="mosaic mt-12 grid-cols-1 sm:grid-cols-2 md:mt-16 lg:grid-cols-4">
            {c.steps.map((s, i) => (
              <Reveal
                key={`${s.n}-${i}`}
                delay={i * 0.06}
                className="relative bg-paper-2 p-7 sm:p-8"
              >
                <div className="tnum text-[44px] font-semibold leading-none tracking-[-0.04em] text-lohix-lime-deep">
                  {s.n}
                </div>
                <h3 className="t-h3 mt-10 text-ink">{s.t}</h3>
                <p className="t-small mt-2.5 text-muted-ink">{s.b}</p>
                {i < c.steps.length - 1 && (
                  <span className="absolute right-7 top-9 hidden h-px w-10 bg-gradient-to-r from-ink/20 to-transparent lg:block" />
                )}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* YOUR CITY */}
      <section className="section bg-paper lg:border-t lg:border-line">
        <div className="container-x grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeader
              layout="stack"
              eyebrow={c.cityEyebrow}
              title={c.cityHeading}
              aside={c.cityBody}
            />
          </div>
          <Reveal delay={0.08} className="lg:col-span-7">
            <CityFinder
              onRequest={requestCity}
              copy={{
                question: c.cityQuestion,
                hint: c.cityHint,
                placeholder: c.cityPlaceholder,
                button: c.cityButton,
              }}
            />
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="section border-y border-line bg-paper-2">
        <div className="container-narrow">
          <SectionHeader layout="stack" eyebrow={c.faqEyebrow} title={c.faqHeading} />
          <Reveal className="card mt-12 divide-y divide-line overflow-hidden bg-paper md:mt-16">
            {c.faqs.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={`${f.q}-${i}`}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left transition-colors hover:bg-paper-2 sm:px-8 sm:py-6"
                  >
                    <span className="text-[15px] font-medium tracking-[-0.01em] text-ink">
                      {f.q}
                    </span>
                    <span
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line transition-all duration-300",
                        isOpen ? "rotate-45 border-transparent bg-ink text-lohix-lime" : "text-ink",
                      )}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="t-body max-w-2xl px-6 pb-6 text-muted-ink sm:px-8">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </Reveal>
        </div>
      </section>

      <div id="apply">
        <DealerCTA prefillCity={applyCity} />
      </div>

      <Footer />
    </main>
  );
}

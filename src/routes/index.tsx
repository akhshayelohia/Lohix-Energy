import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { FeatureSection } from "@/components/FeatureSection";
import { WhyLohix } from "@/components/WhyLohix";
import { DealerCTA } from "@/components/DealerCTA";
import { WarrantyForm } from "@/components/WarrantyForm";
import { Footer } from "@/components/Footer";
import { StatsStrip } from "@/components/StatsStrip";
import { TrustMarquee } from "@/components/TrustMarquee";
import { RangeShowcase } from "@/components/RangeShowcase";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "LOHIX Energy — Smart LFP Batteries | Power. Performance. Possibilities." },
      {
        name: "description",
        content:
          "Smart LiFePO4 batteries built in India — the LOHIX 48 for e-rickshaws and a 60.8V / 64V range for electric two-wheelers. Smart BMS, long cycle life, local service.",
      },
      { property: "og:title", content: "LOHIX Energy — Smart LFP Batteries" },
      {
        property: "og:description",
        content: "Power. Performance. Possibilities. Built for the roads of India.",
      },
      { property: "og:image", content: "/logo_lohix.png" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://lohixenergy.com/" },
    ],
    links: [{ rel: "canonical", href: "https://lohixenergy.com/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: "Lohix Energy Smart LFP Battery",
          brand: { "@type": "Brand", name: "LOHIX" },
          description:
            "51.2V 100Ah Smart Lithium Iron Phosphate (LFP) battery for e-rickshaws and electric vehicles. 3500+ cycles, smart BMS, made in India.",
          image: "https://lohixenergy.com/logo_lohix.png",
          category: "EV Battery",
          countryOfOrigin: "IN",
        }),
      },
    ],
  }),
});

function Index() {
  return (
    <main className="min-h-screen bg-paper text-ink">
      <Nav />
      <Hero />
      <TrustMarquee />
      <FeatureSection />
      <StatsStrip />
      <RangeShowcase />
      <WhyLohix />
      <WarrantyForm />
      <DealerCTA />
      <Footer />
    </main>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Preloader } from "@/components/Preloader";
import { FeatureSection } from "@/components/FeatureSection";
import { WhyLohix } from "@/components/WhyLohix";
import { PixelDivider } from "@/components/PixelDivider";
import { DealerCTA } from "@/components/DealerCTA";
import { WarrantyForm } from "@/components/WarrantyForm";
import { Footer } from "@/components/Footer";
import { StatsStrip } from "@/components/StatsStrip";
import { TrustMarquee } from "@/components/TrustMarquee";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Lohix Energy — Smart LFP Battery | Power. Performance. Possibilities." },
      {
        name: "description",
        content:
          "Lohix Energy — 51.2V 100Ah Smart LFP battery built for e-rickshaws and EVs. 3500+ cycles, smart BMS, made in India.",
      },
      { property: "og:title", content: "Lohix Energy — Smart LFP Battery" },
      {
        property: "og:description",
        content: "Power. Performance. Possibilities. Built for the roads of Eastern India.",
      },
      { property: "og:image", content: "/logo_lohix.png" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://lohix.lovable.app/" },
    ],
    links: [{ rel: "canonical", href: "https://lohix.lovable.app/" }],
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
          image: "https://lohix.lovable.app/logo_lohix.png",
          category: "EV Battery",
          countryOfOrigin: "IN",
        }),
      },
    ],
  }),
});

function Index() {
  return (
    <main className="bg-paper text-ink min-h-screen">
      <Preloader />
      <Nav />
      <Hero />
      <TrustMarquee />
      <FeatureSection />
      <StatsStrip />
      <WhyLohix />
      <PixelDivider />
      <WarrantyForm />
      <DealerCTA />
      <Footer />
    </main>
  );
}

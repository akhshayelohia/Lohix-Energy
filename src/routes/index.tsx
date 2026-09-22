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
      { property: "og:image", content: "https://lohixenergy.com/og-image.jpg" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://lohixenergy.com/" },
    ],
    links: [{ rel: "canonical", href: "https://lohixenergy.com/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "LOHIX Energy",
          legalName: "Aishwarya Nirman Private Limited",
          url: "https://lohixenergy.com/",
          logo: "https://lohixenergy.com/logo_lohix.png",
          image: "https://lohixenergy.com/og-image.jpg",
          description:
            "Smart LiFePO4 battery packs made in India — the 51.2V LOHIX 48 for e-rickshaws and 60.8V / 64V packs for electric two-wheelers.",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Kolkata",
            addressRegion: "West Bengal",
            addressCountry: "IN",
          },
          makesOffer: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Product",
                name: "LOHIX 48",
                category: "E-rickshaw battery",
                url: "https://lohixenergy.com/product",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Product",
                name: "LOHIX 2W battery range",
                category: "Electric two-wheeler battery",
                url: "https://lohixenergy.com/products",
              },
            },
          ],
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

import { useContent } from "@/cms/useContent";
import { SectionHeader } from "@/components/system/SectionHeader";
import { SpecExplorer } from "@/components/SpecExplorer";

export function FeatureSection() {
  const content = useContent("features");

  return (
    <section id="features" className="section bg-paper">
      <div className="container-x">
        <SectionHeader
          eyebrow={content.eyebrow}
          title={content.headingPrefix}
          accent={`${content.headingHighlight} ${content.headingSuffix}`}
          aside={content.body}
        />
        <div className="mt-10 md:mt-12">
          <SpecExplorer
            items={content.items}
            cta={{ label: content.ctaLabel, href: content.ctaHref }}
          />
        </div>
      </div>
    </section>
  );
}

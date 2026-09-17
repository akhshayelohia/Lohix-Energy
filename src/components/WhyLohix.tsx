import { useContent } from "@/cms/useContent";
import { SectionHeader } from "@/components/system/SectionHeader";
import { FeatureGrid } from "@/components/product/FeatureGrid";

export function WhyLohix() {
  const c = useContent("why_lohix");
  return (
    <section id="about" className="section bg-paper">
      <div className="container-x">
        <SectionHeader
          eyebrow={c.eyebrow}
          title={c.headingPrefix}
          accent={`${c.headingHighlight}${c.headingSuffix}`}
          aside={c.body}
        />
        <div className="mt-12 md:mt-16">
          <FeatureGrid items={c.cards} columns={c.cards.length >= 4 ? 4 : 3} />
        </div>
      </div>
    </section>
  );
}

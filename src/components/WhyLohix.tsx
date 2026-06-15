import { motion } from "framer-motion";
import { useContent } from "@/cms/useContent";
import { getIcon } from "@/cms/icons";

export function WhyLohix() {
  const c = useContent("why_lohix");
  return (
    <section
      id="about"
      className="w-full bg-paper-2 px-5 sm:px-6 py-16 sm:py-24 md:py-32 border-y border-line"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10 items-end">
          <div>
            <div className="inline-flex items-center gap-2 pill hairline bg-paper px-3 py-1 text-xxs uppercase tracking-[0.2em] text-muted-ink">
              <span className="w-1 h-1 rounded-full bg-lohix-green" />
              {c.eyebrow}
            </div>
            <h2 className="mt-5 font-sans text-[34px] sm:text-[44px] md:text-[64px] leading-[1] tracking-[-0.03em]">
              {c.headingPrefix} <em className="italic text-lohix-green">{c.headingHighlight}</em>
              {c.headingSuffix}
            </h2>
          </div>
          <p className="text-[14px] text-muted-ink max-w-md md:justify-self-end">{c.body}</p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {c.cards.map((card, i) => {
            const Icon = getIcon(card.icon);
            return (
              <motion.div
                key={card.title + i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="group rounded-2xl hairline bg-paper p-6 hover:border-ink/30 hover:-translate-y-1 transition-all"
              >
                <div className="w-9 h-9 rounded-full bg-lohix-lime/40 flex items-center justify-center group-hover:bg-lohix-lime transition-colors">
                  <Icon className="w-4 h-4 text-ink" />
                </div>
                <h3 className="mt-6 text-[15px] font-semibold tracking-[-0.01em] text-ink">
                  {card.title}
                </h3>
                <p className="mt-2 text-[13px] text-muted-ink leading-relaxed">{card.body}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

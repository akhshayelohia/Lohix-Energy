import { Reveal } from "./Reveal";
import { useContent } from "@/cms/useContent";

export function TrustMarquee() {
  const c = useContent("trust");
  // A short list still has to fill the marquee track, so repeat it enough to
  // cover the widest viewport before the loop seam would show.
  const track = Array.from({ length: 6 }, () => c.items).flat();

  if (c.items.length === 0) return null;

  return (
    <section className="section-sm overflow-hidden border-b border-line bg-paper">
      <Reveal className="container-x flex justify-center">
        <p className="t-label inline-flex items-center gap-2.5 text-muted-ink">
          <span className="h-1.5 w-1.5 rounded-full bg-lohix-lime" />
          {c.eyebrow}
        </p>
      </Reveal>
      <div className="relative mt-7">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-paper to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-paper to-transparent" />
        <div className="flex w-max gap-3 whitespace-nowrap animate-marquee">
          {track.map((t, i) => (
            <span key={`${t}-${i}`} className="chip px-4 py-2 text-[13px] font-medium text-ink">
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

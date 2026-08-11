import { Reveal } from "./Reveal";
import { useContent } from "@/cms/useContent";

export function TrustMarquee() {
  const c = useContent("trust");
  // A short list still has to fill the marquee track, so repeat it enough to
  // cover the widest viewport before the loop seam would show.
  const track = Array.from({ length: 6 }, () => c.items).flat();

  if (c.items.length === 0) return null;

  return (
    <section className="w-full bg-paper border-y border-line py-10 overflow-hidden">
      <Reveal className="max-w-6xl mx-auto px-5 sm:px-6">
        <p className="text-xxs uppercase tracking-[0.25em] text-muted-ink text-center">
          {c.eyebrow}
        </p>
      </Reveal>
      <div className="mt-6 relative">
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-paper to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-paper to-transparent z-10 pointer-events-none" />
        <div className="flex gap-3 animate-marquee whitespace-nowrap w-max">
          {track.map((t, i) => (
            <span
              key={`${t}-${i}`}
              className="pill hairline bg-paper-2 px-4 py-2 text-[12px] font-medium text-ink/80 tracking-wide"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

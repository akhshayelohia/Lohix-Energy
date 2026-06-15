import { Reveal } from "./Reveal";

const ITEMS = [
  "ARAI Certified",
  "BIS IS 16893",
  "UN 38.3 Tested",
  "Made in India",
  "IP67 Enclosure",
  "Smart BMS v4",
  "ISO 9001:2015",
  "Cell-grade A+",
];

export function TrustMarquee() {
  return (
    <section className="w-full bg-paper border-y border-line py-10 overflow-hidden">
      <Reveal className="max-w-6xl mx-auto px-5 sm:px-6">
        <p className="text-xxs uppercase tracking-[0.25em] text-muted-ink text-center">
          Trusted, tested, certified
        </p>
      </Reveal>
      <div className="mt-6 relative">
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-paper to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-paper to-transparent z-10 pointer-events-none" />
        <div className="flex gap-3 animate-marquee whitespace-nowrap w-max">
          {[...ITEMS, ...ITEMS].map((t, i) => (
            <span
              key={i}
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

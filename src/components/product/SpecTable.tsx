import { Reveal } from "@/components/Reveal";
import type { SpecGroup } from "@/cms/products2w";

export function SpecTable({ groups }: { groups: SpecGroup[] }) {
  return (
    <div className="grid gap-12 md:grid-cols-3 md:gap-8 lg:gap-12">
      {groups.map((g, gi) => (
        <Reveal key={`${g.title}-${gi}`} delay={gi * 0.06}>
          <div className="relative flex items-center justify-between border-b border-ink pb-4">
            <span
              aria-hidden
              className="absolute -bottom-0.5 left-0 h-[3px] w-10 rounded-full bg-lohix-lime"
            />
            <h3 className="t-label text-ink">{g.title}</h3>
            <span className="t-label tnum text-lohix-lime-deep">
              {String(gi + 1).padStart(2, "0")}
            </span>
          </div>
          <dl>
            {g.rows.map((r, ri) => (
              <div
                key={`${r.label}-${ri}`}
                className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-6 border-b border-line py-4"
              >
                <dt className="text-[13px] text-muted-ink">{r.label}</dt>
                <dd className="tnum text-right text-[14px] font-medium tracking-[-0.01em] text-ink">
                  {r.value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      ))}
    </div>
  );
}

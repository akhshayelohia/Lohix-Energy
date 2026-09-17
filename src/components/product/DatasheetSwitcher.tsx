import { useEffect, useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { KeyFigure, SpecGroup } from "@/cms/products2w";
import { ButtonLink } from "@/components/system/ButtonLink";
import { cn } from "@/lib/utils";
import { SpecTable } from "./SpecTable";

export type DatasheetModel = {
  id: string;
  name: string;
  /** Short chip label, e.g. "48" or "60.8V 30Ah". */
  label: string;
  category: string;
  href: string;
  figures: KeyFigure[];
  groups: SpecGroup[];
  /** Direct PDF link when available; otherwise the request link is used. */
  datasheetUrl?: string;
  requestHref: string;
};

type Props = {
  models: DatasheetModel[];
  downloadLabel: string;
  requestLabel: string;
  viewLabel: string;
};

const HASH_PREFIX = "#datasheet-";

// One spec sheet at a time across the whole range; each model is deep-linkable
// as /specs#datasheet-<id>.
export function DatasheetSwitcher({ models, downloadLabel, requestLabel, viewLabel }: Props) {
  const uid = useId();
  const reduce = useReducedMotion();
  const [activeId, setActiveId] = useState(models[0]?.id);

  useEffect(() => {
    const fromHash = () => {
      const id = window.location.hash.startsWith(HASH_PREFIX)
        ? decodeURIComponent(window.location.hash.slice(HASH_PREFIX.length))
        : "";
      if (id && models.some((m) => m.id === id)) {
        setActiveId(id);
        document.getElementById(`${uid}-panel`)?.scrollIntoView({ block: "start" });
      }
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [models, uid]);

  const active = models.find((m) => m.id === activeId) ?? models[0];
  if (!active) return null;

  const select = (id: string) => {
    setActiveId(id);
    history.replaceState(null, "", `${HASH_PREFIX}${encodeURIComponent(id)}`);
  };

  const categories = Array.from(new Set(models.map((m) => m.category)));

  return (
    <div>
      <div
        role="tablist"
        aria-label="Choose a battery"
        className="no-scrollbar -mx-5 flex gap-6 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
      >
        {categories.map((cat) => (
          <div key={cat} className="flex shrink-0 flex-col gap-2.5">
            <span className="t-label text-muted-ink">{cat}</span>
            <div className="flex gap-2">
              {models
                .filter((m) => m.category === cat)
                .map((m) => {
                  const on = m.id === active.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      role="tab"
                      id={`${uid}-tab-${m.id}`}
                      aria-selected={on}
                      aria-controls={`${uid}-panel`}
                      onClick={() => select(m.id)}
                      className={cn(
                        "tap tnum whitespace-nowrap rounded-full border px-4 py-2 text-[13px] font-medium transition-colors",
                        on
                          ? "border-ink bg-ink text-lohix-lime"
                          : "border-line bg-paper-2 text-ink/75 hover:border-ink/30 hover:text-ink",
                      )}
                    >
                      {m.label}
                    </button>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      <div
        id={`${uid}-panel`}
        role="tabpanel"
        aria-labelledby={`${uid}-tab-${active.id}`}
        className="mt-10 scroll-mt-28 md:mt-12"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active.id}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex flex-col gap-6 border-b border-line pb-8 md:flex-row md:items-end md:justify-between">
              <div>
                <h3 className="tnum text-[32px] font-semibold leading-none tracking-[-0.03em] text-ink md:text-[40px]">
                  {active.name}
                </h3>
                {active.figures.length > 0 && (
                  <p className="tnum mt-3 text-[14px] text-muted-ink">
                    {active.figures.map((f) => `${f.k} ${f.v.toLowerCase()}`).join(" · ")}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                {active.datasheetUrl?.trim() ? (
                  <ButtonLink href={active.datasheetUrl} icon="download" newTab>
                    {downloadLabel}
                  </ButtonLink>
                ) : (
                  <ButtonLink href={active.requestHref} variant="outline" icon="external">
                    {requestLabel}
                  </ButtonLink>
                )}
                <a
                  href={active.href}
                  className="group inline-flex items-center justify-center gap-1.5 px-2 py-3 text-[13px] font-medium text-ink"
                >
                  {viewLabel} {active.name}
                  <ArrowRight className="h-3.5 w-3.5 text-lohix-lime-deep transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </div>
            </div>
            <div className="mt-10 md:mt-12">
              <SpecTable groups={active.groups} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

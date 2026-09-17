import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { BUY_HREF } from "@/components/BuyDialog";

type Props = {
  /** Section whose own buttons make this bar redundant while visible. */
  introId: string;
  name: string;
  detail?: string;
  label: string;
};

// Phone-only bar that keeps "Where to buy" in reach once the product intro has
// scrolled away. It steps aside for the closing CTA band and the footer.
export function MobileBuyBar({ introId, name, detail, label }: Props) {
  const reduce = useReducedMotion();
  const [pastIntro, setPastIntro] = useState(false);
  const [atEnd, setAtEnd] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const intro = document.getElementById(introId);
    const ends = {
      cta: document.querySelector("main > section:last-of-type"),
      footer: document.querySelector("footer"),
    };
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === intro) {
          setPastIntro(!e.isIntersecting && e.boundingClientRect.top < 0);
          continue;
        }
        const key = e.target === ends.cta ? "cta" : "footer";
        setAtEnd((s) => ({ ...s, [key]: e.isIntersecting }));
      }
    });
    [intro, ends.cta, ends.footer].forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [introId]);

  const show = pastIntro && !atEnd.cta && !atEnd.footer;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={reduce ? { opacity: 0 } : { y: "110%" }}
          animate={reduce ? { opacity: 1 } : { y: 0 }}
          exit={reduce ? { opacity: 0 } : { y: "110%" }}
          transition={{ type: "spring", stiffness: 420, damping: 40 }}
          className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden"
        >
          <div className="flex items-center gap-3 rounded-[14px] border border-white/10 bg-night/90 py-2 pl-4 pr-2 text-white shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6)] backdrop-blur-xl">
            <div className="min-w-0 flex-1">
              <div className="tnum truncate text-[14px] font-semibold tracking-[-0.01em]">
                {name}
              </div>
              {detail && <div className="tnum truncate text-[11.5px] text-white/55">{detail}</div>}
            </div>
            <a href={BUY_HREF} className="btn btn-lime h-11 shrink-0 px-4 shadow-none">
              {label}
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

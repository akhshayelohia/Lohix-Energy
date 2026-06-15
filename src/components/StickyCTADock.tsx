import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

/**
 * Round floating action button — appears on the right edge after 600px of
 * scroll, hides as the footer enters view (so it never overlaps it).
 */
export function StickyCTADock() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const compute = () => {
      const y = window.scrollY;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      // Hide within the last ~520px (footer + breathing room)
      const nearFooter = y > max - 520;
      setShow(y > 600 && !nearFooter);
    };
    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.a
          href="/dealer"
          aria-label="Get LOHIX — talk to a specialist"
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          className="group fixed z-40 bottom-6 right-6 sm:bottom-8 sm:right-8
                     h-14 w-14 rounded-full bg-lohix-lime text-ink
                     flex items-center justify-center
                     shadow-[0_10px_40px_-10px_rgba(183,226,109,0.7),0_4px_12px_rgba(0,0,0,0.25)]
                     ring-1 ring-black/5 hover:bg-lohix-green transition-colors"
        >
          <span className="absolute inset-0 rounded-full bg-lohix-lime/60 animate-ping opacity-50 pointer-events-none" />
          <ArrowUpRight
            className="relative w-6 h-6 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            strokeWidth={2.25}
          />
          <span
            className="pointer-events-none absolute right-[calc(100%+12px)] top-1/2 -translate-y-1/2
                       whitespace-nowrap rounded-full bg-ink text-paper-2 text-[12px] font-medium
                       px-3 py-1.5 opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0
                       transition-all hidden sm:inline-flex shadow-lg"
          >
            Get LOHIX
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}

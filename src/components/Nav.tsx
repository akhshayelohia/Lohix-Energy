import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useContent } from "@/cms/useContent";
import { safeMediaSrc } from "@/lib/safe-url";

const links = [
  { label: "Product", href: "/product" },
  { label: "Specs", href: "/specs" },
  { label: "About", href: "/about" },
  { label: "Dealer", href: "/dealer" },
];

export function Nav() {
  const g = useContent("global");
  const [open, setOpen] = useState(false);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 z-50 w-[min(960px,calc(100%-1rem))] sm:w-[min(960px,calc(100%-2rem))]"
    >
      <div className="glass hairline pill flex items-center justify-between pl-4 sm:pl-5 pr-2 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
        <a href="/" className="flex items-center gap-2 shrink-0">
          <img src={safeMediaSrc(g.logoUrl)} alt={g.brandName} className="h-5 sm:h-6 w-auto" />
        </a>
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="px-3 py-1.5 text-mini font-medium text-ink/70 hover:text-ink transition-colors rounded-full hover:bg-black/[0.04]"
            >
              {l.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <a
            href="/dealer"
            className="pill inline-flex items-center gap-1.5 bg-ink text-paper-2 text-[11px] sm:text-mini font-medium pl-3 sm:pl-3.5 pr-2.5 sm:pr-3 py-1.5 hover:bg-lohix-green transition-colors"
          >
            Get LOHIX
            <ArrowUpRight className="w-3 h-3" />
          </a>
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden pill w-8 h-8 inline-flex items-center justify-center hairline bg-paper-2/60 text-ink"
          >
            {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="md:hidden mt-2 glass hairline rounded-2xl p-2 shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
          >
            <ul className="flex flex-col">
              {links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block px-4 py-2.5 text-[13px] font-medium text-ink/80 hover:text-ink hover:bg-black/[0.04] rounded-xl"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

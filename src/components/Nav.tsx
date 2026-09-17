import { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowUpRight, ChevronDown, Menu, ShieldCheck, X } from "lucide-react";
import { useContent } from "@/cms/useContent";
import { useCatalog, type CatalogProduct } from "@/cms/catalog";
import { safeMediaSrc } from "@/lib/safe-url";
import { cn } from "@/lib/utils";
import { PackRender } from "@/components/product/PackRender";

const links = [
  { label: "Specs", href: "/specs" },
  { label: "About", href: "/about" },
  { label: "Dealer", href: "/dealer" },
];

const DARK_SURFACE = "section.bg-night, .panel-dark";

function Thumb({ product }: { product: CatalogProduct }) {
  return (
    <span className="relative h-11 w-14 shrink-0 overflow-hidden rounded-[6px] bg-night">
      {product.image ? (
        <img
          src={product.thumb ?? product.image}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      ) : (
        <PackRender
          voltage={product.voltage ?? ""}
          capacity={product.capacity ?? ""}
          className="absolute inset-0 m-auto h-[118%] w-auto"
        />
      )}
    </span>
  );
}

export function Nav() {
  const g = useContent("global");
  const catalog = useCatalog();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [onDark, setOnDark] = useState(true);
  const closeTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    setOpen(false);
    setMenu(false);
  }, [pathname]);

  // Every page opens on a dark stage, so the bar starts dark and flips to
  // light glass once it sits over a light section.
  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      const nav = navRef.current;
      if (!nav) return;
      const rect = nav.getBoundingClientRect();
      const hit = document
        .elementsFromPoint(window.innerWidth / 2, rect.top + rect.height / 2)
        .find((el) => !nav.contains(el));
      setOnDark(Boolean(hit?.closest(DARK_SURFACE)));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [pathname]);

  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    const onScroll = () => setMenu(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
    };
  }, [menu]);

  // Phone menu: lock the page behind it and close on Escape.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const dark = onDark && !open;
  const productsActive = pathname === "/product" || pathname.startsWith("/products");
  const openMenu = () => {
    window.clearTimeout(closeTimer.current);
    setMenu(true);
  };
  const scheduleClose = () => {
    closeTimer.current = window.setTimeout(() => setMenu(false), 140);
  };

  const itemCls = (active: boolean) =>
    cn(
      "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors duration-300",
      dark
        ? active
          ? "bg-white/10 text-white"
          : "text-white/65 hover:bg-white/[0.06] hover:text-white"
        : active
          ? "bg-black/[0.06] text-ink"
          : "text-ink/65 hover:bg-black/[0.04] hover:text-ink",
    );

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="nav-backdrop"
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-night/45 backdrop-blur-[2px] md:hidden"
          />
        )}
      </AnimatePresence>
      <motion.nav
        ref={navRef}
        className="animate-nav-in fixed left-1/2 top-3 z-50 w-[min(960px,calc(100%-1rem))] -translate-x-1/2 sm:top-4 sm:w-[min(960px,calc(100%-2rem))]"
      >
        <div
          className={cn(
            "flex items-center justify-between rounded-full border py-2 pl-4 pr-2 backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-500 sm:pl-5",
            dark
              ? "border-white/10 bg-night/55 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]"
              : "border-line bg-paper-2/75 shadow-[0_8px_30px_rgba(0,0,0,0.06)]",
          )}
        >
          <a
            href="/"
            className="flex shrink-0 items-center gap-2"
            aria-label={`${g.brandName} home`}
          >
            <img src={safeMediaSrc(g.logoUrl)} alt={g.brandName} className="h-5 w-auto sm:h-6" />
          </a>

          <div className="hidden items-center gap-0.5 md:flex">
            <div onMouseEnter={openMenu} onMouseLeave={scheduleClose}>
              <button
                type="button"
                aria-expanded={menu}
                aria-haspopup="true"
                onClick={() => setMenu((v) => !v)}
                className={itemCls(productsActive || menu)}
              >
                Products
                <ChevronDown
                  className={cn("h-3 w-3 transition-transform duration-300", menu && "rotate-180")}
                />
              </button>
            </div>
            {links.map((l) => (
              <a key={l.label} href={l.href} className={itemCls(pathname === l.href)}>
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <a
              href="#buy"
              className={cn(
                "btn btn-sm h-9 py-0 pl-3.5 pr-3 shadow-none md:h-auto md:py-1.5",
                dark ? "btn-lime shadow-none" : "btn-ink",
              )}
            >
              Buy LOHIX
              <ArrowUpRight className="h-3 w-3" />
            </a>
            <button
              type="button"
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors md:hidden",
                dark
                  ? "border-white/15 bg-white/[0.06] text-white"
                  : "border-line bg-paper-2/60 text-ink",
              )}
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menu && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              onMouseEnter={openMenu}
              onMouseLeave={scheduleClose}
              className="absolute left-1/2 top-full hidden w-[min(680px,calc(100vw-2rem))] origin-top -translate-x-1/2 pt-2 md:block"
            >
              <div className="rounded-[14px] border border-line bg-paper-2 p-2 shadow-[0_30px_80px_-30px_rgba(11,15,16,0.35)] backdrop-blur-xl">
                <div className="grid grid-cols-[1fr_1.2fr] gap-1">
                  {catalog.map((cat) => (
                    <div key={cat.id} className="p-3">
                      <a
                        href={`/products#${cat.id}`}
                        className="t-label block px-2 pb-2 text-muted-ink transition-colors hover:text-ink"
                      >
                        {cat.label}
                      </a>
                      <ul className="space-y-0.5">
                        {cat.products.map((p) => (
                          <li key={p.id}>
                            <a
                              href={p.href}
                              className={cn(
                                "flex items-center gap-3 rounded-[8px] px-2 py-2 transition-colors hover:bg-paper",
                                pathname === p.href && "bg-paper",
                              )}
                            >
                              <Thumb product={p} />
                              <span className="min-w-0">
                                <span className="tnum block text-[13px] font-semibold tracking-[-0.01em] text-ink">
                                  {p.name}
                                </span>
                                <span className="tnum block truncate text-[11px] text-muted-ink">
                                  {p.figures.map((f) => f.k).join(" · ")}
                                </span>
                              </span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <a
                  href="/products"
                  className="group mt-1 flex items-center justify-between rounded-[12px] bg-night-2 px-5 py-3.5 text-white"
                >
                  <span className="text-[12.5px] font-medium">View all products</span>
                  <ArrowRight className="h-3.5 w-3.5 text-lohix-lime transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              // Any tap on a link closes the sheet (covers same-page anchors like #buy).
              onClick={(e) => (e.target as Element).closest("a") && setOpen(false)}
              className="mt-2 max-h-[calc(100svh-5rem)] overflow-y-auto overscroll-contain rounded-[14px] border border-line bg-paper-2 p-2 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.25)] backdrop-blur-xl md:hidden"
            >
              <a
                href="/products"
                className="flex items-center justify-between rounded-[10px] px-4 py-3 text-[14px] font-semibold text-ink hover:bg-paper"
              >
                Products
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
              {catalog.map((cat) => (
                <div key={cat.id} className="px-2 pb-2">
                  <div className="t-label px-2 pb-1 pt-2 text-muted-ink">{cat.label}</div>
                  {cat.products.map((p) => (
                    <a
                      key={p.id}
                      href={p.href}
                      aria-current={pathname === p.href ? "page" : undefined}
                      className="flex items-center gap-3 rounded-[8px] px-2 py-2 hover:bg-paper aria-[current=page]:bg-paper"
                    >
                      <Thumb product={p} />
                      <span className="tnum text-[13px] font-medium text-ink">{p.name}</span>
                    </a>
                  ))}
                </div>
              ))}
              <div className="mx-2 my-1 h-px bg-line" />
              <ul>
                {links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      aria-current={pathname === l.href ? "page" : undefined}
                      className="flex items-center justify-between rounded-[10px] px-4 py-3 text-[14px] font-medium text-ink/80 hover:bg-paper hover:text-ink aria-[current=page]:text-ink"
                    >
                      {l.label}
                      {pathname === l.href && (
                        <span className="h-1.5 w-1.5 rounded-full bg-lohix-lime" />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-1 grid grid-cols-2 gap-2 border-t border-line p-2 pt-3">
                <a href="#buy" className="btn btn-ink">
                  Where to buy
                </a>
                <a href="/#warranty" className="btn btn-outline">
                  <ShieldCheck className="h-3.5 w-3.5 text-lohix-lime-deep" />
                  Warranty
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}

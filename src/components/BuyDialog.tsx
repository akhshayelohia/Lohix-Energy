import { useEffect, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ArrowRight, ArrowUpRight, Mail, Phone, X } from "lucide-react";
import { useContent } from "@/cms/useContent";
import { safeHref } from "@/lib/safe-url";

// Any link pointing at "#buy" (including CMS-authored ones) opens this dialog.
export const BUY_HREF = "#buy";

const PHONE = /^\+?[\d\s-]{7,}$/;

function isRealPhone(value: string) {
  return /[1-9]/.test(value.replace(/^\s*\+?91/, ""));
}

export function BuyDialog() {
  const g = useContent("global");
  const f = useContent("footer");
  const c = useContent("buy_dialog");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const anchor = (e.target as Element | null)?.closest?.("a");
      const href = anchor?.getAttribute("href") ?? "";
      if (href === BUY_HREF || href === `/${BUY_HREF}`) {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener("click", onClick);
    if (window.location.hash === BUY_HREF) setOpen(true);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const phones = f.contactLines.map((l) => l.trim()).filter((l) => PHONE.test(l));
  if (isRealPhone(g.contactPhone) && !phones.includes(g.contactPhone))
    phones.unshift(g.contactPhone);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[70] bg-night/70 backdrop-blur-sm data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-[71] w-[min(460px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[14px] border border-line bg-paper-2 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.6)] outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95">
          <div className="relative bg-night-2 px-7 pb-7 pt-8 text-white">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-lohix-lime/20 blur-[70px]"
            />
            <p className="t-label relative text-lohix-lime">{c.eyebrow}</p>
            <DialogPrimitive.Title className="relative mt-3 text-[26px] font-semibold leading-[1.1] tracking-[-0.025em]">
              {c.heading}
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="t-small relative mt-2 text-white">
              {c.body}
            </DialogPrimitive.Description>
            <DialogPrimitive.Close
              aria-label="Close"
              className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </DialogPrimitive.Close>
          </div>

          <ul className="divide-y divide-line px-3 py-2">
            {phones.map((p) => (
              <li key={p}>
                <a
                  href={`tel:${p.replace(/[\s-]/g, "")}`}
                  className="group flex items-center gap-4 rounded-[8px] px-4 py-3.5 transition-colors hover:bg-paper"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-lohix-lime text-ink">
                    <Phone className="h-4 w-4" />
                  </span>
                  <span className="flex-1">
                    <span className="block text-[12px] text-muted-ink">{c.callLabel}</span>
                    <span className="tnum block text-[15px] font-semibold text-ink">{p}</span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-muted-ink transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
                </a>
              </li>
            ))}
            {g.contactEmail && (
              <li>
                <a
                  href={`mailto:${g.contactEmail}?subject=${encodeURIComponent(c.emailSubject)}`}
                  className="group flex items-center gap-4 rounded-[8px] px-4 py-3.5 transition-colors hover:bg-paper"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-paper text-ink">
                    <Mail className="h-4 w-4" />
                  </span>
                  <span className="flex-1">
                    <span className="block text-[12px] text-muted-ink">{c.emailLabel}</span>
                    <span className="block text-[15px] font-semibold text-ink">
                      {g.contactEmail}
                    </span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-muted-ink transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
                </a>
              </li>
            )}
          </ul>

          <div className="flex items-center justify-between gap-4 border-t border-line bg-paper px-7 py-4">
            <span className="text-[13px] text-muted-ink">{c.dealerPrompt}</span>
            <a
              href={safeHref(c.dealerLink.href)}
              onClick={() => setOpen(false)}
              className="group inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink"
            >
              {c.dealerLink.label}
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </a>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

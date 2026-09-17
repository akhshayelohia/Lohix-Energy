// Shared helpers for the public lead forms.

/** Local date as YYYY-MM-DD, for date inputs' `max`. */
export function todayISO(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/**
 * After a failed submit, bring the first invalid field into view and focus it.
 * Runs on the next frame so React has rendered the aria-invalid flags.
 */
export function focusFirstInvalid(form: HTMLFormElement | null) {
  if (!form) return;
  requestAnimationFrame(() => {
    const el = form.querySelector<HTMLElement>('[aria-invalid="true"]');
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    const target = el.matches("input, select, textarea")
      ? el
      : el.querySelector<HTMLElement>("button, input");
    target?.focus({ preventScroll: true });
  });
}

/** Database/network errors are not for visitors; keep the message human. */
export function friendlySubmitError(error: { message?: string; code?: string }): string {
  if (error.code === "23514" || /check constraint|violates/i.test(error.message ?? "")) {
    return "Some details don't look right. Please check them and try again.";
  }
  if (/fetch|network|failed to/i.test(error.message ?? "")) {
    return "We couldn't reach our server. Check your connection and try again.";
  }
  return "Something went wrong on our side. Please try again in a moment.";
}

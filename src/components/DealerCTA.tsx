import { useEffect, useId, useRef, useState } from "react";
import { focusFirstInvalid, friendlySubmitError } from "@/lib/forms";
import { z } from "zod";
import { ArrowRight, Check, Loader2, AlertCircle } from "lucide-react";
import { useContent } from "@/cms/useContent";
import { supabase } from "@/integrations/supabase/client";
import { Reveal } from "@/components/Reveal";
import { Eyebrow } from "@/components/system/Eyebrow";

const dealerSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(80),
  phone: z
    .string()
    .trim()
    .regex(/^[+0-9\s-]{7,20}$/, "Enter a valid phone number"),
  city: z.string().trim().min(2, "City required").max(60),
});

const FIELDS = [
  {
    key: "name",
    label: "Full name",
    placeholder: "Your name",
    type: "text",
    autoComplete: "name",
    autoCapitalize: "words",
  },
  {
    key: "phone",
    label: "Phone",
    placeholder: "+91 9xxxxxxxxx",
    type: "tel",
    autoComplete: "tel",
    autoCapitalize: "none",
  },
  {
    key: "city",
    label: "City",
    placeholder: "Kolkata",
    type: "text",
    autoComplete: "address-level2",
    autoCapitalize: "words",
  },
] as const;

type Key = (typeof FIELDS)[number]["key"];

export function DealerCTA({ prefillCity }: { prefillCity?: string }) {
  const c = useContent("dealer_cta");
  const uid = useId();
  const [form, setForm] = useState({ name: "", phone: "", city: "" });

  useEffect(() => {
    if (prefillCity) setForm((f) => ({ ...f, city: prefillCity }));
  }, [prefillCity]);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<Key, string>>>({});
  const formRef = useRef<HTMLFormElement>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = dealerSchema.safeParse(form);
    if (!parsed.success) {
      const next: Partial<Record<Key, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as Key;
        if (key && !next[key]) next[key] = issue.message;
      }
      setErrors(next);
      focusFirstInvalid(formRef.current);
      return;
    }
    setErrors({});
    setSubmitting(true);
    const { error } = await supabase.from("dealer_enquiries").insert(parsed.data);
    setSubmitting(false);
    if (error) {
      setError(friendlySubmitError(error));
      return;
    }
    setSubmitted(true);
  }

  return (
    <section id="dealer" className="section bg-paper">
      <div className="container-x">
        <Reveal className="panel-dark px-6 py-10 sm:px-10 sm:py-14 md:px-14 md:py-16">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="stage-grid absolute inset-0 opacity-70" />
            <div className="absolute -right-32 -top-40 h-[480px] w-[520px] rounded-full bg-lohix-lime/[0.16] blur-[140px]" />
          </div>

          <div className="relative grid gap-12 md:grid-cols-2 md:gap-16">
            <div>
              <Eyebrow tone="dark">{c.eyebrow}</Eyebrow>
              <h2 className="t-h2 mt-5 text-white">
                {c.headingPrefix} <span className="text-lohix-lime">{c.headingHighlight}</span>.
              </h2>
              <p className="t-body mt-5 max-w-md text-white/55">{c.body}</p>
              <ul className="mt-8 space-y-3">
                {c.benefits.map((p) => (
                  <li key={p} className="flex items-center gap-3 text-[14px] text-white/80">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-lohix-lime/15">
                      <Check className="h-3 w-3 text-lohix-lime" />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            <form
              ref={formRef}
              onSubmit={submit}
              noValidate
              className="rounded-[12px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur md:p-8"
            >
              <div className="space-y-6">
                {FIELDS.map((field) => (
                  <div key={field.key}>
                    <label htmlFor={`${uid}-${field.key}`} className="t-label text-white/45">
                      {field.label}
                    </label>
                    <input
                      id={`${uid}-${field.key}`}
                      type={field.type}
                      placeholder={field.placeholder}
                      autoComplete={field.autoComplete}
                      autoCapitalize={field.autoCapitalize}
                      inputMode={field.type === "tel" ? "tel" : undefined}
                      enterKeyHint={field.key === "city" ? "send" : "next"}
                      aria-invalid={errors[field.key] ? true : undefined}
                      aria-describedby={errors[field.key] ? `${uid}-${field.key}-error` : undefined}
                      value={form[field.key]}
                      onChange={(e) => {
                        setForm({ ...form, [field.key]: e.target.value });
                        if (errors[field.key]) setErrors({ ...errors, [field.key]: undefined });
                      }}
                      maxLength={120}
                      className="mt-2 w-full rounded-none border-b border-white/15 bg-transparent py-3 text-[16px] text-white outline-none transition-colors placeholder:text-white/25 focus:border-lohix-lime aria-[invalid=true]:border-red-400 md:py-2.5 md:text-[15px]"
                    />
                    {errors[field.key] && (
                      <p
                        id={`${uid}-${field.key}-error`}
                        className="mt-2 flex items-center gap-1.5 text-[12.5px] text-red-300"
                      >
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {errors[field.key]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="submit"
                disabled={submitted || submitting}
                className="btn btn-lime mt-8 w-full disabled:opacity-60"
              >
                {submitted ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Request received
                  </>
                ) : submitting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <>
                    {c.buttonLabel}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
              {error && (
                <p
                  role="alert"
                  className="mt-3 flex items-center justify-center gap-1.5 text-[12.5px] text-red-300"
                >
                  <AlertCircle className="h-3.5 w-3.5" /> {error}
                </p>
              )}
              <p className="mt-4 text-center text-[11.5px] text-white/40">{c.footnote}</p>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

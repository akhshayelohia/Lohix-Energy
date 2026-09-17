import { useId, useRef, useState } from "react";
import { focusFirstInvalid, friendlySubmitError, todayISO } from "@/lib/forms";
import { z } from "zod";
import { Check, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useContent } from "@/cms/useContent";
import { Reveal } from "@/components/Reveal";
import { Eyebrow } from "@/components/system/Eyebrow";
import { Accent } from "@/components/system/SectionHeader";
import { cn } from "@/lib/utils";

const schema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(80),
  email: z.string().trim().email("Enter a valid email").max(160),
  phone: z
    .string()
    .trim()
    .regex(/^[+0-9\s-]{10,15}$/, "Enter a valid phone number"),
  serial: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9-]{4,32}$/, "Use 4–32 letters, numbers or dashes, as printed on the pack"),
  purchaseDate: z
    .string()
    .min(1, "Select purchase date")
    .refine((d) => d <= todayISO(), "Purchase date can't be in the future"),
  dealer: z.string().trim().min(2, "Dealer name required").max(80),
  city: z.string().trim().min(2, "City required").max(60),
  state: z.string().trim().min(2, "Select your state").max(40),
  vehicleType: z.string().min(1, "Select vehicle type"),
  consent: z.literal(true, { errorMap: () => ({ message: "Please accept the terms" }) }),
});

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  serial: string;
  purchaseDate: string;
  dealer: string;
  city: string;
  state: string;
  vehicleType: string;
  consent: boolean;
};

const initial: FormState = {
  fullName: "",
  email: "",
  phone: "",
  serial: "",
  purchaseDate: "",
  dealer: "",
  city: "",
  state: "",
  vehicleType: "",
  consent: false,
};

const STATES = ["West Bengal", "Bihar", "Jharkhand", "Odisha", "Assam", "Sikkim", "Other"];

const VEHICLES = ["E-Rickshaw", "E-Loader", "E-Auto", "EV 2W", "Other"];

// 16px on phones stops iOS from zooming into the field on focus.
const fieldBase =
  "mt-2 w-full rounded-none border-b border-line bg-transparent py-3 text-[16px] text-ink outline-none transition-colors placeholder:text-muted-ink/50 focus:border-lohix-lime-deep aria-[invalid=true]:border-red-500 md:py-2.5 md:text-[15px]";

export function WarrantyForm() {
  const copy = useContent("warranty");
  const uid = useId();
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    // Clear a field's error as soon as it's being corrected.
    setErrors((e) => (e[k] ? { ...e, [k]: "" } : e));
  };
  const formRef = useRef<HTMLFormElement>(null);
  const id = (k: string) => `${uid}-${k}`;
  const invalid = (k: keyof FormState) => ({
    "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": errors[k] ? `${id(k)}-error` : undefined,
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    const result = schema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as string;
        if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      focusFirstInvalid(formRef.current);
      return;
    }
    setErrors({});
    setSubmitting(true);
    const { error } = await supabase.from("warranty_submissions").insert({
      full_name: form.fullName.trim(),
      email: form.email,
      phone: form.phone,
      serial: form.serial.trim().toUpperCase(),
      purchase_date: form.purchaseDate,
      dealer: form.dealer,
      city: form.city,
      state: form.state,
      vehicle_type: form.vehicleType,
    });
    setSubmitting(false);
    if (error) {
      setSubmitError(friendlySubmitError(error));
      return;
    }
    setSubmitted(true);
  };

  return (
    <section id="warranty" className="section border-y border-line bg-paper-2">
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="self-start lg:sticky lg:top-28 lg:col-span-5">
          <Eyebrow>{copy.eyebrow}</Eyebrow>
          <h2 className="t-h2 mt-5 text-balance text-ink">
            {copy.headingPrefix} <Accent>{`${copy.headingHighlight} ${copy.headingSuffix}`}</Accent>
          </h2>
          <p className="t-body mt-5 max-w-md text-muted-ink">{copy.body}</p>

          <ul className="mt-8 space-y-3.5">
            {copy.bullets.map((p) => (
              <li key={p} className="flex items-start gap-3 text-[14px] text-ink/80">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-lohix-lime/30">
                  <Check className="h-3 w-3 text-lohix-lime-deep" />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.08} className="card bg-paper p-6 sm:p-8 md:p-10 lg:col-span-7">
          {submitted ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-lohix-lime">
                <Check className="h-6 w-6 text-ink" />
              </div>
              <h3 className="mt-6 text-[26px] font-semibold tracking-[-0.025em]">
                Warranty registered
              </h3>
              <p className="t-small mt-2 max-w-sm text-muted-ink">
                Thanks, {form.fullName.trim().split(" ")[0]}. We've recorded serial{" "}
                <span className="tnum text-ink">{form.serial.trim().toUpperCase()}</span>. Keep your
                purchase invoice safe for any claim.
              </p>
              <button
                type="button"
                onClick={() => {
                  setForm(initial);
                  setSubmitted(false);
                }}
                className="btn btn-outline btn-sm mt-8"
              >
                Register another pack
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-8">
              <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
                <Field id={id("fullName")} label="Full name" error={errors.fullName}>
                  <input
                    id={id("fullName")}
                    className={fieldBase}
                    placeholder="Your full name"
                    autoComplete="name"
                    autoCapitalize="words"
                    enterKeyHint="next"
                    {...invalid("fullName")}
                    value={form.fullName}
                    maxLength={80}
                    onChange={(e) => set("fullName", e.target.value)}
                  />
                </Field>

                <Field id={id("email")} label="Email" error={errors.email}>
                  <input
                    id={id("email")}
                    type="email"
                    className={fieldBase}
                    placeholder="you@example.com"
                    autoComplete="email"
                    autoCapitalize="none"
                    spellCheck={false}
                    enterKeyHint="next"
                    {...invalid("email")}
                    value={form.email}
                    maxLength={160}
                    onChange={(e) => set("email", e.target.value)}
                  />
                </Field>

                <Field id={id("phone")} label="Phone" error={errors.phone}>
                  <input
                    id={id("phone")}
                    type="tel"
                    className={fieldBase}
                    placeholder="+91 9xxxxxxxxx"
                    autoComplete="tel"
                    inputMode="tel"
                    enterKeyHint="next"
                    {...invalid("phone")}
                    value={form.phone}
                    maxLength={15}
                    onChange={(e) => set("phone", e.target.value)}
                  />
                </Field>

                <Field id={id("serial")} label="Battery serial no." error={errors.serial}>
                  <input
                    id={id("serial")}
                    className={fieldBase}
                    placeholder="e.g. LX48-000123"
                    autoComplete="off"
                    autoCapitalize="characters"
                    autoCorrect="off"
                    spellCheck={false}
                    maxLength={32}
                    enterKeyHint="next"
                    {...invalid("serial")}
                    value={form.serial}
                    onChange={(e) => set("serial", e.target.value)}
                  />
                </Field>

                <Field id={id("purchaseDate")} label="Purchase date" error={errors.purchaseDate}>
                  <input
                    id={id("purchaseDate")}
                    type="date"
                    max={todayISO()}
                    className={cn(fieldBase, "min-h-[46px] md:min-h-0")}
                    {...invalid("purchaseDate")}
                    value={form.purchaseDate}
                    onChange={(e) => set("purchaseDate", e.target.value)}
                  />
                </Field>

                <Field id={id("dealer")} label="Dealer name" error={errors.dealer}>
                  <input
                    id={id("dealer")}
                    className={fieldBase}
                    placeholder="LOHIX authorized dealer"
                    autoComplete="off"
                    autoCapitalize="words"
                    enterKeyHint="next"
                    {...invalid("dealer")}
                    value={form.dealer}
                    maxLength={80}
                    onChange={(e) => set("dealer", e.target.value)}
                  />
                </Field>

                <Field id={id("city")} label="City" error={errors.city}>
                  <input
                    id={id("city")}
                    className={fieldBase}
                    placeholder="Kolkata"
                    autoComplete="address-level2"
                    autoCapitalize="words"
                    enterKeyHint="next"
                    {...invalid("city")}
                    value={form.city}
                    maxLength={60}
                    onChange={(e) => set("city", e.target.value)}
                  />
                </Field>

                <Field id={id("state")} label="State" error={errors.state}>
                  <select
                    id={id("state")}
                    className={cn(fieldBase, "cursor-pointer appearance-none")}
                    autoComplete="address-level1"
                    {...invalid("state")}
                    value={form.state}
                    onChange={(e) => set("state", e.target.value)}
                  >
                    <option value="">Select state</option>
                    {STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </Field>

                <div className="sm:col-span-2">
                  <Field id={id("vehicleType")} label="Vehicle type" error={errors.vehicleType}>
                    <div
                      className="mt-3 flex flex-wrap gap-2"
                      role="radiogroup"
                      aria-label="Vehicle type"
                      {...invalid("vehicleType")}
                    >
                      {VEHICLES.map((v) => {
                        const active = form.vehicleType === v;
                        return (
                          <button
                            type="button"
                            key={v}
                            role="radio"
                            aria-checked={active}
                            onClick={() => set("vehicleType", v)}
                            className={cn(
                              "tap rounded-full border px-4 py-1.5 text-[12.5px] font-medium transition-colors",
                              active
                                ? "border-ink bg-ink text-lohix-lime"
                                : "border-line bg-paper-2 text-ink hover:border-ink/30",
                            )}
                          >
                            {v}
                          </button>
                        );
                      })}
                    </div>
                  </Field>
                </div>
              </div>

              <div>
                <label className="flex cursor-pointer select-none items-start gap-3 py-1 text-[13px] text-muted-ink md:text-[12.5px]">
                  <input
                    type="checkbox"
                    id={id("consent")}
                    checked={form.consent}
                    onChange={(e) => set("consent", e.target.checked)}
                    {...invalid("consent")}
                    className="mt-0.5 h-5 w-5 shrink-0 accent-lohix-lime md:h-4 md:w-4"
                  />
                  <span>
                    I confirm the information is accurate and agree to LOHIX warranty terms and
                    privacy policy.
                  </span>
                </label>
                {errors.consent && (
                  <ErrorText id={`${id("consent")}-error`}>{errors.consent}</ErrorText>
                )}
                {submitError && <ErrorText live>{submitError}</ErrorText>}
              </div>

              <div className="flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[12px] text-muted-ink">Takes ~60 seconds.</p>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-ink w-full disabled:opacity-60 sm:w-auto"
                >
                  {submitting ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <>
                      Register warranty
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}

function ErrorText({
  id,
  live,
  children,
}: {
  id?: string;
  live?: boolean;
  children: React.ReactNode;
}) {
  return (
    <p
      id={id}
      role={live ? "alert" : undefined}
      className="mt-2 flex items-start gap-1.5 text-[12.5px] leading-snug text-red-600"
    >
      <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" /> {children}
    </p>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id?: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="t-label text-muted-ink">
        {label}
      </label>
      {children}
      {error && <ErrorText id={id ? `${id}-error` : undefined}>{error}</ErrorText>}
    </div>
  );
}

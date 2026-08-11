import { useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { ShieldCheck, Check, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useContent } from "@/cms/useContent";

const schema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(80),
  email: z.string().trim().email("Enter a valid email").max(160),
  phone: z
    .string()
    .trim()
    .regex(/^[+0-9\s-]{10,15}$/, "Enter a valid phone number"),
  serial: z.string().trim().min(1, "Enter battery serial number"),
  purchaseDate: z.string().min(1, "Select purchase date"),
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

export function WarrantyForm() {
  const copy = useContent("warranty");
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

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
      return;
    }
    setErrors({});
    setSubmitting(true);
    const { error } = await supabase.from("warranty_submissions").insert({
      full_name: form.fullName,
      email: form.email,
      phone: form.phone,
      serial: form.serial,
      purchase_date: form.purchaseDate,
      dealer: form.dealer,
      city: form.city,
      state: form.state,
      vehicle_type: form.vehicleType,
    });
    setSubmitting(false);
    if (error) {
      setSubmitError(error.message);
      return;
    }
    setSubmitted(true);
  };

  const fieldBase =
    "w-full bg-transparent border-b border-line text-ink text-[14px] py-2.5 outline-none focus:border-ink transition-colors placeholder:text-muted-ink/50";
  const labelBase = "text-[10px] uppercase tracking-[0.18em] text-muted-ink";

  return (
    <section id="warranty" className="w-full bg-paper px-5 sm:px-6 py-16 sm:py-24 md:py-32">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-20"
        >
          {/* Left — copy */}
          <div className="lg:sticky lg:top-28 self-start">
            <div className="pill inline-flex items-center gap-2 px-3 py-1 hairline bg-paper-2 text-[10px] uppercase tracking-[0.2em] text-muted-ink">
              <ShieldCheck className="w-3 h-3 text-lohix-green" />
              {copy.eyebrow}
            </div>
            <h2 className="mt-5 font-sans text-[32px] sm:text-[40px] md:text-[52px] leading-[1] tracking-[-0.03em] uppercase font-bold">
              {copy.headingPrefix} <span className="text-lohix-green">{copy.headingHighlight}</span>{" "}
              {copy.headingSuffix}
            </h2>
            <p className="mt-4 text-[14px] text-muted-ink max-w-md leading-relaxed">{copy.body}</p>

            <ul className="mt-8 space-y-3">
              {copy.bullets.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-[13px] text-ink/80">
                  <span className="mt-1 w-3.5 h-3.5 rounded-full bg-lohix-lime/30 flex items-center justify-center shrink-0">
                    <Check className="w-2 h-2 text-lohix-green" />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </div>

          {/* Right — form */}
          <div className="rounded-[22px] sm:rounded-[28px] bg-paper-2 hairline p-5 sm:p-6 md:p-10">
            {submitted ? (
              <div className="min-h-[420px] flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 rounded-full bg-lohix-lime/20 flex items-center justify-center">
                  <Check className="w-6 h-6 text-lohix-green" />
                </div>
                <h3 className="mt-5 font-sans text-[28px] uppercase tracking-[-0.02em]">
                  Warranty registered
                </h3>
                <p className="mt-2 text-[13px] text-muted-ink max-w-sm">
                  A confirmation email is on its way to{" "}
                  <span className="text-ink">{form.email}</span>. Keep your serial number safe.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setForm(initial);
                    setSubmitted(false);
                  }}
                  className="pill mt-7 inline-flex items-center gap-2 hairline px-4 py-2 text-[12px] text-ink hover:bg-paper transition-colors"
                >
                  Register another pack
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="space-y-7">
                <div className="grid sm:grid-cols-2 gap-x-6 gap-y-6">
                  <Field label="Full name" error={errors.fullName} labelBase={labelBase}>
                    <input
                      className={fieldBase}
                      placeholder="Aishwarya Nirman"
                      value={form.fullName}
                      maxLength={80}
                      onChange={(e) => set("fullName", e.target.value)}
                    />
                  </Field>

                  <Field label="Email" error={errors.email} labelBase={labelBase}>
                    <input
                      type="email"
                      className={fieldBase}
                      placeholder="you@example.com"
                      value={form.email}
                      maxLength={160}
                      onChange={(e) => set("email", e.target.value)}
                    />
                  </Field>

                  <Field label="Phone" error={errors.phone} labelBase={labelBase}>
                    <input
                      type="tel"
                      className={fieldBase}
                      placeholder="+91 9xxxxxxxxx"
                      value={form.phone}
                      maxLength={15}
                      onChange={(e) => set("phone", e.target.value)}
                    />
                  </Field>

                  <Field label="Battery serial no." error={errors.serial} labelBase={labelBase}>
                    <input
                      className={fieldBase}
                      placeholder="Enter serial number"
                      value={form.serial}
                      onChange={(e) => set("serial", e.target.value)}
                    />
                  </Field>

                  <Field label="Purchase date" error={errors.purchaseDate} labelBase={labelBase}>
                    <input
                      type="date"
                      className={fieldBase}
                      value={form.purchaseDate}
                      onChange={(e) => set("purchaseDate", e.target.value)}
                    />
                  </Field>

                  <Field label="Dealer name" error={errors.dealer} labelBase={labelBase}>
                    <input
                      className={fieldBase}
                      placeholder="LOHIX authorized dealer"
                      value={form.dealer}
                      maxLength={80}
                      onChange={(e) => set("dealer", e.target.value)}
                    />
                  </Field>

                  <Field label="City" error={errors.city} labelBase={labelBase}>
                    <input
                      className={fieldBase}
                      placeholder="Kolkata"
                      value={form.city}
                      maxLength={60}
                      onChange={(e) => set("city", e.target.value)}
                    />
                  </Field>

                  <Field label="State" error={errors.state} labelBase={labelBase}>
                    <select
                      className={fieldBase + " appearance-none cursor-pointer"}
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
                    <Field label="Vehicle type" error={errors.vehicleType} labelBase={labelBase}>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {VEHICLES.map((v) => {
                          const active = form.vehicleType === v;
                          return (
                            <button
                              type="button"
                              key={v}
                              onClick={() => set("vehicleType", v)}
                              className={`pill px-3.5 py-1.5 text-[12px] hairline transition-colors ${
                                active
                                  ? "bg-ink text-paper-2 border-ink"
                                  : "bg-paper hover:bg-paper-2 text-ink"
                              }`}
                            >
                              {v}
                            </button>
                          );
                        })}
                      </div>
                    </Field>
                  </div>
                </div>

                <label className="flex items-start gap-3 text-[12px] text-muted-ink cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.consent}
                    onChange={(e) => set("consent", e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-lohix-green"
                  />
                  <span>
                    I confirm the information is accurate and agree to LOHIX warranty terms and
                    privacy policy.
                  </span>
                </label>
                {errors.consent && (
                  <p className="-mt-5 flex items-center gap-1.5 text-[11px] text-red-500">
                    <AlertCircle className="w-3 h-3" /> {errors.consent}
                  </p>
                )}

                {submitError && (
                  <p className="-mt-3 flex items-center gap-1.5 text-[11px] text-red-500">
                    <AlertCircle className="w-3 h-3" /> {submitError}
                  </p>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 border-t border-line">
                  <p className="text-[11px] text-muted-ink">Takes ~60 seconds.</p>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="pill inline-flex items-center justify-center gap-2 bg-ink text-paper-2 text-[13px] font-semibold px-5 py-3 hover:bg-lohix-green transition-colors w-full sm:w-auto disabled:opacity-60"
                  >
                    {submitting ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>
                        Register warranty
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Field({
  label,
  error,
  labelBase,
  children,
}: {
  label: string;
  error?: string;
  labelBase: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className={labelBase}>{label}</label>
      {children}
      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-[11px] text-red-500">
          <AlertCircle className="w-3 h-3" /> {error}
        </p>
      )}
    </div>
  );
}

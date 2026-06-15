import { useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { ArrowRight, Check, Loader2, AlertCircle } from "lucide-react";
import { useContent } from "@/cms/useContent";
import { supabase } from "@/integrations/supabase/client";

const dealerSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(80),
  phone: z
    .string()
    .trim()
    .regex(/^[+0-9\s-]{7,20}$/, "Enter a valid phone number"),
  city: z.string().trim().min(2, "City required").max(60),
});

export function DealerCTA() {
  const c = useContent("dealer_cta");
  const [form, setForm] = useState({ name: "", phone: "", city: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const onChange = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.target.value });

  async function submit() {
    setError(null);
    const parsed = dealerSchema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check your details");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("dealer_enquiries").insert(parsed.data);
    setSubmitting(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSubmitted(true);
  }

  return (
    <section id="dealer" className="w-full bg-paper px-5 sm:px-6 py-16 sm:py-24 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto relative rounded-[22px] sm:rounded-[28px] overflow-hidden bg-ink text-paper-2 p-6 sm:p-8 md:p-14"
      >
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-lohix-green/30 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-lohix-lime/20 blur-3xl" />

        <div className="relative grid md:grid-cols-2 gap-10">
          <div>
            <div className="inline-flex items-center gap-2 pill bg-paper-2/10 backdrop-blur px-3 py-1 text-xxs uppercase tracking-[0.2em] text-paper-2/80">
              <span className="w-1 h-1 rounded-full bg-lohix-lime" />
              {c.eyebrow}
            </div>
            <h2 className="mt-5 font-sans text-[32px] sm:text-[40px] md:text-[56px] leading-[1] tracking-[-0.03em]">
              {c.headingPrefix} <em className="italic text-lohix-lime">{c.headingHighlight}</em>.
            </h2>
            <p className="mt-4 text-[14px] text-paper-2/70 max-w-md">{c.body}</p>

            <ul className="mt-8 space-y-2.5">
              {c.benefits.map((p) => (
                <li key={p} className="flex items-center gap-2 text-[13px] text-paper-2/80">
                  <span className="w-4 h-4 rounded-full bg-lohix-lime/20 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-lohix-lime" />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative rounded-2xl bg-paper-2/[0.04] hairline border-paper-2/10 backdrop-blur p-5 md:p-6">
            <div className="space-y-3">
              {(["name", "phone", "city"] as const).map((field) => (
                <div key={field}>
                  <label className="text-xxs uppercase tracking-[0.15em] text-paper-2/50">
                    {field}
                  </label>
                  <input
                    type={field === "phone" ? "tel" : "text"}
                    placeholder={
                      field === "name" ? "Your name" : field === "phone" ? "+91 9xxxxxxxxx" : "City"
                    }
                    value={form[field]}
                    onChange={onChange(field)}
                    maxLength={120}
                    className="mt-1 w-full bg-transparent border-b border-paper-2/20 text-paper-2 text-[14px] py-2 outline-none focus:border-lohix-lime transition-colors placeholder:text-paper-2/30"
                  />
                </div>
              ))}
              <button
                onClick={submit}
                disabled={submitted || submitting}
                className="pill mt-4 w-full inline-flex items-center justify-center gap-2 bg-lohix-lime text-ink text-[13px] font-semibold py-3 hover:bg-paper-2 transition-colors disabled:opacity-60"
              >
                {submitted ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Request received
                  </>
                ) : submitting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    {c.buttonLabel}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
              {error && (
                <p className="flex items-center justify-center gap-1.5 text-[11px] text-red-300">
                  <AlertCircle className="w-3 h-3" /> {error}
                </p>
              )}
              <p className="text-xxs text-paper-2/40 text-center">{c.footnote}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

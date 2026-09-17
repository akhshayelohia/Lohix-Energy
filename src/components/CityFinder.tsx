import { useId, useState } from "react";
import { isPlausibleCity } from "@/lib/cityInterest";
import { ArrowRight, MapPin } from "lucide-react";

const titleCase = (s: string) =>
  s
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

// Captures the applicant's city and hands it to the application form.
type Copy = { question: string; hint: string; placeholder: string; button: string };

export function CityFinder({ onRequest, copy }: { onRequest: (city: string) => void; copy: Copy }) {
  const id = useId();
  const [q, setQ] = useState("");
  const city = titleCase(q);
  const ready = isPlausibleCity(city);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (ready) onRequest(city);
      }}
      className="card p-6 sm:p-8"
    >
      <label htmlFor={id} className="t-h3 block text-ink">
        {copy.question}
      </label>
      {copy.hint && <p className="t-small mt-1 text-muted-ink">{copy.hint}</p>}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-ink" />
          <input
            id={id}
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={copy.placeholder}
            autoComplete="address-level2"
            maxLength={60}
            enterKeyHint="go"
            autoCapitalize="words"
            className="w-full rounded-full border border-line bg-paper py-3.5 pl-11 pr-5 text-[16px] md:text-[15px] text-ink outline-none transition-colors placeholder:text-muted-ink/70 focus:border-ink"
          />
        </div>
        <button
          type="submit"
          disabled={!ready}
          className="btn btn-ink shrink-0 disabled:opacity-40"
        >
          {ready ? `${copy.button} ${city}`.trim() : "Continue"}
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </form>
  );
}

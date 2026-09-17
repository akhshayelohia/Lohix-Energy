import { supabase } from "@/integrations/supabase/client";

// Letters in any script, plus the punctuation real place names use.
const CITY = /^[\p{L}\p{M}\s.'()-]{2,60}$/u;

export function isPlausibleCity(city: string) {
  return CITY.test(city.trim());
}

/**
 * Records a city typed in the dealer page's "where do you operate" step.
 * Fire-and-forget: never blocks or breaks the visitor's flow, and each city is
 * counted once per browser session.
 */
export function recordCityInterest(city: string, source = "dealer_city_step") {
  const clean = city.trim().replace(/\s+/g, " ");
  if (!isPlausibleCity(clean)) return;

  const key = `lohix:city:${source}:${clean.toLowerCase()}`;
  try {
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
  } catch {
    // Storage blocked (private mode) — still record.
  }

  void supabase
    .from("city_interest")
    .insert({ city: clean, source })
    .then(({ error }) => {
      if (error && import.meta.env.DEV) console.warn("city_interest insert failed:", error.message);
    });
}

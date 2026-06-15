import { supabase } from "@/integrations/supabase/client";
import { DEFAULTS, type ContentMap, type SectionKey } from "./defaults";

/**
 * Server-safe fetch for a single CMS section, merged over defaults.
 * Used in route loaders so head() can read SEO fields from loaderData.
 * Falls back to defaults on any error (offline, RLS, etc.).
 */
export async function fetchSection<K extends SectionKey>(section: K): Promise<ContentMap[K]> {
  try {
    const { data, error } = await supabase
      .from("site_content")
      .select("data")
      .eq("section", section)
      .maybeSingle();
    if (error || !data?.data || typeof data.data !== "object" || Array.isArray(data.data)) {
      return DEFAULTS[section] as ContentMap[K];
    }
    return { ...DEFAULTS[section], ...(data.data as object) } as ContentMap[K];
  } catch {
    return DEFAULTS[section] as ContentMap[K];
  }
}

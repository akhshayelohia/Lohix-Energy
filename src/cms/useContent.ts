import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DEFAULTS, type ContentMap, type SectionKey } from "./defaults";

type Row = { section: string; data: unknown };

export const siteContentQueryKey = ["site_content"] as const;

export async function fetchAll(): Promise<Partial<Record<SectionKey, unknown>>> {
  const { data, error } = await supabase.from("site_content").select("section, data");
  if (error) throw error;
  const map: Partial<Record<SectionKey, unknown>> = {};
  (data as Row[]).forEach((r) => {
    map[r.section as SectionKey] = r.data;
  });
  return map;
}

export function useContent<K extends SectionKey>(section: K): ContentMap[K] {
  const { data } = useQuery({
    queryKey: ["site_content"],
    queryFn: fetchAll,
    staleTime: 30_000,
  });
  const remote = data?.[section];
  // Deep merge top-level: remote overrides default. Arrays from remote replace defaults entirely.
  if (remote && typeof remote === "object" && !Array.isArray(remote)) {
    return { ...DEFAULTS[section], ...(remote as object) } as ContentMap[K];
  }
  return DEFAULTS[section] as ContentMap[K];
}

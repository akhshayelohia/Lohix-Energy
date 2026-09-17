import { useQuery } from "@tanstack/react-query";
import { useLoaderData } from "@tanstack/react-router";
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

export type SiteContentSnapshot = {
  content: Partial<Record<SectionKey, unknown>>;
  fetchedAt: number;
};

/** Loads every section for the root route; never throws (falls back to defaults). */
export async function loadSiteContent(): Promise<SiteContentSnapshot> {
  try {
    return { content: await fetchAll(), fetchedAt: Date.now() };
  } catch {
    return { content: {}, fetchedAt: 0 };
  }
}

export function useContent<K extends SectionKey>(section: K): ContentMap[K] {
  // The root loader fetched the live content before the page rendered (on the
  // server for the first load), so server HTML and the first client render
  // already agree on it — no flash of default images or copy.
  const snapshot = useLoaderData({ from: "__root__" }) as SiteContentSnapshot | undefined;
  const { data } = useQuery({
    queryKey: siteContentQueryKey,
    queryFn: fetchAll,
    staleTime: 30_000,
    initialData: snapshot?.fetchedAt ? snapshot.content : undefined,
    initialDataUpdatedAt: snapshot?.fetchedAt,
  });
  const remote = data?.[section];
  // Deep merge top-level: remote overrides default. Arrays from remote replace defaults entirely.
  if (remote && typeof remote === "object" && !Array.isArray(remote)) {
    return { ...DEFAULTS[section], ...(remote as object) } as ContentMap[K];
  }
  return DEFAULTS[section] as ContentMap[K];
}

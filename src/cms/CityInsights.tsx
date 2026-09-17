import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Download, Loader2, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Range = 7 | 30 | 90 | 0;
const RANGES: { value: Range; label: string }[] = [
  { value: 7, label: "7 days" },
  { value: 30, label: "30 days" },
  { value: 90, label: "90 days" },
  { value: 0, label: "All time" },
];

type CityRow = {
  key: string;
  city: string;
  searches: number;
  applications: number;
  lastSeen: string;
};

const keyOf = (city: string) => city.trim().replace(/\s+/g, " ").toLowerCase();

const since = (days: Range) =>
  days ? new Date(Date.now() - days * 86_400_000).toISOString() : "1970-01-01T00:00:00Z";

// Where visitors say they operate (dealer page city step), alongside the
// cities dealer applications actually came from.
export function CityInsights() {
  const [range, setRange] = useState<Range>(30);

  const { data, isLoading, error } = useQuery({
    queryKey: ["city_insights", range],
    refetchInterval: 30000,
    queryFn: async () => {
      const from = since(range);
      const [interest, dealers] = await Promise.all([
        supabase
          .from("city_interest")
          .select("city, created_at")
          .gte("created_at", from)
          .order("created_at", { ascending: false })
          .limit(5000),
        supabase
          .from("dealer_enquiries")
          .select("city, created_at")
          .gte("created_at", from)
          .limit(5000),
      ]);
      if (interest.error) throw interest.error;
      if (dealers.error) throw dealers.error;
      return { interest: interest.data, dealers: dealers.data };
    },
  });

  const rows = useMemo<CityRow[]>(() => {
    if (!data) return [];
    const map = new Map<string, CityRow>();
    const touch = (city: string, at: string) => {
      const key = keyOf(city);
      const row = map.get(key) ?? {
        key,
        city: city.trim(),
        searches: 0,
        applications: 0,
        lastSeen: at,
      };
      if (at > row.lastSeen) row.lastSeen = at;
      map.set(key, row);
      return row;
    };
    data.interest.forEach((r) => touch(r.city, r.created_at).searches++);
    data.dealers.forEach((r) => touch(r.city, r.created_at).applications++);
    return [...map.values()].sort(
      (a, b) => b.searches - a.searches || b.applications - a.applications,
    );
  }, [data]);

  const totalSearches = data?.interest.length ?? 0;
  const totalApps = data?.dealers.length ?? 0;
  const max = Math.max(1, ...rows.map((r) => r.searches));
  const missingTable = error && /city_interest|relation|schema cache/i.test(error.message);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5">
        <div className="flex items-center gap-1 p-1 rounded-full border border-white/10 bg-white/[0.03]">
          {RANGES.map((r) => (
            <button
              key={r.value}
              onClick={() => setRange(r.value)}
              className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-colors ${
                range === r.value ? "bg-white text-ink" : "text-white/60 hover:text-white"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
        {rows.length > 0 && (
          <button
            onClick={() => exportRows(rows, range)}
            className="inline-flex items-center gap-1.5 text-white/60 hover:text-lohix-lime transition-colors text-[12px]"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="h-60 flex items-center justify-center">
          <Loader2 className="w-5 h-5 animate-spin text-white/40" />
        </div>
      ) : error ? (
        <div className="flex items-start gap-3 rounded-xl border border-amber-400/20 bg-amber-400/[0.06] p-5 text-[13px] text-amber-200/90">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <div>
            {missingTable ? (
              <>
                City tracking isn't switched on in the database yet. Run the migration{" "}
                <code className="text-amber-100">20260917140000_city_interest.sql</code> in the
                Supabase SQL editor, then refresh.
              </>
            ) : (
              <>Couldn't load city data: {error.message}</>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.08]">
            <Stat label="Cities" value={rows.length} />
            <Stat label="City-step entries" value={totalSearches} />
            <Stat label="Dealer applications" value={totalApps} />
          </div>

          {rows.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-center text-white/40">
              <MapPin className="w-7 h-7 mb-3" />
              <p className="text-[13px]">No cities recorded in this period yet.</p>
            </div>
          ) : (
            <div className="mt-6 overflow-hidden rounded-xl border border-white/[0.08]">
              <table className="w-full text-left text-[13px]">
                <thead className="bg-white/[0.03] text-[10px] uppercase tracking-[0.18em] text-white/40">
                  <tr>
                    <th className="px-5 py-3 font-medium">City</th>
                    <th className="px-5 py-3 font-medium">City step</th>
                    <th className="px-5 py-3 font-medium text-right">Applied</th>
                    <th className="hidden px-5 py-3 font-medium text-right sm:table-cell">
                      Last seen
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {rows.map((r) => (
                    <tr key={r.key} className="hover:bg-white/[0.02]">
                      <td className="px-5 py-3 font-medium text-white">{r.city}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-1.5 w-32 overflow-hidden rounded-full bg-white/[0.06]">
                            <div
                              className="h-full rounded-full bg-lohix-lime"
                              style={{ width: `${(r.searches / max) * 100}%` }}
                            />
                          </div>
                          <span className="tabular-nums text-white/70">
                            {r.searches}
                            {totalSearches > 0 && (
                              <span className="ml-1.5 text-white/35">
                                {Math.round((r.searches / totalSearches) * 100)}%
                              </span>
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums text-white/70">
                        {r.applications || "—"}
                      </td>
                      <td className="hidden px-5 py-3 text-right text-white/40 sm:table-cell">
                        {new Date(r.lastSeen).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p className="mt-4 text-[11px] text-white/35">
            "City step" counts each city once per visitor session. "Applied" counts dealer
            applications from that city. City names are grouped ignoring case and extra spaces.
          </p>
        </>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-[#0A0D0E] p-5">
      <div className="text-[26px] font-semibold tabular-nums text-white">{value}</div>
      <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/40">{label}</div>
    </div>
  );
}

function exportRows(rows: CityRow[], range: Range) {
  const esc = (v: string | number) => {
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [
    "city,city_step_entries,dealer_applications,last_seen",
    ...rows.map((r) => [r.city, r.searches, r.applications, r.lastSeen].map(esc).join(",")),
  ].join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `city-interest-${range ? `${range}d` : "all"}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

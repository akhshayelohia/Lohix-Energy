import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Loader2,
  Inbox,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Hash,
  Store,
  Car,
  Download,
  RadioTower,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Warranty = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  serial: string;
  purchase_date: string;
  dealer: string;
  city: string;
  state: string;
  vehicle_type: string;
  created_at: string;
};
type Dealer = {
  id: string;
  name: string;
  phone: string;
  city: string;
  created_at: string;
};

export function Submissions() {
  const [tab, setTab] = useState<"warranty" | "dealer">("warranty");
  // submissions auto-refresh every 15s via react-query refetchInterval

  return (
    <div className="max-w-[1100px] mx-auto p-10">
      <div className="flex items-end justify-between gap-6 flex-wrap pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-white/40">
            <span className="w-6 h-px bg-white/30" /> Inbox
            <span className="ml-2 inline-flex items-center gap-1 text-lohix-lime">
              <RadioTower className="w-3 h-3 animate-pulse" /> Live
            </span>
          </div>
          <h1 className="mt-3 font-sans text-[34px] font-bold uppercase tracking-[-0.02em]">
            Submissions
          </h1>
          <p className="mt-2 text-[13px] text-white/50 max-w-xl">
            Warranty registrations and dealer enquiries from the public site. Updates appear here in
            real time.
          </p>
        </div>
        <div className="flex items-center gap-1 p-1 rounded-full border border-white/10 bg-white/[0.03]">
          <TabBtn active={tab === "warranty"} onClick={() => setTab("warranty")}>
            Warranty
          </TabBtn>
          <TabBtn active={tab === "dealer"} onClick={() => setTab("dealer")}>
            Dealer enquiries
          </TabBtn>
        </div>
      </div>

      <div className="mt-8">{tab === "warranty" ? <WarrantyList /> : <DealerList />}</div>
    </div>
  );
}

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-[12px] font-medium transition-colors ${
        active ? "bg-lohix-lime text-ink" : "text-white/60 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function WarrantyList() {
  const { data, isLoading } = useQuery({
    queryKey: ["warranty_submissions"],
    refetchInterval: 15000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("warranty_submissions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return data as Warranty[];
    },
  });

  if (isLoading)
    return (
      <Center>
        <Loader2 className="w-5 h-5 animate-spin text-white/40" />
      </Center>
    );
  if (!data?.length) return <Empty label="No warranty registrations yet" />;

  return (
    <div className="space-y-3">
      <Toolbar count={data.length} onExport={() => exportCsv("warranty.csv", data)} />
      {data.map((w) => (
        <div
          key={w.id}
          className="rounded-xl border border-white/[0.08] bg-[#0A0D0E] p-5 hover:border-lohix-lime/30 transition-colors"
        >
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="text-[15px] font-semibold text-white">{w.full_name}</div>
              <div className="mt-1 text-[11px] text-white/40">
                {new Date(w.created_at).toLocaleString()}
              </div>
            </div>
            <span className="pill text-[10px] uppercase tracking-[0.18em] bg-lohix-lime/10 text-lohix-lime border border-lohix-lime/20 px-2.5 py-1">
              {w.vehicle_type}
            </span>
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-[12px]">
            <Row icon={Mail} value={w.email} />
            <Row icon={Phone} value={w.phone} />
            <Row icon={Hash} value={w.serial} />
            <Row icon={Calendar} value={new Date(w.purchase_date).toLocaleDateString()} />
            <Row icon={Store} value={w.dealer} />
            <Row icon={MapPin} value={`${w.city}, ${w.state}`} />
          </div>
        </div>
      ))}
    </div>
  );
}

function DealerList() {
  const { data, isLoading } = useQuery({
    queryKey: ["dealer_enquiries"],
    refetchInterval: 15000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("dealer_enquiries")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return data as Dealer[];
    },
  });

  if (isLoading)
    return (
      <Center>
        <Loader2 className="w-5 h-5 animate-spin text-white/40" />
      </Center>
    );
  if (!data?.length) return <Empty label="No dealer enquiries yet" />;

  return (
    <div className="space-y-3">
      <Toolbar count={data.length} onExport={() => exportCsv("dealer-enquiries.csv", data)} />
      {data.map((d) => (
        <div
          key={d.id}
          className="rounded-xl border border-white/[0.08] bg-[#0A0D0E] p-5 hover:border-lohix-lime/30 transition-colors"
        >
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="text-[15px] font-semibold text-white">{d.name}</div>
              <div className="mt-1 text-[11px] text-white/40">
                {new Date(d.created_at).toLocaleString()}
              </div>
            </div>
            <span className="pill text-[10px] uppercase tracking-[0.18em] bg-white/[0.06] text-white/70 border border-white/10 px-2.5 py-1">
              <Car className="w-3 h-3 inline mr-1" /> Dealer
            </span>
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12px]">
            <Row icon={Phone} value={d.phone} />
            <Row icon={MapPin} value={d.city} />
          </div>
        </div>
      ))}
    </div>
  );
}

function Row({ icon: Icon, value }: { icon: typeof Mail; value: string }) {
  return (
    <div className="flex items-center gap-2 text-white/70">
      <Icon className="w-3.5 h-3.5 text-white/30 shrink-0" />
      <span className="truncate">{value}</span>
    </div>
  );
}

function Center({ children }: { children: React.ReactNode }) {
  return <div className="h-60 flex items-center justify-center">{children}</div>;
}

function Empty({ label }: { label: string }) {
  return (
    <div className="h-60 flex flex-col items-center justify-center text-center text-white/40">
      <Inbox className="w-8 h-8 mb-3" />
      <p className="text-[13px]">{label}</p>
    </div>
  );
}

function Toolbar({ count, onExport }: { count: number; onExport: () => void }) {
  return (
    <div className="flex items-center justify-between text-[11px] text-white/40 uppercase tracking-[0.2em] pb-2">
      <span>
        {count} entr{count === 1 ? "y" : "ies"}
      </span>
      <button
        onClick={onExport}
        className="inline-flex items-center gap-1.5 text-white/60 hover:text-lohix-lime transition-colors normal-case tracking-normal text-[12px]"
      >
        <Download className="w-3.5 h-3.5" /> Export CSV
      </button>
    </div>
  );
}

function exportCsv(filename: string, rows: Record<string, unknown>[]) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const esc = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [headers.join(","), ...rows.map((r) => headers.map((h) => esc(r[h])).join(","))].join(
    "\n",
  );
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

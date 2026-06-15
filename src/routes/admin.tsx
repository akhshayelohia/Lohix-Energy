import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Lock,
  Mail,
  ArrowRight,
  LogOut,
  Save,
  Undo2,
  AlertCircle,
  CheckCircle2,
  Eye,
  ExternalLink,
  Loader2,
  Inbox,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  SECTIONS,
  SECTION_LABELS,
  SECTION_DESCRIPTIONS,
  DEFAULTS,
  type SectionKey,
} from "@/cms/defaults";
import { SCHEMAS } from "@/cms/schemas";
import { FormRenderer } from "@/cms/FormRenderer";
import { Submissions } from "@/cms/Submissions";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({
    meta: [{ title: "LOHIX · Content Studio" }, { name: "robots", content: "noindex, nofollow" }],
  }),
});

type Session = Awaited<ReturnType<typeof supabase.auth.getSession>>["data"]["session"];

function AdminPage() {
  const [session, setSession] = useState<Session>(null);
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) {
      setIsAdmin(false);
      return;
    }
    (async () => {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(!!data);
    })();
  }, [session]);

  if (!ready) {
    return (
      <div className="min-h-screen bg-[#0B0F10] flex items-center justify-center text-white/60">
        <Loader2 className="w-5 h-5 animate-spin" />
      </div>
    );
  }
  if (!session) return <AuthScreen />;
  if (!isAdmin) return <NotAdminScreen email={session.user.email ?? ""} />;
  return <Studio email={session.user.email ?? ""} />;
}

/* ---------- Auth ---------- */
function AuthScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0F10] text-white flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[680px] h-[520px] rounded-full bg-lohix-lime/[0.08] blur-[160px]" />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-[400px]"
      >
        <div className="flex items-center gap-2 mb-8">
          <img src="/logo_lohix.png" alt="LOHIX" className="h-6 w-auto invert" />
          <span className="text-[11px] uppercase tracking-[0.25em] text-white/40 pl-3 ml-3 border-l border-white/10">
            Content Studio
          </span>
        </div>
        <h1 className="font-sans text-[28px] font-bold tracking-[-0.02em] uppercase">
          Welcome back.
        </h1>
        <p className="mt-2 text-[13px] text-white/50">
          Sign in to edit the public site. Admin accounts are invite-only.
        </p>
        <form onSubmit={submit} className="mt-8 space-y-4">
          <AuthField icon={Mail} label="Email" type="email" value={email} onChange={setEmail} />
          <AuthField
            icon={Lock}
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
          />
          {error && (
            <div className="flex items-start gap-2 text-[12px] text-red-400 bg-red-500/[0.08] border border-red-500/20 rounded-lg p-3">
              <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="pill w-full inline-flex items-center justify-center gap-2 bg-lohix-lime text-ink text-[13px] font-semibold py-3 hover:bg-white transition-colors disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Sign in"}
            {!loading && <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

function AuthField({
  icon: Icon,
  label,
  type,
  value,
  onChange,
}: {
  icon: typeof Mail;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">{label}</span>
      <div className="mt-1.5 flex items-center gap-2 border-b border-white/15 focus-within:border-lohix-lime transition-colors">
        <Icon className="w-3.5 h-3.5 text-white/40" />
        <input
          type={type}
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent text-[14px] py-2 outline-none text-white placeholder:text-white/20"
        />
      </div>
    </label>
  );
}

function NotAdminScreen({ email }: { email: string }) {
  return (
    <div className="min-h-screen bg-[#0B0F10] text-white flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <AlertCircle className="w-8 h-8 text-lohix-lime mx-auto" />
        <h1 className="mt-5 font-sans text-[24px] uppercase tracking-[-0.02em]">No admin access</h1>
        <p className="mt-3 text-[13px] text-white/50">
          Signed in as <span className="text-white">{email}</span>. This account has not been
          granted admin rights.
        </p>
        <button
          onClick={() => supabase.auth.signOut()}
          className="pill mt-6 inline-flex items-center gap-2 border border-white/15 bg-white/[0.04] text-white/90 text-[13px] px-4 py-2 hover:bg-white/10 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" /> Sign out
        </button>
      </div>
    </div>
  );
}

/* ---------- Studio ---------- */
function Studio({ email }: { email: string }) {
  const [active, setActive] = useState<SectionKey | "__submissions">("__submissions");
  return (
    <div className="min-h-screen bg-[#0B0F10] text-white flex">
      <aside className="w-[300px] border-r border-white/[0.08] bg-[#0A0D0E] flex flex-col">
        <div className="p-6 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <img src="/logo_lohix.png" alt="LOHIX" className="h-5 w-auto invert" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-white/40 pl-3 ml-2 border-l border-white/10">
              Studio
            </span>
          </div>
          <p className="mt-4 text-[11px] text-white/40 truncate">{email}</p>
        </div>
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          <button
            onClick={() => setActive("__submissions")}
            className={`w-full text-left rounded-lg px-3 py-2.5 transition-colors flex items-start gap-2.5 ${
              active === "__submissions"
                ? "bg-lohix-lime/[0.1] text-lohix-lime border border-lohix-lime/20"
                : "text-white/60 hover:text-white hover:bg-white/[0.04] border border-transparent"
            }`}
          >
            <Inbox className="w-4 h-4 mt-0.5 shrink-0" />
            <div>
              <div className="text-[13px] font-medium">Submissions</div>
              <div className="text-[10px] text-white/30 mt-0.5">
                Warranty & dealer enquiries · live
              </div>
            </div>
          </button>
          <div className="px-3 pt-4 pb-1 text-[9px] uppercase tracking-[0.25em] text-white/25">
            Content
          </div>
          {SECTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setActive(s)}
              className={`w-full text-left rounded-lg px-3 py-2.5 transition-colors ${
                active === s
                  ? "bg-lohix-lime/[0.1] text-lohix-lime border border-lohix-lime/20"
                  : "text-white/60 hover:text-white hover:bg-white/[0.04] border border-transparent"
              }`}
            >
              <div className="text-[13px] font-medium">{SECTION_LABELS[s]}</div>
              <div className="text-[10px] text-white/30 mt-0.5 line-clamp-2">
                {SECTION_DESCRIPTIONS[s]}
              </div>
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-white/[0.08] space-y-1">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="w-full inline-flex items-center justify-between text-[12px] text-white/60 hover:text-white px-3 py-2 rounded-lg hover:bg-white/[0.04] transition-colors"
          >
            <span className="inline-flex items-center gap-2">
              <Eye className="w-3.5 h-3.5" /> Preview site
            </span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <button
            onClick={() => supabase.auth.signOut()}
            className="w-full inline-flex items-center gap-2 text-[12px] text-white/60 hover:text-red-400 px-3 py-2 rounded-lg hover:bg-white/[0.04] transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        {active === "__submissions" ? (
          <Submissions />
        ) : (
          <SectionEditor key={active} section={active} />
        )}
      </main>
    </div>
  );
}

/* ---------- Section editor (forms) ---------- */
function SectionEditor({ section }: { section: SectionKey }) {
  const qc = useQueryClient();
  const { data: row, isLoading } = useQuery({
    queryKey: ["site_content_row", section],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_content")
        .select("data, updated_at")
        .eq("section", section)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const initial = useMemo(() => {
    const remote = (row?.data as object | null) ?? null;
    return { ...(DEFAULTS[section] as object), ...(remote ?? {}) };
  }, [row, section]);

  const [draft, setDraft] = useState<any>(initial);
  const [status, setStatus] = useState<{ kind: "ok" | "err" | "idle"; msg?: string }>({
    kind: "idle",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDraft(initial);
    setStatus({ kind: "idle" });
  }, [initial]);

  const dirty = JSON.stringify(draft) !== JSON.stringify(initial);

  async function save() {
    setSaving(true);
    setStatus({ kind: "idle" });
    try {
      // Defense-in-depth: refuse to persist unsafe URL schemes (javascript:, data:, vbscript:, etc.)
      // in any field that looks like a link/href. Public pages still sanitize at render, but
      // catching it here keeps the database clean and surfaces the error to the editor.
      const SAFE_SCHEME = /^(https?:\/\/|mailto:|tel:|\/|#|\.\/|\.\.\/)/i;
      const offenders: string[] = [];
      const walk = (node: unknown, path: string) => {
        if (Array.isArray(node)) {
          node.forEach((v, i) => walk(v, `${path}[${i}]`));
        } else if (node && typeof node === "object") {
          for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
            walk(v, path ? `${path}.${k}` : k);
          }
        } else if (typeof node === "string" && /(^|\.)href$/i.test(path)) {
          const trimmed = node.trim();
          if (trimmed && !SAFE_SCHEME.test(trimmed)) offenders.push(path);
        }
      };
      walk(draft, "");
      if (offenders.length) {
        throw new Error(
          `Unsafe URL in ${offenders.join(", ")}. Use http(s), mailto:, tel:, or a relative path.`,
        );
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { error } = await supabase
        .from("site_content")
        .upsert({ section, data: draft, updated_by: user?.id ?? null }, { onConflict: "section" });
      if (error) throw error;
      await qc.invalidateQueries({ queryKey: ["site_content"] });
      await qc.invalidateQueries({ queryKey: ["site_content_row", section] });
      setStatus({ kind: "ok", msg: "Saved. Live on the site." });
    } catch (e) {
      setStatus({ kind: "err", msg: (e as Error).message });
    } finally {
      setSaving(false);
    }
  }

  function resetToDefault() {
    setDraft(DEFAULTS[section]);
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center text-white/40">
        <Loader2 className="w-5 h-5 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-[920px] mx-auto p-10">
      <div className="flex items-end justify-between gap-6 flex-wrap pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-white/40">
            <span className="w-6 h-px bg-white/30" /> Editing
          </div>
          <h1 className="mt-3 font-sans text-[34px] font-bold uppercase tracking-[-0.02em]">
            {SECTION_LABELS[section]}
          </h1>
          <p className="mt-2 text-[13px] text-white/50 max-w-xl">{SECTION_DESCRIPTIONS[section]}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={resetToDefault}
            className="pill inline-flex items-center gap-2 border border-white/15 bg-white/[0.04] text-white/80 text-[12px] px-4 py-2 hover:bg-white/[0.1] transition-colors"
          >
            <Undo2 className="w-3.5 h-3.5" /> Reset
          </button>
          <button
            onClick={save}
            disabled={!dirty || saving}
            className="pill inline-flex items-center gap-2 bg-lohix-lime text-ink text-[12px] font-semibold px-4 py-2 hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            Save changes
          </button>
        </div>
      </div>

      {status.kind !== "idle" && (
        <div className="mt-5">
          {status.kind === "ok" ? (
            <div className="flex items-center gap-2 text-[12px] text-lohix-lime bg-lohix-lime/[0.08] border border-lohix-lime/20 rounded-lg p-3">
              <CheckCircle2 className="w-3.5 h-3.5" /> {status.msg}
            </div>
          ) : (
            <div className="flex items-start gap-2 text-[12px] text-red-400 bg-red-500/[0.08] border border-red-500/20 rounded-lg p-3">
              <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <span>{status.msg}</span>
            </div>
          )}
        </div>
      )}

      <div className="mt-2 text-[10px] text-white/30 uppercase tracking-[0.2em]">
        {row?.updated_at
          ? `Last saved ${new Date(row.updated_at).toLocaleString()}`
          : "Not yet saved · using defaults"}
      </div>

      <div className="mt-8 rounded-2xl border border-white/[0.08] bg-[#0A0D0E] p-6 md:p-8">
        <FormRenderer schema={SCHEMAS[section]} value={draft} onChange={setDraft} />
      </div>

      <div className="sticky bottom-4 mt-8 flex justify-end">
        <button
          onClick={save}
          disabled={!dirty || saving}
          className="pill inline-flex items-center gap-2 bg-lohix-lime text-ink text-[13px] font-semibold px-5 py-3 hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_10px_40px_-12px_rgba(183,226,109,0.5)]"
        >
          {saving ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Save className="w-3.5 h-3.5" />
          )}
          {dirty ? "Save changes" : "Saved"}
        </button>
      </div>
    </div>
  );
}

import { useRef, useState } from "react";
import {
  Upload,
  X,
  Loader2,
  Image as ImageIcon,
  Video as VideoIcon,
  Link as LinkIcon,
  Ruler,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Kind = "image" | "video";

export function MediaPicker({
  value,
  onChange,
  kind,
  dimensions,
}: {
  value: string;
  onChange: (url: string) => void;
  kind: Kind;
  dimensions?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manual, setManual] = useState(false);

  async function upload(file: File) {
    setError(null);
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || (kind === "image" ? "png" : "mp4");
      const path = `${kind}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("site-media")
        .upload(path, file, { cacheControl: "31536000", upsert: false });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("site-media").getPublicUrl(path);
      onChange(data.publicUrl);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setUploading(false);
    }
  }

  const Icon = kind === "image" ? ImageIcon : VideoIcon;
  const hasMedia = !!value;

  return (
    <div className="space-y-2">
      <div className="rounded-lg border border-white/10 bg-black/30 overflow-hidden">
        {hasMedia ? (
          <div className="relative">
            {kind === "image" ? (
              <img
                src={value}
                alt=""
                className="w-full max-h-[220px] object-contain bg-[#0a0d0e]"
              />
            ) : (
              <video
                src={value}
                className="w-full max-h-[220px] object-contain bg-[#0a0d0e]"
                controls
                muted
              />
            )}
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 border border-white/15 text-white/80 hover:text-red-400 hover:border-red-400/40 flex items-center justify-center"
              aria-label="Remove"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-white/40">
            <Icon className="w-5 h-5 mb-2" />
            <span className="text-[12px]">No {kind} selected</span>
            {dimensions && (
              <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-lohix-lime/30 bg-lohix-lime/10 px-2.5 py-1 text-[10.5px] tracking-[0.1em] uppercase text-lohix-lime">
                <Ruler className="w-3 h-3" /> {dimensions}
              </span>
            )}
          </div>
        )}
      </div>

      {dimensions && (
        <div className="flex items-center gap-2 text-[11px] text-white/70">
          <span className="inline-flex items-center gap-1.5 rounded-md border border-lohix-lime/30 bg-lohix-lime/10 px-2 py-1 text-[10.5px] tracking-[0.08em] uppercase text-lohix-lime font-medium">
            <Ruler className="w-3 h-3" /> Recommended {dimensions}
          </span>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept={kind === "image" ? "image/*" : "video/*"}
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) upload(f);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/[0.04] text-white/85 text-[12px] px-3 py-1.5 hover:bg-white/[0.1] transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Upload className="w-3.5 h-3.5" />
          )}
          {uploading ? "Uploading…" : `Upload ${kind}`}
        </button>
        <button
          type="button"
          onClick={() => setManual((v) => !v)}
          className="inline-flex items-center gap-2 rounded-md border border-white/10 text-white/60 text-[12px] px-3 py-1.5 hover:text-white hover:border-white/20 transition-colors"
        >
          <LinkIcon className="w-3.5 h-3.5" /> {manual ? "Hide URL" : "Paste URL"}
        </button>
      </div>

      {manual && (
        <input
          type="url"
          placeholder={`https://… (${kind} url)`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-black/30 border border-white/10 rounded-md text-[12px] text-white/90 px-3 py-2 outline-none focus:border-lohix-lime/50"
        />
      )}

      {error && <p className="text-[11px] text-red-400">{error}</p>}
    </div>
  );
}

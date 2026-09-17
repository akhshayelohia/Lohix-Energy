import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { MediaPicker } from "./MediaPicker";
import { ICON_OPTIONS, type Field } from "./schemas";
import { getIcon } from "./icons";

type Value = unknown;

function setAt(obj: any, path: (string | number)[], value: Value): any {
  if (path.length === 0) return value;
  const [head, ...rest] = path;
  if (Array.isArray(obj)) {
    const copy = obj.slice();
    copy[head as number] = setAt(copy[head as number], rest, value);
    return copy;
  }
  return { ...(obj ?? {}), [head]: setAt(obj?.[head as string], rest, value) };
}

function getAt(obj: any, path: (string | number)[]): any {
  return path.reduce((acc, k) => (acc == null ? acc : acc[k as any]), obj);
}

export function FormRenderer({
  schema,
  value,
  onChange,
}: {
  schema: Field[];
  value: any;
  onChange: (next: any) => void;
}) {
  return (
    <div className="space-y-6">
      {schema.map((f) => (
        <FieldView
          key={f.key}
          field={f}
          value={value?.[f.key]}
          onChange={(v) => onChange({ ...(value ?? {}), [f.key]: v })}
        />
      ))}
    </div>
  );
}

function FieldShell({
  label,
  help,
  children,
}: {
  label: string;
  help?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label className="text-[11px] uppercase tracking-[0.18em] text-white/55 font-medium">
          {label}
        </label>
        {help && <span className="text-[10px] text-white/30 text-right max-w-[60%]">{help}</span>}
      </div>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function FieldView({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: any;
  onChange: (v: any) => void;
}) {
  const { type, label, help } = field;

  if (type === "text" || type === "url") {
    return (
      <FieldShell label={label} help={help}>
        <input
          type={type === "url" ? "url" : "text"}
          value={value ?? ""}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-black/30 border border-white/10 rounded-md text-[13px] text-white/95 px-3 py-2 outline-none focus:border-lohix-lime/50 transition-colors"
        />
      </FieldShell>
    );
  }

  if (type === "textarea") {
    return (
      <FieldShell label={label} help={help}>
        <textarea
          rows={field.rows ?? 3}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-black/30 border border-white/10 rounded-md text-[13px] text-white/95 px-3 py-2 outline-none focus:border-lohix-lime/50 transition-colors leading-relaxed resize-y"
        />
      </FieldShell>
    );
  }

  if (type === "color") {
    return (
      <FieldShell label={label} help={help}>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={value || "#B7E26D"}
            onChange={(e) => onChange(e.target.value)}
            className="w-12 h-9 rounded-md bg-transparent border border-white/10 cursor-pointer"
          />
          <input
            type="text"
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 bg-black/30 border border-white/10 rounded-md text-[13px] text-white/95 font-mono px-3 py-2 outline-none focus:border-lohix-lime/50"
          />
        </div>
      </FieldShell>
    );
  }

  if (type === "select") {
    return (
      <FieldShell label={label} help={help}>
        <select
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-black/30 border border-white/10 rounded-md text-[13px] text-white/95 px-3 py-2 outline-none focus:border-lohix-lime/50"
        >
          {(field.options ?? []).map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </FieldShell>
    );
  }

  if (type === "icon") {
    const Icon = getIcon(value ?? "Zap");
    return (
      <FieldShell label={label} help={help}>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-md border border-white/10 bg-black/30 flex items-center justify-center">
            <Icon className="w-4 h-4 text-lohix-lime" />
          </div>
          <select
            value={value ?? "Zap"}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 bg-black/30 border border-white/10 rounded-md text-[13px] text-white/95 px-3 py-2 outline-none focus:border-lohix-lime/50"
          >
            {ICON_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
      </FieldShell>
    );
  }

  if (type === "image" || type === "video") {
    return (
      <FieldShell label={label} help={help}>
        <MediaPicker
          value={value ?? ""}
          onChange={onChange}
          kind={type}
          dimensions={field.dimensions}
        />
      </FieldShell>
    );
  }

  if (type === "group") {
    return (
      <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-4">
        <div className="text-[11px] uppercase tracking-[0.18em] text-white/55 font-medium mb-3">
          {label}
        </div>
        <div className="space-y-4">
          {(field.fields ?? []).map((sub) => (
            <FieldView
              key={sub.key}
              field={sub}
              value={value?.[sub.key]}
              onChange={(v) => onChange({ ...(value ?? {}), [sub.key]: v })}
            />
          ))}
        </div>
      </div>
    );
  }

  if (type === "list") {
    return <ListField field={field} value={value} onChange={onChange} />;
  }

  return null;
}

function ListField({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: any;
  onChange: (v: any) => void;
}) {
  const arr: any[] = Array.isArray(value) ? value : [];
  const [open, setOpen] = useState<Record<number, boolean>>({});

  function update(i: number, v: any) {
    const next = arr.slice();
    next[i] = v;
    onChange(next);
  }
  function remove(i: number) {
    const next = arr.slice();
    next.splice(i, 1);
    onChange(next);
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    const next = arr.slice();
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }
  function add() {
    if (field.itemType === "text") {
      onChange([...arr, ""]);
    } else {
      const blank: Record<string, any> = {};
      (field.fields ?? []).forEach((f) => {
        blank[f.key] = f.type === "list" ? [] : f.type === "group" ? {} : "";
      });
      onChange([...arr, blank]);
    }
  }

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 mb-2">
        <label className="text-[11px] uppercase tracking-[0.18em] text-white/55 font-medium">
          {field.label}
        </label>
        {field.help && <span className="text-[10px] text-white/30">{field.help}</span>}
      </div>
      <div className="space-y-2">
        {arr.map((item, i) => {
          const isOpen = open[i] ?? !field.collapsed;
          return (
            <div key={i} className="rounded-lg border border-white/[0.07] bg-white/[0.02]">
              <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.05]">
                <button
                  type="button"
                  onClick={() => setOpen({ ...open, [i]: !isOpen })}
                  className="flex items-center gap-2 text-[12px] text-white/75 hover:text-white"
                >
                  {isOpen ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                  <span className="text-white/40">
                    {field.itemLabel ?? "Item"} {i + 1}
                  </span>
                  {field.itemType === "group" && (
                    <span className="text-white/85 truncate max-w-[260px]">
                      {item?.title ||
                        item?.label ||
                        item?.k ||
                        item?.name ||
                        (item?.voltage ? `LOHIX ${item.voltage} ${item.capacity ?? ""}` : "") ||
                        item?.alt ||
                        ""}
                    </span>
                  )}
                  {field.itemType === "text" && (
                    <span className="text-white/85 truncate max-w-[320px]">{item}</span>
                  )}
                </button>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    className="p-1.5 text-white/40 hover:text-white"
                    aria-label="Move up"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    className="p-1.5 text-white/40 hover:text-white"
                    aria-label="Move down"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    className="p-1.5 text-white/40 hover:text-red-400"
                    aria-label="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              {isOpen && (
                <div className="p-3 space-y-4">
                  {field.itemType === "text" ? (
                    <input
                      type="text"
                      value={item ?? ""}
                      onChange={(e) => update(i, e.target.value)}
                      className="w-full bg-black/30 border border-white/10 rounded-md text-[13px] text-white/95 px-3 py-2 outline-none focus:border-lohix-lime/50"
                    />
                  ) : (
                    (field.fields ?? []).map((sub) => (
                      <FieldView
                        key={sub.key}
                        field={sub}
                        value={item?.[sub.key]}
                        onChange={(v) => update(i, { ...(item ?? {}), [sub.key]: v })}
                      />
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <button
        type="button"
        onClick={add}
        className="mt-3 inline-flex items-center gap-2 text-[12px] text-lohix-lime hover:text-white border border-lohix-lime/30 hover:border-white/30 rounded-md px-3 py-1.5 transition-colors"
      >
        <Plus className="w-3.5 h-3.5" /> Add {field.itemLabel ?? "item"}
      </button>
    </div>
  );
}

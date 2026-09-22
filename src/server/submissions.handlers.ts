// Server-only: wires the submission core to Supabase, the CMS copy and Resend.
// Only referenced from inside createServerFn handlers (src/lib/submissions/submit.ts),
// so none of this reaches the browser bundle.

import { getRequestIP } from "@tanstack/react-start/server";
import { supabase } from "@/integrations/supabase/client";
import { fetchSection } from "@/cms/fetchSection";
import { readEmailConfig, sendEmail } from "@/lib/email/send";
import { HONEYPOT_FIELD, type SubmitResult } from "@/lib/submissions/schemas";
import { processDealer, processWarranty, rateLimited, type Deps } from "./submissions.core";

export type Payload = Record<string, unknown>;

async function buildDeps(): Promise<Deps> {
  const config = readEmailConfig();
  const [emails, global] = await Promise.all([fetchSection("emails"), fetchSection("global")]);
  const teamTo = (config.teamTo ?? global.contactEmail ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter((s) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s));
  return {
    insert: async (table, row) => {
      // Row shapes are fixed per table in submissions.core.
      const { error } = await supabase.from(table).insert(row as never);
      return { error };
    },
    send: (msg) => sendEmail(msg, config),
    copy: emails,
    teamTo,
  };
}

const TOO_MANY: SubmitResult = {
  ok: false,
  error: "You've sent a few of these already. Please wait a few minutes and try again.",
};

function guard(form: string, data: Payload): SubmitResult | null {
  // Bots fill the hidden field; pretend it worked and do nothing.
  if (typeof data[HONEYPOT_FIELD] === "string" && data[HONEYPOT_FIELD]) {
    return { ok: true, emailed: false };
  }
  const ip = getRequestIP({ xForwardedFor: true }) ?? "unknown";
  return rateLimited(`${form}:${ip}`) ? TOO_MANY : null;
}

export async function handleWarranty(data: Payload): Promise<SubmitResult> {
  return guard("warranty", data) ?? processWarranty(data, await buildDeps());
}

export async function handleDealer(data: Payload): Promise<SubmitResult> {
  return guard("dealer", data) ?? processDealer(data, await buildDeps());
}

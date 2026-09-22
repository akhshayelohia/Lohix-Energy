// Framework-free core of the form submissions: validate → save → email.
// The server functions in ./submissions.ts wire this to Supabase and Resend;
// tests call it directly with fakes.

import {
  dealerSchema,
  firstFieldErrors,
  warrantySchema,
  type DealerInput,
  type SubmitResult,
  type WarrantyInput,
} from "@/lib/submissions/schemas";
import {
  dealerCustomerEmail,
  dealerTeamEmail,
  warrantyCustomerEmail,
  warrantyTeamEmail,
  type EmailCopy,
} from "@/lib/email/templates";
import type { OutgoingEmail, SendOutcome } from "@/lib/email/send";

type DbError = { message?: string; code?: string } | null;

export type Deps = {
  insert: (
    table: "warranty_submissions" | "dealer_enquiries",
    row: Record<string, unknown>,
  ) => Promise<{ error: DbError }>;
  send: (msg: OutgoingEmail) => Promise<SendOutcome>;
  copy: EmailCopy;
  teamTo: string[];
};

const FRIENDLY_DB_ERROR = "Some details don't look right. Please check them and try again.";
const FRIENDLY_SERVER_ERROR = "Something went wrong on our side. Please try again in a moment.";

function dbErrorMessage(error: NonNullable<DbError>) {
  const m = error.message ?? "";
  return error.code === "23514" || /check constraint|violates|row-level security/i.test(m)
    ? FRIENDLY_DB_ERROR
    : FRIENDLY_SERVER_ERROR;
}

/** Sends the customer copy and the team notification. Never throws. */
async function notify(deps: Deps, customer: OutgoingEmail, team: OutgoingEmail) {
  const [c, t] = await Promise.allSettled([deps.send(customer), deps.send(team)]);
  const ok = (r: PromiseSettledResult<SendOutcome>) => r.status === "fulfilled" && r.value.sent;
  if (t.status === "fulfilled" && !t.value.sent && t.value.reason !== "not-configured") {
    console.error("[submissions] team notification not sent:", t.value.reason);
  }
  return ok(c);
}

export async function processWarranty(raw: unknown, deps: Deps): Promise<SubmitResult> {
  const parsed = warrantySchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please check the highlighted fields.",
      fieldErrors: firstFieldErrors(parsed.error),
    };
  }
  const w: WarrantyInput = parsed.data;

  const { error } = await deps.insert("warranty_submissions", {
    full_name: w.fullName,
    email: w.email,
    phone: w.phone,
    serial: w.serial.toUpperCase(),
    purchase_date: w.purchaseDate,
    dealer: w.dealer,
    city: w.city,
    state: w.state,
    vehicle_type: w.vehicleType,
  });
  if (error) {
    console.error("[submissions] warranty insert failed:", error.code, error.message);
    return { ok: false, error: dbErrorMessage(error) };
  }

  const customer = warrantyCustomerEmail(deps.copy, w);
  const team = warrantyTeamEmail(w, deps.copy.footer);
  const emailed = await notify(
    deps,
    { to: [w.email], ...customer, replyTo: deps.teamTo[0] },
    { to: deps.teamTo, ...team, replyTo: w.email },
  );
  return { ok: true, emailed };
}

export async function processDealer(raw: unknown, deps: Deps): Promise<SubmitResult> {
  const parsed = dealerSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please check the highlighted fields.",
      fieldErrors: firstFieldErrors(parsed.error),
    };
  }
  const d: DealerInput = parsed.data;

  let { error } = await deps.insert("dealer_enquiries", {
    name: d.name,
    phone: d.phone,
    city: d.city,
    email: d.email,
  });
  // Until the dealer_enquiries.email column exists in the database, save the
  // enquiry without it rather than losing the lead. The email still goes out.
  if (
    error &&
    (error.code === "PGRST204" || /'email' column|column .*email/i.test(error.message ?? ""))
  ) {
    ({ error } = await deps.insert("dealer_enquiries", {
      name: d.name,
      phone: d.phone,
      city: d.city,
    }));
  }
  if (error) {
    console.error("[submissions] dealer insert failed:", error.code, error.message);
    return { ok: false, error: dbErrorMessage(error) };
  }

  const customer = dealerCustomerEmail(deps.copy, d);
  const team = dealerTeamEmail(d, deps.copy.footer);
  const emailed = await notify(
    deps,
    { to: [d.email], ...customer, replyTo: deps.teamTo[0] },
    { to: deps.teamTo, ...team, replyTo: d.email },
  );
  return { ok: true, emailed };
}

// Best-effort flood control. Serverless instances don't share memory, so this
// only slows down a single noisy client; the database constraints are the real guard.
const hits = new Map<string, number[]>();
export function rateLimited(key: string, max = 5, windowMs = 10 * 60_000, now = Date.now()) {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= max) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return false;
}

// Server-only email sending through Resend's HTTP API (no SDK needed).
// Configure on the server (Vercel project settings, or a local .env):
//   RESEND_API_KEY   required to send anything; without it emails are skipped
//   EMAIL_FROM       e.g. "LOHIX Energy <hello@lohixenergy.com>" (domain must be verified in Resend)
//   EMAIL_TEAM_TO    optional; where internal notifications go (comma-separated).
//                    Falls back to the contact email set in /admin → Global settings.

export type OutgoingEmail = {
  to: string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

export type SendOutcome = { sent: true; id?: string } | { sent: false; reason: string };

export type EmailConfig = { apiKey?: string; from?: string; teamTo?: string };

export function readEmailConfig(): EmailConfig {
  return {
    apiKey: process.env.RESEND_API_KEY?.trim() || undefined,
    from: process.env.EMAIL_FROM?.trim() || undefined,
    teamTo: process.env.EMAIL_TEAM_TO?.trim() || undefined,
  };
}

export async function sendEmail(
  msg: OutgoingEmail,
  config: EmailConfig = readEmailConfig(),
  fetchImpl: typeof fetch = fetch,
): Promise<SendOutcome> {
  if (!config.apiKey) return { sent: false, reason: "not-configured" };
  if (!config.from) return { sent: false, reason: "missing-from" };
  const to = msg.to.map((t) => t.trim()).filter(Boolean);
  if (to.length === 0) return { sent: false, reason: "no-recipient" };

  try {
    const res = await fetchImpl("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: config.from,
        to,
        subject: msg.subject,
        html: msg.html,
        text: msg.text,
        ...(msg.replyTo ? { reply_to: msg.replyTo } : {}),
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(`[email] Resend ${res.status}: ${body.slice(0, 300)}`);
      return { sent: false, reason: `http-${res.status}` };
    }
    const data = (await res.json().catch(() => ({}))) as { id?: string };
    return { sent: true, id: data.id };
  } catch (err) {
    console.error("[email] send failed:", (err as Error).message);
    return { sent: false, reason: "network" };
  }
}

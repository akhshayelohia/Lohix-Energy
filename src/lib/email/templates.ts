// Email bodies for form auto-responses. Pure functions: no I/O, easy to test.
// Styling is inline (email clients ignore <style>) and sticks to the site's
// black / white / lime palette.

import type { DealerInput, WarrantyInput } from "@/lib/submissions/schemas";

export type EmailCopy = {
  warrantySubject: string;
  warrantyHeading: string;
  warrantyBody: string;
  dealerSubject: string;
  dealerHeading: string;
  dealerBody: string;
  signOff: string;
  footer: string;
};

export type EmailMessage = {
  subject: string;
  html: string;
  text: string;
};

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/** Replaces {name} / {serial} / {city} placeholders the team can use in /admin copy. */
export function fill(template: string, vars: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? vars[k] : m));
}

const firstName = (full: string) => full.trim().split(/\s+/)[0] ?? "";

function formatDate(iso: string) {
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function layout(opts: {
  heading: string;
  paragraphs: string[];
  rows: [string, string][];
  signOff: string;
  footer: string;
}) {
  const para = opts.paragraphs
    .filter(Boolean)
    .map(
      (p) =>
        `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#0b0f10;">${esc(p)}</p>`,
    )
    .join("");
  const rows = opts.rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:10px 0;border-bottom:1px solid #e7e5de;font-size:13px;color:#0b0f10;">${esc(k)}</td>` +
        `<td style="padding:10px 0;border-bottom:1px solid #e7e5de;font-size:13px;font-weight:600;color:#0b0f10;text-align:right;">${esc(v)}</td></tr>`,
    )
    .join("");
  return `<!doctype html><html><body style="margin:0;padding:0;background:#f7f6f2;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f6f2;padding:32px 16px;font-family:Inter,Segoe UI,Helvetica,Arial,sans-serif;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #e7e5de;border-radius:12px;overflow:hidden;">
<tr><td style="background:#05070a;padding:24px 28px;">
<span style="font-size:20px;font-weight:700;letter-spacing:0.04em;color:#ffffff;">LOHIX</span>
<span style="display:inline-block;margin-left:8px;width:8px;height:8px;border-radius:50%;background:#b7e26d;"></span>
</td></tr>
<tr><td style="padding:28px;">
<h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;color:#0b0f10;">${esc(opts.heading)}</h1>
${para}
${rows ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 20px;">${rows}</table>` : ""}
<p style="margin:0;font-size:15px;line-height:1.6;color:#0b0f10;">${esc(opts.signOff)}</p>
</td></tr>
<tr><td style="padding:16px 28px;border-top:1px solid #e7e5de;font-size:12px;line-height:1.5;color:#0b0f10;">${esc(opts.footer)}</td></tr>
</table></td></tr></table></body></html>`;
}

function textVersion(
  heading: string,
  paragraphs: string[],
  rows: [string, string][],
  signOff: string,
  footer: string,
) {
  return [
    heading,
    "",
    ...paragraphs.filter(Boolean).flatMap((p) => [p, ""]),
    ...rows.map(([k, v]) => `${k}: ${v}`),
    "",
    signOff,
    "",
    "--",
    footer,
  ].join("\n");
}

function warrantyRows(w: WarrantyInput): [string, string][] {
  return [
    ["Name", w.fullName],
    ["Battery serial", w.serial.toUpperCase()],
    ["Purchase date", formatDate(w.purchaseDate)],
    ["Dealer", w.dealer],
    ["Location", `${w.city}, ${w.state}`],
    ["Vehicle", w.vehicleType],
    ["Phone", w.phone],
  ];
}

export function warrantyCustomerEmail(copy: EmailCopy, w: WarrantyInput): EmailMessage {
  const vars = { name: firstName(w.fullName), serial: w.serial.toUpperCase(), city: w.city };
  const heading = fill(copy.warrantyHeading, vars);
  const paragraphs = fill(copy.warrantyBody, vars).split(/\n{2,}/);
  const rows = warrantyRows(w);
  return {
    subject: fill(copy.warrantySubject, vars),
    html: layout({ heading, paragraphs, rows, signOff: copy.signOff, footer: copy.footer }),
    text: textVersion(heading, paragraphs, rows, copy.signOff, copy.footer),
  };
}

export function dealerCustomerEmail(copy: EmailCopy, d: DealerInput): EmailMessage {
  const vars = { name: firstName(d.name), city: d.city, serial: "" };
  const heading = fill(copy.dealerHeading, vars);
  const paragraphs = fill(copy.dealerBody, vars).split(/\n{2,}/);
  const rows: [string, string][] = [
    ["Name", d.name],
    ["City", d.city],
    ["Phone", d.phone],
    ["Email", d.email],
  ];
  return {
    subject: fill(copy.dealerSubject, vars),
    html: layout({ heading, paragraphs, rows, signOff: copy.signOff, footer: copy.footer }),
    text: textVersion(heading, paragraphs, rows, copy.signOff, copy.footer),
  };
}

// Internal notifications for the LOHIX team: plain and scannable.
export function warrantyTeamEmail(w: WarrantyInput, footer: string): EmailMessage {
  const rows: [string, string][] = [...warrantyRows(w), ["Email", w.email]];
  const heading = `New warranty registration — ${w.serial.toUpperCase()}`;
  const paragraphs = [
    "A warranty was just registered on lohixenergy.com. Reply to this email to contact the customer.",
  ];
  return {
    subject: `[Warranty] ${w.fullName} · ${w.serial.toUpperCase()} · ${w.city}`,
    html: layout({ heading, paragraphs, rows, signOff: "", footer }),
    text: textVersion(heading, paragraphs, rows, "", footer),
  };
}

export function dealerTeamEmail(d: DealerInput, footer: string): EmailMessage {
  const rows: [string, string][] = [
    ["Name", d.name],
    ["City", d.city],
    ["Phone", d.phone],
    ["Email", d.email],
  ];
  const heading = `New dealership enquiry — ${d.city}`;
  const paragraphs = [
    "A dealership application just came in on lohixenergy.com. Reply to this email to contact the applicant.",
  ];
  return {
    subject: `[Dealer] ${d.name} · ${d.city}`,
    html: layout({ heading, paragraphs, rows, signOff: "", footer }),
    text: textVersion(heading, paragraphs, rows, "", footer),
  };
}

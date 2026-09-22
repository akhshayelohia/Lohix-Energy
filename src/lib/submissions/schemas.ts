import { z } from "zod";
import { todayISO } from "@/lib/forms";

// Shared by the forms (instant feedback) and the server functions (the check
// that actually counts). Mirrors the database CHECK constraints.

export const warrantySchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(80),
  email: z.string().trim().email("Enter a valid email").max(160),
  phone: z
    .string()
    .trim()
    .regex(/^[+0-9\s-]{10,15}$/, "Enter a valid phone number"),
  serial: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9-]{4,32}$/, "Use 4–32 letters, numbers or dashes, as printed on the pack"),
  purchaseDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Select purchase date")
    .refine((d) => d <= todayISO(), "Purchase date can't be in the future"),
  dealer: z.string().trim().min(2, "Dealer name required").max(80),
  city: z.string().trim().min(2, "City required").max(60),
  state: z.string().trim().min(2, "Select your state").max(40),
  vehicleType: z.string().trim().min(1, "Select vehicle type").max(40),
  consent: z.literal(true, { errorMap: () => ({ message: "Please accept the terms" }) }),
});

export const dealerSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(80),
  email: z.string().trim().email("Enter a valid email").max(160),
  phone: z
    .string()
    .trim()
    .regex(/^[+0-9\s-]{7,20}$/, "Enter a valid phone number"),
  city: z.string().trim().min(2, "City required").max(60),
});

export type WarrantyInput = z.infer<typeof warrantySchema>;
export type DealerInput = z.infer<typeof dealerSchema>;

/** Hidden "website" field; real visitors never fill it, bots usually do. */
export const HONEYPOT_FIELD = "website";

export type SubmitResult =
  | { ok: true; emailed: boolean }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

export function firstFieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "");
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}

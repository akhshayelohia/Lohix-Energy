export const DATASHEET_NOTE =
  "Charging and discharge ratings live in the full datasheet — a PDF for dealers and fleet buyers who need the deeper numbers.";

export function datasheetRequestHref(email: string, productName: string) {
  return `mailto:${email}?subject=${encodeURIComponent(`Datasheet request — ${productName}`)}`;
}

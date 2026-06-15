// Sanitizes URLs sourced from the CMS / user input before they hit an
// `<a href>` or media `src`. React does NOT block `javascript:` URLs, so a
// compromised admin could otherwise stash a payload in any link field.
//
// Allowed schemes: http, https, mailto, tel, plus same-origin/fragment refs
// (`/foo`, `./foo`, `#foo`). Everything else collapses to `#`.

const ABSOLUTE_SCHEME = /^([a-z][a-z0-9+.-]*):/i;
const ALLOWED_SCHEMES = new Set(["http", "https", "mailto", "tel"]);

export function safeHref(href: unknown): string {
  if (typeof href !== "string") return "#";
  const trimmed = href.trim();
  if (!trimmed) return "#";

  // Relative paths and fragment links are always safe.
  if (
    trimmed.startsWith("/") ||
    trimmed.startsWith("#") ||
    trimmed.startsWith("./") ||
    trimmed.startsWith("../")
  ) {
    return trimmed;
  }

  const schemeMatch = trimmed.match(ABSOLUTE_SCHEME);
  if (!schemeMatch) {
    // No scheme and no leading slash — treat as a relative path.
    return trimmed;
  }

  const scheme = schemeMatch[1].toLowerCase();
  return ALLOWED_SCHEMES.has(scheme) ? trimmed : "#";
}

// For <img>/<video src>: allow data: URIs (commonly used for inline previews)
// in addition to the standard set; still blocks javascript:/vbscript:/etc.
export function safeMediaSrc(src: unknown): string {
  if (typeof src !== "string") return "";
  const trimmed = src.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("/") || trimmed.startsWith("./") || trimmed.startsWith("../")) {
    return trimmed;
  }
  const schemeMatch = trimmed.match(ABSOLUTE_SCHEME);
  if (!schemeMatch) return trimmed;
  const scheme = schemeMatch[1].toLowerCase();
  return scheme === "http" || scheme === "https" || scheme === "data" || scheme === "blob"
    ? trimmed
    : "";
}

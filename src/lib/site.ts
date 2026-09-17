// Production origin, used for canonical URLs, the sitemap and social previews.
export const SITE_URL = "https://lohixenergy.com";

/** Social crawlers need absolute image URLs; site-relative paths get the production origin. */
export function absoluteUrl(url: string): string {
  return url.startsWith("/") ? `${SITE_URL}${url}` : url;
}

/**
 * Converts arbitrary text into a URL-safe slug.
 * Strips diacritics so Italian accented characters produce clean slugs:
 *   "L'articolo è pubblicato" → "larticolo-e-pubblicato"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip combining diacritics
    .replace(/[^a-z0-9\s-]/g, '')    // keep only alphanumeric, spaces, hyphens
    .trim()
    .replace(/\s+/g, '-')            // spaces → hyphens
    .replace(/-+/g, '-')             // collapse consecutive hyphens
}

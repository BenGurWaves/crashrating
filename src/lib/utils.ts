// ─────────────────────────────────────────────────────────────
//  CrashRating — Utility: URL/slug helpers
// ─────────────────────────────────────────────────────────────

/**
 * Turn a make or model into a URL-safe slug.
 * e.g. "HONDA" → "honda", "CR-V" → "cr-v", "F-150" → "f-150"
 */
export function slugify(input: string): string {
  return input
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-") // replace non-alphanumeric runs with hyphen
    .replace(/^-+|-+$/g, ""); // trim leading/trailing hyphens
}

/**
 * Reverse a slug back to the original make/model name
 * for NHTSA API calls.
 * e.g. "cr-v" → "CR-V", "rav4" → "RAV4"
 *
 * This is imperfect — NHTSA's API is case-insensitive and
 * fairly forgiving with model names, so we can use a
 * best-effort reconstruction.
 */
export function slugToName(slug: string): string {
  // Common model name corrections from slug → original case
  const corrections: Record<string, string> = {
    "cr-v": "CR-V",
    "f-150": "F-150",
    "f-150-lightning": "F-150 Lightning",
    "rav4": "RAV4",
    "highlander": "Highlander",
    "tacoma": "Tacoma",
    "camry": "Camry",
    "corolla": "Corolla",
    "civic": "Civic",
    "accord": "Accord",
    "cr-v-hybrid": "CR-V Hybrid",
    "hr-v": "HR-V",
    "rl": "RL",
    "tlx": "TLX",
    "mdx": "MDX",
    "rfx": "RDX",
    "id-4": "ID.4",
    "golf-gti": "Golf GTI",
    "i4": "i4",
    "ix": "iX",
    "ix3": "iX3",
    "q4-e-tron": "Q4 e-tron",
    "q8-e-tron": "Q8 e-tron",
    "e-tron-gt": "e-tron GT",
    "taycan": "Taycan",
    "macan": "Macan",
    "cayenne": "Cayenne",
    "718-cayman": "718 Cayman",
    "c-class": "C-Class",
    "e-class": "E-Class",
    "glc": "GLC",
    "gle": "GLE",
    "g70": "G70",
    "g80": "G80",
    "g90": "G90",
    "gv70": "GV70",
    "gv80": "GV80",
  };

  // Try exact correction first
  if (corrections[slug]) return corrections[slug];

  // Fallback: convert from kebab-case to Title Case
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/**
 * Format a vehicle description for display.
 * e.g. formatVehicleName("HONDA", "CR-V", 2024) → "2024 Honda CR-V"
 */
export function formatVehicleName(make: string, model: string, year: number | string): string {
  // Convert MAKE to "Make" (title case, handling special cases)
  const makeName = make
    .split(" ")
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(" ");
  return `${year} ${makeName} ${model}`;
}

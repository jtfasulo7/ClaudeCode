/**
 * Soft service-area matching for Step 5 of the form.
 *
 * This NEVER blocks submission. It only decides whether to show the gentle
 * "we'll confirm we can reach you" note. Be generous: a false "not in area"
 * costs more than a false "in area".
 */

const TOWNS = [
  // Core six
  "cedar city",
  "st. george",
  "st george",
  "saint george",
  "parowan",
  "beaver",
  "new harmony",
  "paragonah",
  // Nearby communities along the I-15 corridor we can realistically reach
  "enoch",
  "kanarraville",
  "summit",
  "brian head",
  "minersville",
  "milford",
  "washington",
  "santa clara",
  "ivins",
  "hurricane",
  "la verkin",
  "laverkin",
  "toquerville",
  "leeds",
  "pintura",
  "hamilton fort",
  "cedar highlands",
];

const ZIPS = new Set([
  "84720", "84721", // Cedar City / Enoch
  "84770", "84771", "84790", "84791", // St. George
  "84761", // Parowan
  "84713", // Beaver
  "84757", // New Harmony
  "84760", // Paragonah
  "84742", // Kanarraville
  "84772", // Summit
  "84719", // Brian Head
  "84752", // Minersville
  "84751", // Milford
  "84780", // Washington
  "84765", // Santa Clara
  "84738", // Ivins
  "84737", // Hurricane
  "84745", // La Verkin
  "84774", // Toquerville
  "84746", // Leeds
]);

export function isInServiceArea(input: string): boolean {
  const text = input.trim().toLowerCase();
  if (!text) return false;
  if (TOWNS.some((t) => text.includes(t))) return true;
  const zips = text.match(/\b\d{5}\b/g) ?? [];
  return zips.some((z) => ZIPS.has(z));
}

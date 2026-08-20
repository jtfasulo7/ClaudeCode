/** US phone helpers shared by the form (masking) and the API (E.164). */

/** Strip to the 10 national digits, dropping a leading country-code 1. */
export function nationalDigits(input: string): string {
  let d = input.replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("1")) d = d.slice(1);
  return d.slice(0, 10);
}

/** Progressive mask: "4353" -> "(435) 3", "4353199628" -> "(435) 319-9628". */
export function formatUsPhone(input: string): string {
  const d = nationalDigits(input);
  if (d.length === 0) return "";
  if (d.length < 4) return `(${d}`;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

export function isValidUsPhone(input: string): boolean {
  const d = nationalDigits(input);
  // 10 digits, area code and exchange can't start with 0 or 1 (NANP).
  return /^[2-9]\d{2}[2-9]\d{6}$/.test(d);
}

/** "+14353199628" or null if it isn't a plausible US number. */
export function toE164(input: string): string | null {
  return isValidUsPhone(input) ? `+1${nationalDigits(input)}` : null;
}

// Minimal cn helper. Concatenates truthy class strings with spaces.
// Sufficient for this project; if conflicting Tailwind classes start to be
// a problem, swap to clsx + tailwind-merge.
export function cn(...inputs) {
  return inputs.flat(Infinity).filter(Boolean).join(' ');
}

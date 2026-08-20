import { SectionHeading } from "@/components/SectionHeading";

/**
 * REVIEWS — BUILT BUT DISABLED.
 *
 * Montara Forge has not collected reviews yet, so this section is NOT
 * rendered (see SHOW_REVIEWS in lib/site.ts — it's `false`). The entries
 * below are layout placeholders ONLY. Before enabling:
 *
 *   1. Replace every entry in REVIEWS with a real, attributable review the
 *      client has collected (name + town as the customer gave permission).
 *   2. Flip SHOW_REVIEWS to `true` in lib/site.ts.
 *
 * Deliberately no star rating or review count anywhere — add those only
 * if/when the client has a real Google Business Profile rating to cite.
 */

interface Review {
  quote: string;
  name: string;
  town: string;
  project: string;
}

// PLACEHOLDER COPY — replace with real reviews before enabling.
const REVIEWS: Review[] = [
  {
    quote:
      "[Placeholder] Showed up when they said they would, measured everything, and the price they quoted is the price we paid.",
    name: "Customer Name",
    town: "Cedar City",
    project: "Driveway replacement",
  },
  {
    quote:
      "[Placeholder] Tear-out and new pour done in two days. Clean edges, clean yard when they left.",
    name: "Customer Name",
    town: "St. George",
    project: "New driveway",
  },
  {
    quote:
      "[Placeholder] Patio looks better than the renderings. Would hire again for the front walk.",
    name: "Customer Name",
    town: "Parowan",
    project: "Patio",
  },
];

export function Reviews() {
  return (
    <section className="border-t border-line bg-ink-2">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <SectionHeading
          index="04"
          eyebrow="What Neighbors Say"
          title={
            <>
              Word travels <span className="text-gold">in small towns.</span>
            </>
          }
        />
        <ul className="mt-8 grid gap-4 sm:grid-cols-3">
          {REVIEWS.map((r) => (
            <li key={r.quote} className="flex flex-col rounded-xl border border-line bg-ink p-5">
              <span aria-hidden="true" className="font-display text-5xl leading-none text-gold">
                &ldquo;
              </span>
              <blockquote className="mt-1 flex-1 text-[0.95rem] leading-relaxed text-bone">
                {r.quote}
              </blockquote>
              <footer className="mt-4 border-t border-line pt-3 text-sm">
                <p className="font-semibold text-bone">{r.name}</p>
                <p className="text-bone-mute">
                  {r.town} · {r.project}
                </p>
              </footer>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

import { SectionHeading } from "@/components/SectionHeading";

/**
 * REVIEWS — real customer reviews only, rendered when SHOW_REVIEWS
 * (lib/site.ts) is true.
 *
 * Every entry must be a real, attributable review the client has collected
 * (name, plus town/project only as the customer gave them). Never add
 * placeholder or invented reviews.
 *
 * Stars are per review, as the customer rated it. No aggregate rating or
 * review count anywhere — add those only if/when the client has a real
 * Google Business Profile rating to cite.
 */

interface Review {
  quote: string;
  name: string;
  /** 1–5, as the customer rated it. */
  rating: number;
  town?: string;
  project?: string;
}

const REVIEWS: Review[] = [
  {
    quote:
      "Russell and his team arrived promptly as promised and worked tirelessly and professionally to complete the job. I couldn’t help but feel they were working harder than necessary, perhaps because compared to other contractors and builders we’ve hired, they stood out for their meticulous attention to detail and genuine concern for my plans.",
    name: "Scott McDonell",
    rating: 5,
  },
];

function Stars({ rating }: { rating: number }) {
  return (
    <p className="flex gap-0.5 text-lg leading-none" role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} aria-hidden="true" className={n <= rating ? "text-gold" : "text-bone/20"}>
          ★
        </span>
      ))}
    </p>
  );
}

export function Reviews() {
  // One review reads as a single wide card; three or more fill the grid.
  const layout = REVIEWS.length === 1 ? "max-w-2xl" : "sm:grid-cols-2 lg:grid-cols-3";
  return (
    <section className="border-t border-line bg-ink-2">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <SectionHeading
          eyebrow="What Neighbors Say"
          title={
            <>
              Word travels <span className="text-gold">in small towns.</span>
            </>
          }
        />
        <ul className={`mt-8 grid gap-4 ${layout}`}>
          {REVIEWS.map((r) => (
            <li key={r.quote} className="flex flex-col rounded-xl border border-line bg-ink p-5 sm:p-6">
              <Stars rating={r.rating} />
              <blockquote className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-bone sm:text-base">
                &ldquo;{r.quote}&rdquo;
              </blockquote>
              <footer className="mt-4 border-t border-line pt-3 text-sm">
                <p className="font-semibold text-bone">{r.name}</p>
                {(r.town || r.project) && (
                  <p className="text-bone-mute">{[r.town, r.project].filter(Boolean).join(" · ")}</p>
                )}
              </footer>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

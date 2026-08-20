import { SectionHeading } from "@/components/SectionHeading";

const STEPS = [
  {
    n: "1",
    title: "Tell us about your project",
    body: "Five quick taps — what, where, how big, and when. Takes about 30 seconds.",
  },
  {
    n: "2",
    title: "Pick a time",
    body: "Choose a slot that works for you right on the page. We'll text to confirm.",
  },
  {
    n: "3",
    title: "We show up, measure, and give you a firm price",
    body: "A real on-site estimate — not a ballpark over the phone, not a sales pitch.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-y border-line bg-ink-2">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <SectionHeading
          index="02"
          eyebrow="How It Works"
          title={
            <>
              Three steps. <span className="text-gold">Zero runaround.</span>
            </>
          }
        />

        <ol className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-3 sm:gap-6">
          {STEPS.map((s, i) => (
            <li
              key={s.n}
              className="relative rounded-xl border border-line bg-ink p-5 pt-4 sm:p-6"
            >
              <span
                aria-hidden="true"
                className="font-display text-[4.5rem] leading-none text-gold/90 sm:text-[5.5rem]"
              >
                {s.n}
              </span>
              {i < STEPS.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute right-4 top-6 hidden h-px w-10 bg-gold/40 sm:block"
                />
              )}
              <h3 className="mt-1 text-lg font-bold leading-tight text-bone">{s.title}</h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-bone-mute">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

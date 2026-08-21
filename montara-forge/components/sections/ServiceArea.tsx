import { SectionHeading } from "@/components/SectionHeading";
import { PinIcon } from "@/components/icons";
import { SITE } from "@/lib/site";

export function ServiceArea() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-12">
        <SectionHeading
          eyebrow="Service Area"
          title={
            <>
              Local crew. <span className="text-gold">Local schedule.</span>
            </>
          }
        />

        <div>
          <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {SITE.towns.map((town) => (
              <li
                key={town}
                className="flex items-center gap-2 rounded-lg border border-line bg-ink-2 px-3.5 py-3 text-[0.95rem] font-semibold text-bone"
              >
                <PinIcon className="h-4 w-4 shrink-0 text-gold" />
                {town}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-bone-mute">
            Plus surrounding communities along the I-15 corridor. Not sure if we reach you?
            Put your city in the form — we&rsquo;ll confirm when we call.
          </p>
        </div>
      </div>
    </section>
  );
}

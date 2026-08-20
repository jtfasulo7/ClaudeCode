import { CardIcon, PinIcon, ShieldIcon } from "@/components/icons";
import { SITE } from "@/lib/site";

/** Scannable badges directly under the hero/form. */
export function TrustStrip() {
  const items = [
    { icon: ShieldIcon, text: `Licensed & Insured in ${SITE.state}` },
    { icon: CardIcon, text: "Financing Available" },
    { icon: PinIcon, text: "Serving Cedar City & Surrounding Areas" },
  ];
  return (
    <section aria-label="Trust" className="border-y border-line bg-ink-2">
      <ul className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-line px-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-6">
        {items.map(({ icon: Icon, text }) => (
          <li
            key={text}
            className="flex items-center justify-center gap-2.5 py-3 text-center text-[0.85rem] font-semibold tracking-wide text-bone sm:py-4"
          >
            <Icon className="h-4.5 w-4.5 shrink-0 text-gold" />
            {text}
          </li>
        ))}
      </ul>
    </section>
  );
}

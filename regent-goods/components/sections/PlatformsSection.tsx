import { Section } from "../Section";

const platforms = [
  {
    name: "Whatnot",
    tag: "Live auctions",
    body: "High-velocity live selling. Engaged real-time buyers. Cosmetics-focused audiences.",
  },
  {
    name: "Amazon",
    tag: "Marketplace",
    body: "Marketplace listings. Nationwide reach. Established fulfillment infrastructure.",
  },
  {
    name: "Expanding channels",
    tag: "In development",
    body: "Additional marketplaces and direct-to-consumer storefronts coming online as we scale.",
  },
];

export function PlatformsSection() {
  return (
    <Section id="platforms" tone="paper">
      <header className="max-w-3xl">
        <p className="eyebrow text-text-soft">03 / Platforms</p>
        <h2 className="display mt-5 text-[36px] font-extrabold tracking-[-0.02em] leading-[1.05] sm:text-[44px] lg:text-[52px]">
          Where the inventory goes.
        </h2>
        <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-text">
          We&rsquo;re an active e-commerce resale operation. Inventory we purchase
          moves through multiple high-velocity channels.
        </p>
      </header>

      <div className="mt-14 grid gap-px bg-line sm:grid-cols-3 border border-line">
        {platforms.map((p) => (
          <article key={p.name} className="bg-paper p-7 sm:p-9 flex flex-col">
            <div className="flex items-center justify-between">
              <h3 className="display text-[24px] font-bold tracking-tight">
                {p.name}
              </h3>
              <span className="eyebrow text-text-soft">{p.tag}</span>
            </div>
            <div className="mt-6 h-px w-12 bg-navy" aria-hidden="true" />
            <p className="mt-6 text-[15px] leading-relaxed text-text">
              {p.body}
            </p>
          </article>
        ))}
      </div>
    </Section>
  );
}

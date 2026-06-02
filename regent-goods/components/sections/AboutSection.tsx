import { Section } from "../Section";

const facts = [
  { label: "Based in", value: "Bethlehem, PA" },
  { label: "Vertical", value: "Trending consumer goods" },
  { label: "Operation", value: "Wholesale + liquidation" },
  { label: "Channels", value: "Whatnot, Amazon, e-commerce" },
];

export function AboutSection() {
  return (
    <Section id="about" tone="soft">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <p className="eyebrow text-text-soft">04 / About</p>
          <h2 className="display mt-5 text-[36px] font-extrabold tracking-[-0.02em] leading-[1.05] sm:text-[44px] lg:text-[52px]">
            About Regent Goods.
          </h2>
          <div className="mt-8 space-y-5 text-[17px] leading-relaxed text-ink max-w-2xl">
            <p>
              Regent Goods Wholesale &amp; Liquidation is an e-commerce resale
              operation specializing in trending consumer product inventory.
              We source wholesale directly from brands and distributors, and
              purchase liquidation lots from retailers moving overstock,
              shelf pulls, and closeouts.
            </p>
            <p>
              Our focus is operational: long-term supplier relationships, fast
              inventory turn through live auction and marketplace channels, and
              a single point of contact for partners on both sides of the deal.
            </p>
            <p className="text-text">
              Headquartered in Bethlehem, PA &mdash; serving brands, distributors,
              liquidators, and retail operators nationwide.
            </p>
          </div>
        </div>

        <aside className="lg:col-span-5">
          {/* Inventory representation block — substantial dark panel */}
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-ink">
            {/* TODO: Replace with real inventory / warehouse photography */}
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage:
                  "linear-gradient(0deg, #fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                backgroundSize: "48px 48px",
              }}
            />
            <div className="relative flex h-full flex-col justify-between p-8">
              <p className="eyebrow text-mute">Operation</p>
              <div>
                <p className="display text-paper text-[28px] font-bold leading-tight tracking-tight sm:text-[34px]">
                  Trending consumer goods
                  <br />
                  <span className="text-mute">moving through volume.</span>
                </p>
                <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-[#262626] pt-7">
                  {facts.map((f) => (
                    <div key={f.label}>
                      <dt className="eyebrow text-mute">{f.label}</dt>
                      <dd className="mt-2 text-[14px] text-paper leading-snug">
                        {f.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </Section>
  );
}

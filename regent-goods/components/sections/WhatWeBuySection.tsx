import { Check } from "lucide-react";
import { Section } from "../Section";
import { Button } from "../Button";

const wholesale = [
  "Direct from brands & manufacturers",
  "Authorized distributors",
  "Cosmetics & beauty product lines",
  "Long-term supplier relationships",
  "Open volume terms",
];

const liquidation = [
  "Overstock inventory",
  "Shelf pulls & store returns",
  "Discontinued cosmetics & SKUs",
  "Closeout lots",
  "Retail liquidation",
  "Pallets &amp; truckloads",
];

function Bullet({ label }: { label: string }) {
  return (
    <li className="flex items-start gap-3 py-3 border-b border-line last:border-b-0">
      <Check
        size={16}
        strokeWidth={2.25}
        className="mt-1 shrink-0 text-navy"
        aria-hidden="true"
      />
      <span
        className="text-[15px] leading-snug text-ink"
        dangerouslySetInnerHTML={{ __html: label }}
      />
    </li>
  );
}

export function WhatWeBuySection() {
  return (
    <Section id="what-we-buy" tone="paper">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <header className="lg:col-span-4">
          <p className="eyebrow text-text-soft">01 / What we buy</p>
          <h2 className="display mt-5 text-[36px] font-extrabold tracking-[-0.02em] leading-[1.05] sm:text-[44px] lg:text-[52px]">
            Two ways we
            <br />
            buy inventory.
          </h2>
          <p className="mt-6 max-w-md text-[16px] leading-relaxed text-text">
            We work with brands, distributors, and retailers on both wholesale
            and liquidation transactions &mdash; supplying our active e-commerce
            resale operation.
          </p>
        </header>

        <div className="lg:col-span-8 grid gap-6 sm:grid-cols-2 sm:gap-5">
          {/* Wholesale card */}
          <article className="flex flex-col justify-between border border-border bg-paper p-7 sm:p-8">
            <div>
              <p className="eyebrow text-navy">Wholesale</p>
              <h3 className="display mt-4 text-[24px] font-bold tracking-tight leading-snug">
                Wholesale sourcing
              </h3>
              <p className="mt-4 text-[15px] leading-relaxed text-text">
                We open wholesale accounts directly with brands, manufacturers,
                and distributors in the cosmetics and beauty space &mdash;
                building long-term supplier relationships to fuel our e-commerce
                distribution operation.
              </p>
              <ul className="mt-7">
                {wholesale.map((item) => (
                  <Bullet key={item} label={item} />
                ))}
              </ul>
            </div>
          </article>

          {/* Liquidation card */}
          <article className="flex flex-col justify-between border border-border bg-paper-soft p-7 sm:p-8">
            <div>
              <p className="eyebrow text-navy">Liquidation</p>
              <h3 className="display mt-4 text-[24px] font-bold tracking-tight leading-snug">
                Liquidation purchasing
              </h3>
              <p className="mt-4 text-[15px] leading-relaxed text-text">
                We also purchase liquidation inventory &mdash; overstock, shelf
                pulls, discontinued cosmetics, closeouts, and pallets &mdash;
                from retailers and brands looking to move inventory quickly.
              </p>
              <ul className="mt-7">
                {liquidation.map((item) => (
                  <Bullet key={item} label={item} />
                ))}
              </ul>
            </div>
          </article>
        </div>
      </div>

      <div className="mt-14 flex flex-col items-start gap-4 border-t border-line pt-10 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xl text-[16px] leading-relaxed text-text">
          If you have wholesale inventory to move or a liquidation lot to sell,
          we&rsquo;ll review your submission within one business day.
        </p>
        <Button href="/inquire" variant="primary" size="lg" withArrow>
          Submit Inventory
        </Button>
      </div>
    </Section>
  );
}

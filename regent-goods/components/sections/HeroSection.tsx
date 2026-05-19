import { Container } from "../Container";
import { Button } from "../Button";

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-ink text-paper">
      {/* Subtle grain / dot texture — restraint, not decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <Container>
        <div className="relative grid items-end gap-16 py-20 sm:py-28 lg:grid-cols-12 lg:gap-12 lg:py-36">
          <div className="lg:col-span-9">
            <p className="eyebrow text-mute">
              <span className="inline-block h-px w-8 bg-mute align-middle mr-3" />
              Bethlehem, PA &middot; Est. 2025
            </p>

            <h1 className="display mt-7 text-[44px] leading-[1.02] font-extrabold tracking-[-0.025em] sm:text-[60px] lg:text-[76px]">
              Wholesale sourcing and
              <br className="hidden sm:block" />{" "}
              <span className="text-mute">liquidation buyer</span> for the
              cosmetics industry.
            </h1>

            <p className="mt-8 max-w-2xl text-[17px] leading-relaxed text-mute sm:text-[18px]">
              We purchase wholesale inventory and liquidation pallets in
              cosmetics and beauty &mdash; supplying our e-commerce resale
              operation across Whatnot, Amazon, and beyond.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Button href="/inquire" variant="primary" size="lg" withArrow>
                Submit Inventory
              </Button>
              <Button
                href="/#what-we-buy"
                variant="ghost"
                size="lg"
                className="text-paper hover:text-mute"
              >
                View What We Buy
              </Button>
            </div>
          </div>

          {/* Right-side editorial info column */}
          <aside className="hidden lg:col-span-3 lg:flex flex-col gap-8 border-l border-[#262626] pl-8">
            <div>
              <p className="eyebrow text-mute">Response</p>
              <p className="mt-2 text-[15px] text-paper leading-snug">
                Direct review within
                <br />
                <span className="display text-[28px] font-bold tracking-tight">
                  one business day
                </span>
              </p>
            </div>
            <div>
              <p className="eyebrow text-mute">Focus</p>
              <p className="mt-2 text-[15px] text-paper leading-snug">
                Cosmetics &amp; beauty
                <br />
                <span className="text-mute">Wholesale &middot; Liquidation &middot; Pallets</span>
              </p>
            </div>
            <div>
              <p className="eyebrow text-mute">Sells through</p>
              <p className="mt-2 text-[15px] text-paper leading-snug">
                Whatnot live auctions
                <br />
                <span className="text-mute">Amazon marketplace</span>
              </p>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}

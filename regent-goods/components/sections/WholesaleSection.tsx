import { Section } from "../Section";
import { Button } from "../Button";

const features = [
  {
    n: "01",
    title: "Multi-platform distribution",
    body: "Your products move across Whatnot live auctions, Amazon marketplace, and expanding e-commerce channels.",
  },
  {
    n: "02",
    title: "Long-term supply partnerships",
    body: "We&rsquo;re not a one-off buyer. We&rsquo;re building a sourcing operation that scales with the right suppliers.",
  },
  {
    n: "03",
    title: "Online marketplace exposure",
    body: "Live-selling on Whatnot puts your brand in front of engaged buyers in real time.",
  },
];

export function WholesaleSection() {
  return (
    <Section id="wholesale" tone="soft">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-12">
        <header className="lg:col-span-5">
          <p className="eyebrow text-text-soft">02 / Wholesale partnerships</p>
          <h2 className="display mt-5 text-[36px] font-extrabold tracking-[-0.02em] leading-[1.05] sm:text-[44px] lg:text-[52px]">
            Built for brands
            <br />
            and distributors.
          </h2>
          <p className="mt-6 max-w-md text-[16px] leading-relaxed text-text">
            We open wholesale accounts with brands and distributors across
            trending consumer product categories, offering scalable
            multi-platform e-commerce distribution, including live-selling
            exposure on Whatnot.
          </p>
          <div className="mt-8">
            <Button href="/inquire" variant="primary" size="lg" withArrow>
              Open a Wholesale Account
            </Button>
          </div>
        </header>

        <div className="lg:col-span-7">
          <ul className="divide-y divide-line border-y border-line">
            {features.map((feature) => (
              <li
                key={feature.n}
                className="grid grid-cols-12 gap-4 py-7 sm:gap-6 sm:py-9"
              >
                <span className="col-span-12 sm:col-span-2 display text-[14px] font-semibold text-navy tracking-widest">
                  {feature.n}
                </span>
                <div className="col-span-12 sm:col-span-10">
                  <h3 className="display text-[22px] font-bold tracking-tight leading-snug sm:text-[26px]">
                    {feature.title}
                  </h3>
                  <p
                    className="mt-3 text-[15px] leading-relaxed text-text sm:text-[16px]"
                    dangerouslySetInnerHTML={{ __html: feature.body }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

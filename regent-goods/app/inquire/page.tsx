import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { InquiryForm } from "@/components/form/InquiryForm";

export const metadata: Metadata = {
  title: "Submit Inventory or Open a Wholesale Account",
  description:
    "Submit your wholesale inquiry or liquidation inventory to Regent Goods. We respond within one business day.",
  alternates: {
    canonical: "https://regentgoodsliquidation.com/inquire",
  },
  openGraph: {
    title: "Submit Inventory or Open a Wholesale Account | Regent Goods",
    description:
      "Submit your wholesale inquiry or liquidation inventory. We respond within one business day.",
    url: "https://regentgoodsliquidation.com/inquire",
    type: "website",
  },
};

export default function InquirePage() {
  return (
    <>
      <Nav />
      <main id="main">
        {/* Top — page header */}
        <section className="bg-paper border-b border-line">
          <Container>
            <div className="grid items-end gap-8 py-16 sm:py-20 lg:grid-cols-12 lg:py-24">
              <div className="lg:col-span-8">
                <p className="eyebrow text-text-soft">
                  <span className="inline-block h-px w-8 bg-mute align-middle mr-3" />
                  Inquiry
                </p>
                <h1 className="display mt-6 text-[40px] font-extrabold tracking-[-0.025em] leading-[1.05] sm:text-[52px] lg:text-[60px]">
                  Submit Inventory
                  <br />
                  <span className="text-text">or open a wholesale account.</span>
                </h1>
              </div>
              <div className="lg:col-span-4">
                <p className="max-w-md text-[16px] leading-relaxed text-text">
                  Tell us what you have. Our team will review your submission
                  and respond within one business day.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* Form */}
        <section className="bg-paper-soft">
          <Container>
            <div className="grid gap-10 py-16 lg:grid-cols-12 lg:gap-14 lg:py-20">
              <aside className="lg:col-span-4">
                <div className="sticky top-28 space-y-8 border-l-2 border-navy pl-6">
                  <div>
                    <p className="eyebrow text-text-soft">Response</p>
                    <p className="mt-2 display text-[22px] font-bold tracking-tight leading-tight">
                      One business day
                    </p>
                    <p className="mt-2 text-[14px] leading-relaxed text-text">
                      Direct review from our team &mdash; not an automated
                      runaround.
                    </p>
                  </div>
                  <div>
                    <p className="eyebrow text-text-soft">Direct contact</p>
                    <p className="mt-3 text-[15px] text-ink">
                      <a
                        href="tel:+14846661087"
                        className="hover:text-navy transition-colors"
                      >
                        484-666-1087
                      </a>
                    </p>
                    <p className="mt-1 text-[14px] text-text">
                      <a
                        href="mailto:regentgoodsliquidation@gmail.com"
                        className="hover:text-ink transition-colors break-all"
                      >
                        regentgoodsliquidation@gmail.com
                      </a>
                    </p>
                  </div>
                  <div>
                    <p className="eyebrow text-text-soft">What we buy</p>
                    <ul className="mt-3 space-y-1.5 text-[14px] text-text">
                      <li>Wholesale trending consumer products</li>
                      <li>Liquidation pallets &amp; lots</li>
                      <li>Overstock, shelf pulls, closeouts</li>
                      <li>Retail liquidation</li>
                    </ul>
                  </div>
                </div>
              </aside>

              <div className="lg:col-span-8">
                <div className="border border-line bg-paper p-7 sm:p-10 lg:p-12">
                  <InquiryForm />
                </div>

                <p className="mt-6 text-[13px] leading-relaxed text-text-soft">
                  Submissions reviewed within one business day. Direct response
                  from our team &mdash; no automated runaround.
                </p>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}

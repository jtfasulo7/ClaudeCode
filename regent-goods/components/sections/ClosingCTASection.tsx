import { Container } from "../Container";
import { Button } from "../Button";

export function ClosingCTASection() {
  return (
    <section className="relative isolate overflow-hidden bg-ink text-paper">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />
      <Container>
        <div className="relative grid gap-10 py-20 sm:py-24 lg:grid-cols-12 lg:items-center lg:py-32">
          <div className="lg:col-span-8">
            <p className="eyebrow text-mute">Ready to move inventory?</p>
            <h2 className="display mt-5 text-[40px] font-extrabold tracking-[-0.025em] leading-[1.02] sm:text-[56px] lg:text-[68px]">
              Tell us what you have.
              <br />
              <span className="text-mute">We&rsquo;ll respond within one business day.</span>
            </h2>
          </div>
          <div className="lg:col-span-4 lg:justify-self-end">
            <Button
              href="/inquire"
              variant="dark"
              size="lg"
              withArrow
              className="w-full sm:w-auto"
            >
              Submit Inventory
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

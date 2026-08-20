import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StickyBar } from "@/components/StickyBar";
import { Hero } from "@/components/sections/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { Gallery } from "@/components/sections/Gallery";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { ServiceArea } from "@/components/sections/ServiceArea";
import { SeasonCta } from "@/components/sections/SeasonCta";
import { Reviews } from "@/components/sections/Reviews";
import { SHOW_REVIEWS } from "@/lib/site";

/**
 * The one route. Order is the conversion argument:
 *   form → proof → process → locality → urgency + repeat CTA → footer
 */
export default function Page() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <TrustStrip />
        <Gallery />
        <HowItWorks />
        <ServiceArea />
        {/*
          Reviews are gated behind SHOW_REVIEWS (lib/site.ts), currently
          `false` — the client has no collected reviews yet. Enable once real
          reviews are in components/sections/Reviews.tsx.
        */}
        {SHOW_REVIEWS && <Reviews />}
        <SeasonCta />
      </main>
      <Footer />
      <StickyBar />
    </>
  );
}

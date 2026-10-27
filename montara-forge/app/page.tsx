import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StickyBar } from "@/components/StickyBar";
import { Hero } from "@/components/sections/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { Gallery } from "@/components/sections/Gallery";
import { MeetTheOwner } from "@/components/sections/MeetTheOwner";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { ServiceArea } from "@/components/sections/ServiceArea";
import { SeasonCta } from "@/components/sections/SeasonCta";
import { Reviews } from "@/components/sections/Reviews";
import { SHOW_REVIEWS } from "@/lib/site";
import { Clarity } from "@/components/Clarity";

/**
 * The one route. Order is the conversion argument:
 *   form → proof (work, then reviews) → owner → process → locality → urgency + repeat CTA → footer
 */
export default function Page() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <TrustStrip />
        <Gallery />
        {/* Real customer reviews; gated by SHOW_REVIEWS (lib/site.ts). */}
        {SHOW_REVIEWS && <Reviews />}
        <MeetTheOwner />
        <HowItWorks />
        <ServiceArea />
        <SeasonCta />
      </main>
      <Footer />
      <StickyBar />
      {/* Landing page only — not in the root layout, so the other routes aren't recorded. */}
      <Clarity />
    </>
  );
}

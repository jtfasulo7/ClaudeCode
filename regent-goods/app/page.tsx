import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { CredibilityBar } from "@/components/sections/CredibilityBar";
import { WhatWeBuySection } from "@/components/sections/WhatWeBuySection";
import { WholesaleSection } from "@/components/sections/WholesaleSection";
import { PlatformsSection } from "@/components/sections/PlatformsSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ClosingCTASection } from "@/components/sections/ClosingCTASection";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Regent Goods Wholesale & Liquidation",
  url: "https://regentgoodsliquidation.com",
  logo: "https://regentgoodsliquidation.com/logo.png",
  description:
    "Wholesale sourcing and liquidation buyer specializing in cosmetics and beauty inventory.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "2601 Washington Ln",
    addressLocality: "Bethlehem",
    addressRegion: "PA",
    postalCode: "18015",
    addressCountry: "US",
  },
  telephone: "+14846661087",
  email: "regentgoodsliquidation@gmail.com",
  founder: {
    "@type": "Person",
    name: "William Woolley",
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Nav />
      <main id="main">
        <HeroSection />
        <CredibilityBar />
        <WhatWeBuySection />
        <WholesaleSection />
        <PlatformsSection />
        <AboutSection />
        <ClosingCTASection />
      </main>
      <Footer />
    </>
  );
}

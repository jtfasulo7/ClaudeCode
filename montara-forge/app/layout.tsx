import type { Metadata, Viewport } from "next";
import { Big_Shoulders, Barlow } from "next/font/google";
import { MetaPixel } from "@/components/MetaPixel";
import { SITE } from "@/lib/site";
import "./globals.css";

/**
 * Self-hosted via next/font (downloaded at build, served from our origin —
 * no runtime request to Google). Display: Big Shoulders — an industrial
 * signage face. Body: Barlow — legible, slightly squared, built for forms.
 */
const display = Big_Shoulders({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  display: "swap",
  // next/font has no fallback metrics for this face yet; we supply our own.
  adjustFontFallback: false,
  fallback: ["Arial Narrow", "Impact", "sans-serif"],
});

const body = Barlow({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${SITE.name} — Free On-Site Concrete Estimates in Cedar City & Southern Utah`,
  description:
    "New driveways, driveway replacements, patios, sidewalks and stairs. Licensed & insured in Utah. Financing available. Book a free on-site estimate.",
  // Paid-traffic landing page, not an SEO asset. Applies to every route.
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0e0e10",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-ink text-bone">
        {children}
        <MetaPixel />
      </body>
    </html>
  );
}

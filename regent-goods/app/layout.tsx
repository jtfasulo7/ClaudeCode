import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  display: "swap",
  weight: ["600", "700", "800"],
});

const siteUrl = "https://regentgoodsliquidation.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      "Regent Goods Wholesale & Liquidation | Trending Consumer Product Buyer",
    template: "%s | Regent Goods",
  },
  description:
    "Wholesale sourcing and liquidation buyer for trending consumer product inventory. Selling on Whatnot, Amazon, and growing e-commerce channels. Submit inventory or open a wholesale account.",
  applicationName: "Regent Goods",
  keywords: [
    "trending consumer products",
    "viral product reseller",
    "wholesale buyer",
    "liquidation pallets",
    "overstock inventory",
    "trending product liquidation",
    "Whatnot reseller",
    "Amazon reseller",
    "Bethlehem PA wholesale",
  ],
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Regent Goods Wholesale & Liquidation",
    title:
      "Regent Goods Wholesale & Liquidation | Trending Consumer Product Buyer",
    description:
      "Wholesale sourcing and liquidation buyer for trending consumer product inventory. Selling on Whatnot, Amazon, and growing e-commerce channels.",
    images: [
      {
        // TODO: Replace with real 1200x630 brand image at public/og-image.jpg
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Regent Goods Wholesale & Liquidation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Regent Goods Wholesale & Liquidation",
    description:
      "Wholesale sourcing and liquidation buyer for trending consumer product inventory.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  return (
    <html
      lang="en"
      className={`${inter.variable} ${interTight.variable}`}
    >
      <body className="min-h-screen bg-paper text-ink antialiased">
        {children}
        {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
      </body>
    </html>
  );
}

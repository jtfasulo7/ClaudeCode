import Link from "next/link";
import { Container } from "./Container";
import { Logo } from "./Logo";

const columns = [
  {
    heading: "Company",
    links: [
      { label: "About", href: "/#about" },
      { label: "Contact", href: "/inquire" },
    ],
  },
  {
    heading: "What We Buy",
    links: [
      { label: "Wholesale", href: "/#what-we-buy" },
      { label: "Liquidation", href: "/#what-we-buy" },
    ],
  },
  {
    heading: "Platforms",
    links: [
      { label: "Whatnot", href: "/#platforms" },
      { label: "Amazon", href: "/#platforms" },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-ink text-paper">
      <Container>
        <div className="grid grid-cols-1 gap-12 py-16 md:grid-cols-12 md:gap-10 lg:py-20">
          <div className="md:col-span-5">
            <Logo variant="dark" />
            <p className="mt-6 max-w-sm text-[14px] leading-relaxed text-mute">
              Wholesale sourcing and liquidation buyer for trending consumer
              products. Built to supply our e-commerce resale operation across
              Whatnot, Amazon, and growing channels.
            </p>

            <address className="not-italic mt-8 space-y-2 text-[14px] text-mute">
              <div>
                <a
                  href="tel:+14846661087"
                  className="text-paper hover:text-mute transition-colors"
                >
                  484-666-1087
                </a>
              </div>
              <div>
                <a
                  href="mailto:regentgoodsliquidation@gmail.com"
                  className="text-paper hover:text-mute transition-colors break-all"
                >
                  regentgoodsliquidation@gmail.com
                </a>
              </div>
              <div className="leading-relaxed">
                2601 Washington Ln
                <br />
                Bethlehem, PA 18015
              </div>
            </address>
          </div>

          <div className="md:col-span-7 grid grid-cols-2 gap-8 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.heading}>
                <h3 className="eyebrow text-mute">{col.heading}</h3>
                <ul className="mt-5 space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-[14px] text-paper hover:text-mute transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-[#262626] py-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[13px] text-mute">
              &copy; {year} Regent Goods Wholesale &amp; Liquidation. All rights
              reserved.
            </p>
            <Link
              href="/privacy"
              className="text-[13px] text-mute hover:text-paper transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}

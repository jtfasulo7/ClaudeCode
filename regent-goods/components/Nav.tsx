"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Container } from "./Container";
import { Logo } from "./Logo";
import { Button } from "./Button";
import { cn } from "@/lib/cn";

const sectionLinks = [
  { label: "What We Buy", href: "/#what-we-buy" },
  { label: "Wholesale Partnerships", href: "/#wholesale" },
  { label: "Platforms", href: "/#platforms" },
  { label: "About", href: "/#about" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-[background-color,border-color,backdrop-filter] duration-200",
        scrolled
          ? "border-b border-line/80 bg-paper/85 backdrop-blur-md"
          : "border-b border-transparent bg-paper",
      )}
    >
      <Container>
        <div className="flex h-[72px] items-center justify-between">
          <Logo />

          <nav className="hidden items-center gap-9 lg:flex" aria-label="Primary">
            {sectionLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[14px] font-medium text-text transition-colors hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/inquire"
              className="text-[14px] font-medium text-text transition-colors hover:text-ink"
            >
              Contact
            </Link>
          </nav>

          <div className="hidden lg:block">
            <Button href="/inquire" variant="primary">
              Submit Inventory
            </Button>
          </div>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="lg:hidden inline-flex h-11 w-11 items-center justify-center text-ink"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} strokeWidth={2} /> : <Menu size={22} strokeWidth={2} />}
          </button>
        </div>
      </Container>

      {/* Mobile menu */}
      <div
        className={cn(
          "lg:hidden overflow-hidden border-t border-line bg-paper transition-[max-height,opacity] duration-200 ease-out",
          open ? "max-h-[480px] opacity-100" : "max-h-0 opacity-0",
        )}
        aria-hidden={!open}
      >
        <Container>
          <nav className="flex flex-col gap-1 py-6" aria-label="Mobile">
            {sectionLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-3 text-[16px] font-medium text-ink border-b border-line/70 last:border-b-0"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/inquire"
              className="py-3 text-[16px] font-medium text-ink border-b border-line/70"
              onClick={() => setOpen(false)}
            >
              Contact
            </Link>
            <div className="pt-5">
              <Button href="/inquire" variant="primary" className="w-full" size="lg">
                Submit Inventory
              </Button>
            </div>
          </nav>
        </Container>
      </div>
    </header>
  );
}

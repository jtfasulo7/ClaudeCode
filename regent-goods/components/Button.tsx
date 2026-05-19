import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "dark";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-medium transition-colors duration-150 ease-out select-none whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed";

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-[14px] tracking-tight rounded-[4px]",
  lg: "h-[52px] px-7 text-[15px] tracking-tight rounded-[4px]",
};

const variants: Record<Variant, string> = {
  primary: "bg-navy text-paper hover:bg-navy-hover active:bg-navy-deep",
  secondary:
    "bg-transparent text-ink border border-border hover:border-ink hover:bg-paper-soft",
  ghost: "bg-transparent text-ink hover:text-navy",
  dark: "bg-paper text-ink hover:bg-paper-soft",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  withArrow?: boolean;
  className?: string;
  children: React.ReactNode;
};

type ButtonProps = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className"> & {
    href?: undefined;
  };

type LinkProps = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "className" | "href"> & {
    href: string;
  };

export function Button(props: ButtonProps | LinkProps) {
  const {
    variant = "primary",
    size = "md",
    withArrow = false,
    className,
    children,
  } = props;

  const classes = cn("group", base, sizes[size], variants[variant], className);

  const content = (
    <>
      <span>{children}</span>
      {withArrow ? (
        <ArrowRight
          size={size === "lg" ? 18 : 16}
          strokeWidth={2}
          className="transition-transform duration-150 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      ) : null}
    </>
  );

  if ("href" in props && props.href) {
    const {
      variant: _v,
      size: _s,
      withArrow: _w,
      className: _c,
      children: _ch,
      href,
      ...anchorRest
    } = props;
    void _v;
    void _s;
    void _w;
    void _c;
    void _ch;

    const isExternal =
      href.startsWith("http") ||
      href.startsWith("tel:") ||
      href.startsWith("mailto:");

    if (isExternal) {
      return (
        <a className={classes} href={href} {...anchorRest}>
          {content}
        </a>
      );
    }
    return (
      <Link className={classes} href={href} {...anchorRest}>
        {content}
      </Link>
    );
  }

  const {
    variant: _v,
    size: _s,
    withArrow: _w,
    className: _c,
    children: _ch,
    href: _h,
    ...buttonRest
  } = props as ButtonProps;
  void _v;
  void _s;
  void _w;
  void _c;
  void _ch;
  void _h;

  return (
    <button className={classes} {...buttonRest}>
      {content}
    </button>
  );
}

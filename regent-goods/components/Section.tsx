import { Container } from "./Container";
import { cn } from "@/lib/cn";

type Tone = "paper" | "soft" | "ink";

const toneClasses: Record<Tone, string> = {
  paper: "bg-paper text-ink",
  soft: "bg-paper-soft text-ink",
  ink: "bg-ink text-paper",
};

export function Section({
  id,
  tone = "paper",
  className,
  innerClassName,
  children,
  bare = false,
}: {
  id?: string;
  tone?: Tone;
  className?: string;
  innerClassName?: string;
  children: React.ReactNode;
  bare?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-24 py-16 sm:py-20 lg:py-28",
        toneClasses[tone],
        className,
      )}
    >
      {bare ? children : <Container className={innerClassName}>{children}</Container>}
    </section>
  );
}

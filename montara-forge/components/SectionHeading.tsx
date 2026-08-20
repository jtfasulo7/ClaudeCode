/** Numbered section heading: "01 — RECENT WORK" eyebrow + display title. */
export function SectionHeading({
  index,
  eyebrow,
  title,
  align = "left",
}: {
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  align?: "left" | "center";
}) {
  const center = align === "center";
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className={`eyebrow flex items-center gap-3 ${center ? "justify-center" : ""}`}>
        <span className="text-bone-mute">{index}</span>
        <span aria-hidden="true" className="h-px w-8 bg-gold" />
        {eyebrow}
      </p>
      <h2 className="mt-3 font-display text-[2rem] leading-[0.98] text-bone sm:text-[2.75rem]">
        {title}
      </h2>
    </div>
  );
}

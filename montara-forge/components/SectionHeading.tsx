/** Section heading: gold rule + eyebrow label + display title. */
export function SectionHeading({
  eyebrow,
  title,
  align = "left",
}: {
  eyebrow: string;
  title: React.ReactNode;
  align?: "left" | "center";
}) {
  const center = align === "center";
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className={`eyebrow flex items-center gap-3 ${center ? "justify-center" : ""}`}>
        <span aria-hidden="true" className="h-px w-8 bg-gold" />
        {eyebrow}
      </p>
      <h2 className="mt-3 font-display text-[2rem] leading-[0.98] text-bone sm:text-[2.75rem]">
        {title}
      </h2>
    </div>
  );
}

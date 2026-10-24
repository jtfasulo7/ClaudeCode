import Image from "next/image";
import { SectionHeading } from "@/components/SectionHeading";
import { CheckIcon } from "@/components/icons";
import russell from "@/public/images/team/russell.jpg";

/**
 * Introduces Russell. Deliberately no backstory — just who he is, that the
 * crew is small, and that he's the person the visitor will actually deal with.
 */
const POINTS = [
  "Owner of Montara Forge",
  "I run a small crew",
  "I reach out to you myself",
];

export function MeetTheOwner() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="grid items-center gap-8 sm:grid-cols-[0.8fr_1.2fr] sm:gap-12">
        <figure className="relative mx-auto aspect-[4/5] w-full max-w-[20rem] overflow-hidden rounded-xl border border-line bg-ink-2 sm:max-w-none">
          <Image
            src={russell}
            alt="Russell, owner of Montara Forge"
            fill
            sizes="(min-width: 1152px) 430px, (min-width: 640px) 38vw, 320px"
            placeholder="blur"
            className="object-cover"
          />
        </figure>

        <div>
          <SectionHeading
            eyebrow="Meet the Owner"
            title={
              <>
                I&rsquo;m Russell. <span className="text-gold">I own Montara Forge.</span>
              </>
            }
          />
          <p className="mt-5 max-w-xl text-[1.05rem] leading-relaxed text-bone-mute">
            I run a small crew, and you deal with me directly. When you send in your
            project, I&rsquo;m the one who reaches out &mdash; not a call center, not a
            salesperson.
          </p>
          <ul className="mt-6 grid gap-2.5">
            {POINTS.map((point) => (
              <li key={point} className="flex items-center gap-2.5 text-[0.95rem] font-semibold text-bone">
                <CheckIcon className="h-4.5 w-4.5 shrink-0 text-gold" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

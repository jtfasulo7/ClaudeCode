import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import { SectionHeading } from "@/components/SectionHeading";

/**
 * "Recent Work" gallery. Server component — scans /public/images/jobs at
 * build time for the expected filenames, so dropping photos in + redeploying
 * is all it takes.
 *
 * Expected filenames (slots 1–6, any of jpg / jpeg / png / webp):
 *   job-1.jpg                    → single photo
 *   job-1-before.jpg + job-1-after.jpg → before/after pair (preferred)
 *
 * Missing slots are skipped. With no photos at all, the section shows
 * neutral placeholders in development and is hidden in production.
 */

const SLOTS = [1, 2, 3, 4, 5, 6] as const;
const EXTS = ["jpg", "jpeg", "png", "webp"] as const;
const CAPTIONS: Record<number, string> = {
  1: "Covered patio & entry step — new pour",
  2: "New driveway pour",
  3: "Backyard patio",
  4: "Front entry stairs",
  5: "Sidewalk & approach",
  6: "Broom-finish driveway",
};

type JobImage =
  | { kind: "pair"; slot: number; before: string; after: string }
  | { kind: "single"; slot: number; src: string }
  | { kind: "placeholder"; slot: number };

function find(dir: string, base: string): string | null {
  for (const ext of EXTS) {
    const file = `${base}.${ext}`;
    if (fs.existsSync(path.join(/*turbopackIgnore: true*/ dir, file))) return `/images/jobs/${file}`;
  }
  return null;
}

function loadJobs(): JobImage[] {
  const dir = path.join(/*turbopackIgnore: true*/ process.cwd(), "public", "images", "jobs");
  const found: JobImage[] = [];
  for (const slot of SLOTS) {
    const before = find(dir, `job-${slot}-before`);
    const after = find(dir, `job-${slot}-after`);
    const single = find(dir, `job-${slot}`);
    if (before && after) found.push({ kind: "pair", slot, before, after });
    else if (after ?? single) found.push({ kind: "single", slot, src: (after ?? single)! });
  }
  if (found.length > 0) return found;
  if (process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_SHOW_PLACEHOLDERS === "1") {
    return SLOTS.map((slot) => ({ kind: "placeholder", slot }));
  }
  return [];
}

export function Gallery() {
  const jobs = loadJobs();
  if (jobs.length === 0) return null;

  const hasPlaceholders = jobs.some((j) => j.kind === "placeholder");

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <SectionHeading
        index="01"
        eyebrow="Recent Work"
        title={
          <>
            Poured flat. Finished clean. <span className="text-gold">Built to stay that way.</span>
          </>
        }
      />

      <ul
        className={`mt-8 grid gap-2.5 sm:gap-4 ${
          jobs.length === 1 ? "grid-cols-1 sm:max-w-3xl" : "grid-cols-2 lg:grid-cols-3"
        }`}
      >
        {jobs.map((job) => (
          <li
            key={job.slot}
            className="group relative overflow-hidden rounded-lg border border-line bg-ink-2"
          >
            {job.kind === "pair" && <BeforeAfter before={job.before} after={job.after} caption={CAPTIONS[job.slot]} />}
            {job.kind === "single" && (
              <figure className={jobs.length === 1 ? "relative aspect-[16/10]" : "relative aspect-[4/3]"}>
                <Image
                  src={job.src}
                  alt={`${CAPTIONS[job.slot] ?? "Concrete project"} by Montara Forge`}
                  fill
                  sizes={jobs.length === 1 ? "(min-width: 768px) 768px, 100vw" : "(min-width: 1024px) 33vw, 50vw"}
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <Caption text={CAPTIONS[job.slot]} />
              </figure>
            )}
            {job.kind === "placeholder" && (
              <div className="photo-placeholder relative aspect-[4/3]">
                <span className="absolute inset-0 grid place-items-center text-center text-xs font-medium text-bone-mute/70">
                  job-{job.slot}.jpg
                </span>
              </div>
            )}
          </li>
        ))}
      </ul>

      {hasPlaceholders && (
        <p className="mt-4 text-xs text-bone-mute/70">
          Dev placeholders — drop photos into <code>/public/images/jobs/</code> as{" "}
          <code>job-1.jpg</code>…<code>job-6.jpg</code> (or <code>job-N-before.jpg</code> +{" "}
          <code>job-N-after.jpg</code>). Hidden in production until photos exist.
        </p>
      )}
    </section>
  );
}

function Caption({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent px-3 pb-2.5 pt-8 text-xs font-semibold tracking-wide text-bone">
      {text}
    </figcaption>
  );
}

/** Static side-by-side before/after — no JS slider, reads instantly on mobile. */
function BeforeAfter({ before, after, caption }: { before: string; after: string; caption?: string }) {
  return (
    <figure className="relative aspect-[4/3]">
      <div className="absolute inset-0 grid grid-cols-2">
        <div className="relative">
          <Image
            src={before}
            alt={`Before: ${caption ?? "concrete project"}`}
            fill
            sizes="(min-width: 1024px) 17vw, 25vw"
            className="object-cover grayscale-[35%]"
          />
          <Tag>Before</Tag>
        </div>
        <div className="relative border-l-2 border-gold">
          <Image
            src={after}
            alt={`After: ${caption ?? "concrete project"} by Montara Forge`}
            fill
            sizes="(min-width: 1024px) 17vw, 25vw"
            className="object-cover"
          />
          <Tag gold>After</Tag>
        </div>
      </div>
      <Caption text={caption} />
    </figure>
  );
}

function Tag({ children, gold = false }: { children: React.ReactNode; gold?: boolean }) {
  return (
    <span
      className={`absolute left-2 top-2 rounded px-1.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-[0.14em] ${
        gold ? "bg-gold text-ink" : "bg-ink/80 text-bone"
      }`}
    >
      {children}
    </span>
  );
}

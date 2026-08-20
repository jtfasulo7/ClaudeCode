/**
 * Shared form vocabulary — imported by BOTH the client form and the
 * server-side /api/submit-lead route, so the values the browser sends and
 * the values the server validates can never drift apart.
 *
 * Keep this file free of browser- or Node-only imports.
 */

export const PROJECT_TYPES = [
  "driveway-replacement",
  "new-driveway",
  "stairs",
  "sidewalk",
  "patio",
] as const;
export type ProjectType = (typeof PROJECT_TYPES)[number];

export const NEW_OR_REPLACEMENT = ["new", "replacement"] as const;
export type NewOrReplacement = (typeof NEW_OR_REPLACEMENT)[number];

export const SIZE_RANGES = ["small", "medium", "large", "not-sure"] as const;
export type SizeRange = (typeof SIZE_RANGES)[number];

export const TIMELINES = ["asap", "within-month", "1-3-months", "pricing"] as const;
export type Timeline = (typeof TIMELINES)[number];

export interface Option<T extends string> {
  value: T;
  label: string;
  hint?: string;
}

export const PROJECT_OPTIONS: Option<ProjectType>[] = [
  { value: "driveway-replacement", label: "Driveway Replacement", hint: "Tear out & re-pour" },
  { value: "new-driveway", label: "New Driveway", hint: "Fresh pour, nothing there now" },
  { value: "stairs", label: "Stairs" },
  { value: "sidewalk", label: "Sidewalk" },
  { value: "patio", label: "Patio" },
];

export const NEW_OR_REPLACEMENT_OPTIONS: Option<NewOrReplacement>[] = [
  { value: "new", label: "New — nothing there now" },
  { value: "replacement", label: "Replacing existing concrete" },
];

export const SIZE_OPTIONS: Option<SizeRange>[] = [
  { value: "small", label: "Small", hint: "Under ~400 sq ft · walkway, small pad" },
  { value: "medium", label: "Medium", hint: "~400–1,000 sq ft · standard driveway, patio" },
  { value: "large", label: "Large", hint: "Over ~1,000 sq ft · big driveway, multi-area" },
  { value: "not-sure", label: "Not sure", hint: "We'll measure it on-site" },
];

export const TIMELINE_OPTIONS: Option<Timeline>[] = [
  { value: "asap", label: "As soon as possible" },
  { value: "within-month", label: "Within a month" },
  { value: "1-3-months", label: "1–3 months" },
  { value: "pricing", label: "Just getting prices for now" },
];

/**
 * Project types whose "new vs. replacement" answer is implied by the choice
 * itself. The form skips Step 2 for these and sets the value automatically.
 */
export const IMPLIED_NEW_OR_REPLACEMENT: Partial<Record<ProjectType, NewOrReplacement>> = {
  "driveway-replacement": "replacement",
  "new-driveway": "new",
};

/** Human-readable labels for the CRM note / estimate sheet. */
export const LABELS = {
  projectType: Object.fromEntries(PROJECT_OPTIONS.map((o) => [o.value, o.label])) as Record<
    ProjectType,
    string
  >,
  newOrReplacement: {
    new: "New pour (no tear-out)",
    replacement: "Replacing existing (tear-out required)",
  } satisfies Record<NewOrReplacement, string>,
  sizeRange: {
    small: "Small — under ~400 sq ft",
    medium: "Medium — ~400–1,000 sq ft",
    large: "Large — over ~1,000 sq ft",
    "not-sure": "Not sure",
  } satisfies Record<SizeRange, string>,
  timeline: {
    asap: "ASAP",
    "within-month": "Within a month",
    "1-3-months": "1–3 months",
    pricing: "Just getting prices",
  } satisfies Record<Timeline, string>,
};

/** The exact payload POSTed to /api/submit-lead. */
export interface LeadPayload {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  projectType: ProjectType;
  newOrReplacement: NewOrReplacement;
  sizeRange: SizeRange;
  timeline: Timeline;
  location: string;
  /** Whether the location soft-matched our service area (informational). */
  inServiceArea: boolean;
  /** Honeypot — real users never fill this. */
  website?: string;
}

export function isOneOf<T extends string>(list: readonly T[], v: unknown): v is T {
  return typeof v === "string" && (list as readonly string[]).includes(v);
}

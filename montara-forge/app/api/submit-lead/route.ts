import { NextResponse } from "next/server";
import {
  LABELS,
  NEW_OR_REPLACEMENT,
  PROJECT_TYPES,
  SIZE_RANGES,
  TIMELINES,
  isOneOf,
  type LeadPayload,
} from "@/lib/form";
import { toE164 } from "@/lib/phone";
import { type Attribution, describe as describeAttribution } from "@/lib/attribution";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ------------------------------------------------------------------------
 * GoHighLevel custom-field mapping
 *
 * Fields are addressed by their GHL "unique key" (Settings → Custom Fields →
 * Key column, shown as {{contact.<key>}}). Keys are stable and human-readable,
 * so no ID copy-paste is needed. These six fields live in the Montara Forge
 * sub-account under the "Additional Info" folder.
 *
 * Any entry set to "" is skipped. The full answer set is ALSO written to a
 * contact note and to tags as a zero-config fallback.
 * ---------------------------------------------------------------------- */
const CUSTOM_FIELD_KEYS = {
  projectType: "project_type_web",
  newOrReplacement: "tearout_web",
  sizeRange: "approx_size_web",
  timeline: "timeline_web",
  location: "project_location_web",
  estimateSummary: "estimate_summary_web",
} as const;

/**
 * This tag triggers the GHL Workflow that texts the owner, sends the lead
 * their confirmation SMS, etc. Notifications are NOT handled in this code —
 * keep this route's only job "get the contact into GHL, fully annotated".
 */
const LEAD_TAG = "website-lead-montara";

const GHL_BASE = "https://services.leadconnectorhq.com";
const GHL_VERSION = "2021-07-28";

type Validated = Omit<LeadPayload, "website" | "phone" | "attribution"> & {
  phone: string;
  attribution: Attribution | null;
};

/* The channel values the client is allowed to assert.
   It arrives from the browser, so it is checked against a list rather than
   trusted — an unknown value would otherwise become an arbitrary CRM tag. */
const CHANNELS = new Set([
  "meta-paid", "meta-organic", "search", "referral", "direct", "unknown",
]);

/**
 * Attribution, cleaned. Every field optional, every failure silent: this is
 * annotation on a lead and must never be able to reject one.
 */
function validateAttribution(v: unknown): Attribution | null {
  if (!v || typeof v !== "object") return null;
  const a = v as Record<string, unknown>;

  const utmIn = (a.utm && typeof a.utm === "object" ? a.utm : {}) as Record<string, unknown>;
  const utm: Record<string, string> = {};
  for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
    const val = clean(utmIn[k], 200);
    if (val) utm[k] = val;
  }

  const channel = clean(a.channel, 20);
  const out: Attribution = {
    channel: CHANNELS.has(channel) ? (channel as Attribution["channel"]) : "unknown",
    // Presence is the signal, and the value is never displayed — so it is
    // stored only as a flag rather than kept in full.
    ...(clean(a.fbclid, 300) ? { fbclid: "present" } : {}),
    ...(clean(a.gclid, 300) ? { gclid: "present" } : {}),
    ...(Object.keys(utm).length ? { utm } : {}),
    referrer: clean(a.referrer, 500),
    landingPath: clean(a.landingPath, 200),
    firstSeen: clean(a.firstSeen, 40),
  };
  return out;
}

function clean(v: unknown, max = 120): string {
  if (typeof v !== "string") return "";
  // Strip control chars, collapse whitespace, hard cap length.
  return v.replace(/[\x00-\x1f\x7f]/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
}

function validate(body: unknown): { ok: true; data: Validated } | { ok: false; error: string } {
  if (!body || typeof body !== "object") return { ok: false, error: "Invalid body" };
  const b = body as Record<string, unknown>;
  const attribution = validateAttribution(b.attribution);

  const firstName = clean(b.firstName, 60);
  const lastName = clean(b.lastName, 60);
  const phone = toE164(clean(b.phone, 30));
  const emailRaw = clean(b.email, 120).toLowerCase();
  const email = emailRaw && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailRaw) ? emailRaw : undefined;
  const location = clean(b.location, 200);

  if (!firstName) return { ok: false, error: "First name is required" };
  if (!lastName) return { ok: false, error: "Last name is required" };
  if (!phone) return { ok: false, error: "A valid US phone number is required" };
  if (!isOneOf(PROJECT_TYPES, b.projectType)) return { ok: false, error: "Invalid project type" };
  if (!isOneOf(NEW_OR_REPLACEMENT, b.newOrReplacement))
    return { ok: false, error: "Invalid new/replacement value" };
  if (!isOneOf(SIZE_RANGES, b.sizeRange)) return { ok: false, error: "Invalid size range" };
  if (!isOneOf(TIMELINES, b.timeline)) return { ok: false, error: "Invalid timeline" };
  if (!location) return { ok: false, error: "Location is required" };

  return {
    ok: true,
    data: {
      firstName,
      lastName,
      phone,
      email,
      projectType: b.projectType,
      newOrReplacement: b.newOrReplacement,
      sizeRange: b.sizeRange,
      timeline: b.timeline,
      location,
      inServiceArea: b.inServiceArea === true,
      attribution,
    },
  };
}

/** Mini estimate sheet — readable at a glance on the contact record. */
function buildSummary(d: Validated): string {
  return [
    `PROJECT: ${LABELS.projectType[d.projectType]}`,
    `TEAR-OUT: ${d.newOrReplacement === "replacement" ? "Yes (replacing existing)" : "No (new pour)"}`,
    `SIZE: ${LABELS.sizeRange[d.sizeRange]}`,
    `TIMELINE: ${LABELS.timeline[d.timeline]}`,
    `LOCATION: ${d.location}${d.inServiceArea ? "" : " (outside listed area — confirm)"}`,
  ].join(" | ");
}

function buildNote(d: Validated): string {
  return [
    "WEBSITE ESTIMATE REQUEST — Montara Forge landing page",
    "",
    `Project:    ${LABELS.projectType[d.projectType]}`,
    `Tear-out:   ${LABELS.newOrReplacement[d.newOrReplacement]}`,
    `Size:       ${LABELS.sizeRange[d.sizeRange]}`,
    `Timeline:   ${LABELS.timeline[d.timeline]}`,
    `Location:   ${d.location}${d.inServiceArea ? "" : "  ⚠ outside listed service area — confirm on call"}`,
    "",
    `Submitted:  ${new Date().toLocaleString("en-US", { timeZone: "America/Denver" })} MT`,
    "",
    "— WHERE THIS LEAD CAME FROM —",
    d.attribution
      ? describeAttribution(d.attribution)
      : "Not recorded (older page cached, or storage blocked in the browser).",
  ].join("\n");
}

async function ghl(path: string, token: string, body: unknown) {
  const res = await fetch(`${GHL_BASE}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Version: GHL_VERSION,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(10_000),
  });
  const text = await res.text();
  let json: unknown = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    /* non-JSON error body */
  }
  if (!res.ok) {
    throw new Error(`GHL ${path} → ${res.status}: ${text.slice(0, 500)}`);
  }
  return json as Record<string, unknown> | null;
}

/**
 * @returns whether the contact actually reached the CRM.
 *
 * Not void, and not "did it throw": an unconfigured deployment returns early
 * without throwing, which is precisely the case where the lead exists nowhere
 * but a log line. The caller shows a different screen when this is false, so
 * it has to mean the contact was written.
 */
async function pushToGhl(d: Validated): Promise<boolean> {
  const token = process.env.GHL_API_TOKEN?.trim();
  const locationId = process.env.GHL_LOCATION_ID?.trim();
  if (!token || !locationId) {
    console.error(
      "[submit-lead] GHL_API_TOKEN / GHL_LOCATION_ID not set — lead NOT pushed to CRM:",
      buildSummary(d),
      d.phone,
    );
    return false;
  }

  const summary = buildSummary(d);

  const fieldValues: Record<keyof typeof CUSTOM_FIELD_KEYS, string> = {
    projectType: LABELS.projectType[d.projectType],
    newOrReplacement: d.newOrReplacement === "replacement" ? "Yes — replacing existing" : "No — new pour",
    sizeRange: LABELS.sizeRange[d.sizeRange],
    timeline: LABELS.timeline[d.timeline],
    location: d.location,
    estimateSummary: summary,
  };
  const customFields = (Object.keys(CUSTOM_FIELD_KEYS) as (keyof typeof CUSTOM_FIELD_KEYS)[])
    .filter((k) => CUSTOM_FIELD_KEYS[k].length > 0)
    .map((k) => ({ key: CUSTOM_FIELD_KEYS[k], field_value: fieldValues[k] }));

  // Answer tags: visible on every contact with zero configuration, and
  // filterable in Smart Lists. Cheap insurance alongside the note.
  const tags = [
    LEAD_TAG,
    /* WHERE IT CAME FROM, on the contact itself.
       Written as a tag because tags need no configuration — this is filterable
       in a Smart List on the very next lead, whereas a custom field has to be
       created in GHL first. On 2026-09-11 the CRM took three leads and Meta
       attributed one, and nothing recorded anywhere could say why. */
    `src-${d.attribution?.channel ?? "unknown"}`,
    `project-${d.projectType}`,
    d.newOrReplacement === "replacement" ? "tear-out-yes" : "tear-out-no",
    `size-${d.sizeRange}`,
    `timeline-${d.timeline}`,
  ];

  // --- The one required call: create/upsert the contact ------------------
  const upsert = await ghl("/contacts/upsert", token, {
    locationId,
    firstName: d.firstName,
    lastName: d.lastName,
    name: `${d.firstName} ${d.lastName}`,
    phone: d.phone,
    ...(d.email ? { email: d.email } : {}),
    source: "Website — Montara Forge landing page",
    tags,
    ...(customFields.length ? { customFields } : {}),
  });

  // --- Best-effort: pin the estimate sheet as a note on the contact -------
  // The upsert endpoint has no free-text description field, so the note is
  // the only zero-config surface where the owner can read every answer in
  // one place. If this call fails the contact still exists with its tags.
  const contact = (upsert?.contact ?? null) as { id?: string } | null;
  if (contact?.id) {
    try {
      await ghl(`/contacts/${contact.id}/notes`, token, { body: buildNote(d) });
    } catch (err) {
      console.error("[submit-lead] contact created but note failed:", err);
    }
  } else {
    console.error("[submit-lead] upsert succeeded but no contact id in response", upsert);
  }

  /* The contact is written and tagged, which is what triggers the owner's
     notification workflow. A failed NOTE does not make this false — the lead is
     reachable and the answers are on the contact as tags and custom fields. */
  return true;
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot: bots fill every field. Pretend success, do nothing.
  if (body && typeof body === "object" && clean((body as Record<string, unknown>).website)) {
    return NextResponse.json({ ok: true });
  }

  const v = validate(body);
  if (!v.ok) {
    return NextResponse.json({ ok: false, error: v.error }, { status: 400 });
  }

  let captured = false;
  try {
    captured = await pushToGhl(v.data);
  } catch (err) {
    // Still not an error response — a cold lead can do nothing with a 500, and
    // the request itself was fine. But `captured` travels back so the success
    // screen can stop promising a call we have no way to make.
    //
    // This used to be swallowed silently, on the reasoning that the booking
    // widget took their contact a second time. That widget is gone, so this is
    // now the only capture there is.
    console.error("[submit-lead] GHL PUSH FAILED — LEAD NOT IN CRM:", {
      error: err instanceof Error ? err.message : String(err),
      lead: { ...v.data, phone: v.data.phone },
    });
  }

  return NextResponse.json({ ok: true, captured, firstName: v.data.firstName });
}

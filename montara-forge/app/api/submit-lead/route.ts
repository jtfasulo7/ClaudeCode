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

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ------------------------------------------------------------------------
 * GoHighLevel custom-field mapping
 *
 * TODO(owner): paste the real custom field IDs from the Montara Forge
 * sub-account (Settings → Custom Fields → click a field → copy its ID).
 * Any entry still starting with "TODO" is skipped automatically, so the
 * route works before the IDs are filled in — the full answer set is ALSO
 * written to a contact note and to tags (see below) as a zero-config
 * fallback, so the owner never misses the qualifying answers.
 * ---------------------------------------------------------------------- */
const CUSTOM_FIELD_IDS = {
  projectType: "TODO_CUSTOM_FIELD_ID_PROJECT_TYPE",
  newOrReplacement: "TODO_CUSTOM_FIELD_ID_NEW_OR_REPLACEMENT",
  sizeRange: "TODO_CUSTOM_FIELD_ID_SIZE_RANGE",
  timeline: "TODO_CUSTOM_FIELD_ID_TIMELINE",
  location: "TODO_CUSTOM_FIELD_ID_LOCATION",
  estimateSummary: "TODO_CUSTOM_FIELD_ID_ESTIMATE_SUMMARY",
} as const;

/**
 * This tag triggers the GHL Workflow that texts the owner, sends the lead
 * their confirmation SMS, etc. Notifications are NOT handled in this code —
 * keep this route's only job "get the contact into GHL, fully annotated".
 */
const LEAD_TAG = "website-lead-montara";

const GHL_BASE = "https://services.leadconnectorhq.com";
const GHL_VERSION = "2021-07-28";

type Validated = Omit<LeadPayload, "website" | "phone"> & { phone: string };

function clean(v: unknown, max = 120): string {
  if (typeof v !== "string") return "";
  // Strip control chars, collapse whitespace, hard cap length.
  return v.replace(/[\x00-\x1f\x7f]/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
}

function validate(body: unknown): { ok: true; data: Validated } | { ok: false; error: string } {
  if (!body || typeof body !== "object") return { ok: false, error: "Invalid body" };
  const b = body as Record<string, unknown>;

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

async function pushToGhl(d: Validated): Promise<void> {
  const token = process.env.GHL_API_TOKEN?.trim();
  const locationId = process.env.GHL_LOCATION_ID?.trim();
  if (!token || !locationId) {
    console.error(
      "[submit-lead] GHL_API_TOKEN / GHL_LOCATION_ID not set — lead NOT pushed to CRM:",
      buildSummary(d),
      d.phone,
    );
    return;
  }

  const summary = buildSummary(d);

  const fieldValues: Record<keyof typeof CUSTOM_FIELD_IDS, string> = {
    projectType: LABELS.projectType[d.projectType],
    newOrReplacement: LABELS.newOrReplacement[d.newOrReplacement],
    sizeRange: LABELS.sizeRange[d.sizeRange],
    timeline: LABELS.timeline[d.timeline],
    location: d.location,
    estimateSummary: summary,
  };
  const customFields = (Object.keys(CUSTOM_FIELD_IDS) as (keyof typeof CUSTOM_FIELD_IDS)[])
    .filter((k) => !CUSTOM_FIELD_IDS[k].startsWith("TODO"))
    .map((k) => ({ id: CUSTOM_FIELD_IDS[k], field_value: fieldValues[k] }));

  // Answer tags: visible on every contact with zero configuration, and
  // filterable in Smart Lists. Cheap insurance alongside the note.
  const tags = [
    LEAD_TAG,
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

  try {
    await pushToGhl(v.data);
  } catch (err) {
    // Never show a cold lead an error. Log loudly so it's caught in Vercel
    // logs / alerts, but the visitor continues to the calendar. The booking
    // widget captures their contact a second time, so nothing is lost.
    console.error("[submit-lead] GHL PUSH FAILED — LEAD NOT IN CRM:", {
      error: err instanceof Error ? err.message : String(err),
      lead: { ...v.data, phone: v.data.phone },
    });
  }

  return NextResponse.json({ ok: true, firstName: v.data.firstName });
}

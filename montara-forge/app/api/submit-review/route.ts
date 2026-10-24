import { NextResponse } from "next/server";
import { toE164 } from "@/lib/phone";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ------------------------------------------------------------------------
 * Reviews from /review go into GoHighLevel, on the customer's own contact:
 *   - upsert by phone, so a past customer's review lands on the record that
 *     already exists for them rather than on a duplicate
 *   - tags added through the tags endpoint, NOT the upsert — upsert replaces
 *     the tag list, which would strip the lead tags already on the contact
 *   - the review itself as a note
 * Filter by REVIEW_TAG in a Smart List to see every review.
 * ---------------------------------------------------------------------- */
const REVIEW_TAG = "website-review";
/** Added only when the reviewer ticks the box. Nothing is published either way. */
const SHARE_TAG = "review-ok-to-share";

const GHL_BASE = "https://services.leadconnectorhq.com";
const GHL_VERSION = "2021-07-28";

type Review = {
  rating: number;
  review: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  okToShare: boolean;
};

function clean(v: unknown, max = 120): string {
  if (typeof v !== "string") return "";
  return v.replace(/[\x00-\x1f\x7f]/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
}

/** Like clean(), but keeps line breaks — a review can have paragraphs. */
function cleanText(v: unknown, max: number): string {
  if (typeof v !== "string") return "";
  return v
    .replace(/\r\n?/g, "\n")
    .replace(/[\x00-\x09\x0b-\x1f\x7f]/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, max);
}

function validate(body: unknown): { ok: true; data: Review } | { ok: false; error: string } {
  if (!body || typeof body !== "object") return { ok: false, error: "Invalid body" };
  const b = body as Record<string, unknown>;

  const rating = Number(b.rating);
  const review = cleanText(b.review, 4000);
  const firstName = clean(b.firstName, 60);
  const lastName = clean(b.lastName, 60);
  const phone = toE164(clean(b.phone, 30));
  const emailRaw = clean(b.email, 120).toLowerCase();
  const email = emailRaw && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailRaw) ? emailRaw : undefined;

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return { ok: false, error: "Pick a star rating" };
  if (review.length < 3) return { ok: false, error: "Review text is required" };
  if (!firstName) return { ok: false, error: "First name is required" };
  if (!lastName) return { ok: false, error: "Last name is required" };
  if (!phone) return { ok: false, error: "A valid US phone number is required" };

  return {
    ok: true,
    data: { rating, review, firstName, lastName, phone, email, okToShare: b.okToShare === true },
  };
}

function buildNote(r: Review): string {
  return [
    `WEBSITE REVIEW — ${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)} (${r.rating}/5)`,
    "",
    r.review,
    "",
    `From:       ${r.firstName} ${r.lastName}`,
    `OK to share on the website: ${r.okToShare ? "Yes" : "No"}`,
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

/**
 * @returns whether the review text reached the CRM. Unlike a lead, the review
 * IS the note, so a contact without its note counts as not stored.
 */
async function pushToGhl(r: Review): Promise<boolean> {
  const token = process.env.GHL_API_TOKEN?.trim();
  const locationId = process.env.GHL_LOCATION_ID?.trim();
  if (!token || !locationId) {
    console.error("[submit-review] GHL_API_TOKEN / GHL_LOCATION_ID not set — review NOT stored:", r);
    return false;
  }

  // No `source` and no `tags` here: both would overwrite what an existing
  // customer's contact already carries.
  const upsert = await ghl("/contacts/upsert", token, {
    locationId,
    firstName: r.firstName,
    lastName: r.lastName,
    name: `${r.firstName} ${r.lastName}`,
    phone: r.phone,
    ...(r.email ? { email: r.email } : {}),
  });

  const contact = (upsert?.contact ?? null) as { id?: string } | null;
  if (!contact?.id) {
    console.error("[submit-review] upsert succeeded but no contact id in response", upsert);
    return false;
  }

  await ghl(`/contacts/${contact.id}/notes`, token, { body: buildNote(r) });

  // Best-effort: the note already holds everything; the tags are for filtering.
  try {
    await ghl(`/contacts/${contact.id}/tags`, token, {
      tags: [REVIEW_TAG, `review-${r.rating}-star`, ...(r.okToShare ? [SHARE_TAG] : [])],
    });
  } catch (err) {
    console.error("[submit-review] review note saved but tags failed:", err);
  }
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

  try {
    if (await pushToGhl(v.data)) return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[submit-review] GHL PUSH FAILED — REVIEW NOT STORED:", {
      error: err instanceof Error ? err.message : String(err),
      review: v.data,
    });
  }
  // The visitor is told it did not save, so they can retry or text it instead
  // of believing a review exists that nobody will ever read.
  return NextResponse.json({ ok: false, error: "not_stored" }, { status: 502 });
}

import { NextResponse } from "next/server";
import { z } from "zod";
import {
  inquirySchema,
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE,
  MAX_TOTAL_UPLOAD,
} from "@/lib/inquiry-schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const fileEntrySchema = z.object({
  name: z.string().min(1).max(260),
  type: z.string().min(1).max(120),
  size: z.number().int().nonnegative().max(MAX_FILE_SIZE),
  data: z.string().min(1), // base64 (no data: prefix)
});

const bodySchema = inquirySchema.and(
  z.object({
    files: z.array(fileEntrySchema).max(20).optional(),
  }),
);

// TODO: For production scale, swap base64 file embedding for S3 / Vercel Blob
// uploads with presigned URLs. GHL webhook should then receive only file URLs.

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload." },
      { status: 400 },
    );
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed.",
        issues: parsed.error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      },
      { status: 400 },
    );
  }

  const { files = [], ...inquiry } = parsed.data;

  // File guards beyond schema (MIME allowlist + total payload size)
  let totalBytes = 0;
  for (const f of files) {
    if (!ALLOWED_MIME_TYPES.includes(f.type)) {
      return NextResponse.json(
        { error: `Unsupported file type: ${f.type}` },
        { status: 400 },
      );
    }
    totalBytes += f.size;
  }
  if (totalBytes > MAX_TOTAL_UPLOAD) {
    return NextResponse.json(
      { error: "Total upload exceeds maximum allowed size." },
      { status: 413 },
    );
  }

  const webhookUrl = process.env.GHL_WEBHOOK_URL;
  if (!webhookUrl) {
    // In dev / preview without a webhook configured: log and return success.
    // Production must have GHL_WEBHOOK_URL set in Vercel env.
    console.warn(
      "[submit-inquiry] GHL_WEBHOOK_URL not set; payload was validated but not forwarded.",
    );
    return NextResponse.json({
      ok: true,
      forwarded: false,
      message:
        "Inquiry validated. Webhook not configured in this environment.",
    });
  }

  const payload = {
    submittedAt: new Date().toISOString(),
    source: "regentgoodsliquidation.com",
    ...inquiry,
    files,
  };

  try {
    const ghlRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!ghlRes.ok) {
      const text = await ghlRes.text().catch(() => "");
      console.error(
        "[submit-inquiry] GHL webhook returned non-OK:",
        ghlRes.status,
        text.slice(0, 500),
      );
      return NextResponse.json(
        { error: "Submission could not be forwarded. Please try again." },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error("[submit-inquiry] GHL webhook fetch failed:", err);
    return NextResponse.json(
      { error: "Submission could not be sent. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, forwarded: true });
}

export function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST." },
    { status: 405, headers: { Allow: "POST" } },
  );
}

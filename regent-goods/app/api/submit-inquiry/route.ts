import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import {
  inquirySchema,
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE,
  MAX_TOTAL_UPLOAD,
} from "@/lib/inquiry-schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILE_COUNT = 20;

type UploadedFile = {
  name: string;
  url: string;
  pathname: string;
  type: string;
  size: number;
};

function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "anonymous"
  );
}

function safeFileName(name: string): string {
  // Strip any path components; keep extension; sanitize unsafe chars.
  const base = name.split(/[\\/]/).pop() || "file";
  return base.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120) || "file";
}

export async function POST(request: Request) {
  // Parse multipart form data
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Invalid form data." },
      { status: 400 },
    );
  }

  // Extract the JSON payload field carrying validated form values.
  const payloadRaw = formData.get("payload");
  if (typeof payloadRaw !== "string") {
    return NextResponse.json(
      { error: "Missing payload field." },
      { status: 400 },
    );
  }

  let payloadJson: unknown;
  try {
    payloadJson = JSON.parse(payloadRaw);
  } catch {
    return NextResponse.json(
      { error: "Payload field is not valid JSON." },
      { status: 400 },
    );
  }

  const parsed = inquirySchema.safeParse(payloadJson);
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
  const inquiry = parsed.data;

  // Collect File entries from FormData
  const incomingFiles: File[] = [];
  for (const entry of formData.getAll("files")) {
    if (entry instanceof File && entry.size > 0) {
      incomingFiles.push(entry);
    }
  }

  if (incomingFiles.length > MAX_FILE_COUNT) {
    return NextResponse.json(
      { error: `Too many files. Maximum ${MAX_FILE_COUNT} per submission.` },
      { status: 400 },
    );
  }

  // Server-side file guards (MIME allowlist, per-file size, total payload)
  let totalBytes = 0;
  for (const file of incomingFiles) {
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Unsupported file type: ${file.type || "unknown"}` },
        { status: 400 },
      );
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File exceeds 10 MB limit: ${file.name}` },
        { status: 413 },
      );
    }
    totalBytes += file.size;
  }
  if (totalBytes > MAX_TOTAL_UPLOAD) {
    return NextResponse.json(
      { error: "Total upload exceeds maximum allowed size." },
      { status: 413 },
    );
  }

  // Require the Blob token only when files are actually present.
  if (incomingFiles.length > 0 && !process.env.BLOB_READ_WRITE_TOKEN) {
    console.error(
      "[submit-inquiry] BLOB_READ_WRITE_TOKEN is not set; cannot upload files.",
    );
    return NextResponse.json(
      {
        error:
          "File upload service is not configured. Please contact us directly or try again later.",
      },
      { status: 500 },
    );
  }

  // Upload files to Vercel Blob, collect public URLs
  const uploadedFiles: UploadedFile[] = [];
  if (incomingFiles.length > 0) {
    const timestamp = Date.now();
    const companySlug = slugify(inquiry.companyName);
    try {
      const uploads = await Promise.all(
        incomingFiles.map(async (file) => {
          const safeName = safeFileName(file.name);
          const pathname = `regent-goods-uploads/${timestamp}-${companySlug}/${safeName}`;
          // addRandomSuffix defaults to true — guards against name collisions.
          const blob = await put(pathname, file, {
            access: "public",
            contentType: file.type,
          });
          return {
            name: file.name,
            url: blob.url,
            pathname: blob.pathname,
            type: file.type,
            size: file.size,
          } satisfies UploadedFile;
        }),
      );
      uploadedFiles.push(...uploads);
    } catch (err) {
      console.error("[submit-inquiry] Vercel Blob upload failed:", err);
      return NextResponse.json(
        {
          error:
            "We could not upload your files. Please try again, or send them directly to regentgoodsliquidation@gmail.com.",
        },
        { status: 502 },
      );
    }
  }

  // Build webhook payload — URLs only, no binary data
  const webhookPayload = {
    submittedAt: new Date().toISOString(),
    source: "regentgoodsliquidation.com",
    ...inquiry,
    fileCount: uploadedFiles.length,
    files: uploadedFiles.map(({ name, url, type, size }) => ({
      name,
      url,
      type,
      size,
    })),
    fileUrls: uploadedFiles.map((f) => f.url),
  };

  const webhookUrl = process.env.GHL_WEBHOOK_URL;
  if (!webhookUrl) {
    // Dev / preview without a webhook configured: log and return success
    // (files were still uploaded so they aren't lost).
    console.warn(
      "[submit-inquiry] GHL_WEBHOOK_URL not set; payload was validated but not forwarded.",
    );
    return NextResponse.json({
      ok: true,
      forwarded: false,
      fileUrls: webhookPayload.fileUrls,
      message: "Inquiry validated. Webhook not configured in this environment.",
    });
  }

  try {
    const ghlRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(webhookPayload),
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

  return NextResponse.json({
    ok: true,
    forwarded: true,
    fileUrls: webhookPayload.fileUrls,
  });
}

export function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST." },
    { status: 405, headers: { Allow: "POST" } },
  );
}

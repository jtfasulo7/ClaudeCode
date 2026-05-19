"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

import {
  inquirySchema,
  type InquiryPayload,
  type InquiryType,
} from "@/lib/inquiry-schema";
import { Button } from "../Button";
import { FieldGroup, FieldShell, TextArea, TextInput } from "./Field";
import { InquiryTypeSelect } from "./InquiryTypeSelect";
import { FileUpload } from "./FileUpload";

type FormStatus = "idle" | "submitting" | "success" | "error";

async function fileToBase64(
  file: File,
): Promise<{ name: string; type: string; size: number; data: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.includes(",") ? result.split(",")[1] : result;
      resolve({ name: file.name, type: file.type, size: file.size, data: base64 });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function InquiryForm() {
  const [inquiryType, setInquiryType] = useState<InquiryType | "">("");
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<InquiryPayload>({
    resolver: zodResolver(inquirySchema) as never,
    shouldUnregister: true,
    mode: "onBlur",
  });

  const handleTypeChange = (next: InquiryType) => {
    setInquiryType(next);
    setValue("inquiryType", next, { shouldValidate: false });
  };

  const onSubmit: SubmitHandler<InquiryPayload> = async (values) => {
    setStatus("submitting");
    setServerError(null);
    try {
      // TODO: For production scale, upload files to S3 via presigned URL rather
      // than base64-encoding into the JSON payload. This is a temporary approach.
      const encodedFiles = await Promise.all(files.map(fileToBase64));

      const res = await fetch("/api/submit-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, files: encodedFiles }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || "Submission failed");
      }

      setStatus("success");
      reset();
      setFiles([]);
      setInquiryType("");
    } catch (err) {
      setStatus("error");
      setServerError(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    }
  };

  if (status === "success") {
    return (
      <div className="border border-line bg-paper-soft p-10 sm:p-14">
        <div className="flex items-start gap-4">
          <CheckCircle2 size={32} strokeWidth={1.5} className="shrink-0 text-navy" />
          <div>
            <h2 className="display text-[28px] font-extrabold tracking-tight sm:text-[32px]">
              Thanks. We received your inquiry.
            </h2>
            <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-text">
              Our team will review your submission and respond within one
              business day. We&rsquo;ll be in touch at the email and phone you
              provided.
            </p>
            <div className="mt-8">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-[15px] font-medium text-navy hover:text-navy-hover"
              >
                Return Home
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Helper: typed access to errors that may or may not exist depending on type
  const e = errors as Record<string, { message?: string } | undefined>;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-10"
    >
      {/* Hidden registered field for inquiryType */}
      <input type="hidden" {...register("inquiryType")} value={inquiryType} />

      <InquiryTypeSelect value={inquiryType} onChange={handleTypeChange} />

      {e.inquiryType?.message ? (
        <p className="text-[12.5px] text-[#a51c1c]" role="alert">
          Please select an inquiry type.
        </p>
      ) : null}

      {inquiryType ? (
        <div className="space-y-10 field-enter">
          {/* Shared identity fields */}
          <div>
            <h3 className="eyebrow text-text-soft">Your details</h3>
            <FieldGroup className="mt-5">
              <FieldShell
                label="Full name"
                htmlFor="fullName"
                required
                error={e.fullName?.message}
              >
                <TextInput
                  id="fullName"
                  autoComplete="name"
                  invalid={!!e.fullName}
                  {...register("fullName")}
                />
              </FieldShell>
              <FieldShell
                label="Company name"
                htmlFor="companyName"
                required
                error={e.companyName?.message}
              >
                <TextInput
                  id="companyName"
                  autoComplete="organization"
                  invalid={!!e.companyName}
                  {...register("companyName")}
                />
              </FieldShell>
              <FieldShell
                label="Email"
                htmlFor="email"
                required
                error={e.email?.message}
              >
                <TextInput
                  id="email"
                  type="email"
                  autoComplete="email"
                  invalid={!!e.email}
                  {...register("email")}
                />
              </FieldShell>
              <FieldShell
                label="Phone number"
                htmlFor="phone"
                required
                error={e.phone?.message}
              >
                <TextInput
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  invalid={!!e.phone}
                  {...register("phone")}
                />
              </FieldShell>
            </FieldGroup>
          </div>

          {/* Brand / Distributor */}
          {inquiryType === "brand" ? (
            <div>
              <h3 className="eyebrow text-text-soft">Wholesale details</h3>
              <FieldGroup className="mt-5">
                <FieldShell
                  label="Product category / specialty"
                  htmlFor="productCategory"
                  required
                  error={e.productCategory?.message}
                  fullWidth
                >
                  <TextInput
                    id="productCategory"
                    placeholder="e.g. color cosmetics, skincare, fragrance"
                    invalid={!!e.productCategory}
                    {...register("productCategory")}
                  />
                </FieldShell>
                <FieldShell
                  label="Wholesale pricing structure offered"
                  htmlFor="pricingStructure"
                  hint="Optional"
                  error={e.pricingStructure?.message}
                  fullWidth
                >
                  <TextArea
                    id="pricingStructure"
                    rows={3}
                    invalid={!!e.pricingStructure}
                    {...register("pricingStructure")}
                  />
                </FieldShell>
                <FieldShell
                  label="Current distribution channels"
                  htmlFor="distributionChannels"
                  hint="Optional"
                  error={e.distributionChannels?.message}
                  fullWidth
                >
                  <TextInput
                    id="distributionChannels"
                    placeholder="e.g. retail, Amazon, DTC, distributors"
                    invalid={!!e.distributionChannels}
                    {...register("distributionChannels")}
                  />
                </FieldShell>
                <FieldShell
                  label="Minimum order quantity"
                  htmlFor="minimumOrderQuantity"
                  hint="Optional"
                  error={e.minimumOrderQuantity?.message}
                >
                  <TextInput
                    id="minimumOrderQuantity"
                    invalid={!!e.minimumOrderQuantity}
                    {...register("minimumOrderQuantity")}
                  />
                </FieldShell>
                <FieldShell
                  label="Approximate annual revenue / volume"
                  htmlFor="annualVolume"
                  hint="Optional"
                  error={e.annualVolume?.message}
                >
                  <TextInput
                    id="annualVolume"
                    invalid={!!e.annualVolume}
                    {...register("annualVolume")}
                  />
                </FieldShell>
              </FieldGroup>
            </div>
          ) : null}

          {/* Liquidator */}
          {inquiryType === "liquidator" ? (
            <div>
              <h3 className="eyebrow text-text-soft">Liquidation details</h3>
              <FieldGroup className="mt-5">
                <FieldShell
                  label="Inventory category"
                  htmlFor="inventoryCategory"
                  required
                  error={e.inventoryCategory?.message}
                  fullWidth
                >
                  <TextInput
                    id="inventoryCategory"
                    placeholder="e.g. cosmetics — skincare, color, fragrance"
                    invalid={!!e.inventoryCategory}
                    {...register("inventoryCategory")}
                  />
                </FieldShell>
                <FieldShell
                  label="Estimated quantity / pallet count"
                  htmlFor="estimatedQuantity"
                  required
                  error={e.estimatedQuantity?.message}
                >
                  <TextInput
                    id="estimatedQuantity"
                    invalid={!!e.estimatedQuantity}
                    {...register("estimatedQuantity")}
                  />
                </FieldShell>
                <FieldShell
                  label="Condition of inventory"
                  htmlFor="condition"
                  required
                  error={e.condition?.message}
                >
                  <TextInput
                    id="condition"
                    placeholder="new in box, shelf pulls, mixed, customer returns…"
                    invalid={!!e.condition}
                    {...register("condition")}
                  />
                </FieldShell>
                <FieldShell
                  label="Asking price range"
                  htmlFor="askingPrice"
                  hint="Optional"
                  error={e.askingPrice?.message}
                  fullWidth
                >
                  <TextInput
                    id="askingPrice"
                    invalid={!!e.askingPrice}
                    {...register("askingPrice")}
                  />
                </FieldShell>
              </FieldGroup>
            </div>
          ) : null}

          {/* Retail */}
          {inquiryType === "retail" ? (
            <div>
              <h3 className="eyebrow text-text-soft">Retail liquidation details</h3>
              <FieldGroup className="mt-5">
                <FieldShell
                  label="Store type / size"
                  htmlFor="storeType"
                  required
                  error={e.storeType?.message}
                >
                  <TextInput
                    id="storeType"
                    invalid={!!e.storeType}
                    {...register("storeType")}
                  />
                </FieldShell>
                <FieldShell
                  label="Reason for liquidation"
                  htmlFor="reason"
                  required
                  error={e.reason?.message}
                >
                  <TextInput
                    id="reason"
                    placeholder="overstock, closeout, going out of business…"
                    invalid={!!e.reason}
                    {...register("reason")}
                  />
                </FieldShell>
                <FieldShell
                  label="Inventory categories available"
                  htmlFor="categories"
                  required
                  error={e.categories?.message}
                  fullWidth
                >
                  <TextInput
                    id="categories"
                    invalid={!!e.categories}
                    {...register("categories")}
                  />
                </FieldShell>
                <FieldShell
                  label="Estimated retail value of inventory"
                  htmlFor="estimatedRetailValue"
                  hint="Optional"
                  error={e.estimatedRetailValue?.message}
                >
                  <TextInput
                    id="estimatedRetailValue"
                    invalid={!!e.estimatedRetailValue}
                    {...register("estimatedRetailValue")}
                  />
                </FieldShell>
                <FieldShell
                  label="Timeline to move inventory"
                  htmlFor="timeline"
                  required
                  error={e.timeline?.message}
                >
                  <TextInput
                    id="timeline"
                    placeholder="ASAP, 2 weeks, 30 days, flexible…"
                    invalid={!!e.timeline}
                    {...register("timeline")}
                  />
                </FieldShell>
              </FieldGroup>
            </div>
          ) : null}

          {/* Shared bottom: notes + files */}
          <div>
            <h3 className="eyebrow text-text-soft">Additional information</h3>
            <div className="mt-5 space-y-5">
              <FieldShell
                label="Brief description / notes"
                htmlFor="notes"
                hint="Optional"
                error={e.notes?.message}
              >
                <TextArea
                  id="notes"
                  rows={5}
                  placeholder="Anything else we should know?"
                  invalid={!!e.notes}
                  {...register("notes")}
                />
              </FieldShell>
              <FileUpload
                files={files}
                onChange={setFiles}
                required={inquiryType === "liquidator"}
              />
            </div>
          </div>

          {/* Submit */}
          <div className="border-t border-line pt-8">
            {status === "error" && serverError ? (
              <p className="mb-4 text-[14px] text-[#a51c1c]" role="alert">
                {serverError}
              </p>
            ) : null}
            <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[12.5px] leading-relaxed text-text-soft sm:max-w-md">
                By submitting, you authorize Regent Goods Wholesale &amp;
                Liquidation to contact you about your inquiry.
              </p>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                withArrow
                disabled={isSubmitting || status === "submitting"}
                className="w-full sm:w-auto"
              >
                {isSubmitting || status === "submitting"
                  ? "Submitting…"
                  : "Submit Inquiry"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </form>
  );
}

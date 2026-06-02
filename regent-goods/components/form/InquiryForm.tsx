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
    resolver: zodResolver(inquirySchema),
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
      // Send form fields as a JSON payload string + each file as a binary part
      // (multipart/form-data). The API route uploads files to Vercel Blob and
      // forwards only URLs to the downstream webhook.
      const formData = new FormData();
      formData.append("payload", JSON.stringify(values));
      for (const file of files) {
        formData.append("files", file, file.name);
      }

      const res = await fetch("/api/submit-inquiry", {
        method: "POST",
        body: formData,
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-10">
      {/* Hidden registered field for inquiryType */}
      <input type="hidden" {...register("inquiryType")} value={inquiryType} />

      <InquiryTypeSelect value={inquiryType} onChange={handleTypeChange} />

      {errors.inquiryType?.message ? (
        <p className="text-[12.5px] text-[#a51c1c]" role="alert">
          {errors.inquiryType.message}
        </p>
      ) : null}

      {inquiryType ? (
        <div className="space-y-10 field-enter">
          {/* Identity */}
          <div>
            <h3 className="eyebrow text-text-soft">Your details</h3>
            <FieldGroup className="mt-5">
              <FieldShell
                label="Full name"
                htmlFor="fullName"
                required
                error={errors.fullName?.message}
              >
                <TextInput
                  id="fullName"
                  autoComplete="name"
                  invalid={!!errors.fullName}
                  {...register("fullName")}
                />
              </FieldShell>
              <FieldShell
                label="Company name"
                htmlFor="companyName"
                required
                error={errors.companyName?.message}
              >
                <TextInput
                  id="companyName"
                  autoComplete="organization"
                  invalid={!!errors.companyName}
                  {...register("companyName")}
                />
              </FieldShell>
              <FieldShell
                label="Email"
                htmlFor="email"
                required
                error={errors.email?.message}
              >
                <TextInput
                  id="email"
                  type="email"
                  autoComplete="email"
                  invalid={!!errors.email}
                  {...register("email")}
                />
              </FieldShell>
              <FieldShell
                label="Phone number"
                htmlFor="phone"
                required
                error={errors.phone?.message}
              >
                <TextInput
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  invalid={!!errors.phone}
                  {...register("phone")}
                />
              </FieldShell>
            </FieldGroup>
          </div>

          {/* Inventory */}
          <div>
            <h3 className="eyebrow text-text-soft">About your inventory</h3>
            <FieldGroup className="mt-5">
              <FieldShell
                label="Company type / role"
                htmlFor="companyType"
                required
                error={errors.companyType?.message}
                fullWidth
              >
                <TextInput
                  id="companyType"
                  placeholder="e.g. consumer brand, distributor, liquidator, retail chain"
                  invalid={!!errors.companyType}
                  {...register("companyType")}
                />
              </FieldShell>
              <FieldShell
                label="Inventory category"
                htmlFor="inventoryCategory"
                required
                error={errors.inventoryCategory?.message}
                fullWidth
              >
                <TextInput
                  id="inventoryCategory"
                  placeholder="e.g. trending consumer products, electronics, home goods, beauty"
                  invalid={!!errors.inventoryCategory}
                  {...register("inventoryCategory")}
                />
              </FieldShell>
              <FieldShell
                label="Estimated quantity"
                htmlFor="estimatedQuantity"
                required
                hint="Units, pallets, or value"
                error={errors.estimatedQuantity?.message}
                fullWidth
              >
                <TextInput
                  id="estimatedQuantity"
                  placeholder="e.g. 5 pallets, ~2,000 units, $40k retail value"
                  invalid={!!errors.estimatedQuantity}
                  {...register("estimatedQuantity")}
                />
              </FieldShell>
            </FieldGroup>
          </div>

          {/* Notes + files */}
          <div>
            <h3 className="eyebrow text-text-soft">Additional information</h3>
            <div className="mt-5 space-y-5">
              <FieldShell
                label="Notes / description"
                htmlFor="notes"
                hint="Optional"
                error={errors.notes?.message}
              >
                <TextArea
                  id="notes"
                  rows={5}
                  placeholder="Anything else we should know — condition, timeline, asking price, etc."
                  invalid={!!errors.notes}
                  {...register("notes")}
                />
              </FieldShell>
              <FileUpload files={files} onChange={setFiles} />
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

import { z } from "zod";

export const inquiryTypes = ["brand", "liquidator", "retail"] as const;
export type InquiryType = (typeof inquiryTypes)[number];

export const inquiryTypeLabels: Record<InquiryType, string> = {
  brand: "Brand or Distributor",
  liquidator: "Liquidator",
  retail: "Retail Store",
};

export const inquiryTypeDescriptions: Record<InquiryType, string> = {
  brand: "Wholesale partnership",
  liquidator: "Selling inventory or pallets",
  retail: "Liquidating excess inventory",
};

const phoneRegex = /^[+()\-\s\d.]{7,}$/;

export const inquirySchema = z.object({
  inquiryType: z.enum(inquiryTypes, {
    message: "Please select an inquiry type",
  }),
  fullName: z.string().trim().min(1, "Full name is required").max(120),
  companyName: z.string().trim().min(1, "Company name is required").max(180),
  email: z.string().trim().email("Enter a valid email"),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number")
    .regex(phoneRegex, "Enter a valid phone number"),
  companyType: z
    .string()
    .trim()
    .min(1, "Tell us a bit about your company / role")
    .max(240),
  inventoryCategory: z
    .string()
    .trim()
    .min(1, "Inventory category is required")
    .max(240),
  estimatedQuantity: z
    .string()
    .trim()
    .min(1, "Estimated quantity is required")
    .max(240),
  notes: z.string().trim().max(4000).optional().or(z.literal("")),
});

export type InquiryPayload = z.infer<typeof inquirySchema>;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB per file
export const MAX_TOTAL_UPLOAD = 25 * 1024 * 1024; // 25 MB total payload guard
export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

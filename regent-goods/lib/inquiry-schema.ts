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

const baseSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required").max(120),
  companyName: z.string().trim().min(1, "Company name is required").max(180),
  email: z.string().trim().email("Enter a valid email"),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number")
    .regex(phoneRegex, "Enter a valid phone number"),
  notes: z.string().trim().max(4000).optional().or(z.literal("")),
});

export const brandSchema = baseSchema.extend({
  inquiryType: z.literal("brand"),
  productCategory: z.string().trim().min(1, "Product category is required").max(240),
  pricingStructure: z.string().trim().max(2000).optional().or(z.literal("")),
  distributionChannels: z.string().trim().max(800).optional().or(z.literal("")),
  minimumOrderQuantity: z.string().trim().max(160).optional().or(z.literal("")),
  annualVolume: z.string().trim().max(160).optional().or(z.literal("")),
});

export const liquidatorSchema = baseSchema.extend({
  inquiryType: z.literal("liquidator"),
  inventoryCategory: z.string().trim().min(1, "Inventory category is required").max(240),
  estimatedQuantity: z.string().trim().min(1, "Estimated quantity is required").max(240),
  condition: z.string().trim().min(1, "Condition is required").max(240),
  askingPrice: z.string().trim().max(240).optional().or(z.literal("")),
});

export const retailSchema = baseSchema.extend({
  inquiryType: z.literal("retail"),
  storeType: z.string().trim().min(1, "Store type / size is required").max(240),
  reason: z.string().trim().min(1, "Reason for liquidation is required").max(240),
  categories: z.string().trim().min(1, "Inventory categories are required").max(400),
  estimatedRetailValue: z.string().trim().max(160).optional().or(z.literal("")),
  timeline: z.string().trim().min(1, "Timeline is required").max(240),
});

export const inquirySchema = z.discriminatedUnion("inquiryType", [
  brandSchema,
  liquidatorSchema,
  retailSchema,
]);

export type InquiryPayload = z.infer<typeof inquirySchema>;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB per file
export const MAX_TOTAL_UPLOAD = 25 * 1024 * 1024; // 25 MB total payload guard
export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

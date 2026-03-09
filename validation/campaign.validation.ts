import { z } from 'zod';

export const createCampaignSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase and contain only letters, numbers, and hyphens'),
  description: z.string().optional(),
  discountDefault: z.coerce.number().min(0).max(100),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  isActive: z.boolean().default(true),
  file: z.any().optional(),
}).refine(data => new Date(data.startDate) < new Date(data.endDate), {
  message: "End date must be after start date",
  path: ["endDate"],
});

export const updateCampaignSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').optional(),
  slug: z.string().min(3, 'Slug must be at least 3 characters').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase and contain only letters, numbers, and hyphens').optional(),
  description: z.string().optional(),
  discountDefault: z.coerce.number().min(0).max(100).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  isActive: z.boolean().optional(),
  file: z.any().optional(),
});

export const addProductToCampaignSchema = z.object({
  productId: z.coerce.number().min(1, 'Product is required'),
  customDiscountPercentage: z.coerce.number().min(0).max(100).optional(),
});

export type CreateCampaignFormData = z.infer<typeof createCampaignSchema>;
export type UpdateCampaignFormData = z.infer<typeof updateCampaignSchema>;
export type AddProductToCampaignFormData = z.infer<typeof addProductToCampaignSchema>;

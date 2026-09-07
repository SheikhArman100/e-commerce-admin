import { z } from 'zod';

// Discount value is a % (0–100) for PERCENTAGE coupons or a flat ৳ amount
// for FIXED — so no upper bound here; the type selects the meaning.
const discountValueValidator = z.coerce.number().min(0);

export const createCampaignSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase and contain only letters, numbers, and hyphens'),
  description: z.string().optional(),
  discountType: z.enum(['PERCENTAGE', 'FIXED']).default('PERCENTAGE'),
  discountDefault: discountValueValidator,
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  // No isActive — campaigns are always created inactive (activation via update)
  file: z.any().optional(),
});

export const updateCampaignSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').optional(),
  slug: z.string().min(3, 'Slug must be at least 3 characters').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase and contain only letters, numbers, and hyphens').optional(),
  description: z.string().optional(),
  discountType: z.enum(['PERCENTAGE', 'FIXED']).optional(),
  discountDefault: discountValueValidator.optional(),
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

import { z } from 'zod';

// Reusable field validators
const codeValidator = z
  .string({ error: 'Coupon code is required' })
  .min(1, 'Coupon code is required')
  .min(3, 'Coupon code must be at least 3 characters')
  .max(20, 'Coupon code must not exceed 20 characters')
  .regex(/^[A-Z0-9]+$/, 'Coupon code must be uppercase and alphanumeric')
  .trim();

const discountTypeValidator = z.enum(['FIXED', 'PERCENTAGE'], {
  error: 'Discount type is required',
});

const discountValueValidator = z.coerce
  .number({ error: 'Discount value is required' })
  .positive('Discount value must be positive');

const amountValidator = z.coerce
  .number()
  .min(0, 'Amount must be greater than or equal to 0')
  .optional();

const dateValidator = z
  .string({ error: 'Expiry date is required' })
  .refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid date format',
  });

// Coupon Management Validation Schemas
export const createCouponSchema = z.object({
  code: codeValidator,
  discountType: discountTypeValidator,
  discountValue: discountValueValidator,
  minOrderAmount: amountValidator,
  maxDiscountAmount: amountValidator,
  expiryDate: dateValidator,
  usageLimit: z.coerce.number().int().min(0).optional(),
  isActive: z.boolean().optional().default(true),
});

export const updateCouponSchema = z.object({
  code: codeValidator.optional(),
  discountType: discountTypeValidator.optional(),
  discountValue: z.preprocess((val) => (typeof val === 'string' ? Number(val) : val), z.number().positive()).optional(),
  minOrderAmount: z.preprocess((val) => (typeof val === 'string' ? Number(val) : val), z.number().min(0)).optional(),
  maxDiscountAmount: z.preprocess((val) => (typeof val === 'string' ? Number(val) : val), z.number().min(0)).optional(),
  expiryDate: dateValidator.optional(),
  usageLimit: z.preprocess((val) => (typeof val === 'string' ? Number(val) : val), z.number().int().min(0)).optional(),
  isActive: z.boolean().optional(),
});

export const couponFiltersSchema = z.object({
  searchTerm: z.string().optional(),
  code: z.string().optional(),
  discountType: z.enum(['FIXED', 'PERCENTAGE']).optional(),
  isActive: z.string().optional(),
  page: z.number().int().min(1).optional().default(1),
  limit: z.number().int().min(1).max(100).optional().default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
});

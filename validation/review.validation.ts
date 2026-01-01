import { z } from 'zod';

// Reusable validators
const ratingValidator = z
  .number()
  .int()
  .min(1, 'Rating must be at least 1')
  .max(5, 'Rating cannot exceed 5');

const commentValidator = z
  .string()
  .min(10, 'Comment must be at least 10 characters')
  .max(500, 'Comment cannot exceed 500 characters');

const orderIdValidator = z
  .string()
  .min(1, 'Order ID is required');

const productIdValidator = z
  .string()
  .min(1, 'Product ID is required');

// Create review schema
export const createReviewSchema = z.object({
  rating: ratingValidator,
  comment: commentValidator,
  orderId: orderIdValidator,
  productId: productIdValidator,
  images: z.array(z.instanceof(File)).optional(),
});

// Update review schema (all fields optional)
export const updateReviewSchema = z.object({
  rating: ratingValidator.optional(),
  comment: commentValidator.optional(),
  isHide: z.boolean().optional(),
});

// Filter schema for reviews
export const reviewFiltersSchema = z.object({
  searchTerm: z.string().optional(),
  rating: z.string().optional(),
  isHide: z.string().optional(),
  userId: z.string().optional(),
  productId: z.string().optional(),
  orderId: z.string().optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

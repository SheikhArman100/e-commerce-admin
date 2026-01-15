import { z } from 'zod';

// Reusable validators
const productIdValidator = z
  .string()
  .min(1, 'Product ID is required');

const flavorIdValidator = z
  .string()
  .min(1, 'Flavor ID is required');

const sizeIdValidator = z
  .string()
  .min(1, 'Size ID is required');

const quantityValidator = z
  .number()
  .int()
  .positive('Quantity must be a positive integer')
  .max(99, 'Quantity cannot exceed 99');

// Create cart schema (add item to cart)
export const createCartSchema = z.object({
  body: z.object({
    productId: productIdValidator,
    flavorId: flavorIdValidator,
    sizeId: sizeIdValidator,
    quantity: quantityValidator.optional().default(1),
  }).strict()
});

// Update cart item schema
export const updateCartItemSchema = z.object({
  body: z.object({
    quantity: quantityValidator,
  }).strict()
});

// Filter schema for carts
export const cartFiltersSchema = z.object({
  searchTerm: z.string().optional(),
  userId: z.string().optional(),
  productId: z.string().optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

// Frontend form validation schemas
export const cartFormSchema = z.object({
  productId: productIdValidator,
  flavorId: flavorIdValidator,
  sizeId: sizeIdValidator,
  quantity: quantityValidator,
});

export const updateCartItemFormSchema = z.object({
  quantity: quantityValidator,
});

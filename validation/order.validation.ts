import { z } from 'zod';
import { OrderStatus } from '@/types/order.types';

// Create order schema (no payload needed - creates from cart)
export const createOrderSchema = z.object({
  body: z.object({
    // Empty body - order created from current user's cart
  }).strict()
});

// Update order status schema (admin only)
export const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.nativeEnum(OrderStatus)
  }).strict()
});

// Get orders schema (admin filtering)
export const getOrdersSchema = z.object({
  query: z.object({
    searchTerm: z.string().optional(),
    userId: z.string().optional(),
    status: z.nativeEnum(OrderStatus).optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional()
  }).strict()
});

// Get user orders schema (basic pagination)
export const getUserOrdersSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional()
  }).strict()
});

// Frontend form validation schemas
export const orderStatusFormSchema = z.object({
  status: z.nativeEnum(OrderStatus)
});

// Order filters for frontend
export const orderFiltersSchema = z.object({
  searchTerm: z.string().optional(),
  userId: z.string().optional(),
  status: z.nativeEnum(OrderStatus).optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

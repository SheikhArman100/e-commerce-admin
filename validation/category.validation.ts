import { z } from 'zod';

// Reusable field validators
const nameValidator = (fieldName: string) =>
  z
    .string({ error: `${fieldName} is required` })
    .min(1, `${fieldName} is required`)
    .min(3, `${fieldName} must be at least 3 characters`)
    .max(100, `${fieldName} must not exceed 100 characters`)
    .trim();

const slugValidator = z
  .string()
  .min(1, 'Slug is required')
  .max(150, 'Slug must not exceed 150 characters')
  .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens');

const descriptionValidator = z
  .string()
  .min(1, 'Description is required')
  .max(500, 'Description must not exceed 500 characters');

// Category Management Validation Schemas
export const createCategorySchema = z.object({
  name: nameValidator('Name'),
  slug: slugValidator,
  description: descriptionValidator,
  isActive: z.boolean(),
  displayOrder: z.number().int().min(0, 'Display order must be 0 or greater'),
});

export const updateCategorySchema = z.object({
  name: nameValidator('Name').optional(),
  slug: slugValidator,
  description: descriptionValidator,
  isActive: z.boolean().optional(),
  displayOrder: z.number().int().min(0, 'Display order must be 0 or greater').optional(),
});

export const categoryFiltersSchema = z.object({
  searchTerm: z.string().optional(),
  isActive: z.string().optional(),
  displayOrder: z.string().optional(),
  page: z.number().int().min(1).optional().default(1),
  limit: z.number().int().min(1).max(100).optional().default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
});

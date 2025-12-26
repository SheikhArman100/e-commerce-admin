import { z } from 'zod';

// Reusable field validators
const nameValidator = (fieldName: string) =>
  z
    .string({ error: `${fieldName} is required` })
    .min(1, `${fieldName} is required`)
    .max(100, `${fieldName} must not exceed 100 characters`)
    .trim();

const descriptionValidator = z
  .string()
  .min(1, 'Description is required')
  .max(500, 'Description must not exceed 500 characters');

// Size Management Validation Schemas
export const createSizeSchema = z.object({
  name: nameValidator('Name'),
  description: descriptionValidator,
  isActive: z.boolean(),
});

export const updateSizeSchema = z.object({
  name: nameValidator('Name').optional(),
  description: descriptionValidator.optional(),
  isActive: z.boolean().optional(),
});

export const sizeFiltersSchema = z.object({
  searchTerm: z.string().optional(),
  name: z.string().optional(),
  isActive: z.string().optional(),
  page: z.number().int().min(1).optional().default(1),
  limit: z.number().int().min(1).max(100).optional().default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
});

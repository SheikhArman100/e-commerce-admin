import { z } from 'zod';

// Reusable validators
const titleValidator = z
  .string()
  .min(2, 'Title must be at least 2 characters')
  .max(100, 'Title must not exceed 100 characters')
  .regex(/^[a-zA-Z0-9\s\-'&]+$/, 'Title can only contain letters, numbers, spaces, hyphens, ampersands, and apostrophes');

const descriptionValidator = z
  .string()
  .min(10, 'Description must be at least 10 characters')
  .max(1000, 'Description must not exceed 1000 characters');

const categoryIdValidator = z
  .string()
  .min(1, 'Category is required')
  .regex(/^\d+$/, 'Invalid category ID');

const stockValidator = z
  .string()
  .min(1, 'Stock is required')
  .regex(/^\d+$/, 'Stock must be a valid number')
  .refine(val => parseInt(val) >= 0, 'Stock cannot be negative');

const priceValidator = z
  .string()
  .min(1, 'Price is required')
  .regex(/^\d+(\.\d{1,2})?$/, 'Price must be a valid number with up to 2 decimal places')
  .refine(val => parseFloat(val) > 0, 'Price must be greater than 0');

const flavorIdValidator = z
  .string()
  .min(1, 'Flavor is required')
  .regex(/^\d+$/, 'Invalid flavor ID');

const sizeIdValidator = z
  .string()
  .min(1, 'Size is required')
  .regex(/^\d+$/, 'Invalid size ID');

// Size schema for individual size entries
const sizeSchema = z.object({
  sizeId: sizeIdValidator,
  stock: stockValidator,
  price: priceValidator,
});

// Flavor schema for product creation/update
const flavorSchema = z.object({
  flavorId: flavorIdValidator,
  soldByQuantity: z.boolean().optional().default(false),
}).and(
  z.union([
    // Size-based product validation
    z.object({
      soldByQuantity: z.literal(false).optional().default(false),
      sizes: z
        .array(sizeSchema)
        .min(1, 'At least one size is required for each flavor')
        .max(10, 'Maximum 10 sizes per flavor'),
      stock: z.undefined(),
      price: z.undefined(),
    }),
    // Quantity-based product validation
    z.object({
      soldByQuantity: z.literal(true),
      sizes: z.undefined(),
      stock: stockValidator,
      price: priceValidator,
    }),
  ])
);

// File validation for images
const imageFileValidator = z
  .instanceof(File)
  .refine(
    (file) => file.size <= 5 * 1024 * 1024, // 5MB max
    'Image file size must be less than 5MB'
  )
  .refine(
    (file) => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type),
    'Only JPEG, PNG, and WebP images are allowed'
  );

// Create product schema
export const createProductSchema = z.object({
  title: titleValidator,
  description: descriptionValidator,
  categoryId: categoryIdValidator,
  isActive: z.string().optional().default('true'),
  flavors: z
    .array(flavorSchema)
    .min(1, 'At least one flavor is required')
    .max(20, 'Maximum 20 flavors per product'),
});

// Update product schema (all fields optional, simplified for granular operations)
export const updateProductSchema = z.object({
  title: titleValidator.optional(),
  description: descriptionValidator.optional(),
  categoryId: categoryIdValidator.optional(),
  isActive: z.string().optional(),
  flavors: z
    .array(
      z.object({
        flavorId: flavorIdValidator,
        soldByQuantity: z.boolean().optional(),
        sizes: z.array(sizeSchema).optional(),
        stock: stockValidator.optional(),
        price: priceValidator.optional(),
      })
    )
    .optional(),
});

// Filter schemas for query parameters
export const productFiltersSchema = z.object({
  searchTerm: z.string().optional(),
  title: z.string().optional(),
  isActive: z.string().regex(/^(true|false)$/).optional(),
  categoryId: z.string().regex(/^\d+$/).optional(),
  categoryName: z.string().optional(),
  minPrice: z.string().regex(/^\d+(\.\d{1,2})?$/).optional(),
  maxPrice: z.string().regex(/^\d+(\.\d{1,2})?$/).optional(),
  flavorName: z.string().optional(),
  flavorColor: z.string().optional(),
  sizeName: z.string().optional(),
  minStock: z.string().regex(/^\d+$/).optional(),
  maxStock: z.string().regex(/^\d+$/).optional(),
  hasImages: z.string().regex(/^(true|false)$/).optional(),
  inStock: z.string().regex(/^(true|false)$/).optional(),
  page: z.string().regex(/^\d+$/).transform(val => parseInt(val)).optional(),
  limit: z.string().regex(/^\d+$/).transform(val => parseInt(val)).optional(),
  orderBy: z.enum(['title', 'createdAt', 'updatedAt']).optional(),
  orderDirection: z.enum(['asc', 'desc']).optional(),
});

// Product ID parameter validation
export const productIdSchema = z.object({
  productId: z.string().regex(/^\d+$/, 'Invalid product ID'),
});

// Product slug parameter validation
export const productSlugSchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
});

// Type exports for use in components
export type CreateProductFormData = z.infer<typeof createProductSchema>;
export type UpdateProductFormData = z.infer<typeof updateProductSchema>;
export type ProductFiltersData = z.infer<typeof productFiltersSchema>;
export type ProductIdParams = z.infer<typeof productIdSchema>;
export type ProductSlugParams = z.infer<typeof productSlugSchema>;

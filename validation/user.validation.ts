import { z } from 'zod';

// Reusable field validators
const passwordValidator = z
  .string({ error: 'Password is required' })
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

const emailValidator = z
  .string({ error: 'Email is required' })
  .min(1, 'Email is required')
  .email('Please enter a valid email address')
  .toLowerCase();

const bangladeshiPhoneValidator = z
  .string()
  .optional()
  .refine(
    (val) => !val || /^(?:\+?88)?01[3-9]\d{8}$/.test(val),
    'Please enter a valid Bangladeshi phone number (e.g., 017******** or +88017********)'
  );

const nameValidator = (fieldName: string) =>
  z
    .string({ error: `${fieldName} is required` })
    .min(1, `${fieldName} is required`)
    .min(2, `${fieldName} must be at least 2 characters`)
    .max(50, `${fieldName} must not exceed 50 characters`)
    .regex(/^[a-zA-Z\s'-]+$/, `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`)
    .trim();

// User Management Validation Schemas
export const createUserSchema = z.object({
  name: nameValidator('Name'),
  email: emailValidator,
  phoneNumber: bangladeshiPhoneValidator,
  role: z.enum(['admin', 'user'], {
    message: 'Role must be either admin or user',
  }),
  password: z.string().optional(), // Optional for admin creation
});

export const updateUserSchema = z.object({
  name: nameValidator('Name').optional(),
  email: emailValidator.optional(),
  phoneNumber: bangladeshiPhoneValidator,
  password: z.string().optional(),
  role: z.enum(['admin', 'user']).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED'], {
    message: 'Status must be either ACTIVE, INACTIVE, or SUSPENDED',
  }).optional(),
});

export const updateUserProfileSchema = z.object({
  name: nameValidator('Name'),
  phoneNumber: bangladeshiPhoneValidator,
});

// User Filters Validation
export const userFiltersSchema = z.object({
  searchTerm: z.string().optional(),
  isActive: z.boolean().optional(),
  isEmailVerified: z.boolean().optional(),
  roleId: z.string().optional(),
  pointId: z.string().optional(),
  regionId: z.string().optional(),
  areaId: z.string().optional(),
  distributionHouseId: z.string().optional(),
  territoryId: z.string().optional(),
  page: z.number().int().min(1).optional().default(1),
  limit: z.number().int().min(1).max(100).optional().default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
});

// Bulk Operations Validation
export const bulkUpdateUsersSchema = z.object({
  userIds: z.array(z.string()).min(1, 'At least one user must be selected'),
  data: z.object({
    status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
    roleId: z.string().optional(),
  }),
});

export const bulkDeleteUsersSchema = z.object({
  userIds: z.array(z.string()).min(1, 'At least one user must be selected'),
});

// Change Password Validation (Admin)
export const changePasswordSchema = z
  .object({
    oldPassword: z
      .string({ error: 'Current password is required' })
      .min(1, 'Current password is required')
      .optional(), // Optional for admin changes
    newPassword: passwordValidator,
    confirmNewPassword: z
      .string({ error: 'Password confirmation is required' })
      .min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Password confirmation does not match with new password',
    path: ['confirmNewPassword'],
  })
  .refine((data) => !data.oldPassword || data.oldPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  });

// Export CSV Validation
export const exportUsersSchema = z.object({
  searchTerm: z.string().optional(),
  isActive: z.boolean().optional(),
  isEmailVerified: z.boolean().optional(),
  roleId: z.string().optional(),
  pointId: z.string().optional(),
  regionId: z.string().optional(),
  areaId: z.string().optional(),
  distributionHouseId: z.string().optional(),
  territoryId: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
});

// User ID Validation
export const userIdSchema = z.object({
  id: z.string().min(1, 'User ID is required'),
});

// User Role Validation
export const userRoleSchema = z.object({
  name: z.string().min(1, 'Role name is required').max(50, 'Role name too long'),
  description: z.string().max(255, 'Description too long').optional(),
  permissions: z.array(z.string()).default([]),
});

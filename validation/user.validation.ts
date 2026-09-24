import { z } from 'zod';

// Reusable field validators
const passwordValidator = z
  .string({ error: 'Password is required' })
  .min(6, 'Password must be at least 6 characters');

const emailValidator = z
  .string({ error: 'Email is required' })
  .min(1, 'Email is required')
  .email('Please enter a valid email address')
  .toLowerCase();

const bangladeshiPhoneValidator = z
  .string({ error: 'Phone number is required' })
  .min(1, 'Phone number is required')
  .refine(
    (val) => /^(?:\+?88)?01[3-9]\d{8}$/.test(val),
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
  password: passwordValidator,
});

export const updateUserSchema = z.object({
  name: nameValidator('Name').optional(),
  phoneNumber: bangladeshiPhoneValidator.optional(),
  role: z.enum(['admin', 'user']).optional(),
  isActive: z.boolean().optional(),
});

// Optional text field: empty string / whitespace-only means "not provided"
// (form inputs always submit strings — a plain `.optional()` still rejects
// `""` against `.min(5)`, which is why address/city/road wrongly showed
// "must" errors even though the backend treats them as optional).
// NOTE: `.optional().refine(...)` (not `z.preprocess`) is used on purpose —
// preprocess widens the input type to `unknown` and breaks the
// `zodResolver` generic in the update-profile form.
const optionalText = (
  min: number,
  max: number,
  minMessage: string,
  maxMessage: string
) =>
  z
    .string()
    .trim()
    .max(max, maxMessage)
    .optional()
    .refine((val) => !val || val.length >= min, {
      message: minMessage,
    });

export const updateUserProfileSchema = z.object({
  name: nameValidator('Name').optional(),

  phoneNumber: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => !val || /^(?:\+?88)?01[3-9]\d{8}$/.test(val),
      'Please enter a valid Bangladeshi phone number (e.g., 017******** or +88017********)'
    ),

  address: optionalText(
    5,
    200,
    'Address must be at least 5 characters',
    'Address must not exceed 200 characters'
  ),

  city: optionalText(
    2,
    50,
    'City must be at least 2 characters',
    'City must not exceed 50 characters'
  ),

  road: optionalText(
    2,
    100,
    'Road must be at least 2 characters',
    'Road must not exceed 100 characters'
  ),
});

export const userFiltersSchema = z.object({
  searchTerm: z.string().optional(),
  role: z.string().optional(),
  email: z.string().optional(),
  isVerified: z.string().optional(),
  page: z.number().int().min(1).optional().default(1),
  limit: z.number().int().min(1).max(100).optional().default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
});

export const changePasswordSchema = z
  .object({
    oldPassword: z
      .string({ error: 'Current password is required' })
      .min(1, 'Current password is required')
      .optional(),
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

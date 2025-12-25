
import { z } from 'zod'

// Reusable field validators
const passwordValidator = z
  .string({ error: 'Password is required' })
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')

const emailValidator = z
  .string({ error: 'Email is required' })
  .min(1, 'Email is required')
  .email('Please enter a valid email address')
  .toLowerCase()

const bangladeshiPhoneValidator = z
  .string({ error: 'Phone number is required' })
  .regex(
    /^(?:\+?88)?01[3-9]\d{8}$/,
    'Please enter a valid Bangladeshi phone number (e.g., 017******** or +88017********)'
  )

const nameValidator = (fieldName: string) =>
  z
    .string({ error: `${fieldName} is required` })
    .min(1, `${fieldName} is required`)
    .min(2, `${fieldName} must be at least 2 characters`)
    .max(50, `${fieldName} must not exceed 50 characters`)
    .regex(/^[a-zA-Z\s'-]+$/, `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`)
    .trim()

const roleIdValidator = z.string({ error: 'Role is required' })

// User Management Schemas
export const createUserSchema = z.object({
  firstName: nameValidator('First name'),
  lastName: nameValidator('Last name'),
  email: emailValidator,
  phoneNumber: bangladeshiPhoneValidator,
  roleId: z.string({ error: 'Role is required' }),
})

export const updateUserSchema = z.object({
  firstName: nameValidator('First name'),
  lastName: nameValidator('Last name'),
  email: emailValidator,
  phoneNumber: bangladeshiPhoneValidator,
  password: z.string().optional(),
  roleId: roleIdValidator.optional(),
  status: z.enum(['ACTIVE', 'INACTIVE'], {
    message: 'Status must be either ACTIVE or INACTIVE',
  }),
})

// Authentication Schemas
export const signInSchema = z.object({
  email: emailValidator,
  password: z
    .string({ error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters long.'),
})

export const changePasswordSchema = z
  .object({
    oldPassword: z
      .string({ error: 'Current password is required' })
      .min(1, 'Current password is required'),
    newPassword: passwordValidator,
    confirmNewPassword: z
      .string({ error: 'Password confirmation is required' })
      .min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Password confirmation does not match with new password',
    path: ['confirmNewPassword'],
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  })

export const forgetPasswordSchema = z.object({
  email: emailValidator,
})

export const resetPasswordSchema = z
  .object({
    newPassword: passwordValidator,
    confirmNewPassword: z
      .string({ error: 'Password confirmation is required' })
      .min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Password confirmation does not match',
    path: ['confirmNewPassword'],
  })
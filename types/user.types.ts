// User Types matching backend interfaces
import { ENUM_USER_ROLE } from './auth.types';

export interface IUser {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: ENUM_USER_ROLE;
  isVerified: boolean;
  createdAt: Date;
  updatedAt?: Date;
  createdBy?: number;
  updatedBy?: number;
}

export interface ICreateUserPayload {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  role?: ENUM_USER_ROLE;
}

export interface IUpdateUserPayload {
  name?: string;
  phoneNumber?: string;
  role?: ENUM_USER_ROLE;
}

export interface IUserFilters {
  searchTerm?: string;
  role?: string;
  email?: string;
  isVerified?: string;
}

// Additional types for frontend operations
export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  detail?: {
    profileImage?: string | null;
    address?: string;
    city?: string;
    road?: string;
    image?: {
      path: string;
      originalName: string;
      modifiedName: string;
      type: string;
    } | null;
  } | null;
  creator?: {
    name: string;
    email: string;
  };
  updater?: {
    name: string;
    email: string;
  };
}

export interface CreateUserRequest {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  role?: 'admin' | 'user';
  file?: File;
}

export interface UpdateUserRequest {
  name?: string;
  phoneNumber?: string;
  role?: 'admin' | 'user';
  isActive?: boolean;
  address?: string;
  city?: string;
  road?: string;
  file?: File;
}

export interface ChangePasswordRequest {
  oldPassword?: string; // Optional for admin changes
  newPassword: string;
}

export interface UserFilters {
  searchTerm?: string;
  isVerified?: string;
  isActive?: string;
  role?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UserListResponse {
  data: IUser[];
  meta: {
    count: number;
    page: number;
    limit: number;
  };
  message: string;
  statusCode: number;
  success: boolean;
}

export interface UserSingleResponse {
  data: User;
  message: string;
  statusCode: number;
  success: boolean;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  suspendedUsers: number;
  verifiedUsers: number;
  unverifiedUsers: number;
}

export interface UserRole {
  id: string;
  name: string;
  level: number;
  description: string | null;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UserRolesResponse {
  data: UserRole[];
  message: string;
  statusCode: number;
  success: boolean;
}

// Export types for backward compatibility
export type { CreateUserRequest as ICreateUserRequest };

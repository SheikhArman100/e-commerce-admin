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
  firstName: string;
  lastName: string;
  email: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  phoneNumber?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  userRole: {
    id: string;
    name: string;
    level: number;
    description: string | null;
  };
  detail?: {
    image?: {
      diskType?: string;
      path: string;
      originalName: string;
      modifiedName?: string;
    } | null;
  } | null;
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  roleId: string;
  password?: string; // Optional for admin creation
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  roleId?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

export interface ChangePasswordRequest {
  oldPassword?: string; // Optional for admin changes
  newPassword: string;
}

export interface UserFilters {
  searchTerm?: string;
  isActive?: boolean;
  isEmailVerified?: boolean;
  roleId?: string;
  pointId?: string;
  regionId?: string;
  areaId?: string;
  distributionHouseId?: string;
  territoryId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UserListResponse {
  data: User[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
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

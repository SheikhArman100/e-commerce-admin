// Category Types matching backend interfaces

export interface ICategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt?: Date;
  createdBy?: number;
  updatedBy?: number;
  image?: {
    id: number;
    path: string;
    originalName: string;
    modifiedName: string;
    type: string;
  } | null;
}

export interface ICreateCategoryPayload {
  name: string;
  slug?: string;
  description?: string;
  isActive?: boolean;
  displayOrder?: number;
}

export interface IUpdateCategoryPayload {
  name?: string;
  slug?: string;
  description?: string;
  isActive?: boolean;
  displayOrder?: number;
}

// Additional types for frontend operations
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  image?: {
    id: number;
    path: string;
    originalName: string;
    modifiedName: string;
    type: string;
  } | null;
  creator?: {
    id: string;
    name: string;
    email: string;
  } | null;
  updater?: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export interface CreateCategoryRequest {
  name: string;
  slug?: string;
  description?: string;
  isActive?: boolean;
  displayOrder?: number;
  file?: File;
}

export interface UpdateCategoryRequest {
  name?: string;
  slug?: string;
  description?: string;
  isActive?: boolean;
  displayOrder?: number;
  file?: File;
}

export interface CategoryFilters {
  searchTerm?: string;
  isActive?: string;
  displayOrder?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CategoryListResponse {
  data: ICategory[];
  meta: {
    page: number;
    limit: number;
    count: number;
  };
  message: string;
  statusCode: number;
  success: boolean;
}

export interface CategorySingleResponse {
  data: Category;
  message: string;
  statusCode: number;
  success: boolean;
}

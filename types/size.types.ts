// Size Types matching backend interfaces

export interface ISize {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
  createdBy?: number;
  updatedBy?: number;
}

export interface ICreateSizePayload {
  name: string;
  description: string;
  isActive?: boolean;
}

export interface IUpdateSizePayload {
  name?: string;
  description?: string;
  isActive?: boolean;
}

// Additional types for frontend operations
export interface Size {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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

export interface CreateSizeRequest {
  name: string;
  description: string;
  isActive?: boolean;
}

export interface UpdateSizeRequest {
  name?: string;
  description?: string;
  isActive?: boolean;
}

export interface SizeFilters {
  searchTerm?: string;
  name?: string;
  isActive?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SizeListResponse {
  data: ISize[];
  meta: {
    page: number;
    limit: number;
    count: number;
  };
  message: string;
  statusCode: number;
  success: boolean;
}

export interface SizeSingleResponse {
  data: Size;
  message: string;
  statusCode: number;
  success: boolean;
}

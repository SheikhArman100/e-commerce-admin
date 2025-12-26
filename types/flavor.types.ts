// Flavor Types matching backend interfaces

export interface IFlavor {
  id: number;
  name: string;
  color: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
  createdBy?: number;
  updatedBy?: number;
}

export interface ICreateFlavorPayload {
  name: string;
  color: string;
  description: string;
  isActive?: boolean;
}

export interface IUpdateFlavorPayload {
  name?: string;
  color?: string;
  description?: string;
  isActive?: boolean;
}

// Additional types for frontend operations
export interface Flavor {
  id: string;
  name: string;
  color: string;
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

export interface CreateFlavorRequest {
  name: string;
  color: string;
  description: string;
  isActive?: boolean;
}

export interface UpdateFlavorRequest {
  name?: string;
  color?: string;
  description?: string;
  isActive?: boolean;
}

export interface FlavorFilters {
  searchTerm?: string;
  name?: string;
  color?: string;
  isActive?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FlavorListResponse {
  data: IFlavor[];
  meta: {
    page: number;
    limit: number;
    count: number;
  };
  message: string;
  statusCode: number;
  success: boolean;
}

export interface FlavorSingleResponse {
  data: Flavor;
  message: string;
  statusCode: number;
  success: boolean;
}

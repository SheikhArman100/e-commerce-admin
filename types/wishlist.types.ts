// Backend interface (raw API data)
export interface IWishlist {
  id: number;
  userId: number;
  productId: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    name: string;
    email: string;
    detail: {
      profileImage: string;
      image: {
        id: number;
        type: string;
        path: string;
        originalName: string;
        modifiedName: string;
        createdAt: string;
      };
    };
  };
  product: {
    id: number;
    title: string;
    slug: string;
    description: string;
    isActive: boolean;
    category: {
      id: number;
      name: string;
      slug: string;
      description: string;
    };
  };
}

// Frontend interface (processed data)
export interface Wishlist {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  product: {
    id: string;
    title: string;
    slug: string;
    isActive: boolean;
  };
}

// Request/Response types
export interface CreateWishlistRequest {
  productId: string;
}

export interface UpdateWishlistRequest {
  // Currently empty - only updates timestamp
  _empty?: never; // Makes interface non-empty for linting
}

export interface WishlistListResponse {
  data: IWishlist[];
  meta: {
    page: number;
    limit: number;
    count: number;
    total: number;
  };
  message: string;
  statusCode: number;
  success: boolean;
}

export interface WishlistResponse {
  data: IWishlist;
  message: string;
  statusCode: number;
  success: boolean;
}

// Filter types
export interface WishlistFilters {
  searchTerm?: string;    // Search in product titles
  userId?: string;        // Filter by user ID (admin only)
  productId?: string;     // Filter by product ID
  page?: number;          // Page number (default: 1)
  limit?: number;         // Items per page (default: 10)
  sortBy?: string;        // Sort field (default: 'createdAt')
  sortOrder?: 'asc' | 'desc'; // "asc" or "desc" (default: 'desc')
}

// Form types
export interface WishlistFormData {
  productId: string;
}

// Backend interface (raw API data)
export interface IReview {
  id: number;
  rating: number;
  comment: string;
  isHidden: boolean;
  adminNote: string | null;
  ipAddress: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  productId: number;
  orderId: number;
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
  order: {
    id: number;
    status: string;
    totalAmount: number;
    createdAt: string;
  };
  images: Array<{
    id: number;
    type: string;
    path: string;
    originalName: string;
    modifiedName: string;
    createdAt: string;
  }>;
}

// Frontend interface (processed data)
export interface Review {
  id: string;
  rating: number;
  comment: string;
  isHide: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
  productId: string;
  orderId: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  product: {
    id: string;
    title: string;
    slug: string;
  };
  order: {
    id: string;
    status: string;
    totalAmount: number;
  };
  images: Array<{
    id: string;
    type: string;
    path: string;
    originalName: string;
    modifiedName: string;
  }>;
}

// Request/Response types
export interface CreateReviewRequest {
  rating: number;
  comment: string;
  orderId: string;
  productId: string;
  images?: File[];
}

export interface UpdateReviewRequest {
  rating?: number;
  comment?: string;
  isHide?: boolean;
}

export interface ReviewListResponse {
  data: IReview[];
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

export interface ReviewResponse {
  data: IReview;
  message: string;
  statusCode: number;
  success: boolean;
}

// Filter types
export interface ReviewFilters {
  searchTerm?: string;    // Search in comments
  rating?: string;        // Filter by rating (1-5)
  isHidden?: string;      // Filter by hide status ("true"/"false")
  userId?: string;        // Filter by user ID
  productId?: string;     // Filter by product ID
  orderId?: string;       // Filter by order ID
  page?: number;          // Page number (default: 1)
  limit?: number;         // Items per page (default: 10)
  sortBy?: string;        // Sort field
  sortOrder?: 'asc' | 'desc'; // "asc" or "desc"
}

// Form types
export interface ReviewFormData {
  rating: number;
  comment: string;
  orderId: string;
  productId: string;
  images?: File[];
}

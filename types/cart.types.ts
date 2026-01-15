// Backend interface (raw API data)
export interface ICart {
  id: number;
  createdAt: string;
  updatedAt: string;
  userId: number;
  user: {
    id: number;
    name: string;
    email: string;
    phoneNumber?: string;
    role?: string;
    isVerified?: boolean;
    createdAt?: string;
    updatedAt?: string;
    detail?: {
      profileImage?: string;
      address?: string;
      city?: string;
      road?: string;
      image?: {
        id: number;
        type: string;
        path: string;
        originalName: string;
        modifiedName: string;
        createdAt: string;
        updatedAt: string;
        productId: number | null;
        flavorId: number | null;
        userDetailId: number;
        categoryId: number | null;
        reviewId: number | null;
      };
    };
  };
  items: ICartItem[];
  totals?: {
    totalItems: number;
    totalAmount: number;
  };
}

export interface ICartItem {
  id: number;
  cartId: number;
  productId: number;
  flavorId: number;
  sizeId: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  product: {
    id: number;
    title: string;
    slug: string;
    category?: {
      id: number;
      name: string;
    };
  };
  productFlavorSize: {
    id: number;
    productId: number;
    flavorId: number;
    sizeId: number;
    stock: number;
    price: number;
    soldByQuantity: boolean;
    createdAt: string;
    updatedAt: string;
    size?: {
      name: string;
      description: string | null;
    };
    productFlavor?: {
      productId: number;
      flavorId: number;
      createdAt: string;
      updatedAt: string;
      flavor?: {
        name: string;
        color: string;
        description: string | null;
      };
    };
  };
}

// Frontend interface (processed data)
export interface Cart {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  items: CartItem[];
  totals?: {
    totalItems: number;
    totalAmount: number;
  };
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  flavorId: string;
  sizeId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  product: {
    id: string;
    title: string;
    slug: string;
  };
  productFlavorSize: {
    price: number;
    stock: number;
  };
}

// Request/Response types
export interface CreateCartRequest {
  productId: string;
  flavorId: string;
  sizeId: string;
  quantity?: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface CartListResponse {
  data: ICart[];
  meta: {
    page: number;
    limit: number;
    count: number;
    total?: number;
  };
  message: string;
  statusCode: number;
  success: boolean;
}

export interface CartResponse {
  data: ICart;
  message: string;
  statusCode: number;
  success: boolean;
}

export interface CartItemResponse {
  data: ICartItem;
  message: string;
  statusCode: number;
  success: boolean;
}

// Filter types
export interface CartFilters {
  searchTerm?: string;    // Search in product titles
  userId?: string;        // Filter by user ID
  productId?: string;     // Filter by product ID
  page?: number;          // Page number (default: 1)
  limit?: number;         // Items per page (default: 10)
  sortBy?: string;        // Sort field
  sortOrder?: 'asc' | 'desc'; // "asc" or "desc"
}

// Form types
export interface CartFormData {
  productId: string;
  flavorId: string;
  sizeId: string;
  quantity: number;
}

export interface UpdateCartItemFormData {
  quantity: number;
}

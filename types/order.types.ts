// Backend interface (raw API data)
export interface IOrder {
  id: number;
  status: OrderStatus;
  totalAmount: number;
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
  items: IOrderItem[];
}

export interface IOrderItem {
  id: number;
  orderId: number;
  productId: number;
  flavorId: number;
  sizeId: number;
  quantity: number;
  price: number;
  productTitle?: string;
  flavorName?: string;
  sizeName?: string;
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
      images?: Array<{
        id: number;
        type: string;
        path: string;
        originalName: string;
        modifiedName: string;
        createdAt: string;
        updatedAt: string;
        productId: number | null;
        flavorId: number;
        userDetailId: number | null;
        categoryId: number | null;
        reviewId: number | null;
      }>;
    };
  };
}

// Order status enum
export enum OrderStatus {
  PENDING = 'Pending',
  SHIPPED = 'Shipped',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled'
}

// Frontend interface (processed data)
export interface Order {
  id: string;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  flavorId: string;
  sizeId: string;
  quantity: number;
  price: number;
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
export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

export interface OrderListResponse {
  data: IOrder[];
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

export interface OrderResponse {
  data: IOrder;
  message: string;
  statusCode: number;
  success: boolean;
}

// Filter types
export interface OrderFilters {
  searchTerm?: string;    // Search in user names/emails
  userId?: string;        // Filter by user ID
  status?: OrderStatus;   // Filter by order status
  productId?: string;     // Filter by product ID (orders containing this product)
  minAmount?: string;     // Minimum order total
  maxAmount?: string;     // Maximum order total
  startDate?: string;     // Orders from this date (YYYY-MM-DD)
  endDate?: string;       // Orders until this date (YYYY-MM-DD)
  page?: number;          // Page number (default: 1)
  limit?: number;         // Items per page (default: 10)
  sortBy?: string;        // Sort field
  sortOrder?: 'asc' | 'desc'; // "asc" or "desc"
}

// Form types
export interface OrderStatusFormData {
  status: OrderStatus;
}

// Backend interface (raw API data)
export interface IProduct {
  id: number;
  title: string;
  slug: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  category: {
    id: number;
    name: string;
  };
  flavors: Array<{
    flavor: {
      id: number;
      name: string;
      color: string;
    };
    images: Array<{
      id: number;
      path: string;
      originalName: string;
      modifiedName: string;
    }>;
    // For quantity-based products
    stock?: number;
    price?: number;
    // For size-based products
    sizes: Array<{
      size: {
        id: number;
        name: string;
      } | null;
      stock: number;
      price: number;
      soldByQuantity?: boolean;
    }>;
  }>;
  creator: {
    name: string;
    email: string;
    role: string;
  };
}

// Frontend interface (processed data)
export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
  };
  flavors: Array<{
    flavor: {
      id: string;
      name: string;
      color: string;
    };
    images: Array<{
      path: string;
      originalName: string;
      modifiedName: string;
    }>;
    sizes: Array<{
      size: {
        id: string;
        name: string;
      };
      stock: number;
      price: number;
    }>;
  }>;
  creator: {
    name: string;
    email: string;
    role: string;
  };
}

// Request/Response types
export interface CreateProductRequest {
  title: string;
  description: string;
  categoryId: string;
  isActive?: string;
  flavors: Array<{
    flavorId: string;
    soldByQuantity?: boolean; // true for quantity-based, false/undefined for size-based
    // For quantity-based products
    stock?: string;
    price?: string;
    // For size-based products
    sizes?: Array<{
      sizeId: string;
      stock: string;
      price: string;
    }>;
    images?: File[];
  }>;
}

export interface IUpdateProductInterface {
  // ===== Product level =====
  title?: string;
  description?: string;
  categoryId?: string;
  isActive?: boolean;

  // ===== Flavor operations =====
  flavors?: {
    add?: {
      flavorId: string;
      soldByQuantity?: boolean;

      // Quantity-based
      stock?: string;
      price?: string;

      // Size-based
      sizes?: {
        sizeId: string;
        stock: string;
        price: string;
      }[];

      images?: File[];
    }[];
    update?: {
      flavorId: string; // flavor record id (required)
      soldByQuantity?: boolean;
      // Quantity-based
      stock?: string;
      price?: string;
      // Size-based operations
      sizes?: {
        add?: {
          sizeId: string;
          stock: string;
          price: string;
        }[];
        update?: {
          sizeId: string; // size record id
          stock?: string;
          price?: string;
        }[];
        remove?: string[]; // sizeIds
      };
      // Image operations
      images?: {
        add?: File[];
        remove?: string[]; // imageIds or imageUrls
      };
    }[];
    remove?: string[]; // flavorIds
  };
}

export interface UpdateProductRequest {
  title?: string;
  description?: string;
  categoryId?: string;
  isActive?: string;
  flavors?: Array<{
    flavorId: string;
    soldByQuantity?: boolean;
    // For quantity-based products
    stock?: string;
    price?: string;
    // For size-based products
    sizes?: Array<{
      sizeId: string;
      stock: string;
      price: string;
    }>;
    images?: File[];
  }>;
  removeFlavors?: number[]; // Array of flavor IDs to remove
}

export interface ProductListResponse {
  data: IProduct[];
  meta: {
    count: number;
    page: number;
    limit: number;
  };
  message: string;
  statusCode: number;
  success: boolean;
}

export interface ProductResponse {
  data: IProduct;
  message: string;
  statusCode: number;
  success: boolean;
}

// Filter types
export interface ProductFilters {
  searchTerm?: string;
  title?: string;
  isActive?: string;
  categoryId?: string;
  categoryName?: string;
  minPrice?: string;
  maxPrice?: string;
  flavorName?: string;
  flavorColor?: string;
  sizeName?: string;
  minStock?: string;
  maxStock?: string;
  hasImages?: string;
  inStock?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Form types for complex product creation
export interface ProductFlavorForm {
  flavorId: string;
  soldByQuantity?: boolean; // true for quantity-based, false/undefined for size-based
  // For quantity-based products
  stock?: string;
  price?: string;
  // For size-based products
  sizes?: Array<{
    sizeId: string;
    stock: string;
    price: string;
  }>;
  images?: File[];
}

export interface ProductFormData {
  title: string;
  description: string;
  categoryId: string;
  isActive: string;
  flavors: ProductFlavorForm[];
}

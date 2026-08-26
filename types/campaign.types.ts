export interface ICampaign {
  id: string | number;
  title: string;
  slug: string;
  description?: string;
  bannerImage?: string;
  discountDefault: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  updatedBy: number | null;
  creator: {
    name: string;
    email: string;
  };
  updater: {
    name: string;
    email: string;
  } | null;
  products?: ICampaignProduct[];
  _count?: {
    products: number;
  };
}

export interface ICampaignProduct {
  id: string | number;
  campaignId: string | number;
  productId: number;
  customDiscountPercentage?: number;
  product?: {
    id: number;
    title: string;
    flavors: Array<{
      price?: number;
      images: Array<{ path: string }>;
      sizes?: Array<{ price: number }>;
    }>;
  };
}

export interface CampaignFilters {
  searchTerm?: string;
  isActive?: boolean | string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateCampaignRequest {
  title: string;
  slug: string;
  description?: string;
  file?: File;
  discountDefault: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface UpdateCampaignRequest {
  title?: string;
  slug?: string;
  description?: string;
  file?: File;
  discountDefault?: number;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
}

export interface AddProductToCampaignRequest {
  productId: number;
  customDiscountPercentage?: number;
}

export interface CampaignListResponse {
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    count: number;
  };
  data: ICampaign[];
}

export interface CampaignResponse {
  success: boolean;
  message: string;
  data: ICampaign;
}

export interface ButtonContent {
  id: string;
  text: string;
  isDefault: boolean;
  backgroundColor?: string;
  textColor?: string;
}

export enum QuestionType {
  TEXT = 'TEXT',
  DROPDOWN = 'DROPDOWN',
  DATE = 'DATE',
  SIGN = 'SIGN',
}

export type Question =
  | { id: string; text: string; type: QuestionType.TEXT; placeholder?: string }
  | { id: string; text: string; type: QuestionType.DROPDOWN; options: string[] }
  | { id: string; text: string; type: QuestionType.DATE; placeholder?: string }
  | { id: string; text: string; type: QuestionType.SIGN; placeholder?: string };

export interface ImageAsset {
  id: string;
  name: string;
  url: string;
}

export interface TextSnippet {
  id: string;
  name: string;
  text: string;
}

export interface ContentContainerStyle {
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  borderWidth: number;
}

export type ContentItem =
  | { id: string; type: 'QUESTION'; width: number; height: number }
  | { id: string; type: 'TEXT_SNIPPET'; width: number; height: number }
  | { id: string; type: 'BUTTON'; width: number; height: number };

export interface Step {
  id: string;
  title?: string;
  name?: string;
  backgroundAssetId?: string | null;
  contentItems: ContentItem[];
  contentContainerStyle: ContentContainerStyle;
}

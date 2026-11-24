import { GameResponse, CategoryResponse } from './catalog.model';

export interface ProductResponse {
  productId: number;
  productName: string;
  slug: string;
  sku: string;
  productType: 'ACCOUNT' | 'TOPUP' | 'ITEM' | 'PASS';
  price: number;
  salePrice?: number;
  description: string;
  coverUrl: string;
  images?: string[];
  game: GameResponse;
  category: CategoryResponse;
  productStatus: 'ACTIVE' | 'HIDDEN' | 'OUT_OF_STOCK';
  stockCount: number;
  attributes?: {
    server?: string;
    platform?: string;
    arLevel?: number;
    fiveStars?: number;
    characters?: string[];
    rerollGems?: string;
    instantDelivery?: boolean;
    loginMethod?: string;
    guarantee?: string;
    [key: string]: any;
  };
  createdAt?: string;
}

export type ProductSortOption = 'latest' | 'price-asc' | 'price-desc' | 'name' | 'popular';

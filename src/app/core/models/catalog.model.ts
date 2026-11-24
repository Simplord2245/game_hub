export interface GameResponse {
  gameId: number;
  gameName: string;
  slug: string;
  publisher: string;
  description: string;
  coverUrl: string;
  gameStatus: 'ACTIVE' | 'HIDDEN';
  hot?: boolean;
  orderCount?: number;
  createdAt?: string;
}

export interface CategoryResponse {
  categoryId: number;
  categoryName: string;
  slug: string;
  description?: string;
  categoryStatus: 'ACTIVE' | 'HIDDEN';
  icon?: string;
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_CONFIG } from '../config/api.config';
import { ApiResponse, PageResponse } from '../models/api.model';
import { ProductResponse, ProductSortOption } from '../models/product.model';
import { INITIAL_PRODUCTS } from '../data/mock-data';

@Injectable({
  providedIn: 'root'
})
export class ProductApiService {
  private storageKey = 'wg_gamehub_products';

  constructor(private http: HttpClient) {
    this.initStorage();
  }

  private initStorage(): void {
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify(INITIAL_PRODUCTS));
    }
  }

  public getStoredProducts(): ProductResponse[] {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  }

  public saveStoredProducts(products: ProductResponse[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(products));
  }

  getActiveProducts(
    gameId?: number,
    categoryId?: number,
    keyword?: string,
    page = 0,
    size = 12,
    sortBy: ProductSortOption = 'latest'
  ): Observable<ApiResponse<PageResponse<ProductResponse>>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', Math.min(Math.max(1, size), 50).toString())
      .set('sortBy', sortBy);

    if (gameId) params = params.set('gameId', gameId.toString());
    if (categoryId) params = params.set('categoryId', categoryId.toString());
    if (keyword && keyword.trim()) params = params.set('keyword', keyword.trim());

    return this.http.get<ApiResponse<PageResponse<ProductResponse>>>(
      `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.products}`,
      { params }
    ).pipe(
      catchError(() => {
        // Fallback to local mock conforming to BR-002 & BR-011
        let list = this.getStoredProducts().filter(p => p.productStatus === 'ACTIVE');

        if (gameId) {
          list = list.filter(p => p.game && p.game.gameId === gameId);
        }

        if (categoryId) {
          list = list.filter(p => p.category && p.category.categoryId === categoryId);
        }

        if (keyword && keyword.trim()) {
          const kw = keyword.toLowerCase().trim();
          list = list.filter(p =>
            p.productName.toLowerCase().includes(kw) ||
            p.sku.toLowerCase().includes(kw) ||
            (p.game && p.game.gameName.toLowerCase().includes(kw))
          );
        }

        // Sorting according to BR-011
        switch (sortBy) {
          case 'price-asc':
            list.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
            break;
          case 'price-desc':
            list.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
            break;
          case 'name':
            list.sort((a, b) => a.productName.localeCompare(b.productName));
            break;
          case 'popular':
            list.sort((a, b) => (b.attributes?.fiveStars || 0) - (a.attributes?.fiveStars || 0));
            break;
          case 'latest':
          default:
            list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
            break;
        }

        const safePage = Math.max(0, page);
        const safeSize = Math.min(Math.max(1, size), 50);
        const totalElements = list.length;
        const totalPages = Math.ceil(totalElements / safeSize) || 1;
        const startIndex = safePage * safeSize;
        const pageContent = list.slice(startIndex, startIndex + safeSize);

        const pageResponse: PageResponse<ProductResponse> = {
          content: pageContent,
          page: safePage,
          size: safeSize,
          totalElements,
          totalPages,
          first: safePage === 0,
          last: safePage >= totalPages - 1
        };

        return of({
          success: true,
          message: 'Lấy danh sách sản phẩm thành công',
          data: pageResponse,
          timestamp: new Date().toISOString()
        });
      })
    );
  }

  getProductById(id: number): Observable<ApiResponse<ProductResponse>> {
    return this.http.get<ApiResponse<ProductResponse>>(
      `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.products}/${id}`
    ).pipe(
      catchError(() => {
        const prod = this.getStoredProducts().find(p => p.productId === id);
        if (prod) {
          return of({
            success: true,
            message: 'Chi tiết sản phẩm',
            data: prod,
            timestamp: new Date().toISOString()
          });
        }
        throw new Error('Không tìm thấy sản phẩm');
      })
    );
  }

  getProductBySlug(slug: string): Observable<ApiResponse<ProductResponse>> {
    return this.http.get<ApiResponse<ProductResponse>>(
      `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.products}/slug/${slug}`
    ).pipe(
      catchError(() => {
        const prod = this.getStoredProducts().find(p => p.slug === slug);
        if (prod) {
          return of({
            success: true,
            message: 'Chi tiết sản phẩm',
            data: prod,
            timestamp: new Date().toISOString()
          });
        }
        throw new Error('Không tìm thấy sản phẩm');
      })
    );
  }

  // Admin CRUD helper
  saveProduct(product: Partial<ProductResponse>): void {
    const list = this.getStoredProducts();
    if (product.productId) {
      const idx = list.findIndex(p => p.productId === product.productId);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...product } as ProductResponse;
      }
    } else {
      const newProd: ProductResponse = {
        productId: Date.now(),
        productName: product.productName || 'New Product',
        slug: (product.productName || 'new-product').toLowerCase().replace(/\s+/g, '-'),
        sku: product.sku || `SKU-${Date.now().toString().slice(-4)}`,
        productType: product.productType || 'ACCOUNT',
        price: product.price || 50000,
        salePrice: product.salePrice,
        description: product.description || '',
        coverUrl: product.coverUrl || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
        game: product.game!,
        category: product.category!,
        productStatus: product.productStatus || 'ACTIVE',
        stockCount: product.stockCount ?? 10,
        attributes: product.attributes || { server: 'Asia', instantDelivery: true },
        createdAt: new Date().toISOString()
      };
      list.unshift(newProd);
    }
    this.saveStoredProducts(list);
  }

  deleteProduct(productId: number): void {
    const list = this.getStoredProducts().filter(p => p.productId !== productId);
    this.saveStoredProducts(list);
  }
}

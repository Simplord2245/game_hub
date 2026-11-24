import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_CONFIG } from '../config/api.config';
import { ApiResponse } from '../models/api.model';
import { CategoryResponse } from '../models/catalog.model';
import { INITIAL_CATEGORIES } from '../data/mock-data';

@Injectable({
  providedIn: 'root'
})
export class CategoryApiService {
  private storageKey = 'wg_gamehub_categories';

  constructor(private http: HttpClient) {
    this.initStorage();
  }

  private initStorage(): void {
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify(INITIAL_CATEGORIES));
    }
  }

  private getStoredCategories(): CategoryResponse[] {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  }

  getActiveCategories(): Observable<ApiResponse<CategoryResponse[]>> {
    return this.http.get<ApiResponse<CategoryResponse[]>>(
      `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.categories}`
    ).pipe(
      catchError(() => {
        const categories = this.getStoredCategories().filter(c => c.categoryStatus === 'ACTIVE');
        return of({
          success: true,
          message: 'Lấy danh mục thành công',
          data: categories,
          timestamp: new Date().toISOString()
        });
      })
    );
  }

  /** Admin: get ALL categories including INACTIVE */
  getAllCategories(): Observable<ApiResponse<CategoryResponse[]>> {
    return this.http.get<ApiResponse<CategoryResponse[]>>(
      `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.categories}?all=true`
    ).pipe(
      catchError(() => {
        const categories = this.getStoredCategories();
        return of({
          success: true,
          message: 'Lấy tất cả danh mục thành công',
          data: categories,
          timestamp: new Date().toISOString()
        });
      })
    );
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { API_CONFIG } from '../config/api.config';
import { ApiResponse, PageResponse } from '../models/api.model';
import { GameResponse } from '../models/catalog.model';
import { INITIAL_GAMES } from '../data/mock-data';

@Injectable({
  providedIn: 'root'
})
export class GameApiService {
  private storageKey = 'wg_gamehub_games';

  constructor(private http: HttpClient) {
    this.initStorage();
  }

  private initStorage(): void {
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify(INITIAL_GAMES));
    }
  }

  private getStoredGames(): GameResponse[] {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : INITIAL_GAMES;
    } catch {
      return INITIAL_GAMES;
    }
  }

  private saveStoredGames(games: GameResponse[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(games));
  }

  getActiveGames(keyword?: string, page = 0, size = 12): Observable<ApiResponse<PageResponse<GameResponse>>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', Math.min(Math.max(1, size), 50).toString());

    if (keyword && keyword.trim()) {
      params = params.set('keyword', keyword.trim());
    }

    return this.http.get<ApiResponse<PageResponse<GameResponse>>>(
      `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.games}`,
      { params }
    ).pipe(
      catchError(() => {
        // Fallback to local mock repository conforming strictly to BR-001, BR-010
        let games = this.getStoredGames().filter(g => g.gameStatus === 'ACTIVE');
        if (keyword && keyword.trim()) {
          const kw = keyword.toLowerCase().trim();
          games = games.filter(g => g.gameName.toLowerCase().includes(kw));
        }

        // BR-010: PageResponse structure & clamping
        const safePage = Math.max(0, page);
        const safeSize = Math.min(Math.max(1, size), 50);
        const totalElements = games.length;
        const totalPages = Math.ceil(totalElements / safeSize) || 1;
        const startIndex = safePage * safeSize;
        const pageContent = games.slice(startIndex, startIndex + safeSize);

        const pageResponse: PageResponse<GameResponse> = {
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
          message: 'Lấy danh sách game thành công',
          data: pageResponse,
          timestamp: new Date().toISOString()
        });
      })
    );
  }

  getGameById(id: number): Observable<ApiResponse<GameResponse>> {
    return this.http.get<ApiResponse<GameResponse>>(
      `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.games}/${id}`
    ).pipe(
      catchError(() => {
        const game = this.getStoredGames().find(g => g.gameId === id && g.gameStatus === 'ACTIVE');
        if (game) {
          return of({
            success: true,
            message: 'Chi tiết game',
            data: game,
            timestamp: new Date().toISOString()
          });
        }
        throw new Error('Không tìm thấy game');
      })
    );
  }

  getGameBySlug(slug: string): Observable<ApiResponse<GameResponse>> {
    return this.http.get<ApiResponse<GameResponse>>(
      `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.games}/slug/${slug}`
    ).pipe(
      catchError(() => {
        const game = this.getStoredGames().find(g => g.slug === slug && g.gameStatus === 'ACTIVE');
        if (game) {
          return of({
            success: true,
            message: 'Chi tiết game',
            data: game,
            timestamp: new Date().toISOString()
          });
        }
        throw new Error('Không tìm thấy game');
      })
    );
  }

  // Admin CRUD helper
  saveGame(game: Partial<GameResponse>): void {
    const list = this.getStoredGames();
    if (game.gameId) {
      const idx = list.findIndex(g => g.gameId === game.gameId);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...game } as GameResponse;
      }
    } else {
      const newGame: GameResponse = {
        gameId: Date.now(),
        gameName: game.gameName || 'New Game',
        slug: (game.gameName || 'new-game')
          .toLowerCase()
          .normalize('NFD')
          .replace(/\p{Diacritic}/gu, '')
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, ''),
        publisher: game.publisher || 'Developer',
        description: game.description || '',
        coverUrl: game.coverUrl || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=160&auto=format&fit=crop&q=80',
        gameStatus: game.gameStatus || 'ACTIVE',
        hot: game.hot || false,
        createdAt: new Date().toISOString()
      };
      list.push(newGame);
    }
    this.saveStoredGames(list);
  }

  deleteGame(gameId: number): void {
    const list = this.getStoredGames().filter(g => g.gameId !== gameId);
    this.saveStoredGames(list);
  }

  getAllGames(): Observable<ApiResponse<GameResponse[]>> {
    return of({
      success: true,
      message: 'Lấy tất cả game thành công',
      data: this.getStoredGames(),
      timestamp: new Date().toISOString()
    });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { API_CONFIG } from '../config/api.config';
import { ApiResponse } from '../models/api.model';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  private userKey = 'wg_gamehub_current_user';
  private usersDbKey = 'wg_gamehub_users_db';
  private walletKey = 'wg_gamehub_user_wallet';

  private currentUserSubject = new BehaviorSubject<RegisterResponse | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private walletBalanceSubject = new BehaviorSubject<number>(0);
  public walletBalance$ = this.walletBalanceSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserSession();
  }

  private loadUserSession(): void {
    const raw = localStorage.getItem(this.userKey);
    if (raw) {
      try {
        const user = JSON.parse(raw);
        this.currentUserSubject.next(user);
      } catch {
        this.currentUserSubject.next(null);
      }
    }
    const wallet = localStorage.getItem(this.walletKey);
    this.walletBalanceSubject.next(wallet ? Number(wallet) : 250000); // 250k initial gift for testing
  }

  private getUsersDb(): any[] {
    const raw = localStorage.getItem(this.usersDbKey);
    return raw ? JSON.parse(raw) : [
      {
        userId: 1,
        fullName: 'Admin Quản Trị',
        email: 'admin@gamehub.vn',
        phone: '0987654321',
        password: 'password123',
        userStatus: 'ACTIVE',
        roles: ['ADMIN', 'STAFF', 'CUSTOMER']
      },
      {
        userId: 2,
        fullName: 'Khách Hàng Mẫu',
        email: 'customer@wibugem.com',
        phone: '0912345678',
        password: 'password123',
        userStatus: 'ACTIVE',
        roles: ['CUSTOMER']
      }
    ];
  }

  private saveUsersDb(users: any[]): void {
    localStorage.setItem(this.usersDbKey, JSON.stringify(users));
  }

  register(req: RegisterRequest): Observable<ApiResponse<RegisterResponse>> {
    // BR-005: Normalize email & phone
    const normalizedEmail = (req.email || '').trim().toLowerCase();
    const normalizedPhone = req.phone && req.phone.trim() ? req.phone.trim() : undefined;

    return this.http.post<ApiResponse<RegisterResponse>>(
      `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.register}`,
      {
        fullName: req.fullName.trim(),
        email: normalizedEmail,
        password: req.password,
        phone: normalizedPhone
      }
    ).pipe(
      catchError(() => {
        // Fallback local registration
        const users = this.getUsersDb();
        if (users.some(u => u.email.toLowerCase() === normalizedEmail)) {
          return throwError(() => new Error('Email này đã được sử dụng.'));
        }
        if (normalizedPhone && users.some(u => u.phone === normalizedPhone)) {
          return throwError(() => new Error('Số điện thoại này đã được sử dụng.'));
        }

        const newUser: RegisterResponse = {
          userId: Date.now(),
          fullName: req.fullName.trim(),
          email: normalizedEmail,
          phone: normalizedPhone,
          userStatus: 'ACTIVE',
          roles: ['CUSTOMER']
        };

        users.push({ ...newUser, password: req.password });
        this.saveUsersDb(users);

        // Auto login on register
        this.setCurrentUser(newUser);

        return of({
          success: true,
          message: 'Đăng ký tài khoản thành công',
          data: newUser,
          timestamp: new Date().toISOString()
        });
      })
    );
  }

  login(req: LoginRequest): Observable<ApiResponse<LoginResponse>> {
    const normalizedEmail = (req.email || '').trim().toLowerCase();

    return this.http.post<ApiResponse<LoginResponse>>(
      `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.login}`,
      { email: normalizedEmail, password: req.password }
    ).pipe(
      tap(res => {
        if (res.data?.user) {
          this.setCurrentUser(res.data.user);
        }
      }),
      catchError(() => {
        // Fallback local auth
        const users = this.getUsersDb();
        const found = users.find(u => u.email.toLowerCase() === normalizedEmail && u.password === req.password);
        if (!found) {
          return throwError(() => new Error('Email hoặc mật khẩu không chính xác.'));
        }

        const userResp: RegisterResponse = {
          userId: found.userId,
          fullName: found.fullName,
          email: found.email,
          phone: found.phone,
          userStatus: found.userStatus,
          roles: found.roles || ['CUSTOMER']
        };

        const loginResp: LoginResponse = {
          accessToken: 'jwt_mock_token_' + Date.now(),
          tokenType: 'Bearer',
          user: userResp
        };

        this.setCurrentUser(userResp);

        return of({
          success: true,
          message: 'Đăng nhập thành công',
          data: loginResp,
          timestamp: new Date().toISOString()
        });
      })
    );
  }

  setCurrentUser(user: RegisterResponse): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  logout(): void {
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
  }

  topupWallet(amount: number): void {
    const current = this.walletBalanceSubject.value;
    const newBal = current + amount;
    this.walletBalanceSubject.next(newBal);
    localStorage.setItem(this.walletKey, newBal.toString());
  }

  deductWallet(amount: number): boolean {
    const current = this.walletBalanceSubject.value;
    if (current >= amount) {
      const newBal = current - amount;
      this.walletBalanceSubject.next(newBal);
      localStorage.setItem(this.walletKey, newBal.toString());
      return true;
    }
    return false;
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return !!user?.roles?.includes('ADMIN');
  }

  isStaff(): boolean {
    const user = this.currentUserSubject.value;
    return !!(user?.roles?.includes('STAFF') || user?.roles?.includes('ADMIN'));
  }

  getAllUsers(): any[] {
    return this.getUsersDb();
  }

  updateUserRoles(userId: number, roles: string[]): void {
    const users = this.getUsersDb();
    const idx = users.findIndex(u => u.userId === userId);
    if (idx !== -1) {
      users[idx].roles = roles;
      this.saveUsersDb(users);
      // If current user, update session
      const current = this.currentUserSubject.value;
      if (current && current.userId === userId) {
        current.roles = roles;
        this.setCurrentUser(current);
      }
    }
  }

  toggleUserStatus(userId: number): void {
    const users = this.getUsersDb();
    const idx = users.findIndex(u => u.userId === userId);
    if (idx !== -1) {
      users[idx].userStatus = users[idx].userStatus === 'ACTIVE' ? 'LOCKED' : 'ACTIVE';
      this.saveUsersDb(users);
      const current = this.currentUserSubject.value;
      if (current && current.userId === userId) {
        current.userStatus = users[idx].userStatus;
        this.setCurrentUser(current);
      }
    }
  }
}

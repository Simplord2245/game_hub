import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { AuthApiService } from '../../core/services/auth-api.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <header class="wg-header">
      <div class="wg-container header-container">
        <!-- Mobile Left: Hamburger -->
        <button type="button" class="btn-menu mobile-only" (click)="toggleMobileMenu()" aria-label="Menu">
          <span class="hamburger-bar"></span>
          <span class="hamburger-bar"></span>
          <span class="hamburger-bar"></span>
        </button>

        <!-- Brand Logo -->
        <a href="#" class="brand-logo" (click)="scrollToTop($event)">
          <span class="logo-icon">⭐</span>
          <span class="wibu">WIBU</span><span class="gem">GEM</span>
          <span class="badge-hub">GameHub</span>
        </a>

        <!-- Desktop Search Bar -->
        <div class="search-box desktop-only">
          <span class="search-icon">🔍</span>
          <input 
            type="text" 
            [(ngModel)]="searchKeyword" 
            (keyup.enter)="onSearch()" 
            placeholder="Tìm kiếm game, tài khoản, SKU..." 
            class="search-input" />
          <button *ngIf="searchKeyword" type="button" class="btn-clear" (click)="clearSearch()">✕</button>
        </div>

        <!-- Desktop Nav Links -->
        <nav class="nav-links desktop-only">
          <a href="#" class="nav-item active" (click)="scrollToTop($event)">Trang chủ</a>
          <a href="#games-section" class="nav-item">Danh mục game</a>
          <a href="javascript:void(0)" class="nav-item" (click)="openRecharge.emit()">
            <span class="nav-icon-badge">⚡</span> Nạp tiền
          </a>
          <a href="javascript:void(0)" class="nav-item" (click)="openSupport()">Hỗ trợ</a>
        </nav>

        <!-- Actions: Auth & Cart -->
        <div class="header-actions">
          <!-- Mobile Search Trigger -->
          <button type="button" class="btn-icon mobile-only" (click)="showMobileSearch = true" aria-label="Tìm kiếm">
            🔍
          </button>

          <!-- CART PILL BUTTON -->
          <button type="button" class="wg-cart-pill" (click)="openCart.emit()">
            <span class="cart-icon">🛒</span>
            <span class="cart-label desktop-only">Giỏ hàng</span>
            <span class="cart-badge">{{ cartService.getItemCount() }}</span>
          </button>

          <!-- AUTH ACTIONS (DESKTOP) -->
          <div class="auth-box desktop-only">
            <!-- If NOT logged in -->
            <ng-container *ngIf="!(authService.currentUser$ | async)">
              <button type="button" class="btn-pill btn-pill-secondary btn-pill-sm" (click)="openLogin.emit()">
                Đăng nhập
              </button>
              <button type="button" class="btn-pill btn-pill-primary btn-pill-sm" (click)="openRegister.emit()">
                Đăng ký
              </button>
            </ng-container>

            <!-- If LOGGED IN -->
            <div *ngIf="authService.currentUser$ | async as user" class="user-menu-wrapper">
              <div class="user-pill" (click)="showUserDropdown = !showUserDropdown">
                <div class="user-avatar">{{ getInitials(user.fullName) }}</div>
                <div class="user-info">
                  <span class="user-name">{{ user.fullName }}</span>
                  <span class="user-wallet">{{ (authService.walletBalance$ | async) | number:'1.0-0' }}đ</span>
                </div>
                <span class="caret">▾</span>
              </div>

              <!-- User Dropdown Menu -->
              <div *ngIf="showUserDropdown" class="user-dropdown" (click)="showUserDropdown = false">
                <div class="dropdown-header">
                  <strong>{{ user.fullName }}</strong>
                  <small>{{ user.email }}</small>
                  <div class="wallet-chip">
                    Số dư: <strong>{{ (authService.walletBalance$ | async) | number:'1.0-0' }}đ</strong>
                  </div>
                </div>
                <a href="javascript:void(0)" class="dropdown-item" (click)="openOrders.emit()">
                  📦 Lịch sử đơn & Kho acc
                </a>
                <a href="javascript:void(0)" class="dropdown-item" (click)="openRecharge.emit()">
                  💳 Nạp tiền vào tài khoản
                </a>
                <div class="dropdown-divider"></div>
                <a href="javascript:void(0)" class="dropdown-item text-danger" (click)="logout()">
                  🚪 Đăng xuất
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Mobile Search Overlay -->
    <div *ngIf="showMobileSearch" class="mobile-search-overlay" (click)="showMobileSearch = false">
      <div class="mobile-search-bar" (click)="$event.stopPropagation()">
        <span class="search-icon">🔍</span>
        <input 
          type="text" 
          [(ngModel)]="searchKeyword" 
          (keyup.enter)="onSearch(); showMobileSearch = false" 
          placeholder="Nhập tên game bạn muốn tìm..."
          autofocus />
        <button type="button" class="btn-clear" (click)="showMobileSearch = false">✕</button>
      </div>
    </div>

    <!-- Mobile Drawer Menu -->
    <div *ngIf="showMobileMenu" class="mobile-drawer-overlay" (click)="closeMobileMenu()">
      <div class="mobile-drawer" (click)="$event.stopPropagation()">
        <div class="drawer-head">
          <div class="brand-logo">
            <span class="wibu">WIBU</span><span class="gem">GEM</span>
          </div>
          <button type="button" class="btn-close" (click)="closeMobileMenu()">✕</button>
        </div>

        <!-- User Card in Drawer -->
        <div class="drawer-user-card">
          <ng-container *ngIf="authService.currentUser$ | async as user; else guestDrawer">
            <div class="drawer-avatar">{{ getInitials(user.fullName) }}</div>
            <div class="drawer-user-info">
              <strong>{{ user.fullName }}</strong>
              <span class="wallet-badge">{{ (authService.walletBalance$ | async) | number:'1.0-0' }} VNĐ</span>
            </div>
          </ng-container>
          <ng-template #guestDrawer>
            <p class="greeting-text">Chào bạn! Đăng nhập để nhận ngay ưu đãi giảm 10%.</p>
            <div class="drawer-auth-btns">
              <button type="button" class="btn-pill btn-pill-secondary btn-pill-sm" (click)="openLogin.emit(); closeMobileMenu()">
                Đăng nhập
              </button>
              <button type="button" class="btn-pill btn-pill-primary btn-pill-sm" (click)="openRegister.emit(); closeMobileMenu()">
                Đăng ký
              </button>
            </div>
          </ng-template>
        </div>

        <!-- Drawer Navigation -->
        <div class="drawer-links">
          <a href="#" class="drawer-link" (click)="closeMobileMenu()">
            <span>🏠</span> Trang chủ
          </a>
          <a href="#games-section" class="drawer-link" (click)="closeMobileMenu()">
            <span>🎮</span> Danh mục game
          </a>
          <a href="javascript:void(0)" class="drawer-link" (click)="openRecharge.emit(); closeMobileMenu()">
            <span>💳</span> Nạp tiền tự động
          </a>
          <a href="javascript:void(0)" class="drawer-link" (click)="openOrders.emit(); closeMobileMenu()">
            <span>📦</span> Lịch sử đơn hàng
          </a>
          <a href="https://m.me/wibugem" target="_blank" class="drawer-link" (click)="closeMobileMenu()">
            <span>💬</span> Nhắn tin Messenger
          </a>
          <a *ngIf="authService.currentUser$ | async" href="javascript:void(0)" class="drawer-link text-danger" (click)="logout(); closeMobileMenu()">
            <span>🚪</span> Đăng xuất
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .wg-header {
      position: sticky;
      top: 0;
      left: 0;
      right: 0;
      height: 72px;
      background: rgba(255, 255, 255, 0.94);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border-bottom: 1px solid var(--wg-border);
      z-index: 1000;
      transition: var(--wg-transition);
    }
    @media (max-width: 900px) {
      .wg-header {
        height: 60px;
      }
    }
    .header-container {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }
    .brand-logo {
      display: flex;
      align-items: center;
      gap: 6px;
      font-family: var(--wg-font-display);
      font-size: 22px;
      font-weight: 800;
      letter-spacing: -0.5px;
      text-decoration: none;
    }
    .logo-icon {
      font-size: 18px;
    }
    .wibu { color: var(--wg-cyan); }
    .gem { color: var(--wg-blue); }
    .badge-hub {
      font-size: 10px;
      font-weight: 700;
      background: var(--wg-blue-soft);
      color: var(--wg-blue);
      padding: 2px 6px;
      border-radius: 4px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      border: 1px solid var(--wg-blue-border);
    }
    .search-box {
      position: relative;
      flex: 1;
      max-width: 340px;
      display: flex;
      align-items: center;
    }
    .search-icon {
      position: absolute;
      left: 14px;
      font-size: 13px;
      opacity: 0.6;
      pointer-events: none;
    }
    .search-input {
      width: 100%;
      height: 40px;
      padding: 0 34px 0 38px;
      border-radius: var(--wg-radius-pill);
      border: 1px solid var(--wg-border-input);
      background: #f8fafc;
      font-size: 13px;
      color: var(--wg-ink);
      transition: var(--wg-transition);
    }
    .search-input:focus {
      outline: none;
      border-color: var(--wg-blue);
      background: #ffffff;
      box-shadow: 0 0 0 3px rgba(22, 104, 255, 0.12);
    }
    .btn-clear {
      position: absolute;
      right: 12px;
      background: none;
      border: none;
      font-size: 12px;
      color: var(--wg-ink-3);
      cursor: pointer;
    }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .nav-item {
      font-size: 14px;
      font-weight: 600;
      color: var(--wg-ink-2);
      transition: var(--wg-transition);
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .nav-item:hover, .nav-item.active {
      color: var(--wg-blue);
    }
    .nav-icon-badge {
      font-size: 13px;
    }
    .header-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .wg-cart-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      height: 40px;
      padding: 0 16px;
      border-radius: var(--wg-radius-pill);
      border: 1.5px solid var(--wg-blue-border);
      background: var(--wg-blue-surface);
      color: var(--wg-blue);
      font-weight: 600;
      font-size: 13px;
      cursor: pointer;
      transition: var(--wg-transition);
    }
    .wg-cart-pill:hover {
      background: var(--wg-blue-soft);
      border-color: var(--wg-blue);
      transform: translateY(-1px);
    }
    .cart-badge {
      background: var(--wg-blue);
      color: #ffffff;
      font-size: 11px;
      font-weight: 700;
      min-width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .auth-box {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .user-menu-wrapper {
      position: relative;
    }
    .user-pill {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 12px 4px 4px;
      border-radius: var(--wg-radius-pill);
      background: var(--wg-chip-bg);
      border: 1px solid var(--wg-border);
      cursor: pointer;
      transition: var(--wg-transition);
    }
    .user-pill:hover {
      background: var(--wg-chip-hover);
      border-color: var(--wg-blue-border);
    }
    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--wg-gradient-blue);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 12px;
    }
    .user-info {
      display: flex;
      flex-direction: column;
      line-height: 1.2;
    }
    .user-name {
      font-size: 12px;
      font-weight: 600;
      color: var(--wg-ink);
    }
    .user-wallet {
      font-size: 11px;
      font-weight: 700;
      color: var(--wg-blue);
    }
    .caret {
      font-size: 11px;
      color: var(--wg-ink-3);
    }
    .user-dropdown {
      position: absolute;
      top: 48px;
      right: 0;
      width: 240px;
      background: #ffffff;
      border: 1px solid var(--wg-border);
      border-radius: var(--wg-radius);
      box-shadow: var(--wg-shadow-drop);
      padding: 8px;
      display: flex;
      flex-direction: column;
      animation: fadeIn 0.15s ease-out;
    }
    .dropdown-header {
      padding: 8px 12px 10px;
      border-bottom: 1px solid var(--wg-border);
      display: flex;
      flex-direction: column;
    }
    .dropdown-header strong {
      font-size: 13px;
      color: var(--wg-ink);
    }
    .dropdown-header small {
      font-size: 11px;
      color: var(--wg-ink-3);
    }
    .wallet-chip {
      font-size: 11px;
      background: var(--wg-blue-soft);
      color: var(--wg-blue);
      padding: 3px 8px;
      border-radius: 4px;
      margin-top: 6px;
    }
    .dropdown-item {
      padding: 8px 12px;
      font-size: 13px;
      color: var(--wg-ink-2);
      border-radius: var(--wg-radius-sm);
      transition: var(--wg-transition);
    }
    .dropdown-item:hover {
      background: var(--wg-chip-bg);
      color: var(--wg-blue);
    }
    .dropdown-divider {
      height: 1px;
      background: var(--wg-border);
      margin: 6px 0;
    }
    .text-danger {
      color: var(--wg-danger) !important;
    }

    /* Mobile Responsive Classes */
    .mobile-only {
      display: none;
    }
    @media (max-width: 900px) {
      .desktop-only {
        display: none !important;
      }
      .mobile-only {
        display: flex !important;
      }
    }
    .btn-menu {
      width: 36px;
      height: 36px;
      border-radius: var(--wg-radius-sm);
      border: 1px solid var(--wg-border);
      background: #ffffff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;
      cursor: pointer;
    }
    .hamburger-bar {
      width: 18px;
      height: 2px;
      background: var(--wg-ink);
      border-radius: 2px;
    }
    .btn-icon {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 1px solid var(--wg-border);
      background: #ffffff;
      font-size: 14px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Mobile Search Dialog */
    .mobile-search-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100vw;
      height: 100vh;
      height: 100dvh;
      background: rgba(15, 23, 42, 0.65);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      z-index: 99999;
      display: flex;
      align-items: flex-start;
      padding: 16px;
    }
    .mobile-search-bar {
      width: 100%;
      display: flex;
      align-items: center;
      background: #ffffff;
      border-radius: var(--wg-radius-pill);
      padding: 4px 16px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.15);
      position: relative;
    }
    .mobile-search-bar input {
      flex: 1;
      height: 44px;
      border: none;
      outline: none;
      font-size: 14px;
      padding-left: 10px;
    }

    /* Mobile Drawer */
    .mobile-drawer-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100vw;
      height: 100vh;
      height: 100dvh;
      background: rgba(15, 23, 42, 0.65);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      z-index: 99999;
      display: flex;
    }
    .mobile-drawer {
      width: min(320px, 85vw);
      height: 100vh;
      height: 100dvh;
      background-color: #ffffff !important;
      box-shadow: 10px 0 35px rgba(0, 0, 0, 0.25);
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      animation: slideInLeft 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      position: relative;
      z-index: 100000;
    }
    @keyframes slideInLeft {
      from { transform: translateX(-100%); }
      to { transform: translateX(0); }
    }
    .drawer-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 18px 20px;
      background: #ffffff !important;
      border-bottom: 1px solid var(--wg-border);
      flex-shrink: 0;
    }
    .btn-close {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 1px solid var(--wg-border);
      background: #ffffff;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: var(--wg-ink-2);
      transition: var(--wg-transition);
    }
    .btn-close:hover {
      background: #f1f5f9;
      color: var(--wg-ink);
    }
    .drawer-user-card {
      padding: 16px 20px;
      background: var(--wg-blue-surface);
      border-bottom: 1px solid var(--wg-border);
      flex-shrink: 0;
    }
    .greeting-text {
      font-size: 13px;
      color: var(--wg-ink-2);
      margin-bottom: 12px;
    }
    .drawer-auth-btns {
      display: flex;
      gap: 8px;
    }
    .drawer-links {
      display: flex;
      flex-direction: column;
      padding: 12px;
      background-color: #ffffff !important;
      flex: 1;
      overflow-y: auto;
    }
    .drawer-link {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 14px;
      font-size: 14px;
      font-weight: 600;
      color: var(--wg-ink-2);
      border-radius: var(--wg-radius-sm);
      transition: var(--wg-transition);
    }
    .drawer-link:hover {
      background: var(--wg-blue-soft);
      color: var(--wg-blue);
    }
  `]
})
export class HeaderComponent {
  @Output() searchEvent = new EventEmitter<string>();
  @Output() openLogin = new EventEmitter<void>();
  @Output() openRegister = new EventEmitter<void>();
  @Output() openCart = new EventEmitter<void>();
  @Output() openRecharge = new EventEmitter<void>();
  @Output() openOrders = new EventEmitter<void>();

  searchKeyword = '';
  showUserDropdown = false;
  showMobileMenu = false;
  showMobileSearch = false;

  constructor(
    public cartService: CartService,
    public authService: AuthApiService
  ) {}

  onSearch(): void {
    this.searchEvent.emit(this.searchKeyword.trim());
  }

  clearSearch(): void {
    this.searchKeyword = '';
    this.searchEvent.emit('');
  }

  toggleMobileMenu(): void {
    this.showMobileMenu = !this.showMobileMenu;
    if (this.showMobileMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMobileMenu(): void {
    this.showMobileMenu = false;
    document.body.style.overflow = '';
  }

  getInitials(name: string): string {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    return parts[parts.length - 1][0].toUpperCase();
  }

  scrollToTop(event: Event): void {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  openSupport(): void {
    window.open('https://m.me/wibugem', '_blank');
  }

  logout(): void {
    this.authService.logout();
    this.showUserDropdown = false;
  }
}

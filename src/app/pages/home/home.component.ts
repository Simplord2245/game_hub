import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameApiService } from '../../core/services/game-api.service';
import { CategoryApiService } from '../../core/services/category-api.service';
import { ProductApiService } from '../../core/services/product-api.service';
import { CartService } from '../../core/services/cart.service';
import { ToastService } from '../../core/services/toast.service';
import { GameResponse, CategoryResponse } from '../../core/models/catalog.model';
import { ProductResponse, ProductSortOption } from '../../core/models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <main class="home-main">
      <!-- 1. HERO PROMO BANNER SECTION -->
      <section class="hero-section">
        <div class="wg-container">
          <div class="hero-banner">
            <div class="hero-content">
              <div class="hero-badge">
                <span class="pulse-dot"></span>
                <span>HỆ THỐNG GIAO DỊCH TÀI KHOẢN TỰ ĐỘNG 24/7</span>
              </div>
              <h1 class="hero-title">
                Shop Reroll & Tài Khoản Game <span class="gradient-text">Uy Tín Số 1</span>
              </h1>
              <p class="hero-desc">
                Cung cấp tài khoản Wuthering Waves, Genshin Impact, Honkai Star Rail, ZZZ với giá rẻ nhất thị trường.
                Bảo hành trọn đời, đổi mới 1 - 1 ngay lập tức.
              </p>

              <!-- Quick Search in Hero -->
              <div class="hero-search-box">
                <span class="search-icon">🔍</span>
                <input 
                  type="text" 
                  [(ngModel)]="productKeyword" 
                  (keyup.enter)="loadProducts()"
                  placeholder="Hôm nay bạn muốn tìm tài khoản tướng nào..." />
                <button type="button" class="btn-pill btn-pill-primary btn-pill-sm" (click)="loadProducts()">
                  Tìm kiếm
                </button>
              </div>

              <!-- Key Value Props -->
              <div class="hero-features">
                <div class="feat-badge">⚡ Nhận tài khoản sau 3 giây</div>
                <div class="feat-badge">🛡️ Bảo hành 100% trọn đời</div>
                <div class="feat-badge">💎 Nạp chiết khấu tới 25%</div>
              </div>
            </div>

            <!-- Hero Graphic Showcase -->
            <div class="hero-visual">
              <div class="visual-card">
                <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80" alt="Featured Game" class="visual-img" />
                <div class="visual-overlay">
                  <span class="badge-pill badge-hot">🔥 HOT TRENDING</span>
                  <div class="visual-game-title">Wuthering Waves · Jinhsi & Changli</div>
                  <div class="visual-game-price">Giá chỉ từ: <strong>45.000đ</strong></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 2. SYSTEM NOTICE TICKER -->
      <section class="notice-ticker-section">
        <div class="wg-container">
          <div class="notice-ticker-bar" (click)="openAnnouncement.emit()">
            <div class="ticker-left">
              <span class="ticker-icon">📢</span>
              <strong class="ticker-label">THÔNG BÁO:</strong>
              <span class="ticker-text">Hệ thống mở cổng nạp VietQR tự động 24/7 · Giảm ngay 10% khi nhập mã WIBUGEM · Bấm để xem chi tiết</span>
            </div>
            <span class="ticker-btn">Xem thông báo →</span>
          </div>
        </div>
      </section>

      <!-- 3. GAME CATALOG SECTION (DANH SÁCH GAME) -->
      <section id="games-section" class="games-section">
        <div class="wg-container">
          <!-- Section Heading -->
          <div class="section-heading-box">
            <div class="heading-left">
              <h2 class="section-title">DANH SÁCH GAME</h2>
              <div class="title-underline"></div>
            </div>

            <!-- Game Toolbar -->
            <div class="game-toolbar">
              <div class="search-pill">
                <span class="icon">🔍</span>
                <input 
                  type="text" 
                  [(ngModel)]="gameSearchKeyword" 
                  (input)="filterGames()"
                  placeholder="Tìm game theo tên..." />
              </div>

              <select [(ngModel)]="gameSort" (change)="sortGames()" class="select-pill">
                <option value="DEFAULT">Ngẫu nhiên (mặc định)</option>
                <option value="POPULAR">Bán chạy nhất</option>
                <option value="NAME_ASC">Tên: A - Z</option>
                <option value="NAME_DESC">Tên: Z - A</option>
              </select>
            </div>
          </div>

          <!-- Alphabet Ribbon Filter -->
          <div class="alphabet-ribbon">
            <button 
              type="button" 
              class="alpha-btn" 
              [class.active]="selectedAlpha === 'ALL'"
              (click)="selectAlpha('ALL')">
              # Tất cả
            </button>
            <button 
              type="button" 
              *ngFor="let char of alphabet" 
              class="alpha-btn"
              [class.active]="selectedAlpha === char"
              (click)="selectAlpha(char)">
              {{ char }}
            </button>
          </div>

          <!-- Game Cards Grid -->
          <div class="game-grid">
            <div 
              *ngFor="let g of filteredGames" 
              class="game-card" 
              [class.active]="selectedGameId === g.gameId"
              (click)="selectGame(g.gameId)">
              <!-- Thumbnail with 45deg shine sweep reflection -->
              <div class="game-card-thumb">
                <img [src]="g.coverUrl" [alt]="g.gameName" />
                <div class="game-card-shine"></div>
              </div>

              <!-- Body -->
              <div class="game-card-body">
                <div class="game-name-row">
                  <span class="game-name">{{ g.gameName }}</span>
                  <span *ngIf="g.hot" class="badge-pill badge-hot">HOT</span>
                </div>
                <div class="game-meta">
                  <span>{{ g.publisher }}</span>
                  <span *ngIf="g.orderCount">· {{ g.orderCount | number:'1.0-0' }} đơn</span>
                </div>
              </div>

              <!-- Indicator -->
              <div *ngIf="selectedGameId === g.gameId" class="selected-check">✓</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 4. PRODUCTS CATALOG SECTION (SẢN PHẨM / TÀI KHOẢN) -->
      <section id="products-section" class="products-section">
        <div class="wg-container">
          <!-- Section Heading -->
          <div class="section-heading-box">
            <div class="heading-left">
              <h2 class="section-title">KHO TÀI KHOẢN & SẢN PHẨM</h2>
              <div class="title-underline"></div>
            </div>

            <!-- Active Game Filter Tag if any -->
            <div *ngIf="selectedGameId" class="active-filter-badge">
              <span>Đang lọc theo game: <strong>{{ getSelectedGameName() }}</strong></span>
              <button type="button" class="btn-clear-filter" (click)="clearGameFilter()">✕ Bỏ lọc</button>
            </div>
          </div>

          <!-- Category Filter Tabs & Sort -->
          <div class="filter-controls-row">
            <!-- Category Pills -->
            <div class="category-tabs">
              <button 
                type="button" 
                class="btn-cat-pill" 
                [class.active]="!selectedCategoryId"
                (click)="selectCategory(undefined)">
                Tất cả sản phẩm
              </button>
              <button 
                type="button" 
                *ngFor="let c of categories" 
                class="btn-cat-pill"
                [class.active]="selectedCategoryId === c.categoryId"
                (click)="selectCategory(c.categoryId)">
                {{ c.icon || '🎮' }} {{ c.categoryName }}
              </button>
            </div>

            <!-- Sort By Select -->
            <div class="sort-box">
              <span class="sort-label">Sắp xếp:</span>
              <select [(ngModel)]="productSort" (change)="loadProducts()" class="select-pill">
                <option value="latest">Mới nhất</option>
                <option value="popular">Bán chạy nhất</option>
                <option value="price-asc">Giá: Thấp đến cao</option>
                <option value="price-desc">Giá: Cao đến thấp</option>
                <option value="name">Tên: A - Z</option>
              </select>
            </div>
          </div>

          <!-- Product Cards Grid -->
          <div *ngIf="loadingProducts" class="loading-box">
            <div class="spinner"></div>
            <p>Đang tải danh sách sản phẩm...</p>
          </div>

          <!-- Empty products -->
          <div *ngIf="!loadingProducts && products.length === 0" class="empty-products">
            <div class="empty-icon">🔍</div>
            <h3>Không tìm thấy sản phẩm phù hợp</h3>
            <p>Hãy thử tìm với từ khóa khác hoặc bỏ chọn bộ lọc game/danh mục.</p>
            <button type="button" class="btn-pill btn-pill-primary" (click)="resetAllFilters()">
              Xem tất cả sản phẩm
            </button>
          </div>

          <!-- Products Grid -->
          <div *ngIf="!loadingProducts && products.length > 0" class="product-grid">
            <div *ngFor="let p of products" class="wg-acc-card" (click)="openDetail.emit(p)">
              <!-- Thumbnail preview with zoom -->
              <div class="wg-acc-thumb">
                <img [src]="p.coverUrl" [alt]="p.productName" />
                <div class="thumb-badges">
                  <span class="badge-pill badge-server">{{ p.attributes?.server || 'Asia' }}</span>
                  <span *ngIf="p.salePrice" class="badge-pill badge-hot">
                    -{{ getDiscountPercent(p.price, p.salePrice) }}%
                  </span>
                </div>
                <div class="thumb-instant">⚡ Giao tự động 24/7</div>
              </div>

              <!-- Body -->
              <div class="wg-acc-body">
                <div class="game-tag">{{ p.game.gameName }}</div>
                <h3 class="prod-title" [title]="p.productName">{{ p.productName }}</h3>

                <!-- Specs row -->
                <div class="specs-preview">
                  <span *ngIf="p.attributes?.arLevel" class="spec-tag">
                    AR {{ p.attributes?.arLevel }}
                  </span>
                  <span *ngIf="p.attributes?.rerollGems" class="spec-tag highlight">
                    {{ p.attributes?.rerollGems }}
                  </span>
                  <span *ngIf="p.attributes?.fiveStars" class="spec-tag">
                    ⭐ {{ p.attributes?.fiveStars }} SSR
                  </span>
                </div>

                <!-- Footer: Stock & Price -->
                <div class="wg-acc-foot">
                  <div class="price-container">
                    <div class="price-main">
                      {{ (p.salePrice || p.price) | number:'1.0-0' }}đ
                    </div>
                    <div *ngIf="p.salePrice" class="price-old">
                      {{ p.price | number:'1.0-0' }}đ
                    </div>
                  </div>

                  <!-- Quick Add Cart button -->
                  <button 
                    type="button" 
                    class="btn-cart-quick" 
                    (click)="quickAddToCart($event, p)"
                    title="Thêm vào giỏ">
                    🛒
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div *ngIf="totalPages > 1" class="pagination-bar">
            <button 
              type="button" 
              class="page-btn" 
              [disabled]="currentPage === 0"
              (click)="changePage(currentPage - 1)">
              ← Trang trước
            </button>
            <span class="page-info">
              Trang <strong>{{ currentPage + 1 }}</strong> / {{ totalPages }}
            </span>
            <button 
              type="button" 
              class="page-btn" 
              [disabled]="currentPage >= totalPages - 1"
              (click)="changePage(currentPage + 1)">
              Trang sau →
            </button>
          </div>
        </div>
      </section>
    </main>
  `,
  styles: [`
    .home-main {
      min-height: 80vh;
    }

    /* 1. Hero Section */
    .hero-section {
      padding: 30px 0 20px;
    }
    .hero-banner {
      background: #ffffff;
      border: 1px solid var(--wg-border);
      border-radius: var(--wg-radius-xl);
      padding: 36px 32px;
      display: grid;
      grid-template-columns: 1fr;
      gap: 32px;
      box-shadow: var(--wg-shadow-card);
      position: relative;
      overflow: hidden;
    }
    @media (min-width: 900px) {
      .hero-banner {
        grid-template-columns: 1.2fr 0.8fr;
        padding: 44px 40px;
        align-items: center;
      }
    }
    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 4px 12px;
      border-radius: var(--wg-radius-pill);
      background: var(--wg-blue-soft);
      color: var(--wg-blue);
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.5px;
      margin-bottom: 14px;
      border: 1px solid var(--wg-blue-border);
    }
    .pulse-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.3);
      animation: pulse 1.8s infinite;
    }
    @keyframes pulse {
      0% { transform: scale(0.9); opacity: 0.8; }
      50% { transform: scale(1.3); opacity: 1; }
      100% { transform: scale(0.9); opacity: 0.8; }
    }
    .hero-title {
      font-family: var(--wg-font-display);
      font-size: 28px;
      font-weight: 800;
      line-height: 1.3;
      color: var(--wg-ink);
      margin-bottom: 12px;
    }
    @media (min-width: 768px) {
      .hero-title {
        font-size: 36px;
      }
    }
    .gradient-text {
      background: var(--wg-gradient-blue);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .hero-desc {
      font-size: 14px;
      color: var(--wg-ink-3);
      line-height: 1.6;
      margin-bottom: 22px;
      max-width: 540px;
    }
    .hero-search-box {
      display: flex;
      align-items: center;
      background: #f8fafc;
      border: 1.5px solid var(--wg-border-input);
      border-radius: var(--wg-radius-pill);
      padding: 4px 6px 4px 16px;
      max-width: 480px;
      margin-bottom: 20px;
      transition: var(--wg-transition);
    }
    .hero-search-box:focus-within {
      border-color: var(--wg-blue);
      background: #ffffff;
      box-shadow: 0 0 0 3px rgba(22, 104, 255, 0.12);
    }
    .hero-search-box input {
      flex: 1;
      height: 38px;
      border: none;
      background: transparent;
      outline: none;
      font-size: 13.5px;
      color: var(--wg-ink);
      padding: 0 8px;
    }
    .hero-features {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    .feat-badge {
      font-size: 12px;
      font-weight: 600;
      color: var(--wg-ink-2);
      background: var(--wg-chip-bg);
      padding: 4px 10px;
      border-radius: var(--wg-radius-pill);
    }
    .visual-card {
      position: relative;
      border-radius: var(--wg-radius-lg);
      overflow: hidden;
      box-shadow: 0 16px 36px -12px rgba(22, 104, 255, 0.28);
      aspect-ratio: 16/10;
      background: #0f172a;
    }
    .visual-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.9;
    }
    .visual-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 20px;
      background: linear-gradient(to top, rgba(15, 23, 42, 0.95), transparent);
      color: #ffffff;
    }
    .visual-game-title {
      font-family: var(--wg-font-display);
      font-size: 16px;
      font-weight: 700;
      margin-top: 6px;
    }
    .visual-game-price {
      font-size: 13px;
      color: #cbd5e1;
      margin-top: 2px;
    }
    .visual-game-price strong {
      color: #38bdf8;
      font-size: 15px;
    }

    /* 2. Notice Ticker */
    .notice-ticker-section {
      margin-bottom: 24px;
    }
    .notice-ticker-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: var(--wg-blue-surface);
      border: 1px solid var(--wg-blue-border);
      border-radius: var(--wg-radius-pill);
      padding: 10px 20px;
      cursor: pointer;
      transition: var(--wg-transition);
    }
    .notice-ticker-bar:hover {
      background: var(--wg-blue-soft);
      transform: translateY(-1px);
    }
    .ticker-left {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .ticker-label {
      color: var(--wg-blue);
      flex-shrink: 0;
    }
    .ticker-text {
      color: var(--wg-ink-2);
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .ticker-btn {
      font-size: 12px;
      font-weight: 700;
      color: var(--wg-blue);
      flex-shrink: 0;
      margin-left: 12px;
    }

    /* 3. Game Section */
    .games-section {
      padding: 30px 0;
    }
    .section-heading-box {
      display: flex;
      flex-direction: column;
      gap: 14px;
      margin-bottom: 20px;
    }
    @media (min-width: 768px) {
      .section-heading-box {
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-end;
      }
    }
    .section-title {
      font-family: var(--wg-font-display);
      font-size: 22px;
      font-weight: 800;
      color: var(--wg-blue);
      letter-spacing: -0.5px;
    }
    .title-underline {
      width: 48px;
      height: 3px;
      background: var(--wg-blue);
      border-radius: 2px;
      margin-top: 4px;
    }
    .game-toolbar {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }
    .search-pill {
      display: flex;
      align-items: center;
      background: #ffffff;
      border: 1px solid var(--wg-border-input);
      border-radius: var(--wg-radius-pill);
      padding: 0 14px;
      height: 38px;
    }
    .search-pill input {
      border: none;
      outline: none;
      font-size: 13px;
      padding-left: 8px;
      width: 160px;
    }
    .select-pill {
      height: 38px;
      padding: 0 14px;
      border-radius: var(--wg-radius-pill);
      border: 1px solid var(--wg-border-input);
      background: #ffffff;
      font-size: 13px;
      color: var(--wg-ink);
      cursor: pointer;
    }

    /* Alphabet Ribbon */
    .alphabet-ribbon {
      display: flex;
      gap: 6px;
      overflow-x: auto;
      padding-bottom: 12px;
      margin-bottom: 18px;
    }
    .alpha-btn {
      padding: 4px 12px;
      border-radius: var(--wg-radius-pill);
      border: 1px solid var(--wg-border);
      background: #ffffff;
      font-size: 12px;
      font-weight: 600;
      color: var(--wg-ink-3);
      cursor: pointer;
      white-space: nowrap;
      transition: var(--wg-transition);
    }
    .alpha-btn:hover {
      border-color: var(--wg-blue-border);
      color: var(--wg-blue);
    }
    .alpha-btn.active {
      background: var(--wg-blue);
      color: #ffffff;
      border-color: var(--wg-blue);
    }

    /* Game Card Grid (WibuGem style with shine sweep reflection) */
    .game-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 14px;
    }
    @media (min-width: 480px) {
      .game-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media (min-width: 768px) {
      .game-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }
    @media (min-width: 1024px) {
      .game-grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }
    .game-card {
      position: relative;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 14px;
      border-radius: var(--wg-radius-md);
      background: #ffffff;
      border: 1px solid var(--wg-card-border);
      box-shadow: var(--wg-shadow-card);
      cursor: pointer;
      transition: var(--wg-transition);
    }
    .game-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--wg-shadow-hover);
      border-color: var(--wg-blue-border);
    }
    .game-card.active {
      border-color: var(--wg-blue);
      background: var(--wg-blue-surface);
    }

    /* 64x64px thumb with 45deg shine sweep reflection */
    .game-card-thumb {
      position: relative;
      width: 64px;
      height: 64px;
      border-radius: 12px;
      overflow: hidden;
      flex-shrink: 0;
      background: #e2e8f0;
    }
    .game-card-thumb img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .game-card-shine {
      position: absolute;
      top: 0;
      left: -100%;
      width: 50%;
      height: 100%;
      background: linear-gradient(
        to right,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0.6) 50%,
        rgba(255, 255, 255, 0) 100%
      );
      transform: skewX(-25deg);
      transition: none;
    }
    .game-card:hover .game-card-shine {
      left: 150%;
      transition: left 0.75s ease-in-out;
    }
    .game-card-body {
      flex: 1;
      min-width: 0;
    }
    .game-name-row {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 3px;
    }
    .game-name {
      font-size: 14px;
      font-weight: 700;
      color: var(--wg-ink);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .game-meta {
      font-size: 12px;
      color: var(--wg-ink-3);
    }
    .selected-check {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: var(--wg-blue);
      color: #ffffff;
      font-size: 11px;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* 4. Products Section */
    .products-section {
      padding: 40px 0;
    }
    .active-filter-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: var(--wg-blue);
      background: var(--wg-blue-soft);
      padding: 6px 12px;
      border-radius: var(--wg-radius-pill);
      border: 1px solid var(--wg-blue-border);
    }
    .btn-clear-filter {
      background: none;
      border: none;
      color: var(--wg-danger);
      font-weight: 700;
      cursor: pointer;
      font-size: 12px;
    }
    .filter-controls-row {
      display: flex;
      flex-direction: column;
      gap: 14px;
      margin-bottom: 24px;
    }
    @media (min-width: 768px) {
      .filter-controls-row {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
      }
    }
    .category-tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .btn-cat-pill {
      padding: 8px 16px;
      border-radius: var(--wg-radius-pill);
      border: 1px solid var(--wg-border);
      background: #ffffff;
      font-size: 13px;
      font-weight: 600;
      color: var(--wg-ink-2);
      cursor: pointer;
      transition: var(--wg-transition);
    }
    .btn-cat-pill:hover {
      background: var(--wg-chip-bg);
      border-color: var(--wg-border-hover);
    }
    .btn-cat-pill.active {
      background: var(--wg-blue);
      color: #ffffff;
      border-color: var(--wg-blue);
      box-shadow: 0 4px 12px rgba(22, 104, 255, 0.28);
    }
    .sort-box {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
    }
    .sort-label {
      color: var(--wg-ink-3);
    }

    /* Product Grid */
    .product-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 18px;
    }
    @media (min-width: 560px) {
      .product-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media (min-width: 860px) {
      .product-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }
    @media (min-width: 1140px) {
      .product-grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    /* Product Card (.wg-acc-card) */
    .wg-acc-card {
      background: #ffffff;
      border: 1px solid var(--wg-border);
      border-radius: var(--wg-radius-lg);
      overflow: hidden;
      box-shadow: 0 2px 12px -8px rgba(30, 40, 80, 0.18);
      display: flex;
      flex-direction: column;
      cursor: pointer;
      transition: var(--wg-transition);
    }
    .wg-acc-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 28px -12px rgba(22, 104, 255, 0.28);
      border-color: var(--wg-blue-border);
    }
    .wg-acc-thumb {
      position: relative;
      aspect-ratio: 16/10;
      background: #e2e8f0;
      overflow: hidden;
    }
    .wg-acc-thumb img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }
    .wg-acc-card:hover .wg-acc-thumb img {
      transform: scale(1.06);
    }
    .thumb-badges {
      position: absolute;
      top: 8px;
      left: 8px;
      display: flex;
      gap: 6px;
    }
    .thumb-instant {
      position: absolute;
      bottom: 8px;
      left: 8px;
      background: rgba(15, 23, 42, 0.75);
      backdrop-filter: blur(4px);
      color: #ffffff;
      font-size: 10px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 4px;
    }
    .wg-acc-body {
      padding: 14px 16px;
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    .game-tag {
      font-size: 11px;
      font-weight: 700;
      color: var(--wg-ink-3);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }
    .prod-title {
      font-family: var(--wg-font-display);
      font-size: 14px;
      font-weight: 700;
      color: var(--wg-ink);
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      margin-bottom: 10px;
      min-height: 38px;
    }
    .specs-preview {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 12px;
    }
    .spec-tag {
      font-size: 11px;
      background: var(--wg-chip-bg);
      color: var(--wg-ink-2);
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: 600;
    }
    .spec-tag.highlight {
      background: var(--wg-cyan-light);
      color: #0e7490;
    }
    .wg-acc-foot {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: auto;
      padding-top: 10px;
      border-top: 1px dashed var(--wg-border);
    }
    .price-container {
      display: flex;
      flex-direction: column;
      line-height: 1.2;
    }
    .price-main {
      font-size: 17px;
      font-weight: 800;
      color: var(--wg-blue);
      font-family: var(--wg-font-display);
    }
    .price-old {
      font-size: 11px;
      color: var(--wg-ink-muted);
      text-decoration: line-through;
    }
    .btn-cart-quick {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 1px solid var(--wg-border);
      background: var(--wg-blue-surface);
      color: var(--wg-blue);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      transition: var(--wg-transition);
    }
    .btn-cart-quick:hover {
      background: var(--wg-blue);
      color: #ffffff;
      transform: scale(1.08);
    }

    /* Loading & Empty */
    .loading-box, .empty-products {
      text-align: center;
      padding: 50px 20px;
    }
    .spinner {
      width: 36px;
      height: 36px;
      border: 3px solid var(--wg-border);
      border-top-color: var(--wg-blue);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 12px;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .empty-icon {
      font-size: 48px;
      margin-bottom: 12px;
    }
    .empty-products h3 {
      font-size: 18px;
      color: var(--wg-ink);
      margin-bottom: 6px;
    }
    .empty-products p {
      font-size: 14px;
      color: var(--wg-ink-3);
      margin-bottom: 18px;
    }

    /* Pagination */
    .pagination-bar {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      margin-top: 36px;
    }
    .page-btn {
      padding: 8px 18px;
      border-radius: var(--wg-radius-pill);
      border: 1px solid var(--wg-border);
      background: #ffffff;
      font-size: 13px;
      font-weight: 600;
      color: var(--wg-ink);
      cursor: pointer;
      transition: var(--wg-transition);
    }
    .page-btn:hover:not(:disabled) {
      border-color: var(--wg-blue);
      color: var(--wg-blue);
    }
    .page-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .page-info {
      font-size: 13px;
      color: var(--wg-ink-3);
    }
  `]
})
export class HomeComponent implements OnInit {
  @Output() openDetail = new EventEmitter<ProductResponse>();
  @Output() openAnnouncement = new EventEmitter<void>();

  // Data
  games: GameResponse[] = [];
  filteredGames: GameResponse[] = [];
  categories: CategoryResponse[] = [];
  products: ProductResponse[] = [];

  // Filters & State
  gameSearchKeyword = '';
  gameSort = 'DEFAULT';
  selectedAlpha = 'ALL';
  selectedGameId?: number;
  selectedCategoryId?: number;
  productKeyword = '';
  productSort: ProductSortOption = 'latest';

  // Pagination
  currentPage = 0;
  pageSize = 12;
  totalElements = 0;
  totalPages = 1;
  loadingProducts = false;

  alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  constructor(
    private gameService: GameApiService,
    private catService: CategoryApiService,
    private productService: ProductApiService,
    private cartService: CartService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadGames();
    this.loadCategories();
    this.loadProducts();
  }

  loadGames(): void {
    this.gameService.getActiveGames('', 0, 50).subscribe(res => {
      this.games = res.data.content;
      this.filterGames();
    });
  }

  loadCategories(): void {
    this.catService.getActiveCategories().subscribe(res => {
      this.categories = res.data;
    });
  }

  loadProducts(): void {
    this.loadingProducts = true;
    this.productService.getActiveProducts(
      this.selectedGameId,
      this.selectedCategoryId,
      this.productKeyword,
      this.currentPage,
      this.pageSize,
      this.productSort
    ).subscribe(res => {
      this.loadingProducts = false;
      this.products = res.data.content;
      this.currentPage = res.data.page;
      this.totalElements = res.data.totalElements;
      this.totalPages = res.data.totalPages;
    });
  }

  filterGames(): void {
    let result = [...this.games];

    if (this.gameSearchKeyword.trim()) {
      const kw = this.gameSearchKeyword.toLowerCase().trim();
      result = result.filter(g => g.gameName.toLowerCase().includes(kw));
    }

    if (this.selectedAlpha !== 'ALL') {
      result = result.filter(g => g.gameName.toUpperCase().startsWith(this.selectedAlpha));
    }

    this.filteredGames = result;
    this.sortGames();
  }

  sortGames(): void {
    switch (this.gameSort) {
      case 'POPULAR':
        this.filteredGames.sort((a, b) => (b.orderCount || 0) - (a.orderCount || 0));
        break;
      case 'NAME_ASC':
        this.filteredGames.sort((a, b) => a.gameName.localeCompare(b.gameName));
        break;
      case 'NAME_DESC':
        this.filteredGames.sort((a, b) => b.gameName.localeCompare(a.gameName));
        break;
      default:
        // Default
        break;
    }
  }

  selectAlpha(char: string): void {
    this.selectedAlpha = char;
    this.filterGames();
  }

  selectGame(gameId: number): void {
    if (this.selectedGameId === gameId) {
      this.selectedGameId = undefined; // toggle off
    } else {
      this.selectedGameId = gameId;
    }
    this.currentPage = 0;
    this.loadProducts();

    // Smooth scroll down to products section
    const el = document.getElementById('products-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  clearGameFilter(): void {
    this.selectedGameId = undefined;
    this.currentPage = 0;
    this.loadProducts();
  }

  getSelectedGameName(): string {
    const found = this.games.find(g => g.gameId === this.selectedGameId);
    return found ? found.gameName : '';
  }

  selectCategory(catId?: number): void {
    this.selectedCategoryId = catId;
    this.currentPage = 0;
    this.loadProducts();
  }

  resetAllFilters(): void {
    this.selectedGameId = undefined;
    this.selectedCategoryId = undefined;
    this.productKeyword = '';
    this.currentPage = 0;
    this.loadProducts();
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.loadProducts();
  }

  getDiscountPercent(price: number, salePrice?: number): number {
    if (!salePrice || salePrice >= price) return 0;
    return Math.round(((price - salePrice) / price) * 100);
  }

  quickAddToCart(event: Event, product: ProductResponse): void {
    event.stopPropagation();
    if (product.stockCount <= 0) {
      this.toast.error(`${product.productName} đã hết hàng!`);
      return;
    }
    this.cartService.addToCart(product, 1);
    this.toast.success(`✅ Đã thêm "${product.productName}" vào giỏ hàng`);
  }
}

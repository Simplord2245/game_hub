import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductApiService } from '../../core/services/product-api.service';
import { GameApiService } from '../../core/services/game-api.service';
import { CategoryApiService } from '../../core/services/category-api.service';
import { OrderService } from '../../core/services/order.service';
import { AuthApiService } from '../../core/services/auth-api.service';
import { ToastService } from '../../core/services/toast.service';
import { ProductResponse } from '../../core/models/product.model';
import { GameResponse, CategoryResponse } from '../../core/models/catalog.model';
import { Order } from '../../core/models/order.model';

type AdminTab = 'DASHBOARD' | 'PRODUCTS' | 'GAMES' | 'CATEGORIES' | 'ORDERS' | 'USERS' | 'STOCK' | 'SETTINGS';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-wrapper">
      <!-- Mobile Sidebar Overlay -->
      <div *ngIf="sidebarOpen" class="sidebar-overlay" (click)="sidebarOpen = false"></div>

      <!-- SIDEBAR -->
      <aside class="admin-sidebar" [class.sidebar-open]="sidebarOpen">
        <div class="sidebar-brand">
          <div class="brand-text">
            <span class="wibu">WIBU</span><span class="gem">GEM</span>
            <span class="admin-pill">ADMIN</span>
          </div>
          <div class="brand-sub">GameHub Control Center</div>
        </div>

        <!-- Current Admin Info -->
        <div class="admin-user-card" *ngIf="authService.currentUser$ | async as user">
          <div class="avatar">{{ getInitials(user.fullName) }}</div>
          <div class="user-details">
            <div class="name">{{ user.fullName }}</div>
            <div class="roles">
              <span *ngFor="let r of user.roles" class="role-badge">{{ r }}</span>
            </div>
          </div>
        </div>

        <!-- Navigation Menu -->
        <nav class="sidebar-nav">
          <button 
            type="button" 
            class="nav-btn" 
            [class.active]="activeTab === 'DASHBOARD'" 
            (click)="activeTab = 'DASHBOARD'; sidebarOpen = false">
            <span class="icon">📊</span>
            <span>Tổng quan hệ thống</span>
          </button>

          <button 
            type="button" 
            class="nav-btn" 
            [class.active]="activeTab === 'PRODUCTS'" 
            (click)="activeTab = 'PRODUCTS'; sidebarOpen = false">
            <span class="icon">📦</span>
            <span>Quản lý sản phẩm</span>
            <span class="badge-count">{{ products.length }}</span>
          </button>

          <button 
            type="button" 
            class="nav-btn" 
            [class.active]="activeTab === 'GAMES'" 
            (click)="activeTab = 'GAMES'; sidebarOpen = false">
            <span class="icon">🎮</span>
            <span>Danh mục game</span>
            <span class="badge-count">{{ games.length }}</span>
          </button>

          <button 
            type="button" 
            class="nav-btn" 
            [class.active]="activeTab === 'CATEGORIES'" 
            (click)="activeTab = 'CATEGORIES'; sidebarOpen = false">
            <span class="icon">🏷️</span>
            <span>Loại sản phẩm</span>
            <span class="badge-count">{{ categories.length }}</span>
          </button>

          <button 
            type="button" 
            class="nav-btn" 
            [class.active]="activeTab === 'ORDERS'" 
            (click)="activeTab = 'ORDERS'; sidebarOpen = false">
            <span class="icon">📋</span>
            <span>Đơn hàng & Giao dịch</span>
            <span class="badge-count">{{ orders.length }}</span>
          </button>

          <button 
            type="button" 
            class="nav-btn" 
            [class.active]="activeTab === 'USERS'" 
            (click)="activeTab = 'USERS'; sidebarOpen = false">
            <span class="icon">👥</span>
            <span>Người dùng & Phân quyền</span>
            <span class="badge-count">{{ users.length }}</span>
          </button>

          <button 
            type="button" 
            class="nav-btn" 
            [class.active]="activeTab === 'STOCK'" 
            (click)="activeTab = 'STOCK'; sidebarOpen = false">
            <span class="icon">📈</span>
            <span>Tồn kho (vw_product_stock)</span>
          </button>

          <button 
            type="button" 
            class="nav-btn" 
            [class.active]="activeTab === 'SETTINGS'" 
            (click)="activeTab = 'SETTINGS'; sidebarOpen = false">
            <span class="icon">⚙️</span>
            <span>Cài đặt hệ thống</span>
          </button>
        </nav>

        <!-- Sidebar Footer Action -->
        <div class="sidebar-footer">
          <button type="button" class="btn-sidebar-action shop" (click)="goToShop()">
            <span>🛒</span> Về trang mua hàng
          </button>
          <button type="button" class="btn-sidebar-action logout" (click)="logout()">
            <span>🚪</span> Đăng xuất
          </button>
        </div>
      </aside>

      <!-- MAIN CONTENT AREA -->
      <main class="admin-main">
        <!-- Topbar -->
        <header class="admin-topbar">
          <div class="topbar-left">
            <!-- Mobile hamburger button -->
            <button type="button" class="btn-hamburger" (click)="sidebarOpen = !sidebarOpen">☰</button>
            <h1 class="page-title">{{ getTabTitle() }}</h1>
            <div class="breadcrumbs">Trang quản trị / {{ getTabTitle() }}</div>
          </div>

          <div class="topbar-right">
            <button type="button" class="btn-pill btn-pill-outline btn-pill-sm" (click)="goToShop()">
              🛒 Xem trang khách hàng
            </button>
            <button type="button" class="btn-pill btn-pill-secondary btn-pill-sm" (click)="logout()">
              Đăng xuất
            </button>
          </div>
        </header>

        <!-- Dynamic Content Body -->
        <div class="admin-content">
          <!-- 1. DASHBOARD OVERVIEW -->
          <div *ngIf="activeTab === 'DASHBOARD'" class="view-dashboard">
            <!-- 4 Stat KPI Cards -->
            <div class="stats-row">
              <div class="stat-box primary">
                <div class="stat-icon">💰</div>
                <div class="stat-data">
                  <div class="stat-value">{{ calculateTotalRevenue() | number:'1.0-0' }}đ</div>
                  <div class="stat-title">Doanh thu hệ thống</div>
                </div>
              </div>

              <div class="stat-box success">
                <div class="stat-icon">📋</div>
                <div class="stat-data">
                  <div class="stat-value">{{ orders.length }}</div>
                  <div class="stat-title">Đơn hàng hoàn tất</div>
                </div>
              </div>

              <div class="stat-box warning">
                <div class="stat-icon">📦</div>
                <div class="stat-data">
                  <div class="stat-value">{{ calculateTotalStock() }}</div>
                  <div class="stat-title">Tài khoản khả dụng trong kho</div>
                </div>
              </div>

              <div class="stat-box info">
                <div class="stat-icon">👥</div>
                <div class="stat-data">
                  <div class="stat-value">{{ users.length }}</div>
                  <div class="stat-title">Người dùng đăng ký</div>
                </div>
              </div>
            </div>

            <!-- Quick Management Shortcuts -->
            <div class="quick-cards-grid">
              <div class="dash-card">
                <div class="card-head">
                  <h3>Đơn hàng mới nhận</h3>
                  <button type="button" class="link-btn" (click)="activeTab = 'ORDERS'">Xem tất cả →</button>
                </div>
                <div class="table-compact" *ngIf="orders.length > 0; else noOrders">
                  <table>
                    <thead>
                      <tr>
                        <th>Mã đơn</th>
                        <th>Khách hàng</th>
                        <th>Tổng tiền</th>
                        <th>Phương thức</th>
                        <th>Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let o of orders.slice(0, 5)">
                        <td><code>{{ o.orderCode }}</code></td>
                        <td>{{ (o.items && o.items[0]) ? (o.items[0].product.productName | slice:0:22) + '...' : 'Sản phẩm' }}</td>
                        <td><strong>{{ o.totalAmount | number:'1.0-0' }}đ</strong></td>
                        <td><span class="tag-pay">{{ o.paymentMethod }}</span></td>
                        <td><span class="badge-pill badge-stock">{{ o.orderStatus }}</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <ng-template #noOrders>
                  <p class="empty-hint">Chưa có đơn hàng nào. Đơn hàng sẽ hiện khi khách thanh toán qua Ví GameHub.</p>
                </ng-template>
              </div>

              <div class="dash-card">
                <div class="card-head">
                  <h3>Cảnh báo kho tài khoản (≤ 5 acc)</h3>
                  <button type="button" class="link-btn" (click)="activeTab = 'STOCK'">Chi tiết kho →</button>
                </div>
                <div class="low-stock-list" *ngIf="getLowStockProducts().length > 0; else noLowStock">
                  <div *ngFor="let p of getLowStockProducts()" class="low-stock-item">
                    <img [src]="p.coverUrl" class="low-stock-img" />
                    <div class="low-stock-info">
                      <div class="name">{{ p.productName }}</div>
                      <div class="game">{{ p.game.gameName }} · SKU: {{ p.sku }}</div>
                    </div>
                    <span class="stock-alert-badge">{{ p.stockCount }} acc còn lại</span>
                  </div>
                </div>
                <ng-template #noLowStock>
                  <p class="empty-hint">✅ Kho hàng đang đủ. Không có sản phẩm nào sắp hết.</p>
                </ng-template>
              </div>
            </div>

            <!-- Mini Bar Chart: Stock per game -->
            <div class="dash-card" style="margin-top: 24px">
              <div class="card-head">
                <h3>📊 Phân bố tồn kho theo Game</h3>
                <button type="button" class="link-btn" (click)="activeTab = 'PRODUCTS'">Quản lý sản phẩm →</button>
              </div>
              <div class="mini-chart">
                <div *ngFor="let g of games" class="chart-row">
                  <div class="chart-label">{{ g.gameName }}</div>
                  <div class="chart-bar-wrap">
                    <div class="chart-bar" [style.width]="getGameStockPercent(g.gameId) + '%'"></div>
                    <span class="chart-val">{{ getGameStock(g.gameId) }} acc</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 2. PRODUCTS TAB -->
          <div *ngIf="activeTab === 'PRODUCTS'" class="view-products">
            <div class="action-bar">
              <div class="search-filter-group">
                <input 
                  type="text" 
                  [(ngModel)]="productFilterKeyword" 
                  placeholder="Tìm theo tên sản phẩm, SKU..." 
                  class="input-search" />
                <select [(ngModel)]="filterGameId" class="select-filter">
                  <option [ngValue]="undefined">-- Tất cả Game --</option>
                  <option *ngFor="let g of games" [ngValue]="g.gameId">{{ g.gameName }}</option>
                </select>
              </div>
              <button type="button" class="btn-pill btn-pill-primary" (click)="openProductCreateModal()">
                + Thêm sản phẩm mới
              </button>
            </div>

            <!-- Product Create / Edit Modal -->
            <div *ngIf="showProductModal" class="modal-backdrop-custom">
              <div class="modal-card-custom">
                <div class="modal-header-custom">
                  <h3>{{ editingProductId ? 'Chỉnh sửa sản phẩm #' + editingProductId : 'Tạo sản phẩm tài khoản mới' }}</h3>
                  <button class="btn-close-custom" (click)="showProductModal = false">✕</button>
                </div>
                <div class="modal-body-custom">
                  <div class="form-grid">
                    <div class="form-field full">
                      <label>Tên sản phẩm *</label>
                      <input type="text" [(ngModel)]="prodForm.name" placeholder="Ví dụ: Acc Wuthering Waves..." />
                    </div>
                    <div class="form-field">
                      <label>Mã SKU *</label>
                      <input type="text" [(ngModel)]="prodForm.sku" placeholder="WW-ACC-001" />
                    </div>
                    <div class="form-field">
                      <label>Loại sản phẩm</label>
                      <select [(ngModel)]="prodForm.type">
                        <option value="ACCOUNT">Tài khoản (ACCOUNT)</option>
                        <option value="TOPUP">Nạp tiền (TOPUP)</option>
                        <option value="PASS">Thẻ tháng (PASS)</option>
                      </select>
                    </div>
                    <div class="form-field">
                      <label>Thuộc Game *</label>
                      <select [(ngModel)]="prodForm.gameId">
                        <option *ngFor="let g of games" [ngValue]="g.gameId">{{ g.gameName }}</option>
                      </select>
                    </div>
                    <div class="form-field">
                      <label>Thuộc Danh mục *</label>
                      <select [(ngModel)]="prodForm.categoryId">
                        <option *ngFor="let c of categories" [ngValue]="c.categoryId">{{ c.categoryName }}</option>
                      </select>
                    </div>
                    <div class="form-field">
                      <label>Giá niêm yết (VNĐ) *</label>
                      <input type="number" [(ngModel)]="prodForm.price" />
                    </div>
                    <div class="form-field">
                      <label>Giá khuyến mãi (VNĐ)</label>
                      <input type="number" [(ngModel)]="prodForm.salePrice" placeholder="Bỏ trống nếu không sale" />
                    </div>
                    <div class="form-field">
                      <label>Số lượng kho khả dụng *</label>
                      <input type="number" [(ngModel)]="prodForm.stock" />
                    </div>
                    <div class="form-field">
                      <label>Server (Máy chủ)</label>
                      <input type="text" [(ngModel)]="prodForm.server" placeholder="Asia, Global,..." />
                    </div>
                    <div class="form-field full">
                      <label>Ảnh bìa cover (URL)</label>
                      <input type="text" [(ngModel)]="prodForm.coverUrl" placeholder="https://..." />
                    </div>
                    <div class="form-field full">
                      <label>Mô tả chi tiết</label>
                      <textarea [(ngModel)]="prodForm.description" rows="3"></textarea>
                    </div>
                  </div>
                </div>
                <div class="modal-footer-custom">
                  <button type="button" class="btn-pill btn-pill-secondary btn-pill-sm" (click)="showProductModal = false">Hủy</button>
                  <button type="button" class="btn-pill btn-pill-primary btn-pill-sm" (click)="saveProduct()">Lưu sản phẩm</button>
                </div>
              </div>
            </div>

            <!-- Products Data Table -->
            <div class="data-table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Ảnh</th>
                    <th>SKU</th>
                    <th>Tên sản phẩm</th>
                    <th>Game</th>
                    <th>Danh mục</th>
                    <th>Giá bán</th>
                    <th>Tồn kho</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let p of getFilteredProducts()">
                    <td>
                      <img [src]="p.coverUrl" class="cell-thumb" />
                    </td>
                    <td><code>{{ p.sku }}</code></td>
                    <td class="cell-name">
                      <strong>{{ p.productName }}</strong>
                      <small>{{ p.attributes?.server || 'Asia' }}</small>
                    </td>
                    <td>{{ p.game.gameName }}</td>
                    <td>{{ p.category.categoryName }}</td>
                    <td>
                      <div class="price-stack">
                        <span class="active-price">{{ (p.salePrice || p.price) | number:'1.0-0' }}đ</span>
                        <span *ngIf="p.salePrice" class="old-price">{{ p.price | number:'1.0-0' }}đ</span>
                      </div>
                    </td>
                    <td>
                      <span class="stock-indicator" [class.low]="p.stockCount <= 5">{{ p.stockCount }} acc</span>
                    </td>
                    <td>
                      <span class="badge-pill" [class.badge-stock]="p.productStatus === 'ACTIVE'">{{ p.productStatus }}</span>
                    </td>
                    <td>
                      <button type="button" class="action-btn edit" (click)="editProduct(p)">Sửa</button>
                      <button type="button" class="action-btn delete" (click)="deleteProduct(p.productId)">Xóa</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- 3. GAMES TAB -->
          <div *ngIf="activeTab === 'GAMES'" class="view-games">
            <div class="action-bar">
              <h3>Danh sách Game trong hệ thống</h3>
              <button type="button" class="btn-pill btn-pill-primary" (click)="openGameCreateModal()">
                + Thêm Game mới
              </button>
            </div>

            <!-- Game Form Modal -->
            <div *ngIf="showGameModal" class="modal-backdrop-custom">
              <div class="modal-card-custom">
                <div class="modal-header-custom">
                  <h3>{{ editingGameId ? 'Chỉnh sửa Game #' + editingGameId : 'Thêm tựa Game mới' }}</h3>
                  <button class="btn-close-custom" (click)="showGameModal = false">✕</button>
                </div>
                <div class="modal-body-custom">
                  <div class="form-grid">
                    <div class="form-field full">
                      <label>Tên Game *</label>
                      <input type="text" [(ngModel)]="newGameName" placeholder="Ví dụ: Honkai: Star Rail" />
                    </div>
                    <div class="form-field full">
                      <label>Nhà phát hành *</label>
                      <input type="text" [(ngModel)]="newGamePublisher" placeholder="HoYoverse, Kuro Games,..." />
                    </div>
                    <div class="form-field full">
                      <label>Ảnh bìa (URL)</label>
                      <input type="text" [(ngModel)]="newGameCover" placeholder="https://..." />
                    </div>
                    <div class="form-field full">
                      <label>Mô tả ngắn</label>
                      <textarea [(ngModel)]="newGameDesc" rows="2"></textarea>
                    </div>
                    <div class="form-field">
                      <label>Trạng thái</label>
                      <select [(ngModel)]="newGameStatus">
                        <option value="ACTIVE">ACTIVE (Hiển thị)</option>
                        <option value="HIDDEN">HIDDEN (Ẩn)</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div class="modal-footer-custom">
                  <button type="button" class="btn-pill btn-pill-secondary btn-pill-sm" (click)="showGameModal = false">Hủy</button>
                  <button type="button" class="btn-pill btn-pill-primary btn-pill-sm" (click)="saveGame()">{{ editingGameId ? 'Cập nhật' : 'Thêm Game' }}</button>
                </div>
              </div>
            </div>

            <div class="data-table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Bìa</th>
                    <th>ID</th>
                    <th>Tên Game</th>
                    <th>Nhà phát hành</th>
                    <th>Slug URL</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let g of games">
                    <td><img [src]="g.coverUrl" class="cell-thumb-sq" /></td>
                    <td>{{ g.gameId }}</td>
                    <td><strong>{{ g.gameName }}</strong></td>
                    <td>{{ g.publisher }}</td>
                    <td><code>{{ g.slug }}</code></td>
                    <td>
                      <span class="badge-pill" [class.badge-stock]="g.gameStatus === 'ACTIVE'">{{ g.gameStatus }}</span>
                    </td>
                    <td>
                      <div class="user-actions">
                        <button type="button" class="action-btn edit" (click)="editGame(g)">Sửa</button>
                        <button type="button" class="action-btn" [class.warn]="g.gameStatus === 'ACTIVE'" (click)="toggleGameStatus(g)">
                          {{ g.gameStatus === 'ACTIVE' ? 'Ẩn' : 'Hiện' }}
                        </button>
                        <button type="button" class="action-btn delete" (click)="deleteGame(g.gameId)">Xóa</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- 4. CATEGORIES TAB -->
          <div *ngIf="activeTab === 'CATEGORIES'" class="view-categories">
            <div class="action-bar">
              <h3>Danh mục loại sản phẩm</h3>
              <button type="button" class="btn-pill btn-pill-primary" (click)="openCategoryCreateModal()">
                + Thêm danh mục mới
              </button>
            </div>

            <!-- Category Create / Edit Modal -->
            <div *ngIf="showCategoryModal" class="modal-backdrop-custom">
              <div class="modal-card-custom">
                <div class="modal-header-custom">
                  <h3>{{ editingCategoryId ? 'Chỉnh sửa danh mục #' + editingCategoryId : 'Thêm danh mục mới' }}</h3>
                  <button class="btn-close-custom" (click)="showCategoryModal = false">✕</button>
                </div>
                <div class="modal-body-custom">
                  <div class="form-grid">
                    <div class="form-field full">
                      <label>Tên danh mục *</label>
                      <input type="text" [(ngModel)]="catForm.name" placeholder="Ví dụ: Tài khoản trắng thông" />
                    </div>
                    <div class="form-field">
                      <label>Biểu tượng (Emoji)</label>
                      <input type="text" [(ngModel)]="catForm.icon" placeholder="🌟" maxlength="4" />
                    </div>
                    <div class="form-field">
                      <label>Slug URL</label>
                      <input type="text" [(ngModel)]="catForm.slug" placeholder="tai-khoan-trang-thong" />
                    </div>
                    <div class="form-field full">
                      <label>Mô tả</label>
                      <textarea [(ngModel)]="catForm.description" rows="2" placeholder="Mô tả ngắn về loại sản phẩm..."></textarea>
                    </div>
                    <div class="form-field">
                      <label>Trạng thái</label>
                      <select [(ngModel)]="catForm.status">
                        <option value="ACTIVE">ACTIVE (Hiển thị)</option>
                        <option value="HIDDEN">HIDDEN (Ẩn)</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div class="modal-footer-custom">
                  <button type="button" class="btn-pill btn-pill-secondary btn-pill-sm" (click)="showCategoryModal = false">Hủy</button>
                  <button type="button" class="btn-pill btn-pill-primary btn-pill-sm" (click)="saveCategory()">Lưu danh mục</button>
                </div>
              </div>
            </div>

            <div class="data-table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Biểu tượng</th>
                    <th>Tên danh mục</th>
                    <th>Slug</th>
                    <th>Mô tả</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let c of categories">
                    <td>{{ c.categoryId }}</td>
                    <td class="font-emoji">{{ c.icon }}</td>
                    <td><strong>{{ c.categoryName }}</strong></td>
                    <td><code>{{ c.slug }}</code></td>
                    <td>{{ c.description }}</td>
                    <td><span class="badge-pill" [class.badge-stock]="c.categoryStatus === 'ACTIVE'">{{ c.categoryStatus }}</span></td>
                    <td>
                      <div class="user-actions">
                        <button type="button" class="action-btn edit" (click)="editCategory(c)">Sửa</button>
                        <button type="button" class="action-btn delete" (click)="deleteCategory(c.categoryId)">Xóa</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- 5. ORDERS TAB -->
          <div *ngIf="activeTab === 'ORDERS'" class="view-orders">
            <div class="action-bar">
              <div class="search-filter-group">
                <input 
                  type="text" 
                  [(ngModel)]="orderFilterKeyword" 
                  placeholder="Tìm theo mã đơn, sản phẩm..." 
                  class="input-search" />
                <select [(ngModel)]="orderFilterStatus" class="select-filter">
                  <option value="ALL">-- Tất cả trạng thái --</option>
                  <option value="PAID">PAID (Đã thanh toán)</option>
                  <option value="COMPLETED">COMPLETED (Hoàn tất)</option>
                  <option value="CANCELLED">CANCELLED (Đã hủy)</option>
                  <option value="REFUNDED">REFUNDED (Đã hoàn tiền)</option>
                </select>
              </div>
            </div>

            <!-- Secrets Viewer Modal -->
            <div *ngIf="showSecretsModal && selectedOrderForSecrets" class="modal-backdrop-custom">
              <div class="modal-card-custom">
                <div class="modal-header-custom">
                  <h3>Thông tin tài khoản — Đơn #{{ selectedOrderForSecrets.orderCode }}</h3>
                  <button class="btn-close-custom" (click)="showSecretsModal = false">✕</button>
                </div>
                <div class="modal-body-custom">
                  <div *ngFor="let s of selectedOrderForSecrets.deliveredSecrets; let i = index" class="secret-item-card">
                    <div class="secret-header">
                      <strong>Tài khoản #{{ i + 1 }} · {{ s.accountType }}</strong>
                    </div>
                    <div class="secret-field-row">
                      <span class="lbl">Tài khoản:</span>
                      <code>{{ s.username }}</code>
                      <button type="button" class="btn-copy-mini" (click)="copyText(s.username)">Copy</button>
                    </div>
                    <div class="secret-field-row">
                      <span class="lbl">Mật khẩu:</span>
                      <code>{{ s.password }}</code>
                      <button type="button" class="btn-copy-mini" (click)="copyText(s.password)">Copy</button>
                    </div>
                    <div *ngIf="s.twoFactorOrEmail" class="secret-field-row">
                      <span class="lbl">2FA / Mail:</span>
                      <code>{{ s.twoFactorOrEmail }}</code>
                      <button type="button" class="btn-copy-mini" (click)="copyText(s.twoFactorOrEmail)">Copy</button>
                    </div>
                    <div *ngIf="s.note" class="secret-note-box">
                      💡 {{ s.note }}
                    </div>
                  </div>
                </div>
                <div class="modal-footer-custom">
                  <button type="button" class="btn-pill btn-pill-secondary btn-pill-sm" (click)="showSecretsModal = false">Đóng</button>
                </div>
              </div>
            </div>

            <div class="data-table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Mã đơn</th>
                    <th>Thời gian</th>
                    <th>Sản phẩm đặt</th>
                    <th>Tổng tiền</th>
                    <th>Cổng thanh toán</th>
                    <th>Trạng thái</th>
                    <th>Tài khoản bàn giao</th>
                    <th>Cập nhật trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let o of getFilteredOrders()">
                    <td><code>{{ o.orderCode }}</code></td>
                    <td>{{ o.createdAt | date:'HH:mm dd/MM/yyyy' }}</td>
                    <td>
                      <div *ngFor="let it of o.items">
                        • {{ it.product.productName }} (x{{ it.quantity }})
                      </div>
                    </td>
                    <td><strong class="text-blue">{{ o.totalAmount | number:'1.0-0' }}đ</strong></td>
                    <td><span class="tag-pay">{{ o.paymentMethod }}</span></td>
                    <td>
                      <span class="badge-pill" 
                        [class.badge-stock]="o.orderStatus === 'PAID' || o.orderStatus === 'COMPLETED'"
                        [class.badge-hot]="o.orderStatus === 'CANCELLED' || o.orderStatus === 'REFUNDED'">
                        {{ o.orderStatus }}
                      </span>
                    </td>
                    <td>
                      <button type="button" class="action-btn" (click)="viewOrderSecrets(o)">
                        🔑 Xem acc ({{ o.deliveredSecrets ? o.deliveredSecrets.length : 0 }})
                      </button>
                    </td>
                    <td>
                      <select [ngModel]="o.orderStatus" (ngModelChange)="changeOrderStatus(o, $event)" class="select-status-sm">
                        <option value="PAID">PAID</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELLED">CANCELLED</option>
                        <option value="REFUNDED">REFUNDED</option>
                      </select>
                    </td>
                  </tr>
                  <tr *ngIf="getFilteredOrders().length === 0">
                    <td colspan="8" class="empty-hint">Không có đơn hàng nào khớp với tìm kiếm.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- 6. USERS & ROLES TAB (FR-014) -->
          <div *ngIf="activeTab === 'USERS'" class="view-users">
            <div class="action-bar">
              <h3>Quản lý người dùng & Phân quyền tài khoản (FR-014)</h3>
            </div>
            <div class="data-table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Họ và tên</th>
                    <th>Email</th>
                    <th>Số điện thoại</th>
                    <th>Vai trò (Roles)</th>
                    <th>Trạng thái</th>
                    <th>Thao tác phân quyền</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let u of users">
                    <td>{{ u.userId }}</td>
                    <td><strong>{{ u.fullName }}</strong></td>
                    <td>{{ u.email }}</td>
                    <td>{{ u.phone || 'Chưa cung cấp' }}</td>
                    <td>
                      <span *ngFor="let r of u.roles" class="role-badge" [class.admin]="r === 'ADMIN'">
                        {{ r }}
                      </span>
                    </td>
                    <td>
                      <span class="badge-pill" [class.badge-stock]="u.userStatus === 'ACTIVE'" [class.badge-hot]="u.userStatus === 'LOCKED'">
                        {{ u.userStatus }}
                      </span>
                    </td>
                    <td>
                      <div class="user-actions">
                        <button 
                          type="button" 
                          class="action-btn"
                          (click)="toggleRole(u, 'ADMIN')">
                          {{ u.roles.includes('ADMIN') ? '- Bỏ ADMIN' : '+ Gán ADMIN' }}
                        </button>
                        <button 
                          type="button" 
                          class="action-btn"
                          (click)="toggleRole(u, 'STAFF')">
                          {{ u.roles.includes('STAFF') ? '- Bỏ STAFF' : '+ Gán STAFF' }}
                        </button>
                        <button 
                          type="button" 
                          class="action-btn" 
                          [class.delete]="u.userStatus === 'ACTIVE'"
                          (click)="toggleStatus(u)">
                          {{ u.userStatus === 'ACTIVE' ? 'Khóa TK' : 'Mở Khóa' }}
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- 7. STOCK REPORT TAB (vw_product_stock) -->
          <div *ngIf="activeTab === 'STOCK'" class="view-stock">
            <div class="action-bar">
              <h3>Báo cáo kiểm kê tồn kho số (Ánh xạ View vw_product_stock)</h3>
            </div>
            <div class="data-table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>Tên sản phẩm</th>
                    <th>Game</th>
                    <th>Tồn khả dụng (AVAILABLE)</th>
                    <th>Đã bán (SOLD)</th>
                    <th>Tổng nhập</th>
                    <th>Tình trạng cảnh báo</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let p of products">
                    <td><code>{{ p.sku }}</code></td>
                    <td><strong>{{ p.productName }}</strong></td>
                    <td>{{ p.game.gameName }}</td>
                    <td><strong class="text-blue">{{ p.stockCount }}</strong></td>
                    <td>{{ getSoldEstimate(p) }}</td>
                    <td>{{ p.stockCount + getSoldEstimate(p) }}</td>
                    <td>
                      <span class="badge-pill" [class.badge-stock]="p.stockCount > 5" [class.badge-hot]="p.stockCount <= 5">
                        {{ p.stockCount > 5 ? 'ĐỦ KHO' : 'SẮP HẾT' }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- 8. SETTINGS TAB -->
          <div *ngIf="activeTab === 'SETTINGS'" class="view-settings">
            <div class="settings-grid">

              <!-- Shop Info -->
              <div class="settings-card">
                <div class="settings-card-head">
                  <span class="settings-icon">🏪</span>
                  <h3>Thông tin cửa hàng</h3>
                </div>
                <div class="settings-body">
                  <div class="form-field">
                    <label>Tên cửa hàng</label>
                    <input type="text" [(ngModel)]="settings.shopName" />
                  </div>
                  <div class="form-field">
                    <label>Slogan</label>
                    <input type="text" [(ngModel)]="settings.shopSlogan" />
                  </div>
                  <div class="form-field">
                    <label>Link Fanpage / Hỗ trợ</label>
                    <input type="text" [(ngModel)]="settings.supportUrl" />
                  </div>
                  <div class="form-field">
                    <label>Email liên hệ</label>
                    <input type="email" [(ngModel)]="settings.contactEmail" />
                  </div>
                </div>
              </div>

              <!-- Payment Config -->
              <div class="settings-card">
                <div class="settings-card-head">
                  <span class="settings-icon">💳</span>
                  <h3>Cài đặt thanh toán</h3>
                </div>
                <div class="settings-body">
                  <div class="form-field">
                    <label>Số tài khoản ngân hàng (MB Bank)</label>
                    <input type="text" [(ngModel)]="settings.bankAccount" />
                  </div>
                  <div class="form-field">
                    <label>Chủ tài khoản</label>
                    <input type="text" [(ngModel)]="settings.bankOwner" />
                  </div>
                  <div class="form-field">
                    <label>Giới hạn số dư ví tối đa (VNĐ)</label>
                    <input type="number" [(ngModel)]="settings.maxWalletBalance" />
                  </div>
                </div>
              </div>

              <!-- Coupon Config -->
              <div class="settings-card">
                <div class="settings-card-head">
                  <span class="settings-icon">🎟️</span>
                  <h3>Mã khuyến mãi (Coupon)</h3>
                </div>
                <div class="settings-body">
                  <div class="coupon-list">
                    <div class="coupon-item">
                      <code>WIBUGEM</code>
                      <span>Giảm 10% tổng đơn hàng</span>
                      <span class="badge-pill badge-stock">ACTIVE</span>
                    </div>
                    <div class="coupon-item">
                      <code>GAMEHUB</code>
                      <span>Giảm 50.000đ cố định</span>
                      <span class="badge-pill badge-stock">ACTIVE</span>
                    </div>
                    <div class="coupon-item">
                      <code>NEWUSER</code>
                      <span>Giảm 20% cho tài khoản mới</span>
                      <span class="badge-pill" style="background:#f1f5f9; color:#64748b">INACTIVE</span>
                    </div>
                  </div>
                  <p class="settings-hint">💡 Chỉnh sửa coupon trực tiếp trong <code>cart.service.ts</code> khi kết nối backend thật.</p>
                </div>
              </div>

              <!-- System Status -->
              <div class="settings-card">
                <div class="settings-card-head">
                  <span class="settings-icon">🖥️</span>
                  <h3>Trạng thái hệ thống</h3>
                </div>
                <div class="settings-body">
                  <div class="sys-status-list">
                    <div class="sys-status-item">
                      <span class="status-dot online"></span>
                      <span>Angular Frontend (localhost:4200)</span>
                      <span class="status-label ok">ONLINE</span>
                    </div>
                    <div class="sys-status-item">
                      <span class="status-dot offline"></span>
                      <span>Spring Boot API (localhost:8088)</span>
                      <span class="status-label warn">OFFLINE (Dùng Mock)</span>
                    </div>
                    <div class="sys-status-item">
                      <span class="status-dot online"></span>
                      <span>localStorage DB</span>
                      <span class="status-label ok">OK</span>
                    </div>
                    <div class="sys-status-item">
                      <span class="status-dot online"></span>
                      <span>VietQR Payment Gateway</span>
                      <span class="status-label ok">READY</span>
                    </div>
                  </div>
                  <div class="sys-info">
                    <div>Phiên bản: <strong>GameHub v1.0.0</strong></div>
                    <div>Framework: <strong>Angular 18 (Standalone)</strong></div>
                    <div>Build mode: <strong>Development / Hot Reload</strong></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Save Settings Button -->
            <div class="settings-footer">
              <button type="button" class="btn-pill btn-pill-secondary btn-pill-sm" (click)="resetSettings()">
                Khôi phục mặc định
              </button>
              <button type="button" class="btn-pill btn-pill-primary" (click)="saveSettings()">
                💾 Lưu cài đặt
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  `,
  styles: [`
    .admin-wrapper {
      display: flex;
      min-height: 100vh;
      background: #f1f5f9;
      font-family: var(--wg-font);
      color: var(--wg-ink);
    }

    /* SIDEBAR */
    .admin-sidebar {
      width: 270px;
      background: #0f172a;
      color: #f8fafc;
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      border-right: 1px solid #1e293b;
    }
    .sidebar-brand {
      padding: 24px 20px 18px;
      border-bottom: 1px solid #1e293b;
    }
    .brand-text {
      font-family: var(--wg-font-display);
      font-size: 20px;
      font-weight: 800;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .wibu { color: var(--wg-cyan); }
    .gem { color: #38bdf8; }
    .admin-pill {
      font-size: 10px;
      background: #ea580c;
      color: #ffffff;
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: 700;
    }
    .brand-sub {
      font-size: 11px;
      color: #94a3b8;
      margin-top: 4px;
    }
    .admin-user-card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      background: #1e293b;
      border-bottom: 1px solid #334155;
    }
    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--wg-gradient-blue);
      color: #ffffff;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
    }
    .user-details .name {
      font-size: 13px;
      font-weight: 700;
      color: #ffffff;
    }
    .role-badge {
      font-size: 9px;
      font-weight: 700;
      background: #0369a1;
      color: #e0f2fe;
      padding: 2px 6px;
      border-radius: 4px;
      margin-right: 4px;
    }
    .role-badge.admin {
      background: #b91c1c;
      color: #fef2f2;
    }
    .sidebar-nav {
      flex: 1;
      padding: 16px 12px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      overflow-y: auto;
    }
    .nav-btn {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 14px;
      border: none;
      background: none;
      color: #94a3b8;
      font-size: 13.5px;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      text-align: left;
      transition: var(--wg-transition);
    }
    .nav-btn .icon {
      font-size: 16px;
    }
    .nav-btn:hover {
      background: #1e293b;
      color: #ffffff;
    }
    .nav-btn.active {
      background: var(--wg-blue);
      color: #ffffff;
    }
    .badge-count {
      margin-left: auto;
      background: rgba(255, 255, 255, 0.15);
      font-size: 11px;
      padding: 2px 6px;
      border-radius: 999px;
    }
    .sidebar-footer {
      padding: 16px;
      border-top: 1px solid #1e293b;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .btn-sidebar-action {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      border: 1px solid transparent;
      transition: var(--wg-transition);
    }
    .btn-sidebar-action.shop {
      background: #1e293b;
      color: #38bdf8;
      border-color: #334155;
    }
    .btn-sidebar-action.shop:hover {
      background: #334155;
      color: #ffffff;
    }
    .btn-sidebar-action.logout {
      background: transparent;
      color: #f87171;
    }
    .btn-sidebar-action.logout:hover {
      background: rgba(239, 68, 68, 0.15);
    }

    /* MAIN */
    .admin-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow-x: hidden;
    }
    .admin-topbar {
      height: 70px;
      background: #ffffff;
      border-bottom: 1px solid var(--wg-border);
      padding: 0 32px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .page-title {
      font-family: var(--wg-font-display);
      font-size: 20px;
      font-weight: 800;
      color: var(--wg-ink);
    }
    .breadcrumbs {
      font-size: 12px;
      color: var(--wg-ink-3);
    }
    .topbar-right {
      display: flex;
      gap: 12px;
    }
    .admin-content {
      padding: 32px;
      flex: 1;
    }

    /* STATS ROW */
    .stats-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-bottom: 28px;
    }
    .stat-box {
      background: #ffffff;
      border-radius: var(--wg-radius-md);
      padding: 22px 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      border: 1px solid var(--wg-border);
    }
    .stat-box .stat-icon {
      width: 52px;
      height: 52px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }
    .stat-box.primary .stat-icon { background: #e0f2fe; color: #0284c7; }
    .stat-box.success .stat-icon { background: #dcfce7; color: #16a34a; }
    .stat-box.warning .stat-icon { background: #ffedd5; color: #ea580c; }
    .stat-box.info .stat-icon { background: #f3e8ff; color: #9333ea; }
    .stat-value {
      font-size: 22px;
      font-weight: 800;
      color: var(--wg-ink);
      font-family: var(--wg-font-display);
    }
    .stat-title {
      font-size: 13px;
      color: var(--wg-ink-3);
      margin-top: 2px;
    }

    /* QUICK CARDS */
    .quick-cards-grid {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: 24px;
    }
    .dash-card {
      background: #ffffff;
      border: 1px solid var(--wg-border);
      border-radius: var(--wg-radius-md);
      padding: 20px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .card-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    .card-head h3 {
      font-size: 15px;
      font-weight: 700;
      color: var(--wg-ink);
    }
    .link-btn {
      background: none;
      border: none;
      color: var(--wg-blue);
      font-weight: 600;
      font-size: 12.5px;
      cursor: pointer;
    }
    .low-stock-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .low-stock-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 10px;
      background: #f8fafc;
      border-radius: 8px;
    }
    .low-stock-img {
      width: 44px;
      height: 32px;
      object-fit: cover;
      border-radius: 4px;
    }
    .low-stock-info {
      flex: 1;
      min-width: 0;
    }
    .low-stock-info .name {
      font-size: 12.5px;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .low-stock-info .game {
      font-size: 11px;
      color: var(--wg-ink-3);
    }
    .stock-alert-badge {
      background: #fee2e2;
      color: #dc2626;
      font-size: 11px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 999px;
    }

    /* ACTION BAR */
    .action-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .action-bar h3 {
      font-size: 17px;
      font-weight: 700;
    }
    .search-filter-group {
      display: flex;
      gap: 10px;
    }
    .input-search {
      width: 260px;
      height: 40px;
      padding: 0 14px;
      border: 1px solid var(--wg-border-input);
      border-radius: var(--wg-radius-pill);
      font-size: 13px;
    }
    .select-filter {
      height: 40px;
      padding: 0 14px;
      border: 1px solid var(--wg-border-input);
      border-radius: var(--wg-radius-pill);
      background: #ffffff;
      font-size: 13px;
      cursor: pointer;
    }

    /* DATA TABLES */
    .data-table-container {
      background: #ffffff;
      border-radius: var(--wg-radius-md);
      border: 1px solid var(--wg-border);
      overflow-x: auto;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }
    .data-table th {
      background: #f8fafc;
      padding: 12px 16px;
      text-align: left;
      font-weight: 600;
      color: var(--wg-ink-2);
      border-bottom: 1px solid var(--wg-border);
    }
    .data-table td {
      padding: 12px 16px;
      border-bottom: 1px solid var(--wg-border);
      color: var(--wg-ink);
    }
    .cell-thumb {
      width: 52px;
      height: 38px;
      object-fit: cover;
      border-radius: 4px;
    }
    .cell-thumb-sq {
      width: 40px;
      height: 40px;
      object-fit: cover;
      border-radius: 8px;
    }
    .cell-name strong {
      display: block;
      color: var(--wg-ink);
    }
    .cell-name small {
      color: var(--wg-ink-3);
    }
    .price-stack {
      display: flex;
      flex-direction: column;
    }
    .active-price {
      font-weight: 700;
      color: var(--wg-blue);
    }
    .old-price {
      font-size: 11px;
      color: var(--wg-ink-muted);
      text-decoration: line-through;
    }
    .stock-indicator {
      font-weight: 700;
      color: #16a34a;
    }
    .stock-indicator.low {
      color: #dc2626;
    }
    .tag-pay {
      background: var(--wg-chip-bg);
      font-size: 11px;
      padding: 2px 6px;
      border-radius: 4px;
    }
    .secret-box-mini {
      font-size: 11px;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .user-actions {
      display: flex;
      gap: 6px;
    }
    .action-btn {
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 11.5px;
      font-weight: 600;
      cursor: pointer;
      border: 1px solid #cbd5e1;
      background: #ffffff;
      color: var(--wg-ink-2);
    }
    .action-btn.edit {
      color: var(--wg-blue);
      border-color: var(--wg-blue-border);
      background: var(--wg-blue-soft);
    }
    .action-btn.delete {
      color: #dc2626;
      border-color: #fca5a5;
      background: #fee2e2;
    }
    .action-btn.warn {
      color: #ea580c;
      border-color: #fdba74;
      background: #fff7ed;
    }
    .select-status-sm {
      padding: 4px 8px;
      font-size: 11.5px;
      font-weight: 600;
      border: 1px solid var(--wg-border-input);
      border-radius: 4px;
      background: #ffffff;
      cursor: pointer;
    }
    .btn-copy-mini {
      padding: 2px 8px;
      font-size: 11px;
      font-weight: 600;
      border: 1px solid var(--wg-blue-border);
      border-radius: 4px;
      background: var(--wg-blue-soft);
      color: var(--wg-blue);
      cursor: pointer;
    }
    .btn-copy-mini:hover {
      background: var(--wg-blue);
      color: #ffffff;
    }
    .secret-item-card {
      background: #f8fafc;
      border: 1px solid var(--wg-border);
      border-radius: 8px;
      padding: 12px 14px;
      margin-bottom: 12px;
    }
    .secret-header {
      font-size: 13px;
      font-weight: 700;
      margin-bottom: 8px;
      color: var(--wg-ink);
    }
    .secret-field-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 6px;
      font-size: 12.5px;
    }
    .secret-field-row .lbl {
      width: 80px;
      color: var(--wg-ink-3);
      font-weight: 600;
    }
    .secret-field-row code {
      background: #ffffff;
      padding: 2px 8px;
      border-radius: 4px;
      border: 1px solid var(--wg-border);
      font-size: 12px;
      font-weight: 600;
      color: var(--wg-ink);
    }
    .secret-note-box {
      font-size: 11.5px;
      color: var(--wg-ink-3);
      background: #f1f5f9;
      padding: 6px 10px;
      border-radius: 4px;
      margin-top: 6px;
    }

    /* MINI CHART */
    .mini-chart {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 8px;
    }
    .chart-row {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .chart-label {
      width: 160px;
      font-size: 13px;
      font-weight: 600;
      color: var(--wg-ink-2);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .chart-bar-wrap {
      flex: 1;
      height: 24px;
      background: #f1f5f9;
      border-radius: 999px;
      display: flex;
      align-items: center;
      position: relative;
      overflow: hidden;
    }
    .chart-bar {
      height: 100%;
      background: linear-gradient(90deg, #38bdf8, #0284c7);
      border-radius: 999px;
      transition: width 0.5s ease;
    }
    .chart-val {
      position: absolute;
      right: 12px;
      font-size: 11.5px;
      font-weight: 700;
      color: var(--wg-ink-2);
    }

    /* MODAL STYLES */
    .modal-backdrop-custom {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(4px);
      z-index: 2500;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }
    .modal-card-custom {
      background: #ffffff;
      border-radius: 16px;
      width: 100%;
      max-width: 600px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.2);
      overflow: hidden;
    }
    .modal-header-custom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      background: #f8fafc;
      border-bottom: 1px solid var(--wg-border);
    }
    .modal-header-custom h3 {
      font-size: 16px;
      font-weight: 700;
    }
    .btn-close-custom {
      background: none;
      border: none;
      font-size: 16px;
      cursor: pointer;
    }
    .modal-body-custom {
      padding: 20px;
      max-height: 75vh;
      overflow-y: auto;
    }
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .form-field {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .form-field.full {
      grid-column: 1 / -1;
    }
    .form-field label {
      font-size: 12px;
      font-weight: 600;
      color: var(--wg-ink-2);
    }
    .form-field input, .form-field select, .form-field textarea {
      padding: 8px 10px;
      border: 1px solid var(--wg-border-input);
      border-radius: 6px;
      font-size: 13px;
    }
    .modal-footer-custom {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding: 14px 20px;
      background: #f8fafc;
      border-top: 1px solid var(--wg-border);
    }
    .font-emoji {
      font-size: 20px;
    }
    .text-blue {
      color: var(--wg-blue);
    }

    /* MOBILE SIDEBAR */
    .btn-hamburger {
      display: none;
      background: none;
      border: 1px solid var(--wg-border);
      border-radius: 6px;
      padding: 6px 10px;
      font-size: 18px;
      cursor: pointer;
      margin-right: 12px;
    }
    .sidebar-overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.5);
      z-index: 999;
    }

    /* EMPTY STATE */
    .empty-hint {
      color: var(--wg-ink-3);
      font-size: 13px;
      padding: 16px 0;
      text-align: center;
    }

    /* RESPONSIVE */
    @media (max-width: 1024px) {
      .stats-row {
        grid-template-columns: repeat(2, 1fr);
      }
      .quick-cards-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .admin-sidebar {
        position: fixed;
        top: 0;
        left: -270px;
        height: 100vh;
        z-index: 1000;
        transition: left 0.3s ease;
      }
      .admin-sidebar.sidebar-open {
        left: 0;
      }
      .sidebar-overlay {
        display: block;
      }
      .btn-hamburger {
        display: inline-flex;
      }
      .admin-topbar {
        padding: 0 16px;
      }
      .admin-content {
        padding: 16px;
      }
      .topbar-right .btn-pill {
        display: none;
      }
      .topbar-right .btn-pill:last-child {
        display: inline-flex;
      }
      .stats-row {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
      }
      .action-bar {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
      }
      .search-filter-group {
        flex-wrap: wrap;
        width: 100%;
      }
      .input-search {
        width: 100%;
      }
      .form-grid {
        grid-template-columns: 1fr;
      }
      .form-field.full {
        grid-column: auto;
      }
    }

    @media (max-width: 480px) {
      .stats-row {
        grid-template-columns: 1fr 1fr;
        gap: 10px;
      }
      .stat-box {
        padding: 14px 12px;
      }
      .stat-value {
        font-size: 17px;
      }
      .page-title {
        font-size: 16px;
      }
    }

    /* ─── SETTINGS TAB ─────────────────────────────────── */
    .settings-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
      margin-bottom: 8px;
    }
    .settings-card {
      background: #ffffff;
      border: 1px solid var(--wg-border);
      border-radius: var(--wg-radius-md);
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .settings-card-head {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px 18px;
      background: #f8fafc;
      border-bottom: 1px solid var(--wg-border);
    }
    .settings-card-head h3 {
      font-size: 15px;
      font-weight: 700;
      color: var(--wg-ink);
    }
    .settings-icon { font-size: 18px; }
    .settings-body {
      padding: 16px 18px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .settings-hint {
      font-size: 12px;
      color: var(--wg-ink-3);
      background: #f1f5f9;
      border-radius: 6px;
      padding: 8px 10px;
    }
    .coupon-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .coupon-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 10px;
      border: 1px dashed var(--wg-border);
      border-radius: 6px;
    }
    .coupon-item code {
      background: var(--wg-blue-soft);
      color: var(--wg-blue);
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 700;
    }
    .coupon-item > span:nth-child(2) {
      flex: 1;
      font-size: 12.5px;
      color: var(--wg-ink-2);
    }
    .sys-status-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .sys-status-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: var(--wg-ink-2);
    }
    .sys-status-item > span:nth-child(2) { flex: 1; }
    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .status-dot.online { background: #22c55e; }
    .status-dot.offline { background: #f59e0b; }
    .status-label {
      font-size: 11px;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
    }
    .status-label.ok { background: #dcfce7; color: #16a34a; }
    .status-label.warn { background: #fff7ed; color: #ea580c; }
    .sys-info {
      margin-top: 8px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 12.5px;
      color: var(--wg-ink-2);
      border-top: 1px solid var(--wg-border);
      padding-top: 10px;
    }
    .settings-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid var(--wg-border);
    }
    @media (max-width: 768px) {
      .settings-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class AdminComponent implements OnInit {
  activeTab: AdminTab = 'DASHBOARD';
  sidebarOpen = false; // Mobile sidebar toggle

  products: ProductResponse[] = [];
  games: GameResponse[] = [];
  categories: CategoryResponse[] = [];
  orders: Order[] = [];
  users: any[] = [];

  // Filter
  productFilterKeyword = '';
  filterGameId?: number;

  // Product Modal Form
  showProductModal = false;
  editingProductId: number | null = null;
  prodForm = {
    name: '',
    sku: '',
    type: 'ACCOUNT' as any,
    gameId: 1,
    categoryId: 1,
    price: 50000,
    salePrice: undefined as number | undefined,
    stock: 10,
    server: 'Asia',
    coverUrl: '',
    description: ''
  };

  // Game Modal Form
  showGameModal = false;
  editingGameId: number | null = null;
  newGameName = '';
  newGamePublisher = '';
  newGameCover = '';
  newGameDesc = '';
  newGameStatus: 'ACTIVE' | 'HIDDEN' = 'ACTIVE';

  // Order Filter & Secrets Modal
  orderFilterKeyword = '';
  orderFilterStatus = 'ALL';
  showSecretsModal = false;
  selectedOrderForSecrets: Order | null = null;

  // Category Modal Form
  showCategoryModal = false;
  editingCategoryId: number | null = null;
  catForm = {
    name: '',
    icon: '📦',
    slug: '',
    description: '',
    status: 'ACTIVE' as 'ACTIVE' | 'HIDDEN'
  };

  // Settings
  private readonly SETTINGS_KEY = 'wg_gamehub_admin_settings';
  settings = {
    shopName: 'WibuGem · GameHub',
    shopSlogan: 'Shop Reroll & Tài Khoản Game Uy Tín Số 1',
    supportUrl: 'https://m.me/wibugem',
    contactEmail: 'support@wibugem.com',
    bankAccount: '0564567765',
    bankOwner: 'NGUYEN VAN ADMIN',
    maxWalletBalance: 10000000
  };

  private defaultSettings() {
    return {
      shopName: 'WibuGem · GameHub',
      shopSlogan: 'Shop Reroll & Tài Khoản Game Uy Tín Số 1',
      supportUrl: 'https://m.me/wibugem',
      contactEmail: 'support@wibugem.com',
      bankAccount: '0564567765',
      bankOwner: 'NGUYEN VAN ADMIN',
      maxWalletBalance: 10000000
    };
  }

  private loadSettings() {
    try {
      const raw = localStorage.getItem('wg_gamehub_admin_settings');
      return raw ? { ...this.defaultSettings(), ...JSON.parse(raw) } : this.defaultSettings();
    } catch {
      return this.defaultSettings();
    }
  }

  saveSettings(): void {
    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(this.settings));
    this.toast.success('✅ Đã lưu cài đặt hệ thống!');
  }

  resetSettings(): void {
    this.settings = this.defaultSettings();
    localStorage.removeItem(this.SETTINGS_KEY);
    this.toast.info('Đã khôi phục cài đặt mặc định.');
  }

  constructor(
    public authService: AuthApiService,
    private productService: ProductApiService,
    private gameService: GameApiService,
    private catService: CategoryApiService,
    private orderService: OrderService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.refreshAllData();
    this.settings = this.loadSettings();
  }

  refreshAllData(): void {
    this.products = this.productService.getStoredProducts();
    this.gameService.getAllGames().subscribe(res => {
      this.games = res.data;
    });
    // Admin loads ALL categories (including INACTIVE)
    this.catService.getAllCategories().subscribe(res => {
      this.categories = res.data;
    });
    this.orderService.orders$.subscribe(ords => {
      this.orders = ords;
    });
    this.users = this.authService.getAllUsers();
  }

  getTabTitle(): string {
    switch (this.activeTab) {
      case 'DASHBOARD': return 'Tổng quan hệ thống';
      case 'PRODUCTS': return 'Quản lý kho sản phẩm';
      case 'GAMES': return 'Danh mục Game';
      case 'CATEGORIES': return 'Loại sản phẩm';
      case 'ORDERS': return 'Đơn hàng & Giao dịch';
      case 'USERS': return 'Người dùng & Phân quyền';
      case 'STOCK': return 'Kiểm kê tồn kho (vw_product_stock)';
      case 'SETTINGS': return 'Cài đặt hệ thống';
    }
  }

  calculateTotalRevenue(): number {
    return this.orders.reduce((sum, o) => sum + o.totalAmount, 0);
  }

  calculateTotalStock(): number {
    return this.products.reduce((sum, p) => sum + p.stockCount, 0);
  }

  getGameStock(gameId: number): number {
    return this.products
      .filter(p => p.game && p.game.gameId === gameId)
      .reduce((sum, p) => sum + p.stockCount, 0);
  }

  getGameStockPercent(gameId: number): number {
    const total = this.calculateTotalStock();
    if (total === 0) return 0;
    const stock = this.getGameStock(gameId);
    return Math.min(100, Math.round((stock / total) * 100));
  }

  getLowStockProducts(): ProductResponse[] {
    return this.products.filter(p => p.stockCount <= 5);
  }

  getFilteredOrders(): Order[] {
    let result = [...this.orders];
    if (this.orderFilterStatus !== 'ALL') {
      result = result.filter(o => o.orderStatus === this.orderFilterStatus);
    }
    if (this.orderFilterKeyword.trim()) {
      const kw = this.orderFilterKeyword.toLowerCase().trim();
      result = result.filter(o =>
        o.orderCode.toLowerCase().includes(kw) ||
        o.items.some(it => it.product.productName.toLowerCase().includes(kw)) ||
        (o.deliveredSecrets || []).some(s => s.username.toLowerCase().includes(kw))
      );
    }
    return result;
  }

  getFilteredProducts(): ProductResponse[] {
    let result = [...this.products];
    if (this.filterGameId) {
      result = result.filter(p => p.game && p.game.gameId === this.filterGameId);
    }
    if (this.productFilterKeyword.trim()) {
      const kw = this.productFilterKeyword.toLowerCase().trim();
      result = result.filter(p =>
        p.productName.toLowerCase().includes(kw) ||
        p.sku.toLowerCase().includes(kw) ||
        p.game.gameName.toLowerCase().includes(kw)
      );
    }
    return result;
  }

  openProductCreateModal(): void {
    this.editingProductId = null;
    this.prodForm = {
      name: '',
      sku: `ACC-${Date.now().toString().slice(-5)}`,
      type: 'ACCOUNT',
      gameId: this.games[0]?.gameId || 1,
      categoryId: this.categories[0]?.categoryId || 1,
      price: 50000,
      salePrice: undefined,
      stock: 10,
      server: 'Asia',
      coverUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
      description: ''
    };
    this.showProductModal = true;
  }

  editProduct(p: ProductResponse): void {
    this.editingProductId = p.productId;
    this.prodForm = {
      name: p.productName,
      sku: p.sku,
      type: p.productType,
      gameId: p.game.gameId,
      categoryId: p.category.categoryId,
      price: p.price,
      salePrice: p.salePrice,
      stock: p.stockCount,
      server: p.attributes?.server || 'Asia',
      coverUrl: p.coverUrl,
      description: p.description
    };
    this.showProductModal = true;
  }

  saveProduct(): void {
    if (!this.prodForm.name.trim() || !this.prodForm.sku.trim()) {
      this.toast.error('Vui lòng nhập tên và mã SKU.');
      return;
    }

    const game = this.games.find(g => g.gameId === this.prodForm.gameId) || this.games[0];
    const category = this.categories.find(c => c.categoryId === this.prodForm.categoryId) || this.categories[0];

    this.productService.saveProduct({
      productId: this.editingProductId ? this.editingProductId : undefined,
      productName: this.prodForm.name,
      sku: this.prodForm.sku,
      productType: this.prodForm.type,
      game,
      category,
      price: this.prodForm.price,
      salePrice: this.prodForm.salePrice || undefined,
      stockCount: this.prodForm.stock,
      coverUrl: this.prodForm.coverUrl,
      description: this.prodForm.description,
      attributes: {
        server: this.prodForm.server,
        instantDelivery: true
      }
    });

    this.toast.success('Đã lưu sản phẩm thành công!');
    this.showProductModal = false;
    this.refreshAllData();
  }

  deleteProduct(id: number): void {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi hệ thống?')) {
      this.productService.deleteProduct(id);
      this.toast.info('Đã xóa sản phẩm.');
      this.refreshAllData();
    }
  }

  // ─── GAME MANAGEMENT ───────────────────────────────────────────────────
  openGameCreateModal(): void {
    this.editingGameId = null;
    this.newGameName = '';
    this.newGamePublisher = '';
    this.newGameCover = '';
    this.newGameDesc = '';
    this.newGameStatus = 'ACTIVE';
    this.showGameModal = true;
  }

  editGame(g: GameResponse): void {
    this.editingGameId = g.gameId;
    this.newGameName = g.gameName;
    this.newGamePublisher = g.publisher;
    this.newGameCover = g.coverUrl;
    this.newGameDesc = g.description;
    this.newGameStatus = g.gameStatus;
    this.showGameModal = true;
  }

  deleteGame(gameId: number): void {
    if (confirm('Bạn có chắc chắn muốn xóa game này? Tất cả sản phẩm thuộc game có thể bị ảnh hưởng.')) {
      this.gameService.deleteGame(gameId);
      this.toast.info('Đã xóa game khỏi hệ thống.');
      this.refreshAllData();
    }
  }

  toggleGameStatus(g: GameResponse): void {
    const nextStatus = g.gameStatus === 'ACTIVE' ? 'HIDDEN' : 'ACTIVE';
    this.gameService.saveGame({ gameId: g.gameId, gameStatus: nextStatus });
    this.toast.info(`Đã đổi trạng thái game thành ${nextStatus}`);
    this.refreshAllData();
  }

  saveGame(): void {
    if (!this.newGameName.trim()) {
      this.toast.error('Vui lòng nhập tên game.');
      return;
    }
    this.gameService.saveGame({
      gameId: this.editingGameId ? this.editingGameId : undefined,
      gameName: this.newGameName,
      publisher: this.newGamePublisher || 'Developer',
      coverUrl: this.newGameCover || undefined,
      description: this.newGameDesc,
      gameStatus: this.newGameStatus
    });
    this.toast.success(this.editingGameId ? 'Đã cập nhật thông tin game!' : 'Đã thêm game mới!');
    this.showGameModal = false;
    this.editingGameId = null;
    this.newGameName = '';
    this.newGamePublisher = '';
    this.newGameCover = '';
    this.newGameDesc = '';
    this.refreshAllData();
  }

  // ─── ORDER MANAGEMENT ───────────────────────────────────────────────────
  viewOrderSecrets(o: Order): void {
    this.selectedOrderForSecrets = o;
    this.showSecretsModal = true;
  }

  changeOrderStatus(o: Order, newStatus: any): void {
    this.orderService.updateOrderStatus(o.orderId, newStatus);
    this.refreshAllData();
  }

  copyText(text: string): void {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      this.toast.success('Đã sao chép: ' + text);
    }).catch(() => {
      this.toast.info('Nội dung: ' + text);
    });
  }

  toggleRole(user: any, role: string): void {
    let roles: string[] = [...(user.roles || [])];
    if (roles.includes(role)) {
      if (roles.length <= 1) {
        this.toast.error('Người dùng phải có ít nhất một vai trò.');
        return;
      }
      roles = roles.filter(r => r !== role);
    } else {
      roles.push(role);
    }
    this.authService.updateUserRoles(user.userId, roles);
    this.toast.success(`Đã cập nhật vai trò cho ${user.fullName}`);
    this.refreshAllData();
  }

  toggleStatus(user: any): void {
    this.authService.toggleUserStatus(user.userId);
    this.toast.info(`Đã thay đổi trạng thái tài khoản ${user.fullName}`);
    this.refreshAllData();
  }

  getSoldEstimate(p: ProductResponse): number {
    return Math.floor((p.productId * 3) % 40) + 10;
  }

  getInitials(name: string): string {
    if (!name) return 'A';
    const parts = name.trim().split(/\s+/);
    return parts[parts.length - 1][0].toUpperCase();
  }

  goToShop(): void {
    this.router.navigate(['/']);
  }

  logout(): void {
    this.authService.logout();
    this.toast.info('Đã đăng xuất.');
    this.router.navigate(['/']);
  }

  // ─── CATEGORY CRUD ───────────────────────────────────────────────────────
  openCategoryCreateModal(): void {
    this.editingCategoryId = null;
    this.catForm = { name: '', icon: '📦', slug: '', description: '', status: 'ACTIVE' };
    this.showCategoryModal = true;
  }

  editCategory(c: CategoryResponse): void {
    this.editingCategoryId = c.categoryId;
    this.catForm = {
      name: c.categoryName,
      icon: c.icon || '📦',
      slug: c.slug || '',
      description: c.description || '',
      status: c.categoryStatus || 'ACTIVE'
    };
    this.showCategoryModal = true;
  }

  saveCategory(): void {
    if (!this.catForm.name.trim()) {
      this.toast.error('Vui lòng nhập tên danh mục.');
      return;
    }

    const slug = this.catForm.slug.trim() || this.catForm.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    // Load & mutate categories in localStorage
    const raw = localStorage.getItem('wg_gamehub_categories');
    let cats: CategoryResponse[] = raw ? JSON.parse(raw) : [...this.categories];

    if (this.editingCategoryId) {
      const idx = cats.findIndex(c => c.categoryId === this.editingCategoryId);
      if (idx !== -1) {
        cats[idx] = { ...cats[idx], categoryName: this.catForm.name, icon: this.catForm.icon, slug, description: this.catForm.description, categoryStatus: this.catForm.status };
      }
      this.toast.success('Đã cập nhật danh mục!');
    } else {
      const newId = Math.max(0, ...cats.map(c => c.categoryId)) + 1;
      cats.push({
        categoryId: newId,
        categoryName: this.catForm.name,
        icon: this.catForm.icon,
        slug,
        description: this.catForm.description,
        categoryStatus: this.catForm.status
      });
      this.toast.success('Đã thêm danh mục mới!');
    }

    localStorage.setItem('wg_gamehub_categories', JSON.stringify(cats));
    this.showCategoryModal = false;
    this.refreshAllData();
  }

  deleteCategory(id: number): void {
    if (confirm('Bạn có chắc chắn muốn xóa danh mục này? Sản phẩm thuộc danh mục sẽ không bị xóa.')) {
      const raw = localStorage.getItem('wg_gamehub_categories');
      let cats: CategoryResponse[] = raw ? JSON.parse(raw) : [...this.categories];
      cats = cats.filter(c => c.categoryId !== id);
      localStorage.setItem('wg_gamehub_categories', JSON.stringify(cats));
      this.toast.info('Đã xóa danh mục.');
      this.refreshAllData();
    }
  }
}

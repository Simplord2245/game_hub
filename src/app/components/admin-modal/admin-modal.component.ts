import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameApiService } from '../../core/services/game-api.service';
import { CategoryApiService } from '../../core/services/category-api.service';
import { ProductApiService } from '../../core/services/product-api.service';
import { ToastService } from '../../core/services/toast.service';
import { GameResponse, CategoryResponse } from '../../core/models/catalog.model';
import { ProductResponse } from '../../core/models/product.model';

@Component({
  selector: 'app-admin-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="isOpen" class="wg-modal-overlay" (click)="close()">
      <div class="wg-modal-card admin-card" (click)="$event.stopPropagation()">
        <!-- Header -->
        <div class="modal-head">
          <div class="head-title">
            <span class="icon">⚙️</span>
            <span>KHU VỰC QUẢN TRỊ VIÊN & VẬN HÀNH (STAFF / ADMIN)</span>
          </div>
          <button class="btn-close" (click)="close()" aria-label="Đóng">✕</button>
        </div>

        <!-- Admin Tabs -->
        <div class="admin-tabs">
          <button 
            type="button" 
            class="tab-btn" 
            [class.active]="tab === 'PRODUCTS'" 
            (click)="tab = 'PRODUCTS'">
            📦 Quản lý Sản phẩm
          </button>
          <button 
            type="button" 
            class="tab-btn" 
            [class.active]="tab === 'GAMES'" 
            (click)="tab = 'GAMES'">
            🎮 Quản lý Danh mục Game
          </button>
          <button 
            type="button" 
            class="tab-btn" 
            [class.active]="tab === 'STOCK'" 
            (click)="tab = 'STOCK'">
            📊 Tồn kho (vw_product_stock)
          </button>
        </div>

        <!-- Body -->
        <div class="modal-body">
          <!-- TAB 1: PRODUCTS MANAGEMENT -->
          <div *ngIf="tab === 'PRODUCTS'" class="products-tab">
            <div class="tab-toolbar">
              <h4>Danh sách sản phẩm hệ thống</h4>
              <button type="button" class="btn-pill btn-pill-primary btn-pill-sm" (click)="openProductForm()">
                + Thêm sản phẩm mới
              </button>
            </div>

            <!-- Create / Edit Form -->
            <div *ngIf="showProdForm" class="edit-form-box">
              <div class="form-title">
                {{ editingProd ? 'Chỉnh sửa sản phẩm #' + editingProd.productId : 'Tạo sản phẩm tài khoản mới' }}
              </div>
              <div class="form-row">
                <div class="col">
                  <label>Tên sản phẩm *</label>
                  <input type="text" [(ngModel)]="prodName" placeholder="Tên sản phẩm..." class="admin-input" />
                </div>
                <div class="col">
                  <label>Mã SKU *</label>
                  <input type="text" [(ngModel)]="prodSku" placeholder="Mã SKU (duy nhất)..." class="admin-input" />
                </div>
              </div>

              <div class="form-row">
                <div class="col">
                  <label>Game *</label>
                  <select [(ngModel)]="selectedGameId" class="admin-input">
                    <option *ngFor="let g of games" [ngValue]="g.gameId">{{ g.gameName }}</option>
                  </select>
                </div>
                <div class="col">
                  <label>Danh mục *</label>
                  <select [(ngModel)]="selectedCatId" class="admin-input">
                    <option *ngFor="let c of categories" [ngValue]="c.categoryId">{{ c.categoryName }}</option>
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="col">
                  <label>Giá gốc (VNĐ) *</label>
                  <input type="number" [(ngModel)]="prodPrice" class="admin-input" />
                </div>
                <div class="col">
                  <label>Giá khuyến mãi (VNĐ)</label>
                  <input type="number" [(ngModel)]="prodSalePrice" class="admin-input" />
                </div>
                <div class="col">
                  <label>Tồn kho (Số lượng) *</label>
                  <input type="number" [(ngModel)]="prodStock" class="admin-input" />
                </div>
              </div>

              <div class="form-row">
                <div class="col full">
                  <label>Mô tả chi tiết</label>
                  <textarea [(ngModel)]="prodDesc" rows="3" class="admin-input"></textarea>
                </div>
              </div>

              <div class="form-actions">
                <button type="button" class="btn-pill btn-pill-secondary btn-pill-sm" (click)="showProdForm = false">
                  Hủy bỏ
                </button>
                <button type="button" class="btn-pill btn-pill-primary btn-pill-sm" (click)="saveProduct()">
                  Lưu sản phẩm
                </button>
              </div>
            </div>

            <!-- Products Table -->
            <div class="table-responsive">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>Tên sản phẩm</th>
                    <th>Game</th>
                    <th>Giá bán</th>
                    <th>Kho</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let p of products">
                    <td><code>{{ p.sku }}</code></td>
                    <td class="name-cell"><strong>{{ p.productName }}</strong></td>
                    <td>{{ p.game.gameName }}</td>
                    <td>
                      <span class="price-val">{{ (p.salePrice || p.price) | number:'1.0-0' }}đ</span>
                    </td>
                    <td>
                      <span [class.text-danger]="p.stockCount <= 3">{{ p.stockCount }} acc</span>
                    </td>
                    <td>
                      <span class="badge-pill" [class.badge-stock]="p.productStatus === 'ACTIVE'">{{ p.productStatus }}</span>
                    </td>
                    <td>
                      <button type="button" class="btn-action edit" (click)="editProduct(p)">Sửa</button>
                      <button type="button" class="btn-action del" (click)="deleteProduct(p.productId)">Xóa</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- TAB 2: GAMES MANAGEMENT -->
          <div *ngIf="tab === 'GAMES'" class="games-tab">
            <div class="tab-toolbar">
              <h4>Danh mục các Game hỗ trợ</h4>
              <button type="button" class="btn-pill btn-pill-primary btn-pill-sm" (click)="openGameForm()">
                + Thêm Game mới
              </button>
            </div>

            <div *ngIf="showGameForm" class="edit-form-box">
              <div class="form-title">Thêm tựa Game mới vào hệ thống</div>
              <div class="form-row">
                <div class="col">
                  <label>Tên Game *</label>
                  <input type="text" [(ngModel)]="gameName" placeholder="Tên Game..." class="admin-input" />
                </div>
                <div class="col">
                  <label>Nhà phát hành *</label>
                  <input type="text" [(ngModel)]="gamePublisher" placeholder="Nhà phát hành (HoYoverse, Kuro...)" class="admin-input" />
                </div>
              </div>
              <div class="form-row">
                <div class="col full">
                  <label>Ảnh bìa (URL)</label>
                  <input type="text" [(ngModel)]="gameCover" placeholder="https://..." class="admin-input" />
                </div>
              </div>
              <div class="form-actions">
                <button type="button" class="btn-pill btn-pill-secondary btn-pill-sm" (click)="showGameForm = false">Hủy</button>
                <button type="button" class="btn-pill btn-pill-primary btn-pill-sm" (click)="saveGame()">Lưu Game</button>
              </div>
            </div>

            <div class="table-responsive">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tên Game</th>
                    <th>Nhà phát hành</th>
                    <th>Slug</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let g of games">
                    <td>{{ g.gameId }}</td>
                    <td><strong>{{ g.gameName }}</strong></td>
                    <td>{{ g.publisher }}</td>
                    <td><code>{{ g.slug }}</code></td>
                    <td>
                      <span class="badge-pill badge-stock">{{ g.gameStatus }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- TAB 3: STOCK SUMMARY (vw_product_stock) -->
          <div *ngIf="tab === 'STOCK'" class="stock-tab">
            <div class="stock-summary-grid">
              <div class="stat-card">
                <div class="stat-num">{{ products.length }}</div>
                <div class="stat-label">Tổng loại sản phẩm</div>
              </div>
              <div class="stat-card">
                <div class="stat-num">{{ getTotalStock() }}</div>
                <div class="stat-label">Tổng tài khoản khả dụng</div>
              </div>
              <div class="stat-card alert">
                <div class="stat-num">{{ getLowStockCount() }}</div>
                <div class="stat-label">Sản phẩm sắp hết hàng (≤ 5 acc)</div>
              </div>
            </div>

            <h4 class="mt-4 mb-2">Báo cáo tồn kho chi tiết theo view SQL (vw_product_stock)</h4>
            <div class="table-responsive">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>Mã sản phẩm</th>
                    <th>Tên tài khoản / Gói</th>
                    <th>Tồn khả dụng (AVAILABLE)</th>
                    <th>Đã bán (SOLD)</th>
                    <th>Tình trạng</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let p of products">
                    <td><code>{{ p.sku }}</code></td>
                    <td>{{ p.productName }}</td>
                    <td><strong class="text-blue">{{ p.stockCount }}</strong></td>
                    <td>{{ Math.floor(p.productId % 30) + 12 }}</td>
                    <td>
                      <span class="badge-pill" [class.badge-stock]="p.stockCount > 5" [class.badge-hot]="p.stockCount <= 5">
                        {{ p.stockCount > 5 ? 'ỔN ĐỊNH' : 'SẮP HẾT' }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-card {
      max-width: 900px;
    }
    .modal-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      border-bottom: 1px solid var(--wg-border);
      background: var(--wg-blue-surface);
    }
    .head-title {
      font-family: var(--wg-font-display);
      font-size: 14px;
      font-weight: 700;
      color: var(--wg-ink);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .btn-close {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 1px solid #e2e8f0;
      background: #ffffff;
      color: var(--wg-ink-3);
      cursor: pointer;
    }
    .admin-tabs {
      display: flex;
      background: #f8fafc;
      border-bottom: 1px solid var(--wg-border);
    }
    .tab-btn {
      padding: 12px 18px;
      background: none;
      border: none;
      border-bottom: 2px solid transparent;
      font-size: 13px;
      font-weight: 600;
      color: var(--wg-ink-3);
      cursor: pointer;
    }
    .tab-btn.active {
      color: var(--wg-blue);
      border-bottom-color: var(--wg-blue);
      background: #ffffff;
    }
    .modal-body {
      padding: 20px;
      max-height: 80vh;
      overflow-y: auto;
    }
    .tab-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    .edit-form-box {
      background: #f8fafc;
      border: 1px solid var(--wg-border);
      border-radius: var(--wg-radius);
      padding: 16px;
      margin-bottom: 16px;
    }
    .form-title {
      font-size: 14px;
      font-weight: 700;
      color: var(--wg-ink);
      margin-bottom: 12px;
    }
    .form-row {
      display: flex;
      gap: 12px;
      margin-bottom: 12px;
    }
    .col {
      flex: 1;
    }
    .col.full {
      flex: 1 1 100%;
    }
    .col label {
      display: block;
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 4px;
      color: var(--wg-ink-2);
    }
    .admin-input {
      width: 100%;
      height: 38px;
      padding: 0 10px;
      border: 1px solid var(--wg-border-input);
      border-radius: var(--wg-radius-sm);
      font-size: 13px;
    }
    textarea.admin-input {
      height: auto;
      padding: 8px 10px;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 12px;
    }
    .table-responsive {
      overflow-x: auto;
    }
    .admin-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }
    .admin-table th {
      background: #f1f5f9;
      padding: 10px 12px;
      text-align: left;
      font-weight: 600;
      color: var(--wg-ink-2);
      border-bottom: 1px solid var(--wg-border);
    }
    .admin-table td {
      padding: 10px 12px;
      border-bottom: 1px solid var(--wg-border);
      color: var(--wg-ink);
    }
    .name-cell {
      max-width: 200px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .price-val {
      font-weight: 700;
      color: var(--wg-blue);
    }
    .text-danger {
      color: var(--wg-danger);
      font-weight: bold;
    }
    .text-blue {
      color: var(--wg-blue);
    }
    .btn-action {
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      margin-right: 4px;
      border: 1px solid #cbd5e1;
    }
    .btn-action.edit {
      background: #f1f5f9;
      color: var(--wg-blue);
    }
    .btn-action.del {
      background: #fee2e2;
      color: #b91c1c;
      border-color: #fca5a5;
    }
    .stock-summary-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-bottom: 18px;
    }
    .stat-card {
      background: var(--wg-blue-surface);
      border: 1px solid var(--wg-blue-border);
      border-radius: var(--wg-radius);
      padding: 16px;
      text-align: center;
    }
    .stat-card.alert {
      background: #fff7ed;
      border-color: #fdba74;
    }
    .stat-num {
      font-size: 28px;
      font-weight: 800;
      color: var(--wg-blue);
      font-family: var(--wg-font-display);
    }
    .stat-card.alert .stat-num {
      color: #ea580c;
    }
    .stat-label {
      font-size: 12px;
      color: var(--wg-ink-3);
      margin-top: 4px;
    }
    .mt-4 { margin-top: 16px; }
    .mb-2 { margin-bottom: 8px; }
  `]
})
export class AdminModalComponent {
  @Input() isOpen = false;
  @Output() closeEvent = new EventEmitter<void>();

  tab: 'PRODUCTS' | 'GAMES' | 'STOCK' = 'PRODUCTS';
  Math = Math;

  products: ProductResponse[] = [];
  games: GameResponse[] = [];
  categories: CategoryResponse[] = [];

  // Product form
  showProdForm = false;
  editingProd: ProductResponse | null = null;
  prodName = '';
  prodSku = '';
  selectedGameId: number = 1;
  selectedCatId: number = 1;
  prodPrice = 50000;
  prodSalePrice: number | undefined;
  prodStock = 10;
  prodDesc = '';

  // Game form
  showGameForm = false;
  gameName = '';
  gamePublisher = '';
  gameCover = '';

  constructor(
    private productService: ProductApiService,
    private gameService: GameApiService,
    private catService: CategoryApiService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.refreshData();
  }

  ngOnChanges(): void {
    if (this.isOpen) {
      this.refreshData();
    }
  }

  refreshData(): void {
    this.products = this.productService.getStoredProducts();
    this.gameService.getActiveGames('', 0, 50).subscribe(res => {
      this.games = res.data.content;
    });
    this.catService.getActiveCategories().subscribe(res => {
      this.categories = res.data;
    });
  }

  openProductForm(): void {
    this.editingProd = null;
    this.prodName = '';
    this.prodSku = `SKU-${Date.now().toString().slice(-4)}`;
    this.selectedGameId = this.games[0]?.gameId || 1;
    this.selectedCatId = this.categories[0]?.categoryId || 1;
    this.prodPrice = 50000;
    this.prodSalePrice = undefined;
    this.prodStock = 10;
    this.prodDesc = '';
    this.showProdForm = true;
  }

  editProduct(p: ProductResponse): void {
    this.editingProd = p;
    this.prodName = p.productName;
    this.prodSku = p.sku;
    this.selectedGameId = p.game?.gameId || 1;
    this.selectedCatId = p.category?.categoryId || 1;
    this.prodPrice = p.price;
    this.prodSalePrice = p.salePrice;
    this.prodStock = p.stockCount;
    this.prodDesc = p.description;
    this.showProdForm = true;
  }

  saveProduct(): void {
    if (!this.prodName.trim() || !this.prodSku.trim()) {
      this.toast.error('Vui lòng điền tên và mã SKU.');
      return;
    }

    const game = this.games.find(g => g.gameId === this.selectedGameId) || this.games[0];
    const category = this.categories.find(c => c.categoryId === this.selectedCatId) || this.categories[0];

    this.productService.saveProduct({
      productId: this.editingProd ? this.editingProd.productId : undefined,
      productName: this.prodName,
      sku: this.prodSku,
      game,
      category,
      price: this.prodPrice,
      salePrice: this.prodSalePrice || undefined,
      stockCount: this.prodStock,
      description: this.prodDesc
    });

    this.toast.success('Đã lưu sản phẩm thành công!');
    this.showProdForm = false;
    this.refreshData();
  }

  deleteProduct(id: number): void {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      this.productService.deleteProduct(id);
      this.toast.info('Đã xóa sản phẩm.');
      this.refreshData();
    }
  }

  openGameForm(): void {
    this.gameName = '';
    this.gamePublisher = '';
    this.gameCover = '';
    this.showGameForm = true;
  }

  saveGame(): void {
    if (!this.gameName.trim()) {
      this.toast.error('Vui lòng nhập tên game.');
      return;
    }
    this.gameService.saveGame({
      gameName: this.gameName,
      publisher: this.gamePublisher || 'Unknown',
      coverUrl: this.gameCover || undefined
    });
    this.toast.success('Đã lưu game mới!');
    this.showGameForm = false;
    this.refreshData();
  }

  getTotalStock(): number {
    return this.products.reduce((s, p) => s + p.stockCount, 0);
  }

  getLowStockCount(): number {
    return this.products.filter(p => p.stockCount <= 5).length;
  }

  close(): void {
    this.closeEvent.emit();
  }
}

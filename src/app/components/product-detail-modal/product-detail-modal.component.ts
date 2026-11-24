import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductResponse } from '../../core/models/product.model';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-product-detail-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isOpen && product" class="wg-modal-overlay" (click)="close()">
      <div class="wg-modal-card detail-card" (click)="$event.stopPropagation()">
        <!-- Close Button -->
        <button class="btn-close" (click)="close()" aria-label="Đóng">✕</button>

        <div class="detail-grid">
          <!-- Left: Image Gallery -->
          <div class="gallery-col">
            <div class="main-img-box">
              <img [src]="activeImage || product.coverUrl" [alt]="product.productName" class="main-img" />
              <span class="badge-pill badge-hot auto-badge">⚡ Giao Tự Động 24/7</span>
            </div>
            <div *ngIf="product.images && product.images.length > 1" class="thumb-row">
              <img 
                *ngFor="let img of product.images" 
                [src]="img" 
                class="thumb-item" 
                [class.active]="activeImage === img"
                (click)="activeImage = img" />
            </div>
          </div>

          <!-- Right: Details & Purchase -->
          <div class="info-col">
            <div class="game-meta">
              <span class="badge-pill badge-server">{{ product.game.gameName }}</span>
              <span class="badge-pill badge-new">{{ product.category.categoryName }}</span>
              <span class="badge-pill badge-stock">Còn {{ product.stockCount }} tài khoản</span>
            </div>

            <h2 class="prod-title">{{ product.productName }}</h2>
            <div class="sku-text">Mã SKU: <strong>{{ product.sku }}</strong></div>

            <!-- Price Box -->
            <div class="price-box">
              <div class="current-price">
                {{ (product.salePrice || product.price) | number:'1.0-0' }}đ
              </div>
              <div *ngIf="product.salePrice" class="old-price">
                {{ product.price | number:'1.0-0' }}đ
              </div>
              <span *ngIf="product.salePrice" class="discount-badge">
                -{{ getDiscountPercent(product.price, product.salePrice) }}%
              </span>
            </div>

            <!-- Specifications Table -->
            <div class="spec-table">
              <div class="spec-row" *ngIf="product.attributes?.server">
                <span class="spec-key">Khu vực / Máy chủ:</span>
                <span class="spec-val"><strong>{{ product.attributes?.server }}</strong></span>
              </div>
              <div class="spec-row" *ngIf="product.attributes?.arLevel">
                <span class="spec-key">Cấp độ (AR/Union):</span>
                <span class="spec-val">Cấp {{ product.attributes?.arLevel }}</span>
              </div>
              <div class="spec-row" *ngIf="product.attributes?.rerollGems">
                <span class="spec-key">Lượng ngọc / Vé quay:</span>
                <span class="spec-val highlight">{{ product.attributes?.rerollGems }}</span>
              </div>
              <div class="spec-row" *ngIf="product.attributes?.platform">
                <span class="spec-key">Nền tảng hỗ trợ:</span>
                <span class="spec-val">{{ product.attributes?.platform }}</span>
              </div>
              <div class="spec-row" *ngIf="product.attributes?.loginMethod">
                <span class="spec-key">Loại tài khoản:</span>
                <span class="spec-val">{{ product.attributes?.loginMethod }}</span>
              </div>
              <div class="spec-row" *ngIf="product.attributes?.guarantee">
                <span class="spec-key">Bảo hành:</span>
                <span class="spec-val text-success">🛡️ {{ product.attributes?.guarantee }}</span>
              </div>
            </div>

            <!-- Characters List if any -->
            <div *ngIf="product.attributes?.characters?.length" class="char-box">
              <div class="char-title">Nhân vật 5 sao sở hữu:</div>
              <div class="char-chips">
                <span *ngFor="let c of product.attributes?.characters" class="char-chip">
                  ⭐ {{ c }}
                </span>
              </div>
            </div>

            <!-- Description -->
            <div class="desc-box">
              <p>{{ product.description }}</p>
            </div>

            <!-- Actions -->
            <div class="actions-row">
              <button 
                type="button" 
                class="btn-pill btn-pill-outline btn-cart"
                (click)="addToCart()">
                🛒 Thêm vào giỏ hàng
              </button>
              <button 
                type="button" 
                class="btn-pill btn-pill-primary btn-buy"
                (click)="buyNow()">
                ⚡ Mua ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .detail-card {
      max-width: 820px;
      position: relative;
      padding: 0;
      overflow: hidden;
    }
    .btn-close {
      position: absolute;
      top: 14px;
      right: 14px;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 1px solid #e2e8f0;
      background: #ffffff;
      color: var(--wg-ink-3);
      cursor: pointer;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
    }
    .detail-grid {
      display: grid;
      grid-template-columns: 1fr;
    }
    @media (min-width: 768px) {
      .detail-grid {
        grid-template-columns: 360px 1fr;
      }
    }
    .gallery-col {
      padding: 24px;
      background: #fafcff;
      border-right: 1px solid var(--wg-border);
    }
    .main-img-box {
      position: relative;
      border-radius: var(--wg-radius);
      overflow: hidden;
      aspect-ratio: 16/10;
      background: #e2e8f0;
      margin-bottom: 12px;
    }
    .main-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .auto-badge {
      position: absolute;
      top: 10px;
      left: 10px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }
    .thumb-row {
      display: flex;
      gap: 8px;
    }
    .thumb-item {
      width: 60px;
      height: 44px;
      object-fit: cover;
      border-radius: var(--wg-radius-sm);
      border: 2px solid transparent;
      cursor: pointer;
    }
    .thumb-item.active {
      border-color: var(--wg-blue);
    }
    .info-col {
      padding: 24px;
      display: flex;
      flex-direction: column;
    }
    .game-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 12px;
    }
    .prod-title {
      font-family: var(--wg-font-display);
      font-size: 18px;
      font-weight: 700;
      color: var(--wg-ink);
      line-height: 1.4;
      margin-bottom: 6px;
    }
    .sku-text {
      font-size: 12px;
      color: var(--wg-ink-3);
      margin-bottom: 14px;
    }
    .price-box {
      display: flex;
      align-items: baseline;
      gap: 10px;
      background: var(--wg-blue-surface);
      padding: 12px 16px;
      border-radius: var(--wg-radius);
      margin-bottom: 16px;
    }
    .current-price {
      font-size: 24px;
      font-weight: 800;
      color: var(--wg-blue);
      font-family: var(--wg-font-display);
    }
    .old-price {
      font-size: 14px;
      color: var(--wg-ink-muted);
      text-decoration: line-through;
    }
    .discount-badge {
      background: var(--wg-danger);
      color: #ffffff;
      font-size: 11px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: var(--wg-radius-pill);
    }
    .spec-table {
      background: #f8fafc;
      border-radius: var(--wg-radius-sm);
      padding: 12px 14px;
      margin-bottom: 14px;
      font-size: 12.5px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .spec-row {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px dashed #eef1f6;
      padding-bottom: 6px;
    }
    .spec-row:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
    .spec-key {
      color: var(--wg-ink-3);
    }
    .spec-val.highlight {
      color: var(--wg-blue);
      font-weight: 600;
    }
    .text-success {
      color: var(--wg-success);
      font-weight: 600;
    }
    .char-box {
      margin-bottom: 14px;
    }
    .char-title {
      font-size: 12px;
      font-weight: 600;
      color: var(--wg-ink);
      margin-bottom: 6px;
    }
    .char-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .char-chip {
      background: var(--wg-accent-orange-soft);
      color: #b45309;
      font-size: 11px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 4px;
    }
    .desc-box {
      font-size: 13px;
      color: var(--wg-ink-2);
      line-height: 1.5;
      margin-bottom: 20px;
    }
    .actions-row {
      display: flex;
      gap: 10px;
      margin-top: auto;
    }
    .btn-cart {
      flex: 1;
    }
    .btn-buy {
      flex: 1.2;
    }
  `]
})
export class ProductDetailModalComponent {
  @Input() isOpen = false;
  @Input() product: ProductResponse | null = null;
  @Output() closeEvent = new EventEmitter<void>();
  @Output() buyNowEvent = new EventEmitter<ProductResponse>();

  activeImage = '';

  constructor(private cartService: CartService) {}

  ngOnChanges(): void {
    if (this.product) {
      this.activeImage = this.product.coverUrl;
    }
  }

  getDiscountPercent(price: number, salePrice?: number): number {
    if (!salePrice || salePrice >= price) return 0;
    return Math.round(((price - salePrice) / price) * 100);
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addToCart(this.product, 1);
      this.close();
    }
  }

  buyNow(): void {
    if (this.product) {
      this.cartService.addToCart(this.product, 1);
      this.close();
      this.buyNowEvent.emit(this.product);
    }
  }

  close(): void {
    this.closeEvent.emit();
  }
}

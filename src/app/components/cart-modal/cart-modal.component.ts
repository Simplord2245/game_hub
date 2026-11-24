import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { AuthApiService } from '../../core/services/auth-api.service';
import { OrderService } from '../../core/services/order.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-cart-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="isOpen" class="wg-modal-overlay" (click)="close()">
      <div class="cart-drawer" (click)="$event.stopPropagation()">
        <!-- Header -->
        <div class="cart-head">
          <div class="head-title">
            <span class="icon">🛒</span>
            <span>GIỎ HÀNG CỦA BẠN</span>
            <span class="badge-count">{{ cartService.getItemCount() }}</span>
          </div>
          <button class="btn-close" (click)="close()" aria-label="Đóng">✕</button>
        </div>

        <!-- Body -->
        <div class="cart-body">
          <!-- EMPTY STATE -->
          <div *ngIf="(cartService.items$ | async)?.length === 0" class="empty-state">
            <div class="empty-illustration">🛍️</div>
            <h3>Giỏ hàng đang trống</h3>
            <p>Bạn chưa thêm sản phẩm nào vào giỏ. Hãy chọn tài khoản yêu thích nhé!</p>
            <button class="btn-pill btn-pill-primary" (click)="close()">
              Khám phá sản phẩm ngay
            </button>
          </div>

          <!-- CART ITEMS LIST -->
          <div *ngIf="((cartService.items$ | async) || []).length > 0" class="items-list">
            <div *ngFor="let item of (cartService.items$ | async)" class="cart-item">
              <img [src]="item.product.coverUrl" [alt]="item.product.productName" class="item-thumb" />
              <div class="item-info">
                <div class="item-name">{{ item.product.productName }}</div>
                <div class="item-meta">
                  <span class="meta-tag">{{ item.product.game.gameName }}</span>
                  <span class="meta-tag">{{ item.product.attributes?.server || 'Asia' }}</span>
                </div>
                <div class="item-price">
                  {{ (item.product.salePrice || item.product.price) | number:'1.0-0' }}đ
                  <span *ngIf="item.product.salePrice" class="old-price">
                    {{ item.product.price | number:'1.0-0' }}đ
                  </span>
                </div>
              </div>

              <!-- Quantity Controls & Remove -->
              <div class="item-actions">
                <div class="qty-stepper">
                  <button type="button" class="btn-qty" (click)="cartService.updateQuantity(item.product.productId, item.quantity - 1)">-</button>
                  <span class="qty-num">{{ item.quantity }}</span>
                  <button type="button" class="btn-qty" (click)="cartService.updateQuantity(item.product.productId, item.quantity + 1)">+</button>
                </div>
                <button type="button" class="btn-del" (click)="cartService.removeItem(item.product.productId)" title="Xóa">
                  🗑️
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer / Checkout Area -->
        <div *ngIf="((cartService.items$ | async) || []).length > 0" class="cart-foot">
          <!-- Coupon Box -->
          <div class="coupon-box">
            <input 
              type="text" 
              [(ngModel)]="couponInput" 
              placeholder="Nhập mã giảm giá (VD: WIBUGEM)"
              class="coupon-input" />
            <button type="button" class="btn-coupon" (click)="applyCoupon()">
              Áp dụng
            </button>
          </div>

          <!-- Price Summary -->
          <div class="summary-rows">
            <div class="summary-row">
              <span>Tạm tính</span>
              <span>{{ cartService.getSubtotal() | number:'1.0-0' }}đ</span>
            </div>
            <div *ngIf="cartService.getDiscountAmount() > 0" class="summary-row discount">
              <span>Giảm giá khuyến mãi</span>
              <span>-{{ cartService.getDiscountAmount() | number:'1.0-0' }}đ</span>
            </div>
            <div class="summary-row total">
              <span>Tổng thanh toán</span>
              <span class="total-price">{{ cartService.getTotalAmount() | number:'1.0-0' }}đ</span>
            </div>
          </div>

          <!-- Payment Method Choice -->
          <div class="payment-methods">
            <div class="pay-title">Hình thức thanh toán:</div>
            <div class="pay-grid">
              <label class="pay-option" [class.selected]="selectedPayment === 'WALLET'">
                <input type="radio" name="pay" [(ngModel)]="selectedPayment" value="WALLET" />
                <span class="pay-text">
                  <strong>Ví tài khoản</strong>
                  <small>Số dư: {{ (authService.walletBalance$ | async) | number:'1.0-0' }}đ</small>
                </span>
              </label>

              <label class="pay-option" [class.selected]="selectedPayment === 'VIETQR'">
                <input type="radio" name="pay" [(ngModel)]="selectedPayment" value="VIETQR" />
                <span class="pay-text">
                  <strong>Chuyển khoản QR</strong>
                  <small>VietQR tự động</small>
                </span>
              </label>
            </div>
          </div>

          <!-- Checkout Button -->
          <button 
            type="button" 
            class="btn-pill btn-pill-primary w-full btn-checkout"
            [disabled]="loading"
            (click)="onCheckout()">
            {{ loading ? 'Đang giao dịch...' : 'Xác nhận thanh toán ngay' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cart-drawer {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      max-width: 460px;
      background: #ffffff;
      box-shadow: -10px 0 30px rgba(0, 0, 0, 0.15);
      z-index: 2050;
      display: flex;
      flex-direction: column;
      animation: slideInFromRight 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes slideInFromRight {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }
    .cart-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 18px 20px;
      border-bottom: 1px solid var(--wg-border);
      background: var(--wg-blue-surface);
    }
    .head-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: var(--wg-font-display);
      font-size: 15px;
      font-weight: 700;
      color: var(--wg-ink);
    }
    .badge-count {
      background: var(--wg-blue);
      color: #ffffff;
      font-size: 11px;
      padding: 2px 8px;
      border-radius: var(--wg-radius-pill);
    }
    .btn-close {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 1px solid #e2e8f0;
      background: #ffffff;
      color: var(--wg-ink-3);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .cart-body {
      flex: 1;
      overflow-y: auto;
      padding: 16px 20px;
    }
    .empty-state {
      text-align: center;
      padding: 40px 20px;
    }
    .empty-illustration {
      font-size: 64px;
      margin-bottom: 16px;
    }
    .empty-state h3 {
      font-size: 18px;
      color: var(--wg-ink);
      margin-bottom: 8px;
    }
    .empty-state p {
      font-size: 13px;
      color: var(--wg-ink-3);
      margin-bottom: 24px;
    }
    .items-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .cart-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      border: 1px solid var(--wg-border);
      border-radius: var(--wg-radius);
      background: #ffffff;
    }
    .item-thumb {
      width: 68px;
      height: 52px;
      object-fit: cover;
      border-radius: var(--wg-radius-sm);
    }
    .item-info {
      flex: 1;
      min-width: 0;
    }
    .item-name {
      font-size: 13px;
      font-weight: 600;
      color: var(--wg-ink);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: 4px;
    }
    .item-meta {
      display: flex;
      gap: 6px;
      margin-bottom: 4px;
    }
    .meta-tag {
      font-size: 10px;
      background: var(--wg-chip-bg);
      color: var(--wg-ink-3);
      padding: 1px 6px;
      border-radius: 4px;
    }
    .item-price {
      font-size: 13px;
      font-weight: 700;
      color: var(--wg-blue);
    }
    .old-price {
      font-size: 11px;
      color: var(--wg-ink-muted);
      text-decoration: line-through;
      margin-left: 4px;
      font-weight: normal;
    }
    .item-actions {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 8px;
    }
    .qty-stepper {
      display: flex;
      align-items: center;
      border: 1px solid var(--wg-border-input);
      border-radius: var(--wg-radius-pill);
      overflow: hidden;
    }
    .btn-qty {
      width: 24px;
      height: 24px;
      border: none;
      background: #f8fafc;
      font-weight: bold;
      cursor: pointer;
    }
    .btn-qty:hover {
      background: #e2e8f0;
    }
    .qty-num {
      padding: 0 8px;
      font-size: 12px;
      font-weight: 600;
    }
    .btn-del {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 14px;
      opacity: 0.6;
    }
    .btn-del:hover {
      opacity: 1;
    }
    .cart-foot {
      padding: 18px 20px;
      background: #f8fafc;
      border-top: 1px solid var(--wg-border);
    }
    .coupon-box {
      display: flex;
      gap: 8px;
      margin-bottom: 14px;
    }
    .coupon-input {
      flex: 1;
      height: 38px;
      padding: 0 12px;
      border-radius: var(--wg-radius-pill);
      border: 1px solid var(--wg-border-input);
      font-size: 12px;
    }
    .btn-coupon {
      height: 38px;
      padding: 0 16px;
      border-radius: var(--wg-radius-pill);
      border: none;
      background: var(--wg-ink);
      color: #ffffff;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
    }
    .summary-rows {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 16px;
      font-size: 13px;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      color: var(--wg-ink-2);
    }
    .summary-row.discount {
      color: var(--wg-danger);
      font-weight: 600;
    }
    .summary-row.total {
      padding-top: 8px;
      border-top: 1px dashed var(--wg-border);
      font-size: 15px;
      font-weight: 700;
      color: var(--wg-ink);
    }
    .total-price {
      color: var(--wg-blue);
      font-size: 18px;
    }
    .payment-methods {
      margin-bottom: 16px;
    }
    .pay-title {
      font-size: 12px;
      font-weight: 600;
      color: var(--wg-ink-3);
      margin-bottom: 8px;
    }
    .pay-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    .pay-option {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 10px;
      border: 1px solid var(--wg-border-input);
      border-radius: var(--wg-radius-sm);
      cursor: pointer;
      background: #ffffff;
      transition: var(--wg-transition);
    }
    .pay-option.selected {
      border-color: var(--wg-blue);
      background: var(--wg-blue-soft);
    }
    .pay-text {
      display: flex;
      flex-direction: column;
      font-size: 12px;
      line-height: 1.2;
    }
    .pay-text small {
      font-size: 10px;
      color: var(--wg-ink-3);
    }
    .btn-checkout {
      height: 46px;
      font-size: 15px;
    }
    .w-full {
      width: 100%;
    }
  `]
})
export class CartModalComponent {
  @Input() isOpen = false;
  @Output() closeEvent = new EventEmitter<void>();
  @Output() orderCreatedEvent = new EventEmitter<void>();

  couponInput = '';
  selectedPayment: 'WALLET' | 'VIETQR' | 'TELCO' = 'WALLET';
  loading = false;

  constructor(
    public cartService: CartService,
    public authService: AuthApiService,
    private orderService: OrderService,
    private toast: ToastService
  ) {}

  applyCoupon(): void {
    if (!this.couponInput.trim()) return;
    this.cartService.applyCoupon(this.couponInput);
  }

  onCheckout(): void {
    if (this.selectedPayment === 'WALLET') {
      const total = this.cartService.getTotalAmount();
      const user = this.authService['currentUserSubject'].value;
      if (!user) {
        this.toast.error('Vui lòng đăng nhập để thanh toán qua Ví tài khoản.');
        return;
      }
    }

    this.loading = true;
    this.orderService.checkout(this.selectedPayment).subscribe({
      next: (order) => {
        this.loading = false;
        if (order) {
          this.close();
          this.orderCreatedEvent.emit();
        }
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  close(): void {
    this.closeEvent.emit();
  }
}

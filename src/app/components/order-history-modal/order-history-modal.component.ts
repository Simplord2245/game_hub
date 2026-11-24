import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../core/services/order.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-order-history-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isOpen" class="wg-modal-overlay" (click)="close()">
      <div class="wg-modal-card order-card" (click)="$event.stopPropagation()">
        <!-- Header -->
        <div class="modal-head">
          <div class="head-title">
            <span class="icon">📦</span>
            <span>LỊCH SỬ ĐƠN HÀNG & KHO TÀI KHOẢN ĐÃ MUA</span>
          </div>
          <button class="btn-close" (click)="close()" aria-label="Đóng">✕</button>
        </div>

        <!-- Body -->
        <div class="modal-body">
          <div *ngIf="(orderService.orders$ | async)?.length === 0" class="empty-state">
            <div class="empty-icon">📭</div>
            <h4>Bạn chưa có đơn hàng nào</h4>
            <p>Sau khi mua tài khoản thành công, thông tin đăng nhập và mật khẩu bảo mật sẽ hiển thị ngay tại đây.</p>
          </div>

          <div *ngIf="((orderService.orders$ | async) || []).length > 0" class="order-list">
            <div *ngFor="let order of (orderService.orders$ | async)" class="order-box">
              <div class="order-top">
                <div class="order-id">
                  <span class="code-badge">{{ order.orderCode }}</span>
                  <span class="order-time">{{ order.createdAt | date:'HH:mm dd/MM/yyyy' }}</span>
                </div>
                <div class="order-status-badge">
                  <span class="badge-pill badge-stock">✓ Đã thanh toán</span>
                </div>
              </div>

              <!-- Purchased Products summary -->
              <div class="order-items">
                <div *ngFor="let item of order.items" class="order-item-row">
                  <img [src]="item.product.coverUrl" class="item-pic" />
                  <div class="item-desc">
                    <div class="name">{{ item.product.productName }}</div>
                    <div class="qty-price">
                      Số lượng: {{ item.quantity }} × {{ (item.product.salePrice || item.product.price) | number:'1.0-0' }}đ
                    </div>
                  </div>
                </div>
              </div>

              <!-- Delivered Digital Secrets (Tài khoản bàn giao) -->
              <div *ngIf="order.deliveredSecrets?.length" class="vault-box">
                <div class="vault-title">
                  <span>🔐 THÔNG TIN BÀN GIAO SẢN PHẨM SỐ (TỰ ĐỘNG)</span>
                </div>

                <div *ngFor="let sec of order.deliveredSecrets; let i = index" class="secret-item">
                  <div class="secret-tag">Tài khoản #{{ i + 1 }} · {{ sec.accountType }}</div>
                  <div class="secret-fields">
                    <div class="secret-field">
                      <span class="field-label">Tài khoản (ID/Mail):</span>
                      <span class="field-val">{{ sec.username }}</span>
                      <button type="button" class="btn-copy" (click)="copy(sec.username)">Copy</button>
                    </div>

                    <div class="secret-field">
                      <span class="field-label">Mật khẩu:</span>
                      <span class="field-val password-mono">{{ sec.password }}</span>
                      <button type="button" class="btn-copy" (click)="copy(sec.password)">Copy</button>
                    </div>

                    <div class="secret-field" *ngIf="sec.twoFactorOrEmail">
                      <span class="field-label">Email liên kết / Auth:</span>
                      <span class="field-val">{{ sec.twoFactorOrEmail }}</span>
                      <button type="button" class="btn-copy" (click)="copy(sec.twoFactorOrEmail)">Copy</button>
                    </div>

                    <div class="secret-note">
                      💡 {{ sec.note }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Total price -->
              <div class="order-bottom">
                <span>Tổng tiền: <strong>{{ order.totalAmount | number:'1.0-0' }}đ</strong></span>
                <span class="pay-method">Phương thức: {{ order.paymentMethod }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .order-card {
      max-width: 680px;
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
    .modal-body {
      padding: 20px;
      max-height: 80vh;
      overflow-y: auto;
    }
    .empty-state {
      text-align: center;
      padding: 40px 20px;
    }
    .empty-icon {
      font-size: 48px;
      margin-bottom: 12px;
    }
    .empty-state h4 {
      font-size: 16px;
      color: var(--wg-ink);
      margin-bottom: 6px;
    }
    .empty-state p {
      font-size: 13px;
      color: var(--wg-ink-3);
    }
    .order-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .order-box {
      border: 1px solid var(--wg-border);
      border-radius: var(--wg-radius);
      padding: 16px;
      background: #ffffff;
      box-shadow: var(--wg-shadow-sm);
    }
    .order-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 10px;
      border-bottom: 1px dashed var(--wg-border);
      margin-bottom: 12px;
    }
    .code-badge {
      font-family: monospace;
      font-weight: 700;
      color: var(--wg-blue);
      font-size: 14px;
      margin-right: 8px;
    }
    .order-time {
      font-size: 12px;
      color: var(--wg-ink-3);
    }
    .order-items {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 14px;
    }
    .order-item-row {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .item-pic {
      width: 48px;
      height: 36px;
      object-fit: cover;
      border-radius: 4px;
    }
    .item-desc .name {
      font-size: 13px;
      font-weight: 600;
      color: var(--wg-ink);
    }
    .item-desc .qty-price {
      font-size: 12px;
      color: var(--wg-ink-3);
    }
    .vault-box {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: var(--wg-radius-sm);
      padding: 12px 14px;
      margin-bottom: 12px;
    }
    .vault-title {
      font-size: 11px;
      font-weight: 800;
      color: #166534;
      letter-spacing: 0.5px;
      margin-bottom: 10px;
    }
    .secret-item {
      background: #ffffff;
      border: 1px solid #dcfce7;
      border-radius: 6px;
      padding: 10px;
      margin-bottom: 8px;
    }
    .secret-item:last-child {
      margin-bottom: 0;
    }
    .secret-tag {
      font-size: 11px;
      font-weight: 700;
      color: #15803d;
      margin-bottom: 8px;
    }
    .secret-fields {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .secret-field {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12.5px;
    }
    .field-label {
      color: var(--wg-ink-3);
      width: 150px;
      flex-shrink: 0;
    }
    .field-val {
      font-weight: 600;
      color: var(--wg-ink);
      flex: 1;
    }
    .password-mono {
      font-family: monospace;
      color: #b91c1c;
      background: #fee2e2;
      padding: 1px 6px;
      border-radius: 4px;
    }
    .btn-copy {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 11px;
      cursor: pointer;
      font-weight: 600;
    }
    .btn-copy:hover {
      background: var(--wg-blue);
      color: #ffffff;
      border-color: var(--wg-blue);
    }
    .secret-note {
      font-size: 11px;
      color: #4b5563;
      margin-top: 4px;
      font-style: italic;
    }
    .order-bottom {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      color: var(--wg-ink-2);
    }
    .order-bottom strong {
      color: var(--wg-blue);
      font-size: 15px;
    }
    .pay-method {
      font-size: 11px;
      background: var(--wg-chip-bg);
      padding: 2px 8px;
      border-radius: 4px;
    }
  `]
})
export class OrderHistoryModalComponent {
  @Input() isOpen = false;
  @Output() closeEvent = new EventEmitter<void>();

  constructor(
    public orderService: OrderService,
    private toast: ToastService
  ) {}

  copy(text: string): void {
    navigator.clipboard?.writeText(text);
    this.toast.info(`Đã sao chép: ${text}`);
  }

  close(): void {
    this.closeEvent.emit();
  }
}

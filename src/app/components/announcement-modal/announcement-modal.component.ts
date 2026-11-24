import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-announcement-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isOpen" class="wg-modal-overlay" (click)="close()">
      <div class="wg-modal-card announcement-card" (click)="$event.stopPropagation()">
        <!-- Header -->
        <div class="modal-head">
          <div class="head-badge">
            <span class="bell-icon">🔔</span>
            <span>THÔNG BÁO TỪ WIBUGEM</span>
          </div>
          <button class="btn-close" (click)="close()" aria-label="Đóng">✕</button>
        </div>

        <!-- Body -->
        <div class="modal-body">
          <div class="notice-banner">
            <div class="notice-title">🎉 Chào mừng bạn đến với WibuGem x GameHub!</div>
            <p class="notice-desc">
              Hệ thống cung cấp tài khoản game reroll, khởi đầu, VIP và dịch vụ nạp game anime hàng đầu Việt Nam.
            </p>
          </div>

          <div class="notice-features">
            <div class="feat-item">
              <span class="feat-icon">⚡</span>
              <div>
                <strong>Giao hàng tự động 24/7</strong>
                <p>Nhận tài khoản, mã kích hoạt tức thì sau khi thanh toán.</p>
              </div>
            </div>
            <div class="feat-item">
              <span class="feat-icon">🛡️</span>
              <div>
                <strong>Bảo hành vĩnh viễn</strong>
                <p>Cam kết tài khoản sạch, đổi mới hoặc hoàn tiền 100% nếu có sự cố.</p>
              </div>
            </div>
            <div class="feat-item">
              <span class="feat-icon">🎁</span>
              <div>
                <strong>Mã ưu đãi thành viên mới</strong>
                <p>Nhập mã <span class="coupon-code">WIBUGEM</span> tại giỏ hàng để được giảm ngay 10%!</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="modal-foot">
          <button class="btn-pill btn-pill-primary w-full" (click)="close()">
            Tôi đã hiểu & Khám phá ngay
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .announcement-card {
      max-width: 480px;
      overflow: hidden;
    }
    .modal-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      border-bottom: 1px solid var(--wg-border);
      background: var(--wg-blue-surface);
    }
    .head-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 700;
      font-size: 13px;
      color: var(--wg-blue);
      letter-spacing: 0.5px;
    }
    .bell-icon {
      font-size: 16px;
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
      font-size: 14px;
      transition: var(--wg-transition);
    }
    .btn-close:hover {
      background: #f1f5f9;
      color: var(--wg-ink);
    }
    .modal-body {
      padding: 20px;
    }
    .notice-banner {
      background: linear-gradient(135deg, #1668ff 0%, #06b6d4 100%);
      color: #ffffff;
      padding: 18px;
      border-radius: var(--wg-radius);
      margin-bottom: 18px;
    }
    .notice-title {
      font-family: var(--wg-font-display);
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 6px;
    }
    .notice-desc {
      font-size: 13px;
      opacity: 0.95;
      line-height: 1.5;
    }
    .notice-features {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .feat-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      background: var(--wg-chip-bg);
      padding: 12px 14px;
      border-radius: var(--wg-radius-sm);
    }
    .feat-icon {
      font-size: 20px;
      flex-shrink: 0;
      margin-top: 2px;
    }
    .feat-item strong {
      display: block;
      font-size: 14px;
      color: var(--wg-ink);
      margin-bottom: 2px;
    }
    .feat-item p {
      font-size: 12px;
      color: var(--wg-ink-3);
      margin: 0;
    }
    .coupon-code {
      background: var(--wg-accent-orange-soft);
      color: #b45309;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
      border: 1px dashed var(--wg-accent-orange);
    }
    .modal-foot {
      padding: 16px 20px;
      border-top: 1px solid var(--wg-border);
      background: #fafafa;
    }
    .w-full {
      width: 100%;
    }
  `]
})
export class AnnouncementModalComponent {
  @Input() isOpen = false;
  @Output() closeEvent = new EventEmitter<void>();

  close(): void {
    this.closeEvent.emit();
  }
}

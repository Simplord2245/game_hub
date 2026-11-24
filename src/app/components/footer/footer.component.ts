import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthApiService } from '../../core/services/auth-api.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="wg-footer">
      <div class="wg-container">
        <!-- 4 Columns Grid -->
        <div class="footer-grid">
          <!-- Col 1: Brand & Bio -->
          <div class="footer-col brand-col">
            <div class="brand-logo">
              <span class="wibu">WIBU</span><span class="gem">GEM</span>
            </div>
            <p class="brand-tagline">
              WibuGem · Shop reroll uy tín — mang thế giới game quí bủ tới bên bạn.
              Hệ thống cung cấp tài khoản tự động, bảo mật và chất lượng hàng đầu.
            </p>
            <div class="social-links">
              <a href="https://facebook.com/wibugem" target="_blank" class="social-btn" title="Facebook">FB</a>
              <a href="https://discord.gg/ebU456H3qB" target="_blank" class="social-btn" title="Discord">DC</a>
              <a href="https://m.me/wibugem" target="_blank" class="social-btn" title="Messenger">MS</a>
            </div>
          </div>

          <!-- Col 2: Policies -->
          <div class="footer-col">
            <h4 class="col-title">Chính sách & Hỗ trợ</h4>
            <ul class="col-links">
              <li><a href="javascript:void(0)">Điều khoản dịch vụ</a></li>
              <li><a href="javascript:void(0)">Chính sách bảo mật</a></li>
              <li><a href="javascript:void(0)">Chính sách bảo hành 1 đổi 1</a></li>
              <li><a href="javascript:void(0)">Quy định giao hàng tự động</a></li>
              <li><a href="javascript:void(0)">Hướng dẫn nạp tiền VietQR</a></li>
            </ul>
          </div>

          <!-- Col 3: Games -->
          <div class="footer-col">
            <h4 class="col-title">Tựa game phổ biến</h4>
            <ul class="col-links">
              <li><a href="#games-section">Wuthering Waves Reroll</a></li>
              <li><a href="#games-section">Genshin Impact Khởi Đầu</a></li>
              <li><a href="#games-section">Honkai: Star Rail VIP</a></li>
              <li><a href="#games-section">Zenless Zone Zero Acc</a></li>
              <li><a href="#games-section">Blue Archive Global</a></li>
            </ul>
          </div>

          <!-- Col 4: Contact -->
          <div class="footer-col">
            <h4 class="col-title">Liên hệ CSKH</h4>
            <ul class="col-info">
              <li>
                <span class="icon">⏰</span>
                <span>Thời gian hỗ trợ: <strong>08:00 – 22:00</strong> hằng ngày</span>
              </li>
              <li>
                <span class="icon">✉️</span>
                <span>Email: <a href="mailto:hotro@wibugem.com">hotro&#64;wibugem.com</a></span>
              </li>
              <li>
                <span class="icon">💬</span>
                <span>Live Chat: <a href="https://m.me/wibugem" target="_blank">m.me/wibugem</a></span>
              </li>
              <li>
                <span class="icon">🛡️</span>
                <span>Hệ thống bảo hộ: <strong>GameHub Backend Spring Boot 4</strong></span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Copyright Bar -->
        <div class="footer-bottom">
          <div class="copyright">
            © 2026 · <strong>WibuGem x GameHub</strong> · All rights reserved. Giao diện thiết kế chuẩn WibuGem.
          </div>
          <div class="payment-badges">
            <span class="badge-pay">VietQR</span>
            <span class="badge-pay">Napas 247</span>
            <span class="badge-pay">Momo</span>
            <span class="badge-pay">Thẻ cào</span>
          </div>
        </div>
      </div>

      <!-- MOBILE FIXED 5-TAB BAR -->
      <div class="mobile-bottom-bar">
        <a href="#" class="tab-item active" (click)="scrollToTop($event)">
          <span class="tab-icon">🏠</span>
          <span class="tab-text">Trang chủ</span>
        </a>
        <a href="javascript:void(0)" class="tab-item" (click)="openOrders.emit()">
          <span class="tab-icon">📦</span>
          <span class="tab-text">Lịch sử</span>
        </a>
        <a href="javascript:void(0)" class="tab-item recharge-tab" (click)="openRecharge.emit()">
          <div class="recharge-circle">⚡</div>
          <span class="tab-text">Nạp tiền</span>
        </a>
        <a href="javascript:void(0)" class="tab-item" (click)="openAuth.emit()">
          <span class="tab-icon">👤</span>
          <span class="tab-text">{{ (authService.currentUser$ | async) ? 'Tài khoản' : 'Đăng nhập' }}</span>
        </a>
        <a href="https://m.me/wibugem" target="_blank" class="tab-item">
          <span class="tab-icon">💬</span>
          <span class="tab-text">Hỗ trợ</span>
        </a>
      </div>
    </footer>
  `,
  styles: [`
    .wg-footer {
      background: #ffffff;
      border-top: 1px solid var(--wg-border);
      padding: 50px 0 30px;
      margin-top: 60px;
      color: var(--wg-ink-2);
    }
    @media (max-width: 900px) {
      .wg-footer {
        padding-bottom: 90px; /* Space for mobile fixed tab bar */
      }
    }
    .footer-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 32px;
      margin-bottom: 40px;
    }
    @media (min-width: 640px) {
      .footer-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media (min-width: 1024px) {
      .footer-grid {
        grid-template-columns: 1.5fr 1fr 1fr 1.2fr;
      }
    }
    .brand-logo {
      font-family: var(--wg-font-display);
      font-size: 22px;
      font-weight: 800;
      letter-spacing: -0.5px;
      margin-bottom: 12px;
    }
    .wibu { color: var(--wg-cyan); }
    .gem { color: var(--wg-blue); }
    .brand-tagline {
      font-size: 13px;
      color: var(--wg-ink-3);
      line-height: 1.6;
      margin-bottom: 16px;
    }
    .social-links {
      display: flex;
      gap: 10px;
    }
    .social-btn {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--wg-chip-bg);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 12px;
      color: var(--wg-ink);
      transition: var(--wg-transition);
    }
    .social-btn:hover {
      background: var(--wg-blue);
      color: #ffffff;
      transform: translateY(-2px);
    }
    .col-title {
      font-family: var(--wg-font-display);
      font-size: 14px;
      font-weight: 700;
      color: var(--wg-ink);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 16px;
    }
    .col-links, .col-info {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 10px;
      font-size: 13px;
    }
    .col-links a {
      color: var(--wg-ink-3);
      transition: var(--wg-transition);
    }
    .col-links a:hover {
      color: var(--wg-blue);
      padding-left: 4px;
    }
    .col-info li {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      color: var(--wg-ink-3);
      line-height: 1.4;
    }
    .col-info a {
      color: var(--wg-blue);
      font-weight: 600;
    }
    .footer-bottom {
      border-top: 1px solid var(--wg-border);
      padding-top: 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      font-size: 13px;
      color: var(--wg-ink-3);
    }
    @media (min-width: 768px) {
      .footer-bottom {
        flex-direction: row;
        justify-content: space-between;
      }
    }
    .payment-badges {
      display: flex;
      gap: 8px;
    }
    .badge-pay {
      background: var(--wg-chip-bg);
      border: 1px solid var(--wg-border);
      font-size: 11px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 4px;
      color: var(--wg-ink-2);
    }

    /* Fixed Bottom Tab Bar for Mobile */
    .mobile-bottom-bar {
      display: none;
    }
    @media (max-width: 900px) {
      .mobile-bottom-bar {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 60px;
        background: rgba(255, 255, 255, 0.96);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border-top: 1px solid var(--wg-border);
        display: flex;
        justify-content: space-around;
        align-items: center;
        z-index: 1000;
      }
      .tab-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: var(--wg-ink-3);
        font-size: 10px;
        font-weight: 600;
        text-decoration: none;
        flex: 1;
      }
      .tab-item.active {
        color: var(--wg-blue);
      }
      .tab-icon {
        font-size: 18px;
        margin-bottom: 2px;
      }
      .recharge-tab {
        position: relative;
        top: -12px;
      }
      .recharge-circle {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: var(--wg-gradient-blue);
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        box-shadow: 0 4px 14px rgba(22, 104, 255, 0.4);
      }
    }
  `]
})
export class FooterComponent {
  @Output() openRecharge = new EventEmitter<void>();
  @Output() openOrders = new EventEmitter<void>();
  @Output() openAuth = new EventEmitter<void>();

  constructor(public authService: AuthApiService) {}

  scrollToTop(event: Event): void {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

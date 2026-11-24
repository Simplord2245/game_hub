import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthApiService } from '../../core/services/auth-api.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-recharge-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="isOpen" class="wg-modal-overlay" (click)="close()">
      <div class="wg-modal-card recharge-card" (click)="$event.stopPropagation()">
        <!-- Header -->
        <div class="modal-head">
          <div class="head-title">
            <span class="icon">💳</span>
            <span>NẠP TIỀN TÀI KHOẢN</span>
          </div>
          <button class="btn-close" (click)="close()" aria-label="Đóng">✕</button>
        </div>

        <!-- Tabs -->
        <div class="recharge-tabs">
          <button 
            type="button" 
            class="tab-btn" 
            [class.active]="tab === 'BANK'"
            (click)="tab = 'BANK'">
            🏦 Ngân hàng / VietQR (0% phí)
          </button>
          <button 
            type="button" 
            class="tab-btn" 
            [class.active]="tab === 'CARD'"
            (click)="tab = 'CARD'">
            🎫 Thẻ cào điện thoại
          </button>
        </div>

        <!-- Body -->
        <div class="modal-body">
          <!-- CURRENT WALLET -->
          <div class="wallet-banner">
            <div>
              <span class="wallet-label">Số dư hiện tại của bạn:</span>
              <div class="wallet-val">{{ (authService.walletBalance$ | async) | number:'1.0-0' }} VNĐ</div>
            </div>
            <span class="instant-badge">⚡ Cộng tiền tự động</span>
          </div>

          <!-- TAB 1: BANK / VIETQR -->
          <div *ngIf="tab === 'BANK'" class="bank-section">
            <div class="qr-box">
              <div class="qr-img-wrapper">
                <!-- Dynamic VietQR preview -->
                <img 
                  [src]="'https://api.vietqr.io/image/970422-0386789999-sLgNf3A.jpg?amount=' + selectedAmount + '&addInfo=WIBUGEM+' + transferCode + '&accountName=WIBUGEM+VIETNAM'" 
                  alt="VietQR WibuGem" 
                  class="qr-img" />
              </div>

              <!-- Quick amounts -->
              <div class="amount-pills">
                <button 
                  type="button" 
                  *ngFor="let amt of amounts" 
                  class="pill-amt" 
                  [class.active]="selectedAmount === amt"
                  (click)="selectedAmount = amt">
                  {{ amt | number:'1.0-0' }}đ
                </button>
              </div>
            </div>

            <!-- Transfer Info -->
            <div class="bank-info-table">
              <div class="info-row">
                <span class="info-label">Ngân hàng:</span>
                <span class="info-val"><strong>MB Bank (Quân Đội)</strong></span>
              </div>
              <div class="info-row">
                <span class="info-label">Số tài khoản:</span>
                <span class="info-val highlight">
                  <span>0386789999</span>
                  <button type="button" class="btn-copy" (click)="copy('0386789999')">Copy</button>
                </span>
              </div>
              <div class="info-row">
                <span class="info-label">Chủ tài khoản:</span>
                <span class="info-val"><strong>WIBUGEM VIETNAM</strong></span>
              </div>
              <div class="info-row">
                <span class="info-label">Nội dung chuyển khoản:</span>
                <span class="info-val highlight">
                  <span class="code">WIBUGEM {{ transferCode }}</span>
                  <button type="button" class="btn-copy" (click)="copy('WIBUGEM ' + transferCode)">Copy</button>
                </span>
              </div>
            </div>

            <div class="note-box">
              ⚠️ <strong>Lưu ý quan trọng:</strong> Vui lòng giữ đúng nội dung chuyển khoản để hệ thống tự động cộng tiền trong 10-30 giây.
            </div>

            <button 
              type="button" 
              class="btn-pill btn-pill-primary w-full"
              (click)="simulateBankPayment()">
              Tôi đã chuyển khoản thành công (Kiểm tra & Cộng tiền)
            </button>
          </div>

          <!-- TAB 2: TELCO CARDS -->
          <div *ngIf="tab === 'CARD'" class="card-section">
            <div class="form-group">
              <label>Loại thẻ cào:</label>
              <div class="telco-grid">
                <button 
                  type="button" 
                  *ngFor="let telco of telcos" 
                  class="btn-telco"
                  [class.active]="selectedTelco === telco"
                  (click)="selectedTelco = telco">
                  {{ telco }}
                </button>
              </div>
            </div>

            <div class="form-group">
              <label>Mệnh giá thẻ:</label>
              <select [(ngModel)]="cardDenom" class="select-input">
                <option [ngValue]="20000">20.000đ (Thực nhận: 17.000đ)</option>
                <option [ngValue]="50000">50.000đ (Thực nhận: 42.500đ)</option>
                <option [ngValue]="100000">100.000đ (Thực nhận: 85.000đ)</option>
                <option [ngValue]="200000">200.000đ (Thực nhận: 170.000đ)</option>
                <option [ngValue]="500000">500.000đ (Thực nhận: 425.000đ)</option>
              </select>
            </div>

            <div class="form-group">
              <label>Mã số thẻ (PIN):</label>
              <input type="text" [(ngModel)]="cardPin" placeholder="Nhập mã cào dưới lớp tráng bạc" class="text-input" />
            </div>

            <div class="form-group">
              <label>Số Seri:</label>
              <input type="text" [(ngModel)]="cardSerial" placeholder="Nhập dãy số seri in trên thẻ" class="text-input" />
            </div>

            <button 
              type="button" 
              class="btn-pill btn-pill-primary w-full"
              (click)="simulateCardPayment()">
              Nạp thẻ ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .recharge-card {
      max-width: 500px;
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
      font-size: 15px;
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
    .recharge-tabs {
      display: flex;
      background: #f8fafc;
      border-bottom: 1px solid var(--wg-border);
    }
    .tab-btn {
      flex: 1;
      padding: 12px;
      background: none;
      border: none;
      border-bottom: 2px solid transparent;
      font-size: 13px;
      font-weight: 600;
      color: var(--wg-ink-3);
      cursor: pointer;
      transition: var(--wg-transition);
    }
    .tab-btn.active {
      color: var(--wg-blue);
      border-bottom-color: var(--wg-blue);
      background: #ffffff;
    }
    .modal-body {
      padding: 20px;
    }
    .wallet-banner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: linear-gradient(135deg, #1668ff 0%, #0b4fd1 100%);
      color: #ffffff;
      padding: 14px 18px;
      border-radius: var(--wg-radius);
      margin-bottom: 18px;
    }
    .wallet-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      opacity: 0.85;
    }
    .wallet-val {
      font-size: 20px;
      font-weight: 800;
      font-family: var(--wg-font-display);
    }
    .instant-badge {
      font-size: 11px;
      background: rgba(255, 255, 255, 0.2);
      padding: 4px 8px;
      border-radius: var(--wg-radius-pill);
      font-weight: 600;
    }
    .qr-box {
      text-align: center;
      margin-bottom: 16px;
    }
    .qr-img-wrapper {
      display: inline-block;
      padding: 8px;
      background: #ffffff;
      border: 1px solid var(--wg-border);
      border-radius: var(--wg-radius);
      box-shadow: var(--wg-shadow-sm);
      margin-bottom: 12px;
    }
    .qr-img {
      width: 170px;
      height: 170px;
      object-fit: contain;
    }
    .amount-pills {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 6px;
    }
    .pill-amt {
      background: var(--wg-chip-bg);
      border: 1px solid var(--wg-chip-border);
      padding: 6px 12px;
      border-radius: var(--wg-radius-pill);
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      color: var(--wg-ink-2);
      transition: var(--wg-transition);
    }
    .pill-amt.active {
      background: var(--wg-blue);
      color: #ffffff;
      border-color: var(--wg-blue);
    }
    .bank-info-table {
      background: var(--wg-chip-bg);
      padding: 12px 14px;
      border-radius: var(--wg-radius-sm);
      margin-bottom: 14px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      font-size: 13px;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .info-label {
      color: var(--wg-ink-3);
    }
    .info-val.highlight {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .btn-copy {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 11px;
      cursor: pointer;
      font-weight: 600;
    }
    .btn-copy:hover {
      background: var(--wg-blue-soft);
      color: var(--wg-blue);
    }
    .code {
      font-family: monospace;
      font-weight: 700;
      color: var(--wg-blue);
    }
    .note-box {
      font-size: 12px;
      color: #92400e;
      background: #fef3c7;
      padding: 10px 12px;
      border-radius: var(--wg-radius-sm);
      margin-bottom: 16px;
      line-height: 1.4;
    }
    .telco-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
    }
    .btn-telco {
      padding: 8px;
      border: 1px solid var(--wg-border-input);
      border-radius: var(--wg-radius-sm);
      background: #ffffff;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: var(--wg-transition);
    }
    .btn-telco.active {
      background: var(--wg-blue-soft);
      border-color: var(--wg-blue);
      color: var(--wg-blue);
    }
    .form-group {
      margin-bottom: 14px;
    }
    .form-group label {
      display: block;
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 6px;
      color: var(--wg-ink);
    }
    .select-input, .text-input {
      width: 100%;
      height: 42px;
      padding: 0 12px;
      border: 1px solid var(--wg-border-input);
      border-radius: var(--wg-radius-sm);
      font-size: 13px;
    }
    .w-full {
      width: 100%;
    }
  `]
})
export class RechargeModalComponent {
  @Input() isOpen = false;
  @Output() closeEvent = new EventEmitter<void>();

  tab: 'BANK' | 'CARD' = 'BANK';
  amounts = [50000, 100000, 200000, 500000, 1000000];
  selectedAmount = 100000;
  transferCode = Math.floor(10000 + Math.random() * 90000);

  telcos = ['Viettel', 'Vinaphone', 'Mobifone', 'Zing', 'Garena'];
  selectedTelco = 'Viettel';
  cardDenom = 100000;
  cardPin = '';
  cardSerial = '';

  constructor(
    public authService: AuthApiService,
    private toast: ToastService
  ) {}

  copy(text: string): void {
    navigator.clipboard?.writeText(text);
    this.toast.info(`Đã sao chép: ${text}`);
  }

  simulateBankPayment(): void {
    this.authService.topupWallet(this.selectedAmount);
    this.toast.success(`Hệ thống nhận diện giao dịch thành công! Đã cộng +${this.selectedAmount.toLocaleString()}đ vào ví.`);
    this.close();
  }

  simulateCardPayment(): void {
    if (!this.cardPin || !this.cardSerial) {
      this.toast.error('Vui lòng nhập đầy đủ Mã PIN và Số Seri thẻ.');
      return;
    }
    const received = Math.round(this.cardDenom * 0.85);
    this.authService.topupWallet(received);
    this.toast.success(`Nạp thẻ ${this.selectedTelco} thành công! Đã cộng +${received.toLocaleString()}đ vào ví.`);
    this.cardPin = '';
    this.cardSerial = '';
    this.close();
  }

  close(): void {
    this.closeEvent.emit();
  }
}

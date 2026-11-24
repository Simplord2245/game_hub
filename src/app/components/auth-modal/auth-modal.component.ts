import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthApiService } from '../../core/services/auth-api.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="isOpen" class="wg-modal-overlay" (click)="close()">
      <div class="wg-modal-card auth-card" (click)="$event.stopPropagation()">
        <!-- Header -->
        <div class="auth-header">
          <div class="brand-title">
            <span class="wibu">WIBU</span><span class="gem">GEM</span>
          </div>
          <p class="auth-subtitle">
            {{ isLogin ? 'Đăng nhập vào tài khoản của bạn' : 'Tạo tài khoản mới để trải nghiệm dịch vụ' }}
          </p>
          <button class="btn-close" (click)="close()" aria-label="Đóng">✕</button>
        </div>

        <!-- Mode Toggle Tabs -->
        <div class="auth-tabs">
          <button 
            type="button" 
            class="tab-btn" 
            [class.active]="isLogin" 
            (click)="setMode(true)">
            Đăng nhập
          </button>
          <button 
            type="button" 
            class="tab-btn" 
            [class.active]="!isLogin" 
            (click)="setMode(false)">
            Đăng ký
          </button>
        </div>

        <!-- Body / Form -->
        <div class="auth-body">
          <!-- Error alert -->
          <div *ngIf="errorMessage" class="error-box">
            ⚠️ {{ errorMessage }}
          </div>

          <!-- LOGIN FORM -->
          <form *ngIf="isLogin" (ngSubmit)="onLogin()">
            <div class="form-group">
              <label for="login-email">Email đăng nhập</label>
              <div class="input-wrapper">
                <span class="input-icon">✉️</span>
                <input 
                  id="login-email"
                  type="email" 
                  [(ngModel)]="loginEmail" 
                  name="email" 
                  placeholder="name@example.com"
                  maxlength="190"
                  required />
              </div>
            </div>

            <div class="form-group">
              <div class="label-row">
                <label for="login-password">Mật khẩu</label>
                <a href="javascript:void(0)" class="link-muted" (click)="forgotPassword()">Quên mật khẩu?</a>
              </div>
              <div class="input-wrapper">
                <span class="input-icon">🔒</span>
                <input 
                  id="login-password"
                  [type]="showPassword ? 'text' : 'password'" 
                  [(ngModel)]="loginPassword" 
                  name="password" 
                  placeholder="Nhập mật khẩu..."
                  required />
                <button type="button" class="btn-eye" (click)="togglePassword()">
                  {{ showPassword ? '👁️' : '🙈' }}
                </button>
              </div>
            </div>

            <div class="form-check">
              <label>
                <input type="checkbox" [(ngModel)]="rememberMe" name="remember" />
                <span>Ghi nhớ đăng nhập</span>
              </label>
            </div>

            <button type="submit" class="btn-pill btn-pill-primary w-full" [disabled]="loading">
              {{ loading ? 'Đang xử lý...' : 'Đăng nhập ngay' }}
            </button>

            <!-- Quick Demo Accounts -->
            <div class="demo-accounts">
              <div class="demo-title">Tài khoản thử nghiệm:</div>
              <div class="demo-buttons">
                <button type="button" class="btn-demo admin-demo" (click)="fillDemo('admin@gamehub.vn', 'password123')">
                  <strong>👑 Quản trị viên:</strong> admin&#64;gamehub.vn
                </button>
                <button type="button" class="btn-demo user-demo" (click)="fillDemo('customer@wibugem.com', 'password123')">
                  <strong>🛒 Khách hàng:</strong> customer&#64;wibugem.com
                </button>
              </div>
            </div>
          </form>

          <!-- REGISTER FORM -->
          <form *ngIf="!isLogin" (ngSubmit)="onRegister()">
            <div class="form-group">
              <label for="reg-fullname">Họ và tên <span class="required">*</span></label>
              <div class="input-wrapper">
                <span class="input-icon">👤</span>
                <input 
                  id="reg-fullname"
                  type="text" 
                  [(ngModel)]="regFullName" 
                  name="fullName" 
                  placeholder="Ví dụ: Nguyễn Văn A"
                  maxlength="120"
                  required />
              </div>
            </div>

            <div class="form-group">
              <label for="reg-email">Email <span class="required">*</span></label>
              <div class="input-wrapper">
                <span class="input-icon">✉️</span>
                <input 
                  id="reg-email"
                  type="email" 
                  [(ngModel)]="regEmail" 
                  name="email" 
                  placeholder="name@example.com"
                  maxlength="190"
                  required />
              </div>
            </div>

            <div class="form-group">
              <label for="reg-phone">Số điện thoại (tùy chọn)</label>
              <div class="input-wrapper">
                <span class="input-icon">📱</span>
                <input 
                  id="reg-phone"
                  type="tel" 
                  [(ngModel)]="regPhone" 
                  name="phone" 
                  placeholder="0912345678"
                  maxlength="25" />
              </div>
            </div>

            <div class="form-group">
              <label for="reg-password">Mật khẩu (8 - 64 ký tự) <span class="required">*</span></label>
              <div class="input-wrapper">
                <span class="input-icon">🔒</span>
                <input 
                  id="reg-password"
                  [type]="showPassword ? 'text' : 'password'" 
                  [(ngModel)]="regPassword" 
                  name="password" 
                  placeholder="Tối thiểu 8 ký tự"
                  minlength="8"
                  maxlength="64"
                  required />
                <button type="button" class="btn-eye" (click)="togglePassword()">
                  {{ showPassword ? '👁️' : '🙈' }}
                </button>
              </div>
            </div>

            <div class="form-check">
              <label>
                <input type="checkbox" [(ngModel)]="agreeTerms" name="agree" required />
                <span>Tôi đồng ý với <a href="javascript:void(0)" class="link-blue">Điều khoản dịch vụ</a> và <a href="javascript:void(0)" class="link-blue">Chính sách bảo mật</a></span>
              </label>
            </div>

            <button type="submit" class="btn-pill btn-pill-primary w-full" [disabled]="loading">
              {{ loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản mới' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-card {
      max-width: 440px;
      padding: 0;
      overflow: hidden;
    }
    .auth-header {
      position: relative;
      padding: 24px 24px 16px;
      text-align: center;
      background: var(--wg-blue-surface);
      border-bottom: 1px solid var(--wg-border);
    }
    .brand-title {
      font-family: var(--wg-font-display);
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.5px;
    }
    .wibu { color: var(--wg-cyan); }
    .gem { color: var(--wg-blue); }
    .auth-subtitle {
      font-size: 13px;
      color: var(--wg-ink-3);
      margin-top: 4px;
    }
    .btn-close {
      position: absolute;
      top: 16px;
      right: 16px;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 1px solid #e2e8f0;
      background: #ffffff;
      color: var(--wg-ink-3);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
    }
    .btn-close:hover {
      background: #f1f5f9;
      color: var(--wg-ink);
    }
    .auth-tabs {
      display: flex;
      padding: 8px 24px 0;
      background: var(--wg-blue-surface);
      border-bottom: 1px solid var(--wg-border);
    }
    .tab-btn {
      flex: 1;
      padding: 12px 0;
      background: none;
      border: none;
      border-bottom: 2px solid transparent;
      font-weight: 600;
      font-size: 14px;
      color: var(--wg-ink-3);
      cursor: pointer;
      transition: var(--wg-transition);
    }
    .tab-btn.active {
      color: var(--wg-blue);
      border-bottom-color: var(--wg-blue);
    }
    .auth-body {
      padding: 24px;
    }
    .error-box {
      background: var(--wg-danger-soft);
      color: var(--wg-danger);
      border: 1px solid rgba(239, 68, 68, 0.2);
      border-radius: var(--wg-radius-sm);
      padding: 10px 14px;
      font-size: 13px;
      font-weight: 500;
      margin-bottom: 16px;
    }
    .form-group {
      margin-bottom: 16px;
    }
    .form-group label {
      display: block;
      font-size: 13px;
      font-weight: 600;
      color: var(--wg-ink);
      margin-bottom: 6px;
    }
    .label-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }
    .label-row label {
      margin-bottom: 0;
    }
    .required {
      color: var(--wg-danger);
    }
    .link-muted {
      font-size: 12px;
      color: var(--wg-ink-3);
    }
    .link-muted:hover {
      color: var(--wg-blue);
    }
    .link-blue {
      color: var(--wg-blue);
      font-weight: 600;
    }
    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }
    .input-icon {
      position: absolute;
      left: 14px;
      font-size: 14px;
      pointer-events: none;
      opacity: 0.7;
    }
    .input-wrapper input {
      width: 100%;
      height: 44px;
      padding: 0 40px 0 40px;
      border-radius: var(--wg-radius-sm);
      border: 1px solid var(--wg-border-input);
      background: #ffffff;
      font-size: 14px;
      color: var(--wg-ink);
      transition: var(--wg-transition);
    }
    .input-wrapper input:focus {
      outline: none;
      border-color: var(--wg-blue);
      box-shadow: 0 0 0 3px rgba(22, 104, 255, 0.12);
    }
    .btn-eye {
      position: absolute;
      right: 12px;
      background: none;
      border: none;
      font-size: 14px;
      cursor: pointer;
      opacity: 0.6;
    }
    .btn-eye:hover {
      opacity: 1;
    }
    .form-check {
      margin-bottom: 18px;
      font-size: 13px;
      color: var(--wg-ink-2);
    }
    .form-check label {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      cursor: pointer;
    }
    .form-check input {
      margin-top: 3px;
    }
    .w-full {
      width: 100%;
    }
    .demo-accounts {
      margin-top: 20px;
      padding-top: 16px;
      border-top: 1px dashed var(--wg-border);
    }
    .demo-title {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--wg-ink-3);
      margin-bottom: 8px;
    }
    .demo-buttons {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .btn-demo {
      background: var(--wg-chip-bg);
      border: 1px solid var(--wg-border);
      border-radius: var(--wg-radius-sm);
      padding: 6px 10px;
      font-size: 12px;
      color: var(--wg-ink-2);
      text-align: left;
      cursor: pointer;
      transition: var(--wg-transition);
    }
    .btn-demo:hover {
      background: var(--wg-blue-soft);
      border-color: var(--wg-blue-border);
      color: var(--wg-blue);
    }
  `]
})
export class AuthModalComponent {
  @Input() isOpen = false;
  @Input() initialMode: 'login' | 'register' = 'login';
  @Output() closeEvent = new EventEmitter<void>();
  @Output() loginSuccess = new EventEmitter<string[]>();

  isLogin = true;
  loading = false;
  errorMessage = '';
  showPassword = false;

  // Login model
  loginEmail = '';
  loginPassword = '';
  rememberMe = true;

  // Register model
  regFullName = '';
  regEmail = '';
  regPhone = '';
  regPassword = '';
  agreeTerms = true;

  constructor(
    private authService: AuthApiService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnChanges(): void {
    this.isLogin = this.initialMode === 'login';
    this.errorMessage = '';
  }

  setMode(login: boolean): void {
    this.isLogin = login;
    this.errorMessage = '';
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  fillDemo(email: string, pass: string): void {
    this.loginEmail = email;
    this.loginPassword = pass;
    this.onLogin();
  }

  onLogin(): void {
    if (!this.loginEmail || !this.loginPassword) {
      this.errorMessage = 'Vui lòng nhập đầy đủ email và mật khẩu.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login({
      email: this.loginEmail,
      password: this.loginPassword
    }).subscribe({
      next: (res) => {
        this.loading = false;
        const roles = res.data.user.roles || [];
        this.loginSuccess.emit(roles);
        this.close();

        // Separate user vs admin redirection based on roles
        if (roles.includes('ADMIN') || roles.includes('STAFF')) {
          this.toast.success(`Đăng nhập Quản trị viên thành công! Xin chào ${res.data.user.fullName}`);
          this.router.navigate(['/admin']);
        } else {
          this.toast.success(`Đăng nhập thành công! Xin chào ${res.data.user.fullName}`);
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.message || 'Đăng nhập không thành công.';
      }
    });
  }

  onRegister(): void {
    if (!this.regFullName.trim() || !this.regEmail.trim() || !this.regPassword) {
      this.errorMessage = 'Vui lòng điền đầy đủ các thông tin bắt buộc (*).';
      return;
    }

    if (this.regPassword.length < 8 || this.regPassword.length > 64) {
      this.errorMessage = 'Mật khẩu phải từ 8 đến 64 ký tự (quy chuẩn BR-008).';
      return;
    }

    if (!this.agreeTerms) {
      this.errorMessage = 'Bạn cần đồng ý với điều khoản sử dụng để tiếp tục.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.register({
      fullName: this.regFullName,
      email: this.regEmail,
      password: this.regPassword,
      phone: this.regPhone || undefined
    }).subscribe({
      next: (res) => {
        this.loading = false;
        this.toast.success(`Đăng ký thành công! Chào mừng ${res.data.fullName}`);
        this.close();
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.message || 'Đăng ký thất bại.';
      }
    });
  }

  forgotPassword(): void {
    this.toast.info('Vui lòng liên hệ Admin qua kênh hỗ trợ Fanpage/Discord để khôi phục mật khẩu.');
  }

  close(): void {
    this.closeEvent.emit();
  }
}

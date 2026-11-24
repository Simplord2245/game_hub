import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { HomeComponent } from '../home/home.component';
import { AnnouncementModalComponent } from '../../components/announcement-modal/announcement-modal.component';
import { AuthModalComponent } from '../../components/auth-modal/auth-modal.component';
import { CartModalComponent } from '../../components/cart-modal/cart-modal.component';
import { RechargeModalComponent } from '../../components/recharge-modal/recharge-modal.component';
import { ProductDetailModalComponent } from '../../components/product-detail-modal/product-detail-modal.component';
import { OrderHistoryModalComponent } from '../../components/order-history-modal/order-history-modal.component';
import { AuthApiService } from '../../core/services/auth-api.service';
import { ToastService } from '../../core/services/toast.service';
import { ProductResponse } from '../../core/models/product.model';

@Component({
  selector: 'app-store-layout',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    AnnouncementModalComponent,
    AuthModalComponent,
    CartModalComponent,
    RechargeModalComponent,
    ProductDetailModalComponent,
    OrderHistoryModalComponent
  ],
  template: `
    <!-- Header -->
    <app-header 
      (searchEvent)="onHeaderSearch($event)"
      (openLogin)="openAuthModal('login')"
      (openRegister)="openAuthModal('register')"
      (openCart)="showCartModal = true"
      (openRecharge)="showRechargeModal = true"
      (openOrders)="showOrdersModal = true">
    </app-header>

    <!-- Main Home Page -->
    <app-home 
      #homeComp
      (openDetail)="onOpenDetail($event)"
      (openAnnouncement)="showAnnouncementModal = true">
    </app-home>

    <!-- Footer -->
    <app-footer
      (openRecharge)="showRechargeModal = true"
      (openOrders)="showOrdersModal = true"
      (openAuth)="openAuthModal('login')">
    </app-footer>

    <!-- Modals -->
    <app-announcement-modal
      [isOpen]="showAnnouncementModal"
      (closeEvent)="showAnnouncementModal = false">
    </app-announcement-modal>

    <app-auth-modal
      [isOpen]="showAuthModal"
      [initialMode]="authMode"
      (closeEvent)="showAuthModal = false"
      (loginSuccess)="onLoginSuccess($event)">
    </app-auth-modal>

    <app-cart-modal
      [isOpen]="showCartModal"
      (closeEvent)="showCartModal = false"
      (orderCreatedEvent)="onOrderPlaced()">
    </app-cart-modal>

    <app-recharge-modal
      [isOpen]="showRechargeModal"
      (closeEvent)="showRechargeModal = false">
    </app-recharge-modal>

    <app-product-detail-modal
      [isOpen]="showDetailModal"
      [product]="selectedProduct"
      (closeEvent)="showDetailModal = false"
      (buyNowEvent)="onBuyNow($event)">
    </app-product-detail-modal>

    <app-order-history-modal
      [isOpen]="showOrdersModal"
      (closeEvent)="showOrdersModal = false">
    </app-order-history-modal>
  `
})
export class StoreLayoutComponent implements OnInit {
  @ViewChild('homeComp') homeComponent!: HomeComponent;

  showAnnouncementModal = false;
  showAuthModal = false;
  authMode: 'login' | 'register' = 'login';
  showCartModal = false;
  showRechargeModal = false;
  showDetailModal = false;
  showOrdersModal = false;

  selectedProduct: ProductResponse | null = null;

  constructor(
    public authService: AuthApiService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const seen = sessionStorage.getItem('wg_seen_announcement');
    if (!seen) {
      setTimeout(() => {
        this.showAnnouncementModal = true;
        sessionStorage.setItem('wg_seen_announcement', 'true');
      }, 700);
    }
  }

  onHeaderSearch(kw: string): void {
    if (this.homeComponent) {
      this.homeComponent.productKeyword = kw;
      this.homeComponent.currentPage = 0;
      this.homeComponent.loadProducts();

      const el = document.getElementById('products-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  openAuthModal(mode: 'login' | 'register'): void {
    this.authMode = mode;
    this.showAuthModal = true;
  }

  onLoginSuccess(roles: string[]): void {
    // Navigation is handled inside auth-modal.component.ts to avoid duplicate navigate.
  }

  onOpenDetail(product: ProductResponse): void {
    this.selectedProduct = product;
    this.showDetailModal = true;
  }

  onBuyNow(product: ProductResponse): void {
    this.showCartModal = true;
  }

  onOrderPlaced(): void {
    this.showOrdersModal = true;
  }
}

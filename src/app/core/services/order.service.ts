import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { DeliveredSecret, Order } from '../models/order.model';
import { CartService } from './cart.service';
import { AuthApiService } from './auth-api.service';
import { ProductApiService } from './product-api.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private storageKey = 'wg_gamehub_orders';
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  public orders$ = this.ordersSubject.asObservable();

  constructor(
    private cartService: CartService,
    private authService: AuthApiService,
    private productService: ProductApiService,
    private toast: ToastService
  ) {
    this.loadOrders();
  }

  private loadOrders(): void {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (raw) {
        this.ordersSubject.next(JSON.parse(raw));
      }
    } catch {
      this.ordersSubject.next([]);
    }
  }

  private saveOrders(orders: Order[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(orders));
    this.ordersSubject.next(orders);
  }

  checkout(paymentMethod: 'WALLET' | 'VIETQR' | 'TELCO'): Observable<Order | null> {
    const items = [...this.cartService['itemsSubject'].value];
    if (items.length === 0) {
      this.toast.error('Giỏ hàng đang trống!');
      return of(null);
    }

    const total = this.cartService.getTotalAmount();
    const discount = this.cartService.getDiscountAmount();

    // If wallet payment, check and deduct
    if (paymentMethod === 'WALLET') {
      const success = this.authService.deductWallet(total);
      if (!success) {
        this.toast.error('Số dư tài khoản không đủ. Vui lòng nạp thêm tiền!');
        return of(null);
      }
    }

    // Generate delivered digital secrets
    const deliveredSecrets: DeliveredSecret[] = items.map(item => {
      const randomId = Math.floor(100000 + Math.random() * 900000);
      return {
        accountType: `${item.product.game.gameName} (${item.product.attributes?.server || 'Asia'})`,
        username: `wg_user_${randomId}`,
        password: `Pass@${Math.random().toString(36).slice(-8)}`,
        twoFactorOrEmail: `wg.auth.${randomId}@gmail.com`,
        note: 'Tài khoản trắng thông tin. Bạn có thể tự do đổi mật khẩu & liên kết email cá nhân tại trang chủ nhà phát hành.'
      };
    });

    // Deduct inventory stock
    const products = this.productService.getStoredProducts();
    items.forEach(item => {
      const idx = products.findIndex(p => p.productId === item.product.productId);
      if (idx !== -1 && products[idx].stockCount > 0) {
        products[idx].stockCount = Math.max(0, products[idx].stockCount - item.quantity);
      }
    });
    this.productService.saveStoredProducts(products);

    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randCode = Math.floor(1000 + Math.random() * 9000);

    const newOrder: Order = {
      orderId: Date.now(),
      orderCode: `ORD-${dateStr}-${randCode}`,
      items: items,
      totalAmount: total,
      discountAmount: discount,
      paymentMethod,
      orderStatus: 'PAID',
      createdAt: now.toISOString(),
      deliveredSecrets
    };

    const currentOrders = [newOrder, ...this.ordersSubject.value];
    this.saveOrders(currentOrders);

    this.cartService.clearCart();
    this.toast.success(`Đặt hàng thành công! Mã đơn: ${newOrder.orderCode}`);

    return of(newOrder);
  }

  updateOrderStatus(orderId: number, status: 'PAID' | 'PENDING_PAYMENT' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED'): void {
    const list = [...this.ordersSubject.value];
    const idx = list.findIndex(o => o.orderId === orderId);
    if (idx !== -1) {
      list[idx] = { ...list[idx], orderStatus: status };
      this.saveOrders(list);
      this.toast.success(`Đã cập nhật trạng thái đơn #${list[idx].orderCode} thành ${status}`);
    }
  }
}

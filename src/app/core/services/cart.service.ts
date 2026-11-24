import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/order.model';
import { ProductResponse } from '../models/product.model';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private storageKey = 'wg_gamehub_cart';
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  public items$ = this.itemsSubject.asObservable();

  private couponSubject = new BehaviorSubject<{ code: string; discountPercent?: number; discountFixed?: number } | null>(null);
  public coupon$ = this.couponSubject.asObservable();

  constructor(private toast: ToastService) {
    this.loadCart();
  }

  private loadCart(): void {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        this.itemsSubject.next(JSON.parse(data));
      }
    } catch {
      this.itemsSubject.next([]);
    }
  }

  private saveCart(items: CartItem[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
    this.itemsSubject.next(items);
  }

  addToCart(product: ProductResponse, quantity = 1): void {
    const current = [...this.itemsSubject.value];
    const index = current.findIndex(i => i.product.productId === product.productId);

    if (index > -1) {
      current[index].quantity += quantity;
    } else {
      current.push({ product, quantity });
    }

    this.saveCart(current);
    this.toast.success(`Đã thêm "${product.productName.slice(0, 30)}..." vào giỏ!`);
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }
    const current = this.itemsSubject.value.map(item => {
      if (item.product.productId === productId) {
        return { ...item, quantity };
      }
      return item;
    });
    this.saveCart(current);
  }

  removeItem(productId: number): void {
    const current = this.itemsSubject.value.filter(i => i.product.productId !== productId);
    this.saveCart(current);
    this.toast.info('Đã xóa sản phẩm khỏi giỏ hàng.');
  }

  clearCart(): void {
    this.saveCart([]);
    this.couponSubject.next(null);
  }

  getItemCount(): number {
    return this.itemsSubject.value.reduce((sum, i) => sum + i.quantity, 0);
  }

  getSubtotal(): number {
    return this.itemsSubject.value.reduce((sum, item) => {
      const price = item.product.salePrice || item.product.price;
      return sum + price * item.quantity;
    }, 0);
  }

  getDiscountAmount(): number {
    const subtotal = this.getSubtotal();
    const coupon = this.couponSubject.value;
    if (!coupon) return 0;
    if (coupon.discountPercent) {
      return Math.round((subtotal * coupon.discountPercent) / 100);
    }
    if (coupon.discountFixed) {
      return Math.min(coupon.discountFixed, subtotal);
    }
    return 0;
  }

  getTotalAmount(): number {
    const total = this.getSubtotal() - this.getDiscountAmount();
    return Math.max(0, total);
  }

  applyCoupon(code: string): boolean {
    const clean = code.trim().toUpperCase();
    if (clean === 'WIBUGEM' || clean === 'WIBUGEM2026') {
      this.couponSubject.next({ code: clean, discountPercent: 10 });
      this.toast.success('Áp dụng mã giảm 10% thành công!');
      return true;
    }
    if (clean === 'GAMEHUB' || clean === 'GAMEHUB50K') {
      this.couponSubject.next({ code: clean, discountFixed: 50000 });
      this.toast.success('Áp dụng mã giảm 50.000đ thành công!');
      return true;
    }
    this.toast.error('Mã giảm giá không hợp lệ hoặc đã hết hạn.');
    return false;
  }

  removeCoupon(): void {
    this.couponSubject.next(null);
    this.toast.info('Đã hủy áp dụng mã giảm giá.');
  }
}

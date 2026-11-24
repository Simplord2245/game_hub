import { ProductResponse } from './product.model';

export interface CartItem {
  product: ProductResponse;
  quantity: number;
}

export interface DeliveredSecret {
  accountType: string;
  username: string;
  password: string;
  twoFactorOrEmail?: string;
  note: string;
}

export interface Order {
  orderId: number;
  orderCode: string;
  items: CartItem[];
  totalAmount: number;
  discountAmount: number;
  paymentMethod: 'WALLET' | 'VIETQR' | 'TELCO';
  orderStatus: 'PAID' | 'PENDING_PAYMENT' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED';
  createdAt: string;
  deliveredSecrets?: DeliveredSecret[];
}

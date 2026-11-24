import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthApiService } from '../services/auth-api.service';
import { ToastService } from '../services/toast.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthApiService);
  const router = inject(Router);
  const toast = inject(ToastService);

  if (authService.isStaff() || authService.isAdmin()) {
    return true;
  }

  toast.error('Khu vực hạn chế: Bạn cần tài khoản có quyền Quản trị viên (ADMIN / STAFF) để truy cập.');
  router.navigate(['/']);
  return false;
};

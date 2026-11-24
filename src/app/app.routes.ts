import { Routes } from '@angular/router';
import { StoreLayoutComponent } from './pages/store-layout/store-layout.component';
import { AdminComponent } from './pages/admin/admin.component';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    component: StoreLayoutComponent,
    title: 'WibuGem x GameHub · Shop Game & Tài Khoản Reroll Uy Tín'
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [adminGuard],
    title: 'WibuGem Admin · Trung Tâm Quản Trị Hệ Thống'
  },
  {
    path: '**',
    redirectTo: ''
  }
];

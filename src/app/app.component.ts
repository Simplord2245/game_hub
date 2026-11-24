import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ToastService } from './core/services/toast.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <!-- Top-level Router Outlet for Store (/) and Admin (/admin) -->
    <router-outlet></router-outlet>

    <!-- Global Toast Container -->
    <div class="wg-toast-container">
      <div 
        *ngFor="let toast of (toastService.toasts$ | async)" 
        class="wg-toast" 
        [class.success]="toast.type === 'success'"
        [class.error]="toast.type === 'error'"
        [class.info]="toast.type === 'info'">
        <span *ngIf="toast.type === 'success'">✅</span>
        <span *ngIf="toast.type === 'error'">❌</span>
        <span *ngIf="toast.type === 'info'">ℹ️</span>
        <span>{{ toast.message }}</span>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }
  `]
})
export class AppComponent {
  constructor(public toastService: ToastService) {}
}


import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PopupService } from '../../services/popup-service';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart-service';

@Component({
  selector: 'app-common-popup',
  standalone: true,
  imports: [],
  templateUrl: './common-popup.html',
  styleUrl: './common-popup.css'
})
export class CommonPopup {
  popupService = inject(PopupService);
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private router = inject(Router);

  confirmLogout(): void {
    this.authService.logout();
    this.cartService.resetCartCount();
    this.popupService.close();
    this.popupService.show('logged out successfully.', 'success');
    this.router.navigate(['/login']);
  }
}

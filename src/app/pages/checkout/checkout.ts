import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CheckoutService } from '../../services/checkout-service';
import { PopupService } from '../../services/popup-service';
import { CartService } from '../../services/cart-service';

@Component({
  selector: 'app-checkout',
  imports: [FormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {
  // Input fields ki values
  fullName = '';
  phone = '';
  address = '';
  city = '';

  isSubmitting = false;
  errorMessage = '';

  constructor(
    private checkoutService: CheckoutService,
    private router: Router,
    private popupService: PopupService,
    private cartService: CartService
  ) {}

  // Place order method
  placeOrder() {
    this.isSubmitting = true;
    this.errorMessage = '';

    const orderData = {
      fullName: this.fullName,
      phone: this.phone,
      address: this.address,
      city: this.city,
    };

    this.checkoutService.placeOrder(orderData).subscribe({
      next: () => {
        this.isSubmitting = false;

        this.cartService.resetCartCount();

        this.popupService.show('Your order has been placed successfully!', 'success');

        this.router.navigate(['/']);
      },
      // Order placement failed
      error: (error: any) => {
        this.isSubmitting = false;

        this.popupService.show(
          error.error?.message || 'Order could not be placed. Please try again.',
          'error',
        );
      },
    });
  }
}

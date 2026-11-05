  import { Component, OnInit, signal } from '@angular/core';
  import { CartService } from '../../services/cart-service';
  import { PopupService } from '../../services/popup-service';

  @Component({
    imports: [],
    selector: 'app-cart',
    styleUrl: './cart.css',
    templateUrl: './cart.html',
  })
  export class Cart implements OnInit {
    cartItems = signal<any[]>([]);
    totalAmount = signal(0);
    totalItems = signal(0);

    constructor(
      private cartService: CartService,
      private popupService: PopupService,
    ) {}

    ngOnInit() {
      this.loadCart();
    }

    // Load cart data from backend
loadCart() {
  this.cartService.getCart().subscribe((data: any) => {

    // Update cart items
    this.cartItems.set(data.cartItems);

    // Update total amount
    this.totalAmount.set(data.totalAmount);

    // Calculate total quantity
    const total = data.cartItems.reduce(
      (sum: number, item: any) => sum + item.quantity,
      0
    );

    // Update cart page item count
    this.totalItems.set(total);

    // Update navbar cart count
    this.cartService.cartCount.set(total);
  });
}
  // Increase cart item quantity
  increaseQuantity(item: any) {

    // Calculate new quantity
    const newQuantity = item.quantity + 1;

    // Send updated quantity to backend
    this.cartService.updateQuantity(item.id, newQuantity).subscribe({

      // Reload cart after successful update
      next: () => {
        this.loadCart();
      },

      // Show error popup if update fails
      error: (err) => {
        this.popupService.show(err.error, 'error');
      }
    });
  }

    // Decrease cart item quantity
  decreaseQuantity(item: any) {

    // Do not allow quantity below 1
    if (item.quantity <= 1) {
      return;
    }

    // Calculate new quantity
    const newQuantity = item.quantity - 1;

    // Send updated quantity to backend
    this.cartService.updateQuantity(item.id, newQuantity).subscribe({

      // Reload cart after successful update
      next: () => {
        this.loadCart();
      },

      // Show error popup if update fails
      error: (err) => {
        this.popupService.show(err.error, 'error');
      }
    });
  }

    // Remove item from cart
  removeItem(cartItemId: number) {

    // Send remove request to backend
    this.cartService.removeFromCart(cartItemId).subscribe({

      // Reload cart after successful removal
      next: () => {
        this.loadCart();

        // Show success popup
        this.popupService.show('Item removed from cart successfully.', 'success');
      },

      // Show error popup if removal fails
      error: (err) => {
        this.popupService.show(err.error, 'error');
      }
    });
  }
  }

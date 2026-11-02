import { Component, OnInit, signal } from '@angular/core';
import { CartService } from '../../services/cart-service';

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

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.cartService.getCart().subscribe((data: any) => {
      this.cartItems.set(data.cartItems);
      this.totalAmount.set(data.totalAmount);
      this.totalItems.set(
        data.cartItems.reduce((total: number, item: any) => total + item.quantity, 0),
      );
    });
  }
  increaseQuantity(item: any) {
    const newQuantity = item.quantity + 1;

    this.cartService.updateQuantity(item.id, newQuantity).subscribe({
      next: () => this.loadCart(),
      error: (err) => alert(err.error),
    });
  }

  decreaseQuantity(item: any) {
    if (item.quantity <= 1) {
      return;
    }

    const newQuantity = item.quantity - 1;

    this.cartService.updateQuantity(item.id, newQuantity).subscribe({
      next: () => this.loadCart(),
      error: (err) => alert(err.error),
    });
  }

  removeItem(cartItemId: number) {
    this.cartService.removeFromCart(cartItemId).subscribe({
      next: () => this.loadCart(),
      error: (err) => alert(err.error),
    });
  }
}

import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  // Store total number of cart items
  cartCount = signal(0);

  // Inject HttpClient using Dependency Injection
  constructor(private http: HttpClient) {}

  private url = 'https://localhost:7223/api/Carts';

  // Get logged-in user's cart
  getCart() {
    return this.http.get(this.url);
  }

  // Add product to cart
  addToCart(cartItem: any) {
    return this.http.post(this.url, cartItem);
  }

  // Update cart item quantity
  updateQuantity(cartItemId: number, quantity: number) {
    return this.http.put(`${this.url}/${cartItemId}?quantity=${quantity}`, null);
  }

  // Remove item from cart
  // Remove item from cart
  removeFromCart(cartItemId: number) {
    return this.http.delete(`${this.url}/${cartItemId}`, { responseType: 'text' });
  }

  // Refresh total cart item count from backend
  refreshCartCount() {
    this.getCart().subscribe({
      next: (data: any) => {
        // Calculate total quantity of all cart items
        const total = data.cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);

        // Update cart count signal
        this.cartCount.set(total);
      },

      // Set count to zero if cart is empty or unavailable
      error: () => {
        this.cartCount.set(0);
      },
    });
  }
  
}

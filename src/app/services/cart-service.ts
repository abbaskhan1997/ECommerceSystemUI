import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CartService {

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
    return this.http.put(
      `${this.url}/${cartItemId}?quantity=${quantity}`,
      null
    );
  }

  // Remove item from cart
  // Remove item from cart
removeFromCart(cartItemId: number) {
  return this.http.delete(
    `${this.url}/${cartItemId}`,
    { responseType: 'text' }
  );
}
}
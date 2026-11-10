
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CreateOrderRequest {
  fullName: string;
  phone: string;
  address: string;
  city: string;
}

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private url = 'https://localhost:7223/api/Orders';

  // Dependency Injection: HttpClient Angular se receive hota hai.
  constructor(private http: HttpClient) {}

  // Send customer delivery details and place the order
  placeOrder(orderData: CreateOrderRequest): Observable<any> {
    return this.http.post(this.url, orderData);
  }
}

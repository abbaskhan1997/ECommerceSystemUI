import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  // Backend API URL
  private apiUrl = 'https://localhost:7223/api/Orders';

  // DI: HttpClient Angular se inject hota hai.
  // Iski madad se backend API ko request bhejte hain.
  constructor(private http: HttpClient) {}

  // Logged-in customer ke orders get karna
  getMyOrders(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
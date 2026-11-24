
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  // Backend API URL
  private apiUrl = 'https://localhost:7223/api/Orders';

  constructor(private http: HttpClient) {}

  // Get logged-in customer orders
  getMyOrders(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Get admin orders with search, filters and pagination
  getAllOrders(
    pageNumber: number = 1,
    pageSize: number = 10,
    search: string = '',
    status: string = '',
    paymentStatus: string = ''
  ): Observable<any> {

    const params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize)
      .set('search', search)
      .set('status', status)
      .set('paymentStatus', paymentStatus);

    return this.http.get<any>(
      `${this.apiUrl}/admin/all`,
      { params }
    );
  }

  // Get total orders count for Admin Dashboard
getOrdersCount() {
  return this.http.get<{ totalOrders: number }>(
    `${this.apiUrl}/admin/count`
  );
}   

  // Get a specific order for Admin
  getOrderById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/${id}`);
  }

  // Update order status
  updateOrderStatus(id: number, status: string): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/admin/${id}/status?status=${status}`,
      {}
    );
  }

  // Update payment status
  updatePaymentStatus(id: number, paymentStatus: string): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/admin/${id}/payment?paymentStatus=${paymentStatus}`,
      {}
    );
  }

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductSizeService {

  private url = 'https://localhost:7223/api/ProductSizes';

  constructor(private http: HttpClient) {}

  // Get sizes of a product
  getProductSizes(productId: number) {
    return this.http.get(`${this.url}/${productId}`);
  }

  // Add a new size
  addProductSize(productSize: any) {
    return this.http.post(this.url, productSize);
  }

  // Update an existing size
  updateProductSize(id: number, productSize: any) {
    return this.http.put(`${this.url}/${id}`, productSize);
  }

  // Delete a size
  deleteProductSize(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }
}
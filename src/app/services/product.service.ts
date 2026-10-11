import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http: HttpClient) { }

  private url = 'https://localhost:7223/api/Products';

  getProducts(pageNumber: number = 1) {
  return this.http.get(
    `${this.url}?pageNumber=${pageNumber}`
  );
}

  getProductById(id: number) {
  return this.http.get(`${this.url}/${id}`);
}

addProduct(product: any) {
  return this.http.post(this.url, product);
}

updateProduct(id: number, product: any) {
  return this.http.put(`${this.url}/${id}`, product); 
}

deleteProduct(id: number) {
  return this.http.delete(`${this.url}/${id}`);
}

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http: HttpClient) { }

  private url = 'https://localhost:7223/api/Products';

  getProducts() {
    return this.http.get(this.url);
  }
}

import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  private url = 'https://localhost:7223/api/Products';

  totalProducts = signal(0);

  getProducts(
  pageNumber: number = 1,
  search: string = '',
  categoryId?: number,
  schoolId?: number,
  schoolClassId?: number
) {
  let params =
    `?pageNumber=${pageNumber}&search=${encodeURIComponent(search)}`;

  if (categoryId !== undefined) {
    params += `&categoryId=${categoryId}`;
  }

  if (schoolId !== undefined) {
    params += `&schoolId=${schoolId}`;
  }

  if (schoolClassId !== undefined) {
    params += `&schoolClassId=${schoolClassId}`;
  }

  return this.http.get(`${this.url}${params}`);
}

  refreshProductCount() {
  this.getProducts(1, '').subscribe((data: any) => {
    this.totalProducts.set(data.totalProducts);
  });
}

  getProductById(id: number) {
    return this.http.get(`${this.url}/${id}`);
  }

  addProduct(product: any) {
  return this.http.post(this.url, product).pipe(
    tap(() => this.refreshProductCount())
  );
}

  updateProduct(id: number, product: any) {
    return this.http.put(`${this.url}/${id}`, product);
  }

  deleteProduct(id: number) {
  return this.http.delete(`${this.url}/${id}`).pipe(
    tap(() => this.refreshProductCount())
  );
}
}

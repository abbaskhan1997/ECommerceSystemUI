import { Component, signal } from '@angular/core';
import { ProductService } from '../../services/product.service';


@Component({
  imports: [],
  selector: 'app-products',
  styleUrl: './products.css',
  templateUrl: './products.html',
})
export class Products {

  products = signal<any[]>([]);

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.getProducts();
    
  }

  getProducts() {
    this.productService.getProducts().subscribe((data: any) => {
      this.products.set(data.products);
    });
  }

 
}
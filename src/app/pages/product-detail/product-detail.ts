import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { signal } from '@angular/core';
import { CartService } from '../../services/cart-service';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule],
  selector: 'app-product-detail',
  styleUrl: './product-detail.css',
  templateUrl: './product-detail.html',
})
export class ProductDetail {
  product = signal<any | null>(null);
  selectedSizeId: number | null = null;
  quantity: number = 1;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService,
  ) {}

  ngOnInit() {
    const productId = Number(this.route.snapshot.paramMap.get('id'));

    this.getProductById(productId);
  }

  getProductById(id: number) {
    this.productService.getProductById(id).subscribe((data: any) => {
      console.log('Product data:', data);
      this.product.set(data);
    });
  }
}

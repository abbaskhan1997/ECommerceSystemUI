import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { signal } from '@angular/core';


@Component({
  imports: [],
  selector: 'app-product-detail',
  styleUrl: './product-detail.css',
  templateUrl: './product-detail.html',
})
export class ProductDetail {
  product = signal<any | null>(null);

  constructor(private productService: ProductService, private route: ActivatedRoute,) { }

  ngOnInit() { const productId = Number( this.route.snapshot.paramMap.get('id') );

    this.getProductById(productId);
  }

  getProductById(id: number) {
    this.productService.getProductById(id).subscribe((data: any) => {
      console.log('Product data:', data);
      this.product.set(data);
    });
  }
}

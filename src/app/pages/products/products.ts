import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';


@Component({
  imports: [RouterLink],
  selector: 'app-products',
  styleUrl: './products.css',
  templateUrl: './products.html',
})
export class Products implements OnInit {
  products = signal<any[]>([]);

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
  this.route.queryParams.subscribe(params => {
    const categoryId = params['categoryId']
      ? Number(params['categoryId'])
      : undefined;

    const schoolId = params['schoolId']
      ? Number(params['schoolId'])
      : undefined;

    const schoolClassId = params['schoolClassId']
      ? Number(params['schoolClassId'])
      : undefined;

    this.getProducts(categoryId, schoolId, schoolClassId);
  });
}

getProducts(
  categoryId?: number,
  schoolId?: number,
  schoolClassId?: number
): void {
  this.productService
    .getProducts(1, '', categoryId, schoolId, schoolClassId)
    .subscribe({
      next: (data: any) => {
        this.products.set(data.products);
      },
      error: (err) => {
        console.error('Error loading products:', err);
      }
    });
}

 
}
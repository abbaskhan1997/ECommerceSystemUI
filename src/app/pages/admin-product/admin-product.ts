import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { SchoolService } from '../../services/school.service';
import { CategoryService } from '../../services/category.service';

@Component({
  imports: [FormsModule],
  selector: 'app-admin-product',
  styleUrl: './admin-product.css',
  templateUrl: './admin-product.html',
})
export class AdminProduct {
  products = signal<any[]>([]);
  categories = signal<any[]>([]);
  schools = signal<any[]>([]);
classes = signal<any[]>([]);

  name = '';
description = '';
price = 0;
stockQuantity = 0;
categoryId = 0;
schoolId = 0;
schoolClassId = 0;

constructor(private productService: ProductService, private router: Router, private schoolService: SchoolService, private categoryService: CategoryService) { }

ngOnInit() {
  this.getProducts();
  this.getSchools();
  this.getClasses();
  this.getCategories();
}

addProduct() {
  const product = {
    name: this.name,
    description: this.description,
    price: this.price,
    stockQuantity: this.stockQuantity,
    categoryId: this.categoryId,
    schoolId: this.schoolId,
    schoolClassId: this.schoolClassId
  };

  this.productService.addProduct(product).subscribe(
    (response) => {
      console.log('Product added successfully:', response);
      // Reset form fields after successful submission
      this.name = '';
      this.description = '';
      this.price = 0;
      this.stockQuantity = 0;
      this.categoryId = 0;
      this.schoolId = 0;
      this.schoolClassId = 0;
    },
    (error) => {
      console.error('Error adding product:', error);
    }
  );
}

getProducts() { 
  this.productService.getProducts().subscribe((data: any) => { 
    console.log('Products:', data);
    this.products.set(data.products); }); }

getCategories() {
  this.categoryService.getCategories().subscribe((data: any) => {
    this.categories.set(data);
  });
}    

getSchools() {
  this.schoolService.getSchools().subscribe((data: any) => {
    this.schools.set(data);
  });
}

getClasses() {
  this.schoolService.getClasses().subscribe((data: any) => {
    this.classes.set(data);
  });
}

}

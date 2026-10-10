import { Component, signal, HostListener } from '@angular/core';
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
  showSuccessPopup = false;
  editingProductId: number | null = null;
  deleteProductId: number | null = null;
  showDeletePopup = false;
  showProductForm = false;

  // Search box mein user jo text likhega
    searchText = ''; 

  

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.showSuccessPopup) {
      this.closeSuccessPopup();
    }
  }

  name = '';
  description = '';
  price = 0;
  stockQuantity = 0;
  categoryId = 0;
  schoolId = 0;
  schoolClassId = 0;

  constructor(
    private productService: ProductService,
    private router: Router,
    private schoolService: SchoolService,
    private categoryService: CategoryService,
  ) {}

  ngOnInit() {
    this.getProducts();
    this.getSchools();
    this.getClasses();
    this.getCategories();
  }

  resetForm() {
    this.name = '';
    this.description = '';
    this.price = 0;
    this.stockQuantity = 0;
    this.categoryId = 0;
    this.schoolId = 0;
    this.schoolClassId = 0;
  }

  // Search products by filter

get filteredProducts() {
  const searchWords = this.searchText
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 0);

  if (searchWords.length === 0) {
    return this.products();
  }

  return this.products().filter((product: any) => {
    const name = product.name?.toLowerCase() || '';
    const school = product.school?.name?.toLowerCase() || '';
    const schoolClass = product.schoolClass?.name?.toLowerCase() || '';

    const searchableText = `${name} ${school} ${schoolClass}`;

    // Har word ka match milna zaroori hai
    return searchWords.every(word => searchableText.includes(word));
  });
}



  closeSuccessPopup() {
    this.showSuccessPopup = false;
  }

  openAddProduct() {
  this.editingProductId = null;
  this.resetForm();
  this.showProductForm = true;
}

closeProductForm() {
  this.showProductForm = false;
  this.editingProductId = null;
  this.resetForm();
}

  addProduct() {
    const product = {
      name: this.name,
      description: this.description,
      price: this.price,
      stockQuantity: this.stockQuantity,
      categoryId: this.categoryId,
      schoolId: this.schoolId,
      schoolClassId: this.schoolClassId,
    };

    this.productService.addProduct(product).subscribe(
      (response) => {
        this.showSuccessPopup = true;

        this.getProducts();
        this.resetForm();
      },
      (error) => {
        console.error('Error adding product:', error);
      },
    );
  }

  getProducts() {
    this.productService.getProducts().subscribe((data: any) => {
      this.products.set(data.products);
    });
  }

  editProduct(product: any) {
  this.editingProductId = product.id;
  this.name = product.name;
  this.description = product.description;
  this.price = product.price;
  this.stockQuantity = product.stockQuantity;
  this.categoryId = product.categoryId;
  this.schoolId = product.schoolId;
  this.schoolClassId = product.schoolClassId;

  this.showProductForm = true;
}

  updateProduct() {
    console.log('Update button clicked');
    console.log('Editing ID:', this.editingProductId);

    if (this.editingProductId !== null) {
      const updatedProduct = {
        id: this.editingProductId,
        name: this.name,
        description: this.description,
        price: this.price,
        stockQuantity: this.stockQuantity,
        categoryId: this.categoryId,
        schoolId: this.schoolId,
        schoolClassId: this.schoolClassId,
      };

      this.productService
        .updateProduct(this.editingProductId, updatedProduct)
        .subscribe((response) => {
          this.showSuccessPopup = true;
          this.getProducts();
          this.resetForm();
          this.editingProductId = null;
        });
    }
  }

  deleteProduct(productId: number) {
    this.productService.deleteProduct(productId).subscribe((response) => {
    
      this.getProducts();
      this.showSuccessPopup = true;
      
    });
  }

  cancelEdit() {
    this.resetForm();
    this.editingProductId = null;
  }


  confirmDeleteNo() {
  this.deleteProductId = null;
  this.showDeletePopup = false;
}

confirmDeleteYes() {

  if (this.deleteProductId === null) {
    return;
  }

  this.productService.deleteProduct(this.deleteProductId).subscribe({

    next: () => {

      this.getProducts();

      this.showDeletePopup = false;
      this.deleteProductId = null;

      this.showSuccessPopup = true;
    },

    error: (error) => {
      console.error('Error deleting product:', error);
    }

  });
}

confirmDelete(productId: number) {
  this.deleteProductId = productId;
  this.showDeletePopup = true;
} 

  navigateToAdminDashboard() {
    this.router.navigate(['/admin-dashboard']);
  }

  navigateToAdminProduct() {
    this.router.navigate(['/admin-product']);
  }

  navigateToAdminCategory() {
    this.router.navigate(['/admin-category']);
  }

  navigateToAdminSchool() {
    this.router.navigate(['/admin-school']);
  }

  navigateToAdminClass() {
    this.router.navigate(['/admin-class']);
  }

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

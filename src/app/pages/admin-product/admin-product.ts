import { Component, signal, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { SchoolService } from '../../services/school.service';
import { CategoryService } from '../../services/category.service';
import { ProductSizeService } from '../../services/product-size.service';
import { PopupService } from '../../services/popup-service';
import { CommonPopup } from '../../pages/common-popup/common-popup';
import { forkJoin } from 'rxjs';

@Component({
  imports: [FormsModule, CommonPopup],
  selector: 'app-admin-product',
  styleUrl: './admin-product.css',
  templateUrl: './admin-product.html',
})
export class AdminProduct {
  products = signal<any[]>([]);
  categories = signal<any[]>([]);
  schools = signal<any[]>([]);
  classes = signal<any[]>([]);
  productSizes = signal<any[]>([]);
  showSuccessPopup = false;
  editingProductId: number | null = null;
  deleteProductId: number | null = null;
  existingImageUrl: string | null = null;
  showDeletePopup = false;
  showProductForm = false;
  isSaving = false;

  searchText = '';

  // pagination
  currentPage = 1;
  pageSize = 10;

  // for image
  selectedImage: File | null = null;
  imagePreview: string | null = null;

  // for size and size quantity
  newSize = '';
  newSizeStock = 0;

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
    private productSizeService: ProductSizeService,
    private popupService:  PopupService,
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

    // Clear image selection and preview
    this.selectedImage = null;
    this.imagePreview = null;
    this.existingImageUrl = null;

    // Reset product sizes
    this.productSizes.set([]);
    this.newSize = '';
    this.newSizeStock = 0;
  }

  // validation method
  validateProductForm(): boolean {

  if (!this.name.trim()) {
    this.popupService.show('Please enter product name.', 'error');
    return false;
  }

  if (!this.description.trim()) {
    this.popupService.show('Please enter product description.', 'error');
    return false;
  }

  if (this.price <= 0 || !Number.isFinite(this.price)) {
    this.popupService.show('Please enter a valid product price.', 'error');
    return false;
  }

  if (this.stockQuantity < 0 || !Number.isFinite(this.stockQuantity)) {
    this.popupService.show('Please enter a valid stock quantity.', 'error');
    return false;
  }

  if (this.categoryId <= 0) {
    this.popupService.show('Please select a category.', 'error');
    return false;
  }

  if (this.schoolId <= 0) {
    this.popupService.show('Please select a school.', 'error');
    return false;
  }

  if (this.schoolClassId <= 0) {
    this.popupService.show('Please select a class.', 'error');
    return false;
  }

  // New products must have an image.
  // Existing products can keep their current image.
  if (!this.selectedImage && !this.existingImageUrl) {
    this.popupService.show('Please select a product image.', 'error');
    return false;
  }

  return true;
}

  // Search products by filter

  get filteredProducts() {
    return this.products();
  }

  onSearchChange() {
    this.currentPage = 1;
    this.getProducts();
  }

  totalProducts = 0;

  get totalPages() {
    return Math.ceil(this.totalProducts / this.pageSize);
  }

  // Show current page products
  get paginatedProducts() {
    return this.filteredProducts;
  }

  // next page show

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getProducts();
    }
  }

  // previous page show
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getProducts();
    }
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

  if (this.isSaving) {
    return;
  }

  if (!this.validateProductForm()) {
    return;
  }

  this.isSaving = true;

  if (this.selectedImage) {
    this.productService.uploadProductImage(this.selectedImage).subscribe({
      next: (response) => {
        this.saveProduct(response.imageUrl);
      },
      error: (error) => {
        console.error('Image upload failed:', error);
        this.isSaving = false;
        this.popupService.show('Image upload failed.', 'error');
      },
    });
  } else {
    this.saveProduct(null);
  }
}

 saveProduct(imageUrl: string | null) {
  const product = {
    name: this.name,
    description: this.description,
    price: this.price,
    stockQuantity: this.stockQuantity,
    categoryId: this.categoryId,
    schoolId: this.schoolId,
    schoolClassId: this.schoolClassId,
    imageUrl: imageUrl,
  };

  this.productService.addProduct(product).subscribe({
    next: (response: any) => {

      // Save sizes only if admin added any sizes
      if (this.productSizes().length > 0) {
        const sizeRequests = this.productSizes().map(size => {
          const productSize = {
            id: 0,
            productId: response.id,
            size: size.size,
            stockQuantity: size.stockQuantity
          };

          return this.productSizeService.addProductSize(productSize);
        });

        // Wait until all sizes are saved
       forkJoin(sizeRequests).subscribe({
  next: () => this.finishProductSave(),
  error: (error) => {
    console.error('Error saving product sizes:', error);
    this.isSaving = false;
  }
});

      } else {
        // No sizes added, save product only
        this.finishProductSave();
      }
    },
    error: (error) => {
      console.error('Error adding product:', error);
      this.isSaving = false;
    },
  });
}

finishProductSave() {
  this.popupService.show(
    'Product added successfully!',
    'success'
  );

  this.getProducts();
  this.resetForm();
  this.showProductForm = false;
  this.isSaving = false;
}

  getProductSizes(productId: number) {
    this.productSizeService.getProductSizes(productId).subscribe({
      next: (data: any) => {
        this.productSizes.set(data);
      },
      error: (error) => {
        console.error('Error loading product sizes:', error);
      },
    });
  }

addProductSize() {
  if (!this.newSize.trim()) {
    return;
  }

  this.productSizes.update(sizes => [
    ...sizes,
    {
      id: 0,
      size: this.newSize,
      stockQuantity: this.newSizeStock
    }
  ]);

  this.newSize = '';
  this.newSizeStock = 0;

  // Show popup
  this.popupService.show(
    
    'Product size added successfully!',
    'success'
  );
}

  updateProductSize(productSize: any) {
    const updatedSize = {
      id: productSize.id,
      productId: productSize.productId,
      size: productSize.size,
      stockQuantity: productSize.stockQuantity,
    };

    this.productSizeService.updateProductSize(productSize.id, updatedSize).subscribe({
      next: () => {
        this.getProductSizes(productSize.productId);
      },
      error: (error) => {
        console.error('Error updating product size:', error);
      },
    });
  }

  deleteProductSize(id: number) {
    this.productSizeService.deleteProductSize(id).subscribe({
      next: () => {
        if (this.editingProductId !== null) {
          this.getProductSizes(this.editingProductId);
        }
      },
      error: (error) => {
        console.error('Error deleting product size:', error);
      },
    });
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedImage = input.files[0];

      this.imagePreview = URL.createObjectURL(this.selectedImage);
    }
  }

  getProducts() {
    this.productService.getProducts(this.currentPage, this.searchText).subscribe((data: any) => {
      this.products.set(data.products);
      this.totalProducts = data.totalProducts;
    });
  }

  editProduct(product: any) {
    this.editingProductId = product.id;
    this.getProductSizes(product.id);
    this.name = product.name;
    this.description = product.description;
    this.existingImageUrl = product.imageUrl;
    this.price = product.price;
    this.stockQuantity = product.stockQuantity;
    this.categoryId = product.categoryId;
    this.schoolId = product.schoolId;
    this.schoolClassId = product.schoolClassId;

    // Show existing product image
    this.imagePreview = product.imageUrl ? `https://localhost:7223${product.imageUrl}` : null;

    // No new image selected yet
    this.selectedImage = null;

    this.showProductForm = true;
  }

  updateProduct() {

  if (this.editingProductId === null) {
    return;
  }

  if (!this.validateProductForm()) {
    return;
  }

  if (this.selectedImage) {
    this.productService.uploadProductImage(this.selectedImage).subscribe({
      next: (response) => {
        this.saveUpdatedProduct(response.imageUrl);
      },
      error: (error) => {
        console.error('Image upload failed:', error);
        this.popupService.show('Image upload failed.', 'error');
      },
    });
  } else {
    this.saveUpdatedProduct(this.existingImageUrl);
  }
}

 saveUpdatedProduct(imageUrl: string | null) {
  const updatedProduct = {
    id: this.editingProductId,
    name: this.name,
    description: this.description,
    price: this.price,
    stockQuantity: this.stockQuantity,
    categoryId: this.categoryId,
    schoolId: this.schoolId,
    schoolClassId: this.schoolClassId,
    imageUrl: imageUrl,
  };

  this.productService.updateProduct(this.editingProductId!, updatedProduct).subscribe({
    next: () => {

      // Find only newly added sizes
      const newSizes = this.productSizes().filter(size => size.id === 0);

      // Save new sizes in database
      if (newSizes.length > 0) {

        const sizeRequests = newSizes.map(size => {
          const productSize = {
            productId: this.editingProductId,
            size: size.size,
            stockQuantity: size.stockQuantity
          };

          return this.productSizeService.addProductSize(productSize);
        });

        forkJoin(sizeRequests).subscribe({
          next: () => this.finishProductUpdate(),
          error: (error) => {
            console.error('Error adding new product sizes:', error);
          }
        });

      } else {
        // No new sizes, finish product update
        this.finishProductUpdate();
      }
    },

    error: (error) => {
      console.error('Error updating product:', error);
    },
  });
}

finishProductUpdate() {
  this.popupService.show(
    'Product updated successfully!',
    'success'
  );

  this.getProducts();
  this.resetForm();
  this.showProductForm = false;
  this.editingProductId = null;
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
      },
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

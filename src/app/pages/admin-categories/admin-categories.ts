import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CategoryService } from '../../services/category.service';
import { PopupService } from '../../services/popup-service';

@Component({
  selector: 'app-admin-categories',
  imports: [FormsModule],
  templateUrl: './admin-categories.html',
  styleUrl: './admin-categories.css',
})
export class AdminCategories implements OnInit {
  // Categories received from the backend API
  categories = signal<any[]>([]);

  // Add/Edit category modal
  showCategoryModal = false;
  selectedCategory: any = null;
  categoryName = '';

  // Search
  searchText = '';

  // Pagination
  currentPage = 1;
  pageSize = 10;

  // Delete confirmation popup
  showDeletePopup = false;
  selectedCategoryId: number | null = null;

  // Dependency Injection (DI)
  constructor(
    private categoryService: CategoryService,
    private popupService: PopupService,
  ) {}

  ngOnInit(): void {
    this.getCategories();
  }

  // Load categories from the backend API
  getCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data: any[]) => {
        this.categories.set(data);
      },
      error: (error: any) => {
        console.error('Failed to load categories:', error);

        this.popupService.show('Unable to load categories. Please try again.', 'error');
      },
    });
  }

  // Filter categories by name
  filteredCategories(): any[] {
    const search = this.searchText.toLowerCase().trim();

    return this.categories().filter((category) =>
      (category.name ?? '').toLowerCase().includes(search),
    );
  }

  // Get categories for the current page
  paginatedCategories(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;

    return this.filteredCategories().slice(startIndex, startIndex + this.pageSize);
  }

  // Calculate total pages
  totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredCategories().length / this.pageSize));
  }

  // Change the current page
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage = page;
    }
  }

  // Open the Add Category modal
  openAddModal(): void {
    this.selectedCategory = null;
    this.categoryName = '';
    this.showCategoryModal = true;
  }

  // Open the Edit Category modal
  editCategory(category: any): void {
    this.selectedCategory = category;
    this.categoryName = category.name ?? '';
    this.showCategoryModal = true;
  }

  // Close the Add/Edit modal
  closeModal(): void {
    this.showCategoryModal = false;
    this.selectedCategory = null;
    this.categoryName = '';
  }

  // Add a new category or update an existing category
  saveCategory(): void {
    if (!this.categoryName.trim()) {
      this.popupService.show('Category name is required.', 'error');
      return;
    }

    // Store the action before closing the modal
    const isEditing = this.selectedCategory !== null;
    const categoryId = this.selectedCategory?.id;

    const category = {
      name: this.categoryName.trim(),
    };

    const request = isEditing
      ? this.categoryService.updateCategory(categoryId, {
          id: categoryId,
          ...category,
        })
      : this.categoryService.addCategory(category);

    request.subscribe({
      next: (response: any) => {
        this.closeModal();

        this.popupService.show(
          response?.message ||
            (isEditing ? 'Category updated successfully.' : 'Category added successfully.'),
          'success',
        );

        this.getCategories();
      },
      error: (error: any) => {
        console.error('Failed to save category:', error);

        this.popupService.show(
          error.error?.message || 'Unable to save the category. Please try again.',
          'error',
        );
      },
    });
  }

  // Open the delete confirmation popup
  confirmDelete(id: number): void {
    this.selectedCategoryId = id;
    this.showDeletePopup = true;
  }

  // Delete the category after confirmation
  confirmDeleteYes(): void {
    if (this.selectedCategoryId === null) {
      return;
    }

    const categoryId = this.selectedCategoryId;

    this.categoryService.deleteCategory(categoryId).subscribe({
      next: (response: any) => {
        this.showDeletePopup = false;
        this.selectedCategoryId = null;

        this.popupService.show(response?.message || 'Category deleted successfully.', 'success');

        this.getCategories();
      },
      error: (error: any) => {
        console.error('Category deletion failed:', error);

        this.showDeletePopup = false;
        this.selectedCategoryId = null;

        this.popupService.show(
          error.error?.message || 'Unable to delete the category. Please try again.',
          'error',
        );
      },
    });
  }

  // Cancel category deletion
  confirmDeleteNo(): void {
    this.showDeletePopup = false;
    this.selectedCategoryId = null;
  }
}

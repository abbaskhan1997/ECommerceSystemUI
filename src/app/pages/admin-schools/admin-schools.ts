import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SchoolService } from '../../services/school.service';
import { PopupService } from '../../services/popup-service';

@Component({
  selector: 'app-admin-schools',
  imports: [FormsModule],
  templateUrl: './admin-schools.html',
  styleUrl: './admin-schools.css',
})
export class AdminSchools implements OnInit {

  schools = signal<any[]>([]);

  schoolName = '';
  selectedSchool: any = null;

  showSchoolModal = false;
  showDeletePopup = signal(false);
  deletingSchoolId = signal<number | null>(null);

  

  searchText = '';
  currentPage = 1;
  pageSize = 10;

  constructor(
    private schoolService: SchoolService,
    private popupService: PopupService
  ) {}

  ngOnInit(): void {
    this.getSchools();
  }

  // Load schools from the backend
  getSchools(): void {
    this.schoolService.getSchools().subscribe({
      next: (data: any[]) => {
        this.schools.set(data);
        this.currentPage = Math.min(this.currentPage, this.totalPages());
      },
      error: (error: any) => {
        console.error('Failed to load schools:', error);
        this.popupService.show('Failed to load schools.', 'error');
      }
    });
  }

  // Filter schools by name or ID
  filteredSchools(): any[] {
    const search = this.searchText.trim().toLowerCase();

    return this.schools().filter((school: any) =>
      String(school.id).includes(search) ||
      String(school.name ?? '').toLowerCase().includes(search)
    );
  }

  // Get schools for the current page
  paginatedSchools(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;

    return this.filteredSchools().slice(
      start,
      start + this.pageSize
    );
  }

  // Calculate total pages
  totalPages(): number {
    return Math.max(
      1,
      Math.ceil(this.filteredSchools().length / this.pageSize)
    );
  }

  // Change page
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage = page;
    }
  }

  // Open the Add School modal
  openAddModal(): void {
    this.selectedSchool = null;
    this.schoolName = '';
    this.showSchoolModal = true;
  }

  // Open the Edit School modal
  editSchool(school: any): void {
    this.selectedSchool = school;
    this.schoolName = school.name;
    this.showSchoolModal = true;
  }

  // Close Add/Edit modal
  closeModal(): void {
    this.showSchoolModal = false;
    this.selectedSchool = null;
    this.schoolName = '';
  }

  // Add or update a school
  saveSchool(): void {
    const name = this.schoolName.trim();

    if (!name) {
      this.popupService.show('Please enter the school name.', 'error');
      return;
    }

    const school = {
      id: this.selectedSchool?.id,
      name: name
    };

    if (this.selectedSchool) {
      this.schoolService.updateSchool(school.id, school).subscribe({
        next: () => {
          this.closeModal();
          this.getSchools();
          this.popupService.show('School updated successfully.', 'success');
        },
        error: (error: any) => {
          console.error('Failed to update school:', error);
          this.popupService.show('Failed to update school.', 'error');
        }
      });
    } else {
      this.schoolService.addSchool({ name }).subscribe({
        next: () => {
          this.closeModal();
          this.currentPage = 1;
          this.getSchools();
          this.popupService.show('School added successfully.', 'success');
        },
        error: (error: any) => {
          console.error('Failed to add school:', error);
          this.popupService.show('Failed to add school.', 'error');
        }
      });
    }
  }

  // Open delete confirmation
  confirmDelete(id: number): void {
    this.deletingSchoolId.set(id);
    this.showDeletePopup.set(true);
  }

  // Cancel deletion
  confirmDeleteNo(): void {
    this.showDeletePopup.set(false);
    this.deletingSchoolId.set(null);
  }

  confirmDeleteYes(): void {
    const id = this.deletingSchoolId();
    if (id === null) {
      return;
    }

    this.schoolService.deleteSchool(id).subscribe({
      next: () => {
        this.showDeletePopup.set(false);
        this.deletingSchoolId.set(null);

        this.getSchools();

      this.popupService.show('School deleted successfully.', 'success');
      },
      error: (error: any) => {
        console.error('Failed to delete school:', error);

        this.showDeletePopup.set(false);
        this.deletingSchoolId.set(null);

        const detail =
          typeof error.error === 'string'
            ? error.error
            : error.error?.detail ?? error.error?.message ?? error.error?.title;
        const status = error.status ? ` (HTTP ${error.status})` : '';

        this.popupService.show(
          detail
            ? `Failed to delete school${status}: ${detail}`
            : `Failed to delete school${status}. Check the API response for details.`,
          'error'
        );
      }
    });
  }

}
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SchoolService } from '../../services/school.service';
import { SchoolClassService } from '../../services/school-class-service';
import { PopupService } from '../../services/popup-service';

@Component({
  selector: 'app-admin-classes',
  imports: [FormsModule],
  templateUrl: './admin-classes.html',
  styleUrl: './admin-classes.css',
})
export class AdminClasses implements OnInit {

  classes = signal<any[]>([]);
  schools = signal<any[]>([]);

  className = '';
  schoolId = 0;
  selectedClass: any = null;

  showClassModal = false;
  showDeletePopup = signal(false);
  deletingClassId = signal<number | null>(null);

  searchText = '';
  currentPage = 1;
  pageSize = 10;

  constructor(
    private schoolClassService: SchoolClassService,
    private schoolService: SchoolService,
    private popupService: PopupService
  ) {}

  ngOnInit(): void {
    this.getClasses();
    this.getSchools();
  }

  getClasses(): void {
    this.schoolClassService.getClasses().subscribe({
      next: (data: any[]) => {
        this.classes.set(data);
        this.currentPage = Math.min(this.currentPage, this.totalPages());
      },
      error: (error: any) => {
        console.error('Failed to load classes:', error);
        this.popupService.show('Failed to load classes.', 'error');
      }
    });
  }

  getSchools(): void {
    this.schoolService.getSchools().subscribe({
      next: (data: any[]) => {
        this.schools.set(data);
      },
      error: (error: any) => {
        console.error('Failed to load schools:', error);
        this.popupService.show('Failed to load schools.', 'error');
      }
    });
  }

  filteredClasses(): any[] {
    const search = this.searchText.trim().toLowerCase();

    return this.classes().filter((schoolClass: any) =>
      String(schoolClass.id).includes(search) ||
      String(schoolClass.name ?? '').toLowerCase().includes(search) ||
      String(this.getSchoolName(schoolClass.schoolId)).toLowerCase().includes(search)
    );
  }

  paginatedClasses(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;

    return this.filteredClasses().slice(start, start + this.pageSize);
  }

  totalPages(): number {
    return Math.max(
      1,
      Math.ceil(this.filteredClasses().length / this.pageSize)
    );
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage = page;
    }
  }

  getSchoolName(schoolId: number): string {
    const school = this.schools().find(
      (item: any) => item.id === schoolId
    );

    return school?.name ?? 'Unknown School';
  }

  openAddModal(): void {
    this.selectedClass = null;
    this.className = '';
    this.schoolId = 0;
    this.showClassModal = true;
  }

  editClass(schoolClass: any): void {
    this.selectedClass = schoolClass;
    this.className = schoolClass.name;
    this.schoolId = schoolClass.schoolId;
    this.showClassModal = true;
  }

  closeModal(): void {
    this.showClassModal = false;
    this.selectedClass = null;
    this.className = '';
    this.schoolId = 0;
  }

  saveClass(): void {
    const name = this.className.trim();

    if (!name) {
      this.popupService.show('Please enter the class name.', 'error');
      return;
    }

    if (!this.schoolId) {
      this.popupService.show('Please select a school.', 'error');
      return;
    }

    const schoolClass = {
      id: this.selectedClass?.id,
      name,
      schoolId: Number(this.schoolId)
    };

    if (this.selectedClass) {
      this.schoolClassService.updateClass(
        this.selectedClass.id,
        schoolClass
      ).subscribe({
        next: () => {
          this.closeModal();
          this.getClasses();
          this.popupService.show('Class updated successfully.', 'success');
        },
        error: (error: any) => {
          console.error('Failed to update class:', error);
          this.popupService.show('Failed to update class.', 'error');
        }
      });
    } else {
      this.schoolClassService.addClass(schoolClass).subscribe({
        next: () => {
          this.closeModal();
          this.currentPage = 1;
          this.getClasses();
          this.popupService.show('Class added successfully.', 'success');
        },
        error: (error: any) => {
          console.error('Failed to add class:', error);
          this.popupService.show('Failed to add class.', 'error');
        }
      });
    }
  }

  confirmDelete(id: number): void {
    this.deletingClassId.set(id);
    this.showDeletePopup.set(true);
  }

  confirmDeleteNo(): void {
    this.showDeletePopup.set(false);
    this.deletingClassId.set(null);
  }

  confirmDeleteYes(): void {
    const id = this.deletingClassId();

    if (id === null) {
      return;
    }

    this.schoolClassService.deleteClass(id).subscribe({
      next: () => {
        this.confirmDeleteNo();
        this.getClasses();
        this.popupService.show('Class deleted successfully.', 'success');
      },
      error: (error: any) => {
        console.error('Failed to delete class:', error);
        this.confirmDeleteNo();
        this.popupService.show('Failed to delete class.', 'error');
      }
    });
  }
}

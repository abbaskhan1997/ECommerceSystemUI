import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AdminSchools } from './admin-schools';
import { SchoolService } from '../../services/school.service';
import { PopupService } from '../../services/popup-service';

describe('AdminSchools', () => {
  let component: AdminSchools;
  let fixture: ComponentFixture<AdminSchools>;
  let schoolService: { getSchools: ReturnType<typeof vi.fn>; deleteSchool: ReturnType<typeof vi.fn> };
  let popupService: { show: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    schoolService = {
      getSchools: vi.fn(() => of([])),
      deleteSchool: vi.fn(() => of(undefined))
    };
    popupService = { show: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [AdminSchools],
      providers: [
        { provide: SchoolService, useValue: schoolService },
        { provide: PopupService, useValue: popupService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminSchools);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('closes the delete confirmation and shows success after deletion', () => {
    component.confirmDelete(12);

    component.confirmDeleteYes();

    expect(schoolService.deleteSchool).toHaveBeenCalledWith(12);
    expect(component.showDeletePopup()).toBe(false);
    expect(component.deletingSchoolId()).toBeNull();
    expect(popupService.show).toHaveBeenCalledWith(
      'School deleted successfully.',
      'success'
    );
  });
});

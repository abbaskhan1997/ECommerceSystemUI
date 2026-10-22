import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminSchools } from './admin-schools';

describe('AdminSchools', () => {
  let component: AdminSchools;
  let fixture: ComponentFixture<AdminSchools>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSchools],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminSchools);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

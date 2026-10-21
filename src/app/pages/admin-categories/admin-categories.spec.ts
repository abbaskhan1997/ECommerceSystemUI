import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AdminCategories } from './admin-categories';
import { CategoryService } from '../../services/category.service';

describe('AdminCategories', () => {
  let component: AdminCategories;
  let fixture: ComponentFixture<AdminCategories>;
  let categoryService: any;

  beforeEach(async () => {
    categoryService = {
      getCategories: vi.fn(() => of([])),
      addCategory: vi.fn(() => of({})),
      updateCategory: vi.fn(() => of({})),
      deleteCategory: vi.fn(() => of({}))
    };

    await TestBed.configureTestingModule({
      imports: [AdminCategories],
      providers: [{ provide: CategoryService, useValue: categoryService }]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminCategories);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('adds a category without school-specific fields', () => {
    component.categoryName = 'Books';
    component.categoryDescription = 'Reading materials';

    component.saveCategory();

    expect(categoryService.addCategory).toHaveBeenCalledWith({
      name: 'Books',
      description: 'Reading materials'
    });
  });
});

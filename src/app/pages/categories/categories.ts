import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';


@Component({
  selector: 'app-categories',
  imports: [],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories implements OnInit {

  categories = signal<any[]>([]);
  isLoading = signal(true);

  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const schoolClassId = Number(params['schoolClassId']);

      this.categoryService.getCategories(schoolClassId).subscribe({
        next: (data) => {
          this.categories.set(data);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error loading categories:', err);
          this.isLoading.set(false);
        }
      });
    });
  }

  openCategory(category: any): void {
  this.router.navigate(['/products'], {
    queryParams: {
      categoryId: category.id,
      schoolId: this.route.snapshot.queryParams['schoolId'],
      schoolClassId: this.route.snapshot.queryParams['schoolClassId']
    }
  });
}

}
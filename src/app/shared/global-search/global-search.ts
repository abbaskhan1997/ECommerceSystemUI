import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SearchService } from '../../services/search-service';
import { Subject, of, timer } from 'rxjs';
import { distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-global-search',
  imports: [FormsModule],
  templateUrl: './global-search.html',
  styleUrl: './global-search.css',
})
export class GlobalSearch {
  private router = inject(Router);
  private searchService = inject(SearchService);
  private destroyRef = inject(DestroyRef);

  searchText = '';
  searchResults = signal<any>(null);
  showSuggestions = signal(false);
  isLoading = signal(false);
  errorMessage = signal('');

  private searchSubject = new Subject<string>();

  ngOnInit(): void {
    this.searchSubject
      .pipe(
        distinctUntilChanged(),
        switchMap((search) => {
          this.errorMessage.set('');
          this.searchResults.set(null);
          this.showSuggestions.set(search.length >= 2);
          this.isLoading.set(search.length >= 2);

          if (search.length < 2) {
            return of(null);
          }

          return timer(400).pipe(
            switchMap(() => this.searchService.globalSearch(search)),
            catchError(() => {
              this.errorMessage.set('Failed to load search results.');
              return of(null);
            }),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((response) => {
        this.searchResults.set(response);
        this.isLoading.set(false);
      });
  }

  // Search while customer is typing
  onSearchChange(value: string): void {
    this.searchSubject.next(value.trim());
  }

  // Navigate to the complete search results page
  onSearch(): void {
    const search = this.searchText.trim();

    if (!search) {
      return;
    }

    this.closeSuggestions();

    this.router.navigate(['/search-results'], {
      queryParams: { search },
    });
  }

  // Close search suggestions
  closeSuggestions(): void {
    this.showSuggestions.set(false);
    this.isLoading.set(false);
    this.searchSubject.next('');
  }

  // Navigate to school classes
  openSchool(school: any): void {
    this.closeSuggestions();

    this.router.navigate(['/classes'], {
      queryParams: {
        schoolId: school.id,
      },
    });
  }

  // Navigate to class categories
  openClass(schoolClass: any): void {
    this.closeSuggestions();

    this.router.navigate(['/categories'], {
      queryParams: {
        schoolId: schoolClass.schoolId,
        schoolClassId: schoolClass.id,
      },
    });
  }

  // Navigate to category products
  openCategory(category: any): void {
    this.closeSuggestions();

    this.router.navigate(['/products'], {
      queryParams: {
        categoryId: category.id,
        schoolId: category.schoolId,
        schoolClassId: category.schoolClassId,
      },
    });
  }

  // Navigate to product details
  openProduct(product: any): void {
    this.closeSuggestions();

    this.router.navigate(['/products', product.id]);
  }
}

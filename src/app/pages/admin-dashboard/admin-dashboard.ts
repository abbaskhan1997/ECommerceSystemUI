import { Component, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { UserService } from '../../services/user-service';
import { CategoryService } from '../../services/category.service';
import { SchoolService } from '../../services/school.service';
import { SchoolClassService } from '../../services/school-class-service';
@Component({
  imports: [RouterLink],
  selector: 'app-admin-dashboard',
  styleUrl: './admin-dashboard.css',
  templateUrl: './admin-dashboard.html',
})
export class AdminDashboard {
  showLogoutPopup = false;
  showLogoutSuccessPopup = false;
  logoutMessage = '';
  userCount = signal(0);
  categoryCount = signal(0);
  schoolCount = signal(0);
  totalClasses = signal(0);

  constructor(
    private authService: AuthService,
    private router: Router,
    private productService: ProductService,
    private userService: UserService,
    private categoryService: CategoryService,
    private schoolService: SchoolService,
    private schoolclassservice: SchoolClassService,
  ) {}

  ngOnInit() {
    this.schoolService.getClasses().subscribe({
      next: (data: any) => {
        const classes = Array.isArray(data) ? data : [];
        this.totalClasses.set(classes.length);
      },
      error: (error: any) => {
        console.error('Failed to load classes count:', error);
      },
    });

    this.productService.refreshProductCount();
    this.userService.getUsers().subscribe({
      next: (data: any) => {
        this.userCount.set(data.length);
      },
      error: (error) => {
        console.log('Users load nahi hue:', error);
      },
    });

    this.categoryService.getCategories().subscribe({
      next: (data: any[]) => {
        this.categoryCount.set(data.length);
      },
      error: (error) => {
        console.log('Categories load nahi hui:', error);
      },
    });

    this.schoolService.getSchools().subscribe({
      next: (data: any[]) => {
        this.schoolCount.set(data.length);
      },
      error: (error) => {
        console.error('Failed to load school count:', error);
      },
    });
  }

  confirmLogout() {
    this.showLogoutPopup = true;
  }

  cancelLogout() {
    this.showLogoutPopup = false;
  }

  logout() {
    this.authService.logout();

    this.showLogoutPopup = false;

    this.router.navigate(['/login'], {
      state: { logoutSuccess: true },
    });
  }
}

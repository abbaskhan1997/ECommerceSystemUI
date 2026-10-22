import { Component, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { UserService } from '../../services/user-service';
import { CategoryService } from '../../services/category.service';

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

  constructor(
    private authService: AuthService,
    private router: Router,
    private productService: ProductService,
    private userService: UserService,
    private categoryService: CategoryService,
  ) {}

  ngOnInit() {
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

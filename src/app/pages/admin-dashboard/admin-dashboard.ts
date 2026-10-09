import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

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

  constructor(private authService: AuthService, private router: Router) { }

  

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
    state: { logoutSuccess: true }
  });
}
}

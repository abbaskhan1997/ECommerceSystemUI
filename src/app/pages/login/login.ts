import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { PopupService } from '../../services/popup-service';
import { RouterLink, Router } from '@angular/router';
import { timer } from 'rxjs';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  email = '';
  password = '';
  loginRole: string | null = null;

  constructor(
    private authService: AuthService,
    private popupService: PopupService,
    private router: Router,
  ) {}

  closeMessagePopup(): void {
    this.popupService.close();

    if (this.loginRole === 'Admin') {
      this.router.navigate(['/admin-dashboard']);
    } else if (this.loginRole === 'User') {
      this.router.navigate(['/']);
    }
  }

  login(): void {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        // Save the authentication token
        localStorage.setItem('token', response.token);
        this.authService.refreshLoginStatus();

        // Retrieve the user's role
        this.loginRole = this.authService.getRole();

        // Display the login success message
        this.popupService.show(
          'Login Successful\nWelcome back!',
          'success'
        );

        timer(1000).subscribe(() => {
          this.closeMessagePopup();
        });
      },

      error: () => {
        this.loginRole = null;

        // Display the login error message
        this.popupService.show(
          'Login Failed\nInvalid email or password',
          'error'
        );
      },
    });
  }
}
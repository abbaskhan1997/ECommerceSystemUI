import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  email = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  login() {

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {

        localStorage.setItem('token', response.token);

        const role = this.authService.getRole();

        if (role === 'Admin') {
          this.router.navigate(['/admin-dashboard']);
          alert('Login successful! Welcome, Admin.');
        } else {
          this.router.navigate(['/']);
        }
      },

      error: (error) => {
        console.log(error);
        alert('Invalid email or password');
      }
    });
  }
}


// vkbe pjog bqdw exhc
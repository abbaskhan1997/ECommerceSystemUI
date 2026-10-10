import { Component, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { timer } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register {
  showMessagePopup = signal(false);
  messageTitle = signal('');
  messageText = signal('');

  name = '';
  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.authService.register(this.name, this.email, this.password).subscribe({
      next: (response) => {
        

        this.messageTitle.set('Registration Successful');
        this.messageText.set('Your account has been created successfully.');
        this.showMessagePopup.set(true);

        timer(1000).subscribe(() => {
          this.showMessagePopup.set(false);

          this.router.navigate(['/login'], {
            state: { registrationSuccess: true },
          });
        });
      },

      error: (error) => {
  

        this.messageTitle.set('Registration Failed');
        this.messageText.set(
          error.error?.message || 'Unable to create your account. Please try again.',
        );
        this.showMessagePopup.set(true);

        // 1 second baad error popup bhi close hoga
        timer(1000).subscribe(() => {
          this.showMessagePopup.set(false);
        });
      },
    });
  }
}

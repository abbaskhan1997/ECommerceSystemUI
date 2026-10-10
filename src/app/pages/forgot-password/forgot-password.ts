import { Component,signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
// import { Router } from '@angular/router';
import { timer } from 'rxjs';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-forgot-password',
  styleUrl: './forgot-password.css',
  templateUrl: './forgot-password.html',
})
export class ForgotPassword {
   showMessagePopup = signal(false);
  messageTitle = signal('');
  messageText = signal('');

  email = '';

  constructor(private authService: AuthService) {}

  forgotPassword() {
    this.authService.forgotPassword(this.email).subscribe({
      next: (response) => {
        this.showMessagePopup.set(true);
        this.messageTitle.set('Password Reset Sent');
        this.messageText.set('Please check your email for instructions to reset your password.');

        timer(1000).subscribe(() => {
          this.showMessagePopup.set(false);
        });
        console.log(response);
      },
      error: (error) => {
        this.showMessagePopup.set(true);
        this.messageTitle.set('Error');
        this.messageText.set(
          error.error?.message || 'Unable to send password reset email. Please try again.',
        );

        timer(1000).subscribe(() => {
          this.showMessagePopup.set(false);
        });
        console.error(error);
      },
    });
  }
}

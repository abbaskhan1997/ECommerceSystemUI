import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
// import { Router } from '@angular/router';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-reset-password',
  styleUrl: './reset-password.css',
  templateUrl: './reset-password.html',
})
export class ResetPassword {
  showMessagePopup = signal(false);
  messageTitle = signal('');
  messageText = signal('');

  token = '';
  newPassword = '';

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
  }

  resetPassword() {
    this.authService.resetPassword(this.token, this.newPassword).subscribe({
      next: (response) => {
        this.messageTitle.set('Password Reset Successfully');
        this.messageText.set('Your password has been reset successfully.');
        this.showMessagePopup.set(true);

        // after 2 seconds, close the popup and navigate to login page with resetSuccess state
        timer(2000).subscribe(() => {
          this.showMessagePopup.set(false);

          this.router.navigate(['/login'], {
            state: { resetSuccess: true },
          });
        });
      },

      error: (error) => {
        this.showMessagePopup.set(true);
        this.messageTitle.set('Password Reset Failed');
        this.messageText.set('An error occurred while resetting the password.');
        
        timer(2000).subscribe(() => {
          this.showMessagePopup.set(false);
        });
        console.error(error);
      },
    });
  }
}

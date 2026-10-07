import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
// import { Router } from '@angular/router';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-reset-password',
  styleUrl: './reset-password.css',
  templateUrl: './reset-password.html',
})
export class ResetPassword {
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
        alert(response);
        this.router.navigate(['/login']);
       
      },
      error: (error) => {
        alert('An error occurred while resetting the password.');
      },
    });
  }
}

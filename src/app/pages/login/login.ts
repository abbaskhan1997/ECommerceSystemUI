import { AsyncPipe } from '@angular/common';
import { Component, signal} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { RouterLink, Router } from '@angular/router';
import { BehaviorSubject, timer } from 'rxjs';

@Component({
  imports: [AsyncPipe, FormsModule, RouterLink],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  showMessagePopup = signal(false);
  messageTitle = signal('');
  messageText = signal('');
  messageType = signal<'success' | 'error'>('error');
  showSuccessPopup = false;

  logoutSuccessVisible$ = new BehaviorSubject(false);
  logoutMessage = '';


  email = '';
  password = '';
  loginRole: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  


ngOnInit() {
  const logoutSuccess =
    this.router.getCurrentNavigation()?.extras.state?.['logoutSuccess']
    ?? history.state?.logoutSuccess;

  if (logoutSuccess) {
    this.logoutMessage = 'You have logged out successfully.';
    this.logoutSuccessVisible$.next(true);

    timer(1000).subscribe(() => {
      this.logoutSuccessVisible$.next(false);
      history.replaceState({}, document.title, location.pathname);
    });
  }
}

  closeMessagePopup() {
    this.showMessagePopup.set(false);

    if (this.loginRole === 'Admin') {
      this.router.navigate(['/admin-dashboard']);
    } else if (this.loginRole === 'User') {
      this.router.navigate(['/']);
    }
  }

  login() {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);

        const role = this.authService.getRole();
        this.loginRole = role;

        this.messageTitle.set('Login Successful');
        this.messageText.set('Welcome back!');
        this.messageType.set('success');
        this.showMessagePopup.set(true);

        timer(1000).subscribe(() => {
  this.closeMessagePopup();
});
      },

      error: (error) => {
        this.loginRole = null;

        this.messageTitle.set('Login Failed');
        this.messageText.set('Invalid email or password');
        this.messageType.set('error');
        this.showMessagePopup.set(true);

        console.log('After:', this.showMessagePopup);
      },
    });
  }
}

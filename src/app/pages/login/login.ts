import { Component , signal} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { RouterLink, Router } from '@angular/router';


@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {

  showMessagePopup = signal(false);
messageTitle = signal('');
messageText = signal('');
messageType = signal<'success' | 'error'>('error');

  email = '';
  password = '';
  loginRole: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    
  ) {}

  

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
},

      error: (error) => {
this.loginRole = null;

  this.messageTitle.set('Login Failed');
this.messageText.set('Invalid email or password');
this.messageType.set('error');
this.showMessagePopup.set(true);
  

  console.log('After:', this.showMessagePopup);
}

    });
  }

 closeMessagePopup() {
  this.showMessagePopup.set(false);

  if (this.loginRole === 'Admin') {
    this.router.navigate(['/admin-dashboard']);
  } else if (this.loginRole === 'User') {
    this.router.navigate(['/']);
  }
}
}
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  imports: [FormsModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {

  email='';
  password='';
  

  constructor(private authService: AuthService) { }

  login() {
    this.authService.login(this.email, this.password).subscribe((response) => {
      const token = response.token;
      localStorage.setItem('token', token);
      console.log('Login successful. Token stored in localStorage.');
    });
  }

}

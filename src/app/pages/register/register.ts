import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule],
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register {
  name = '';
  email = '';
  password = '';

  constructor(private authService: AuthService) { }

  register() {
    this.authService.register(this.name, this.email, this.password).subscribe((response) => {
      console.log('Registration successful:', response);
    });
  }

  
}

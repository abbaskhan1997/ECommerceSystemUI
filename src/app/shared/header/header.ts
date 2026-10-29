
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PopupService } from '../../services/popup-service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  private popupService = inject(PopupService);
  private authService = inject(AuthService);

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout(): void {
    this.popupService.confirm('Are you sure you want to logout?');
  }
}

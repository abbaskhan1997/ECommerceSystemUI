
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PopupService } from '../../services/popup-service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-common-popup',
  standalone: true,
  imports: [],
  templateUrl: './common-popup.html',
  styleUrl: './common-popup.css'
})
export class CommonPopup {
  popupService = inject(PopupService);
  private authService = inject(AuthService);
  private router = inject(Router);

  confirmLogout(): void {
    this.authService.logout();
    this.popupService.close();
    this.router.navigate(['/login']);
  }
}

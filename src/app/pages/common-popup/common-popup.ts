import { Component, inject } from '@angular/core';
import { PopupService } from '../../services/popup-service';

@Component({
  selector: 'app-common-popup',
  standalone: true,
  imports: [],
  templateUrl: './common-popup.html',
  styleUrl: './common-popup.css'
})
export class CommonPopup {
  popupService = inject(PopupService);
}
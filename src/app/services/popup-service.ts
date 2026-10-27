
import { Injectable, signal } from '@angular/core';

export type PopupType = 'success' | 'error';
export type PopupMode = 'message' | 'confirm';

@Injectable({
  providedIn: 'root'
})
export class PopupService {
  showPopup = signal(false);
  message = signal('');
  type = signal<PopupType>('success');
  mode = signal<PopupMode>('message');

  private timer: ReturnType<typeof setTimeout> | undefined;

  // Normal success/error message popup
  show(message: string, type: PopupType): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }

    this.mode.set('message');
    this.message.set(message);
    this.type.set(type);
    this.showPopup.set(true);

    this.timer = setTimeout(() => {
      this.close();
    }, 3000);
  }

  // Logout confirmation popup
  confirm(message: string): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }

    this.mode.set('confirm');
    this.message.set(message);
    this.type.set('error');
    this.showPopup.set(true);
  }

  // Close popup
  close(): void {
    this.showPopup.set(false);

    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }
  }
}

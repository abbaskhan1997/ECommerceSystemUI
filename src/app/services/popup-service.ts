import { Injectable, signal } from '@angular/core';

export type PopupType = 'success' | 'error';

@Injectable({
  providedIn: 'root'
})
export class PopupService {
  showPopup = signal(false);
  message = signal('');
  type = signal<PopupType>('success');

  private timer: ReturnType<typeof setTimeout> | undefined;

  show(message: string, type: PopupType): void {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.message.set(message);
    this.type.set(type);
    this.showPopup.set(true);

    this.timer = setTimeout(() => {
      this.close();
    }, 3000);
  }

  close(): void {
    this.showPopup.set(false);

    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }
  }
}
import { Component, signal, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonPopup } from './pages/common-popup/common-popup';
import { Header } from './shared/header/header';
import { Footer } from './shared/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonPopup, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ECommerceUI');

  private router = inject(Router);

  isAdminRoute(): boolean {
    return this.router.url.startsWith('/admin-');
  }
}
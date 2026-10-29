import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
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
}

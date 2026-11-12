import { Component, OnInit, signal } from '@angular/core';
import { OrdersService } from '../../services/orders-service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-my-orders',
  imports: [DatePipe],
  templateUrl: './my-orders.html',
  styleUrl: './my-orders.css'
})
export class MyOrders implements OnInit {

  // Signals for component state
  orders = signal<any[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');

  // Currently expanded order  ID
expandedOrderId = signal<number | null>(null);

  constructor(private ordersService: OrdersService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.ordersService.getMyOrders().subscribe({
      next: (response) => {
        this.orders.set(response);
        this.isLoading.set(false);
      },
      error: (error: any) => {
        this.isLoading.set(false);
        this.errorMessage.set('Unable to load your orders.');
        console.error(error);
      }
    });
  }

  // Order details  open/close
toggleOrderDetails(orderId: number): void {
  if (this.expandedOrderId() === orderId) {
    this.expandedOrderId.set(null);
  } else {
    this.expandedOrderId.set(orderId);
  }
}

}
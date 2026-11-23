import { Component, OnInit, signal } from '@angular/core';
import { OrdersService } from '../../services/orders-service';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PopupService } from '../../services/popup-service';

@Component({
  selector: 'app-admin-orders',
  imports: [DatePipe, FormsModule],
  templateUrl: './admin-orders.html',
  styleUrl: './admin-orders.css'
})
export class AdminOrders implements OnInit {

  // Store all orders
  orders = signal<any[]>([]);

  // Loading state
  isLoading = signal(false);

  // Store error message
  errorMessage = signal('');

  // Available order statuses
orderStatuses = [
  'Pending',
  'Confirmed',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled'
];

// Available payment statuses
paymentStatuses = [
  'Pending',
  'Paid',
  'Failed'
];

  // Inject OrdersService using DI
  constructor(private ordersService: OrdersService,
     private popupService: PopupService) {}

  // Automatically runs when component loads
  ngOnInit(): void {
    this.loadOrders();
  }

  // Get all orders from backend
  loadOrders(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.ordersService.getAllOrders().subscribe({
      next: (response) => {
        this.orders.set(response);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set('Unable to load orders.');
        this.isLoading.set(false);
        console.error(error);
      }
    });
  }

  // Update order status
updateStatus(orderId: number, status: string): void {

  this.ordersService.updateOrderStatus(orderId, status).subscribe({
    next: () => {
      // Reload orders after successful update
      this.loadOrders();
        // Show the selected order status in popup
      this.popupService.show(
        `Order status ${status} successfully.`,
        'success'
      );
    },
    error: (error) => {
      console.error(error);
       this.popupService.show(
        `Unable to  order status  ${status}.`,
        'error'
      );
    }
  });

}

// Update payment status
updatePaymentStatus(orderId: number, paymentStatus: string): void {

  this.ordersService.updatePaymentStatus(orderId, paymentStatus).subscribe({
    next: () => {
      this.loadOrders();
       // Show the selected payment status in popup
      this.popupService.show(
        `Payment status ${paymentStatus} successfully.`,
        'success'
      );
    },
    error: (error) => {
      console.error(error);
         this.popupService.show(
        `Unable to  payment status  ${paymentStatus}.`,
        'error'
      );
    }
  });

}

}
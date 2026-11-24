
import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { OrdersService } from '../../services/orders-service';
import { PopupService } from '../../services/popup-service';

@Component({
  selector: 'app-admin-orders',
  imports: [DatePipe, FormsModule],
  templateUrl: './admin-orders.html',
  styleUrl: './admin-orders.css',
})
export class AdminOrders implements OnInit, OnDestroy {

  // ==================== Order State ====================

  orders = signal<any[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');

  private ordersRequest?: Subscription;

  // ==================== Order Details State ====================

  selectedOrder = signal<any | null>(null);
  showOrderDetails = signal(false);

  // ==================== Search and Filter State ====================

  searchText = signal('');
  selectedOrderStatus = signal('');
  selectedPaymentStatus = signal('');

  // ==================== Pagination State ====================

  pageNumber = signal(1);
  pageSize = signal(10);
  totalOrders = signal(0);
  totalPages = signal(0);

  // ==================== Available Statuses ====================

  orderStatuses = [
    'Pending',
    'Confirmed',
    'Processing',
    'Shipped',
    'Delivered',
    'Cancelled'
  ];

  paymentStatuses = ['Pending', 'Paid', 'Failed'];

  // ==================== Dependency Injection ====================

  constructor(
    private ordersService: OrdersService,
    private popupService: PopupService,
  ) {}

  // ==================== Lifecycle Hooks ====================

  ngOnInit(): void {
    this.loadOrders();
  }

  ngOnDestroy(): void {
    this.ordersRequest?.unsubscribe();
  }

  // ==================== Load Orders ====================

  loadOrders(): void {
    this.ordersRequest?.unsubscribe();

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.ordersRequest = this.ordersService.getAllOrders(
      this.pageNumber(),
      this.pageSize(),
      this.searchText(),
      this.selectedOrderStatus(),
      this.selectedPaymentStatus()
    ).subscribe({
      next: (response) => {

        if (this.pageNumber() > Math.max(1, response.totalPages)) {
          this.pageNumber.set(Math.max(1, response.totalPages));
          this.loadOrders();
          return;
        }

        this.orders.set(response.orders);
        this.totalOrders.set(response.totalOrders);
        this.totalPages.set(response.totalPages);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set('Unable to load orders.');
        this.isLoading.set(false);
        console.error(error);
      },
    });
  }

  // ==================== Search and Filter Methods ====================

  onSearchChange(value: string): void {
    this.searchText.set(value);
    this.pageNumber.set(1);
    this.loadOrders();
  }

  onOrderStatusChange(value: string): void {
    this.selectedOrderStatus.set(value);
    this.pageNumber.set(1);
    this.loadOrders();
  }

  onPaymentStatusChange(value: string): void {
    this.selectedPaymentStatus.set(value);
    this.pageNumber.set(1);
    this.loadOrders();
  }

  // ==================== Pagination Methods ====================

  nextPage(): void {
    if (this.pageNumber() < this.totalPages()) {
      this.pageNumber.update(page => page + 1);
      this.loadOrders();
    }
  }

  previousPage(): void {
    if (this.pageNumber() > 1) {
      this.pageNumber.update(page => page - 1);
      this.loadOrders();
    }
  }

  // ==================== Update Order Status ====================

  updateStatus(orderId: number, status: string): void {
    this.ordersService.updateOrderStatus(orderId, status).subscribe({
      next: () => {
        this.loadOrders();
        this.popupService.show(
          `Order status ${status} successfully.`,
          'success'
        );
      },
      error: (error) => {
        console.error(error);
        this.popupService.show(
          `Unable to update order status ${status}.`,
          'error'
        );
      },
    });
  }

  // ==================== Update Payment Status ====================

  updatePaymentStatus(orderId: number, paymentStatus: string): void {
    this.ordersService.updatePaymentStatus(orderId, paymentStatus).subscribe({
      next: () => {
        this.loadOrders();
        this.popupService.show(
          `Payment status ${paymentStatus} successfully.`,
          'success'
        );
      },
      error: (error) => {
        console.error(error);
        this.popupService.show(
          `Unable to update payment status ${paymentStatus}.`,
          'error'
        );
      },
    });
  }

  // ==================== View Order Details ====================

  viewOrderDetails(orderId: number): void {
    this.ordersService.getOrderById(orderId).subscribe({
      next: (response) => {
        this.selectedOrder.set(response);
        this.showOrderDetails.set(true);
      },
      error: (error) => {
        console.error(error);
        this.popupService.show('Unable to load order details.', 'error');
      },
    });
  }

  // ==================== Close Order Details ====================

  closeOrderDetails(): void {
    this.showOrderDetails.set(false);
    this.selectedOrder.set(null);
  }
}

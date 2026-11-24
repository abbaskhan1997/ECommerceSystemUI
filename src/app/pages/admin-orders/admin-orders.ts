import { Component, OnInit, signal, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrdersService } from '../../services/orders-service';
import { PopupService } from '../../services/popup-service';

@Component({
  selector: 'app-admin-orders',
  imports: [DatePipe, FormsModule],
  templateUrl: './admin-orders.html',
  styleUrl: './admin-orders.css',
})
export class AdminOrders implements OnInit {
  // ==================== Order State ====================

  orders = signal<any[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');

  // ==================== Order Details State ====================

  selectedOrder = signal<any | null>(null);
  showOrderDetails = signal(false);

  // ==================== Search and Filter State ====================

  searchText = signal('');
  selectedOrderStatus = signal('');
  selectedPaymentStatus = signal('');

  // ==================== Available Statuses ====================

  orderStatuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  paymentStatuses = ['Pending', 'Paid', 'Failed'];

  // ==================== Search and Filter Logic ====================

  // Search and filter logic
  filteredOrders = computed(() => {
    // Split search text into individual words
    const searchWords = this.searchText().toLowerCase().trim().split(/\s+/);

    return this.orders().filter((order) => {
      // Combine all product names
      const productNames = (order.orderItems ?? [])
        .map((item: any) => item.product?.name || '')
        .join(' ');

      // Combine all searchable fields
      const searchableText = [
        order.id,
        order.user?.name || '',
        order.user?.email || '',
        order.deliveryAddress?.phone || '',
        productNames,
      ]
        .join(' ')
        .toLowerCase();

      // Check if all search words match
      const matchesSearch = searchWords.every((word) => searchableText.includes(word));

      // Filter by order status
      const matchesOrderStatus =
        !this.selectedOrderStatus() || order.status === this.selectedOrderStatus();

      // Filter by payment status
      const matchesPaymentStatus =
        !this.selectedPaymentStatus() || order.paymentStatus === this.selectedPaymentStatus();

      return matchesSearch && matchesOrderStatus && matchesPaymentStatus;
    });
  });

  // ==================== Dependency Injection ====================

  constructor(
    private ordersService: OrdersService,
    private popupService: PopupService,
  ) {}

  // ==================== Lifecycle Hook ====================

  ngOnInit(): void {
    this.loadOrders();
  }

  // ==================== Load Orders ====================

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
      },
    });
  }

  // ==================== Update Order Status ====================

  updateStatus(orderId: number, status: string): void {
    this.ordersService.updateOrderStatus(orderId, status).subscribe({
      next: () => {
        this.loadOrders();
        this.popupService.show(`Order status ${status} successfully.`, 'success');
      },
      error: (error) => {
        console.error(error);
        this.popupService.show(`Unable to update order status ${status}.`, 'error');
      },
    });
  }

  // ==================== Update Payment Status ====================

  updatePaymentStatus(orderId: number, paymentStatus: string): void {
    this.ordersService.updatePaymentStatus(orderId, paymentStatus).subscribe({
      next: () => {
        this.loadOrders();
        this.popupService.show(`Payment status ${paymentStatus} successfully.`, 'success');
      },
      error: (error) => {
        console.error(error);
        this.popupService.show(`Unable to update payment status ${paymentStatus}.`, 'error');
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

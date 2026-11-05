import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { signal } from '@angular/core';
import { CartService } from '../../services/cart-service';
import { FormsModule } from '@angular/forms';
import { PopupService } from '../../services/popup-service';

@Component({
  imports: [FormsModule],
  selector: 'app-product-detail',
  styleUrl: './product-detail.css',
  templateUrl: './product-detail.html',
})
export class ProductDetail {
  product = signal<any | null>(null);
  selectedSizeId: number | null = null;
  quantity: number = 1;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService,
    private popupService: PopupService,
  ) {}

  ngOnInit() {
    const productId = Number(this.route.snapshot.paramMap.get('id'));

    this.getProductById(productId);
  }

  getProductById(id: number) {
    this.productService.getProductById(id).subscribe((data: any) => {
      console.log('Product data:', data);
      this.product.set(data);
    });
  }

  // Add product to cart
  // Add product to cart
  addToCart() {
    // Get current product details
    const currentProduct = this.product();

    if (!currentProduct) {
      return;
    }

    // Check whether product has sizes
    const hasSizes = currentProduct.productSizes?.length > 0;

    // Validate size selection
    if (hasSizes && this.selectedSizeId === null) {
      this.popupService.show('Please select a size.', 'error');
      return;
    }

    // Validate quantity
    if (this.quantity < 1 || !Number.isInteger(this.quantity)) {
      this.popupService.show('Please enter a valid quantity.', 'error');
      return;
    }

    // Get selected size details
    const selectedSize = hasSizes
      ? currentProduct.productSizes.find((size: any) => size.id === this.selectedSizeId)
      : null;

    // Get available stock for selected size or product
    const availableStock = hasSizes
      ? (selectedSize?.stockQuantity ?? 0)
      : currentProduct.stockQuantity;

    // Check requested quantity against available stock
    if (this.quantity > availableStock) {
      this.popupService.show('Requested quantity is greater than available stock.', 'error');
      return;
    }

    // Prepare cart item data for API request
    const cartItem = {
      productId: currentProduct.id,
      productSizeId: this.selectedSizeId,
      quantity: this.quantity,
    };

    // Send add-to-cart request to backend
    this.cartService.addToCart(cartItem).subscribe({
      // Show success message when product is added
      next: () => {
        // Refresh navbar cart count
        this.cartService.refreshCartCount();
        // Show success popup
        this.popupService.show('Product added to cart successfully!', 'success');
      },

      // Show error message if API request fails
      error: (err) => {
        const message = err.error?.message || err.error || 'Unable to add product to cart.';

        this.popupService.show(message, 'error');
      },
    });
  }
}

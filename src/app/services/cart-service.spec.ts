import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { CartService } from './cart-service';

describe('CartService', () => {
  let service: CartService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    localStorage.removeItem('token');
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CartService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('updates the count from the authenticated user cart', () => {
    localStorage.setItem('token', 'user-token');

    service.refreshCartCount();

    const request = httpTesting.expectOne('https://localhost:7223/api/Carts');
    expect(request.request.headers.get('Authorization')).toBe('Bearer user-token');
    request.flush({ cartItems: [{ quantity: 2 }, { quantity: 1 }] });

    expect(service.cartCount()).toBe(3);
  });

  it('ignores a previous user response after the count is reset', () => {
    localStorage.setItem('token', 'first-user-token');
    service.cartCount.set(1);
    service.refreshCartCount();
    const firstRequest = httpTesting.expectOne('https://localhost:7223/api/Carts');

    service.resetCartCount();
    localStorage.setItem('token', 'second-user-token');
    service.refreshCartCount();
    const secondRequest = httpTesting.expectOne('https://localhost:7223/api/Carts');

    secondRequest.flush({ cartItems: [] });
    firstRequest.flush({ cartItems: [{ quantity: 1 }] });

    expect(service.cartCount()).toBe(0);
  });

  it('resets the count when logged out', () => {
    service.cartCount.set(4);

    service.resetCartCount();

    expect(service.cartCount()).toBe(0);
  });
});

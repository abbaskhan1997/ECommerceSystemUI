import { TestBed } from '@angular/core/testing';
import { ProductSize } from './product-size';

describe('ProductSize', () => {
  let service: ProductSize;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductSize);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

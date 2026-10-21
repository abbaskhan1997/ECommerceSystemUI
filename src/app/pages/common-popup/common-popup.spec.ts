import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonPopup } from './common-popup';

describe('CommonPopup', () => {
  let component: CommonPopup;
  let fixture: ComponentFixture<CommonPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonPopup],
    }).compileComponents();

    fixture = TestBed.createComponent(CommonPopup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

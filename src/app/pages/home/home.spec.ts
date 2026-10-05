import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Home } from './home';
import { SchoolService } from '../../services/school.service';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [
        {
          provide: SchoolService,
          useValue: { getSchools: () => of([{ id: 1, name: 'Test School' }]) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render schools returned by the API', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('li')?.textContent).toContain('Test School');
  });
});

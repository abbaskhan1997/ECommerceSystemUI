
import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SchoolService } from '../../services/school.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  imports: [],
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home implements OnInit, OnDestroy {
  schools = signal<any[]>([]);

  // Current visible slide
  activeSlide = signal(0);

  // Automatic slider timer
  private sliderTimer: ReturnType<typeof setInterval> | undefined;

  constructor(
    private schoolService: SchoolService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getSchools();
    this.startSlider();
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  getSchools(): void {
    this.schoolService.getSchools().subscribe((data) => {
      this.schools.set(data as any[]);
    });
  }

  // Move to next slide
  nextSlide(): void {
    this.activeSlide.update(current => (current + 1) % 3);
  }

  // Move to previous slide
  previousSlide(): void {
    this.activeSlide.update(current => (current + 2) % 3);
  }

  // Open a specific slide using dots
  goToSlide(index: number): void {
    this.activeSlide.set(index);
  }

  // Automatically change slide every 4 seconds
  startSlider(): void {
    this.sliderTimer = setInterval(() => {
      this.nextSlide();
    }, 4000);
  }

  // Scroll down to the school list
  scrollToSchools(): void {
    document.getElementById('schools-section')
      ?.scrollIntoView({ behavior: 'smooth' });
  }

  // Open selected school
  openSchool(school: any): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.router.navigate(['/classes'], {
      queryParams: { schoolId: school.id }
    });
  }

  // Clean up timer when leaving the page
  ngOnDestroy(): void {
    if (this.sliderTimer) {
      clearInterval(this.sliderTimer);
    }
  }
}

import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { SchoolService } from '../../services/school.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  imports: [],
  selector: 'app-home',
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

  ngOnInit() {
  this.getSchools();

  this.startSlider();
}

  getSchools() {
    this.schoolService.getSchools().subscribe((data) => {
      this.schools.set(data as any[]);
    });
  }

  // Move to next slide
   nextSlide() {
    this.activeSlide.update(current => (current + 1) % 3);
  }

  // Move to previous slide
   previousSlide() {
    this.activeSlide.update(current => (current + 2) % 3);
  }

  // Open a specific slide using dots
 goToSlide(index: number) {
    this.activeSlide.set(index);
  }

  // Automatically change slide every 4 seconds

startSlider() {
  this.sliderTimer = setInterval(() => {
    this.nextSlide();
  }, 4000);
}



  // Scroll down to the school list
  scrollToSchools() {
    document.getElementById('schools-section')
      ?.scrollIntoView({ behavior: 'smooth' });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Clean up timer when leaving the page
  ngOnDestroy() {
    if (this.sliderTimer) {
      clearInterval(this.sliderTimer);
    }
  }
}
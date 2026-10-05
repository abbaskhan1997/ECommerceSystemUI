import { Component, signal } from '@angular/core';
import { SchoolService } from '../../services/school.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  imports: [],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {
  schools = signal<any[]>([]);

  constructor(private schoolService: SchoolService, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.getSchools();
  };

  getSchools() {
    this.schoolService.getSchools().subscribe((data) => {
      this.schools.set(data as any[]);
    });
  }

  logout() {
  this.authService.logout();
  this.router.navigate(['/login']);
}
}

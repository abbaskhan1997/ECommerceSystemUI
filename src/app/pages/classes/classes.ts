import { Component, OnInit, signal } from '@angular/core';
import { SchoolClassService } from '../../services/school-class-service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  imports: [],
  selector: 'app-classes',
  styleUrl: './classes.css',
  templateUrl: './classes.html',
})
export class Classes implements OnInit{
 schoolId: number | null = null;
classes = signal<any[]>([]);
isLoading = signal(true);

  constructor(
    private schoolClassService: SchoolClassService,
    private route: ActivatedRoute,
     private router: Router
  ) {}

  ngOnInit(): void {
  this.route.queryParams.subscribe(params => {
    this.schoolId = Number(params['schoolId']);

   this.schoolClassService.getClasses(this.schoolId).subscribe({
  next: (data) => {
  this.classes.set(data);
  this.isLoading.set(false);
},
error: (err) => {
  console.log('Error loading classes:', err);
  this.isLoading.set(false);
}
    });
  });
}

openClass(item: any): void {
  this.router.navigate(['/categories'], {
    queryParams: {
      schoolId: this.schoolId,
      schoolClassId: item.id
    }
  });
}


}

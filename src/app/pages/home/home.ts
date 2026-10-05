import { Component } from '@angular/core';
import { SchoolService } from '../../services/school.service';

@Component({
  imports: [],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {
  
  constructor(private schoolService: SchoolService) { }

  ngOnInit() {
    this.getSchools();
  };

  getSchools() {
    this.schoolService.getSchools().subscribe((data) => {
      console.log(data);
    });
  }
}

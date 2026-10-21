import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
 providedIn: 'root'
})
export class SchoolService {

  private url = 'https://localhost:7223/api/Schools';
  private classUrl = 'https://localhost:7223/api/SchoolClasses';

  constructor(private http: HttpClient) { }

  getSchools(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }

   getClasses() {
    return this.http.get(this.classUrl);
  }
}

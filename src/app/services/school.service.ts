import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
 providedIn: 'root'
})
export class SchoolService {

  private url = 'https://localhost:7223/api/Schools';

  constructor(private http: HttpClient) { }

  getSchools() {
    return this.http.get(this.url);
  }
}

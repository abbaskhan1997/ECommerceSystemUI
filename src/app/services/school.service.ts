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

  addSchool(school: any): Observable<any> {
    return this.http.post<any>(this.url, school);
  }

  updateSchool(id: number, school: any): Observable<void> {
    return this.http.put<void>(`${this.url}/${id}`, school);
  }

  deleteSchool(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

   getClasses() {
    return this.http.get(this.classUrl);
  }
}

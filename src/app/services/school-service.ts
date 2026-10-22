import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SchoolService {

  private apiUrl = 'https://localhost:7223/api/Schools';

  constructor(private http: HttpClient) {}

  // Get all schools
  getSchools(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Get one school by ID
  getSchoolById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Add a school
  addSchool(school: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, school);
  }

  // Update a school
  updateSchool(id: number, school: any): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, school);
  }

  // Delete a school
  deleteSchool(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
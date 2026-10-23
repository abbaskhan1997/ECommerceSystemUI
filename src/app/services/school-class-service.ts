import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SchoolClassService {

  private apiUrl = 'https://localhost:7223/api/SchoolClasses';

  constructor(private http: HttpClient) {}

  // Get all classes
  getClasses(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Get one class by ID
  getClassById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Add a class
  addClass(schoolClass: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, schoolClass);
  }

  // Update a class
  updateClass(id: number, schoolClass: any): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, schoolClass);
  }

  // Delete a class
 deleteClass(id: number): Observable<string> {
  return this.http.delete(
    `${this.apiUrl}/${id}`,
    { responseType: 'text' }
  );
}
}

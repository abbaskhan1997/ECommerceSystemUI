import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }
  private apiurl = 'https://localhost:7223/api/Categories';

  getCategories() {
    return this.http.get(this.apiurl);
  } 
}

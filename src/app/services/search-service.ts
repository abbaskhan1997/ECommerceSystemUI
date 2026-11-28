import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private apiUrl = 'https://localhost:7223/api/Search';

  constructor(private http: HttpClient) {}

  globalSearch(search: string) {
    const params = new HttpParams().set('search', search);

    return this.http.get<any>(this.apiUrl, { params });
  }
}
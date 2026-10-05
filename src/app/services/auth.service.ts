import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private url = 'https://localhost:7223/api/Auth/login';
  constructor(private http: HttpClient) { }

  login(email: string, password: string) {
    
    const body = { email, password };
    return this.http.post<LoginResponse>(this.url, body);
  }
}

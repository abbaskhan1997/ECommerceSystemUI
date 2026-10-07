import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private url = 'https://localhost:7223/api/Auth';
  constructor(private http: HttpClient) { }

  login(email: string, password: string) {
  const body = { email, password };
  return this.http.post<LoginResponse>(`${this.url}/login`, body);
}

  register(name: string, email: string, password: string) {
    const body = { name, email, password };
    return this.http.post(`${this.url}/register`, body, { responseType: 'text' });
  }

  logout() {
    localStorage.removeItem('token');
  }

  forgotPassword(email: string) {
    const body = { email };
   return this.http.post(
  'https://localhost:7223/api/Users/forgot-password',body);
  } 

  resetPassword(token: string, newPassword: string) {
  const body = {
    token,
    newPassword
  };

  return this.http.post(
    'https://localhost:7223/api/Users/reset-password',
    body,
    { responseType: 'text' }
  );
}
}

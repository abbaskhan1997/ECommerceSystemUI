import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url = 'https://localhost:7223/api/Auth';
  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    const body = { email, password };
    return this.http.post<LoginResponse>(`${this.url}/login`, body);
  }

  register(name: string, email: string, password: string) {
    const body = { name, email, password };
    return this.http.post(`${this.url}/register`, body, { responseType: 'text' });
  }

  getRole() {
    const token = localStorage.getItem('token');

    if (!token) {
      return null;
    }

    const payload = token.split('.')[1];
    const decodedPayload = atob(payload);
    const claims = JSON.parse(decodedPayload);

    return claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
  }

  logout() {
    localStorage.removeItem('token');
  }

  forgotPassword(email: string) {
    const body = { email };
    return this.http.post('https://localhost:7223/api/Users/forgot-password', body);
  }

  resetPassword(token: string, newPassword: string) {
    const body = {
      token,
      newPassword,
    };

    return this.http.post('https://localhost:7223/api/Users/reset-password', body, {
      responseType: 'text',
    });
  }
}

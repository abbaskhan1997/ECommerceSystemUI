
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url = 'https://localhost:7223/api/Auth';

  // Current login status ko reactive rakhega
  private loginStatus = signal(false);

  constructor(private http: HttpClient) {
    // App start hone par saved token check karo
    this.loginStatus.set(!!localStorage.getItem('token'));
  }

  login(email: string, password: string) {
    const body = { email, password };
    return this.http.post<LoginResponse>(`${this.url}/login`, body);
  }

  register(name: string, email: string, password: string) {
    const body = { name, email, password };

    return this.http.post(`${this.url}/register`, body, {
      responseType: 'text',
    });
  }

  isLoggedIn(): boolean {
    return this.loginStatus();
  }

  // Token save hone ke baad login status update karo
  refreshLoginStatus(): void {
    this.loginStatus.set(!!localStorage.getItem('token'));
  }

  getRole() {
    const token = localStorage.getItem('token');

    if (!token) {
      return null;
    }

    try {
      const payload = token.split('.')[1];
      if (!payload) {
        return null;
      }

      const base64Payload = payload.replace(/-/g, '+').replace(/_/g, '/');
      const decodedPayload = atob(
        base64Payload.padEnd(Math.ceil(base64Payload.length / 4) * 4, '=')
      );
      const payloadBytes = Uint8Array.from(decodedPayload, (character) =>
        character.charCodeAt(0)
      );
      const claims = JSON.parse(new TextDecoder().decode(payloadBytes));
      const role =
        claims[
          'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
        ] ??
        claims.role ??
        claims.roles;

      return Array.isArray(role)
        ? role.find((value) => typeof value === 'string') ?? null
        : typeof role === 'string'
          ? role
          : null;
    } catch {
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    this.loginStatus.set(false);
  }

  forgotPassword(email: string) {
    const body = { email };

    return this.http.post(
      'https://localhost:7223/api/Users/forgot-password',
      body
    );
  }

  resetPassword(token: string, newPassword: string) {
    const body = { token, newPassword };

    return this.http.post(
      'https://localhost:7223/api/Users/reset-password',
      body,
      { responseType: 'text' }
    );
  }
}

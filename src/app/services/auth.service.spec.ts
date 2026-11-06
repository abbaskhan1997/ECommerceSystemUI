import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.removeItem('token');
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('detects the role from a saved JWT after service initialization', () => {
    const payload = btoa(JSON.stringify({ role: 'User' }))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    localStorage.setItem('token', `header.${payload}.signature`);

    const refreshedService = new AuthService(TestBed.inject(HttpClient));

    expect(refreshedService.isLoggedIn()).toBe(true);
    expect(refreshedService.getRole()).toBe('User');
  });

  it('reads the ASP.NET role claim for Admin users', () => {
    const payload = btoa(
      JSON.stringify({
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': 'Admin',
      })
    );
    localStorage.setItem('token', `header.${payload}.signature`);

    expect(service.getRole()).toBe('Admin');
  });
});

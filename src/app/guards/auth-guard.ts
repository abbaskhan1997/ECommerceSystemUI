
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const currentRole = authService.getRole();
  const requiredRole = route.data['role'];
  const allowGuest = route.data['allowGuest'];

  // Allow guests on public routes
  if (!authService.isLoggedIn()) {
    return allowGuest ? true : router.createUrlTree(['/login']);
  }

  // Redirect users who do not have a valid role
  if (!currentRole) {
    return router.createUrlTree(['/login']);
  }

  // Redirect users to their own area if role does not match
  if (requiredRole && currentRole !== requiredRole) {
    return currentRole === 'Admin'
      ? router.createUrlTree(['/admin-dashboard'])
      : router.createUrlTree(['/']);
  }

  return true;
};

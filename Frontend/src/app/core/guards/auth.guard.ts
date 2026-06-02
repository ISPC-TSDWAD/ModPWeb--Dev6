import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('access_token');

  if (token) {
    return true;
  }

  // Redirigir al login informando que se requiere inicio de sesión
  router.navigate(['/login'], { queryParams: { loginRequired: 'true' } });
  return false;
};

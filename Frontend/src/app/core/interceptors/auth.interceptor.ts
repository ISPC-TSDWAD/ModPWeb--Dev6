import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const token = localStorage.getItem('access_token');

  const conAuth = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  const cerrarSesion = (error: unknown) => {
    authService.logout();
    router.navigate(['/login'], { queryParams: { sessionExpired: 'true' } });
    return throwError(() => error);
  };

  return next(conAuth).pipe(
    catchError((error: HttpErrorResponse) => {
      const esLlamadaRefresh = req.url.includes('/token/refresh');
      const refresh = localStorage.getItem('refresh_token');

      // Si vence el access token, intentamos renovarlo una vez y reintentar.
      if (error.status === 401 && refresh && !esLlamadaRefresh) {
        return authService.refreshToken(refresh).pipe(
          switchMap((res) => {
            const reintento = req.clone({
              setHeaders: { Authorization: `Bearer ${res.access}` },
            });
            return next(reintento);
          }),
          catchError(cerrarSesion),
        );
      }

      if (error.status === 401) {
        return cerrarSesion(error);
      }

      return throwError(() => error);
    }),
  );
};

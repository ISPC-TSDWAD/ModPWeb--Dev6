import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

interface TokenResponse {
  access: string;
  refresh: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}token/`;

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.baseUrl, { username, password }).pipe(
      tap(response => {
        localStorage.setItem('access_token', response.access);
        localStorage.setItem('refresh_token', response.refresh);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
        if (response.is_staff) {
          localStorage.setItem('is_staff', 'true');
        } else {
          localStorage.removeItem('is_staff');
        }
        if (response.rol) {
          localStorage.setItem('rol', response.rol);
        } else {
          localStorage.removeItem('rol');
        }
      })
    );
  }

  /** Pide un nuevo access token usando el refresh token y lo guarda. */
  refreshToken(refresh: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}token/refresh/`, { refresh }).pipe(
      tap(response => {
        if (response.access) {
          localStorage.setItem('access_token', response.access);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('is_staff');
    localStorage.removeItem('rol');
    localStorage.removeItem('username');
  }
}

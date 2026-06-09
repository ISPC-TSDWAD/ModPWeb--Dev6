import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  id?: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  is_staff?: boolean;
  rol?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}users/`;

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }

  /** Datos del usuario autenticado. */
  getMe(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}me/`);
  }

  /** Actualiza el perfil del usuario autenticado (nombre, apellido, email). */
  updateMe(data: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.baseUrl}me/`, data);
  }

  /** Cambia la contraseña propia validando la actual. */
  changePassword(actual: string, nueva: string): Observable<any> {
    return this.http.post(`${this.baseUrl}change-password/`, { actual, nueva });
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.baseUrl, user);
  }

  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}${id}/`, user);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}${id}/`);
  }
}

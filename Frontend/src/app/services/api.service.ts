import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { TestData } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getTestData(): Observable<TestData> {
    return this.http.get<TestData>(`${this.baseUrl}test/`);
  }

  // Método simulado para el envío del formulario del Asesor
  createResource(resourceData: any): Observable<any> {
    // Aquí normalmente haríamos un POST al backend:
    // return this.http.post(`${this.baseUrl}recursos/`, resourceData);
    
    // Para cumplir el criterio de aceptación y probar el Data Binding sin un endpoint real configurado aún:
    return new Observable(observer => {
      console.log('ApiService: Enviando recurso simulado...', resourceData);
      setTimeout(() => {
        observer.next({ success: true, data: resourceData });
        observer.complete();
      }, 1000);
    });
  }
  // Método simulado para obtener los recursos (cumpliendo con obtener datos del servicio)
  getRecursosMock(): Observable<any[]> {
    const mockData = [
      { id: 1, titulo: 'Plantilla de Examen Canvas', categoria: 'EXAMEN', url: '#' },
      { id: 2, titulo: 'Botón Institucional Primario', categoria: 'ESTILOS', url: '#' },
      { id: 3, titulo: 'Interactividad Drag & Drop', categoria: 'H5P', url: '#' },
      { id: 4, titulo: 'LTI Herramienta Externa', categoria: 'LTI', url: '#' },
      { id: 5, titulo: 'Acordeón de Contenidos', categoria: 'ESTILOS', url: '#' },
    ];
    // Usamos 'of' para retornar sincrónicamente y evitar problemas de SSR o Zone.js con setTimeout
    return of(mockData);
  }
}

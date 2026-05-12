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
      { 
        id: 1, 
        titulo: 'Llamado a la Acción: Video', 
        categoria: 'CTA', 
        url: '#',
        html: `<div class="dp-callout dp-callout-color-lg-tip card dp-callout-position-default dp-callout-type-title-bar" style="border-color: #003087; border-radius: 5px;">
  <div class="card-body">
    <p class="card-title" style="text-align: left; background-color: #003087; color: #ffffff;">
      <span style="font-size: 10pt;">
        <em><strong style="border-color: #003087;"><img src="https://distancia.ucc.edu.ar/courses/399/files/32157/preview" alt="Icono recuadro video"></strong></em>
        <strong style="border-color: #003087;">Video </strong>
      </span>
    </p>
    <p>Introducción o invitación al video</p>
    <p class="card-text"><span style="color: #236fa1;">Ver video (LINK del video)</span></p>
  </div>
</div>`
      },
      { 
        id: 2, 
        titulo: 'Acordeón de Contenidos', 
        categoria: 'ORGANIZADOR', 
        url: '#',
        html: `<div class="dp-panels-wrapper dp-accordion-default dp-panel-color-dp-secondary dp-panel-active-color-dp-primary">
  <div class="dp-panel-group">
    <h3 class="dp-panel-heading "><strong>Titulo 1</strong></h3>
    <div class="dp-panel-content "><p>TEXTO - TEXTO - TEXTO</p></div>
  </div>
  <div class="dp-panel-group">
    <h3 class="dp-panel-heading "><strong>Titulo 2</strong></h3>
    <div class="dp-panel-content "><p>TEXTO - TEXTO - TEXTO</p></div>
  </div>
</div>`
      },
      { 
        id: 3, 
        titulo: 'Resaltado: Importante', 
        categoria: 'RESALTADO', 
        url: '#',
        html: `<div class="dp-callout dp-callout-placeholder card dp-callout-position-default dp-callout-type-info dp-callout-color-danger">
  <div class="dp-callout-side-emphasis">
    <i class="dp-icon dp-default-icon fas fa-exclamation-triangle">​</i>
  </div>
  <div class="card-body">
    <h3 class="card-title">Atención / Importante </h3>
    <p class="card-text" style="text-align: left;">
      <i><span>TEXTO A RESALTAR</span></i>
    </p>
  </div>
</div>`
      },
      { 
        id: 4, 
        titulo: 'Llamado a la Acción: Lectura', 
        categoria: 'CTA', 
        url: '#',
        html: `<div class="dp-callout dp-callout-color-lg-tip card dp-callout-position-default dp-callout-type-title-bar" style="border-color: #003087; border-radius: 5px;">
  <div class="card-body">
    <p class="card-title" style="text-align: left; background-color: #003087; color: #ffffff;">
      <span style="font-size: 10pt;">
        <em><strong style="border-color: #003087;"><img src="https://distancia.ucc.edu.ar/courses/399/files/32158/preview" alt=""> </strong></em>
        <strong style="border-color: #003087;">Lectura</strong>
      </span>
    </p>
    <p>Introducción o invitación a lectura</p>
    <p><span><span style="color: #236fa1;">Acceso al documento (LINK)</span></span></p>
  </div>
</div>`
      }
    ];
    // Usamos 'of' para retornar sincrónicamente y evitar problemas de SSR o Zone.js con setTimeout
    return of(mockData);
  }
}

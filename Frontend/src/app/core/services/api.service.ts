import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TestData } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}token/`, { username, password });
  }

  private mockData = [
      { 
        id: 1, 
        titulo: 'Llamado a la Acción: Video', 
        categoria: 'CTA', 
        asignatura: 'Matematicas',
        url: '',
        imagen: '/assets/images/edu_card_cta.png',
        icono: 'play_circle',
        html: `<div class="dp-callout dp-callout-color-lg-tip card dp-callout-position-default dp-callout-type-title-bar" style="border-color: #003087; border-radius: 5px;">
  <div class="card-body">
    <p class="card-title" style="text-align: left; background-color: #003087; color: #ffffff;">
      <span style="font-size: 10pt;">
        <em><strong style="border-color: #003087;"><span class="material-symbols-outlined" style="vertical-align: middle; color: white;">play_circle</span></strong></em>
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
        asignatura: 'Historia',
        url: '',
        imagen: '/assets/images/edu_card_organizer.png',
        icono: 'view_day',
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
        asignatura: 'Psicologia',
        url: '',
        imagen: '/assets/images/edu_card_highlight.png',
        icono: 'warning',
        html: `<div class="dp-callout dp-callout-placeholder card dp-callout-position-default dp-callout-type-info dp-callout-color-danger">
  <div class="dp-callout-side-emphasis">
    <span class="material-symbols-outlined dp-icon dp-default-icon text-white" style="font-size: 24px; display: block; margin-top: 15px;">warning</span>
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
        asignatura: 'Matematicas',
        url: '',
        imagen: '/assets/images/edu_card_cta.png',
        icono: 'menu_book',
        html: `<div class="dp-callout dp-callout-color-lg-tip card dp-callout-position-default dp-callout-type-title-bar" style="border-color: #003087; border-radius: 5px;">
  <div class="card-body">
    <p class="card-title" style="text-align: left; background-color: #003087; color: #ffffff;">
      <span style="font-size: 10pt;">
        <em><strong style="border-color: #003087;"><span class="material-symbols-outlined" style="vertical-align: middle; color: white;">menu_book</span></strong></em>
        <strong style="border-color: #003087;">Lectura</strong>
      </span>
    </p>
    <p>Introducción o invitación a lectura</p>
    <p><span><span style="color: #236fa1;">Acceso al documento (LINK)</span></span></p>
  </div>
</div>`
      },
      { 
        id: 5, 
        titulo: 'Llamado a la Acción: Podcast', 
        categoria: 'CTA', 
        asignatura: 'Historia',
        url: '',
        imagen: '/assets/images/edu_card_cta.png',
        icono: 'podcasts',
        html: `<div class="dp-callout dp-callout-color-lg-tip card dp-callout-position-default dp-callout-type-title-bar" style="border-color: #003087; border-radius: 5px;">
  <div class="card-body">
    <p class="card-title" style="text-align: left; background-color: #003087; color: #ffffff;">
      <span style="font-size: 10pt;">
        <em><strong style="border-color: #003087;"><span class="material-symbols-outlined" style="vertical-align: middle; color: white;">podcasts</span></strong></em>
        <strong style="border-color: #003087;">Podcast</strong>
      </span>
    </p>
    <p>Introducción o invitation a Podcast</p>
    <p><span><span style="color: #236fa1;">Acceso al audio (LINK)</span></span></p>
  </div>
</div>`
      },
      { 
        id: 6, 
        titulo: 'Llamado a la Acción: Consigna', 
        categoria: 'CTA', 
        asignatura: 'Psicologia',
        url: '',
        imagen: '/assets/images/edu_card_cta.png',
        icono: 'assignment',
        html: `<div class="dp-callout card dp-callout-position-default dp-callout-type-title-bar dp-callout-color-lg-info" style="border-radius: 5px;">
  <div class="card-body">
    <p class="card-title" style="text-align: left;">
      <span style="font-size: 10pt;">
        <strong style="border-color: #003087;">
          <span class="material-symbols-outlined" style="vertical-align: middle; color: #003087;">assignment</span>
          Actividad: NOMBRE DE ACTIVIDAD
        </strong>
      </span>
    </p>
    <p class="card-text"><span>Introducción o invitación a la actividad</span></p>
    <p class="card-text"><span style="color: #236fa1;">Acceso a la consigna</span></p>
  </div>
</div>`
      },
      { 
        id: 7, 
        titulo: 'Profundización', 
        categoria: 'RESALTADO', 
        asignatura: 'Matematicas',
        url: '',
        imagen: '/assets/images/edu_card_highlight.png',
        icono: 'lightbulb',
        html: `<div class="dp-callout dp-callout-placeholder card dp-callout-position-default dp-callout-type-info dp-callout-color-lg-warning">
  <div class="dp-callout-side-emphasis">
    <span class="material-symbols-outlined dp-icon dp-default-icon text-white" style="font-size: 24px; display: block; margin-top: 15px;">lightbulb</span>
  </div>
  <div class="card-body">
    <h3 class="card-title">Para pensar / Para saber más</h3>
    <p class="card-text" style="text-align: left;">
      <i><span>TEXTO - TEXTO - TEXTO</span></i>
    </p>
  </div>
</div>`
      },
      { 
        id: 8, 
        titulo: 'Tabs Horizontales', 
        categoria: 'ORGANIZADOR', 
        asignatura: 'Historia',
        url: '',
        imagen: '/assets/images/edu_card_organizer.png',
        icono: 'tab',
        html: `<div class="dp-panels-wrapper dp-tabs dp-panel-color-dp-secondary dp-panel-active-color-dp-primary">
  <div class="dp-panel-group">
    <h3 class="dp-panel-heading">TITULO 1</h3>
    <div class="dp-panel-content"><p><strong>TEXTO 1</strong></p></div>
  </div>
  <div class="dp-panel-group">
    <h3 class="dp-panel-heading">TITULO 2</h3>
    <div class="dp-panel-content"><p><strong>TEXTO 2</strong></p></div>
  </div>
</div>`
      },
      { 
        id: 9, 
        titulo: 'Resaltado Simple', 
        categoria: 'RESALTADO', 
        asignatura: 'Psicologia',
        url: '',
        imagen: '/assets/images/edu_card_highlight.png',
        icono: 'info',
        html: `<div class="dp-callout dp-callout-color-lg-tip card dp-callout-position-default dp-callout-type-title-bar" style="border-color: #003087; border-radius: 5px;">
  <div class="card-body">
    <p>TEXTO - TEXTO - TEXTO - TEXTO</p>
  </div>
</div>`
      }
  ];

  getTestData(): Observable<TestData> {
    return this.http.get<TestData>(`${this.baseUrl}pedagogia/recursos/`);
  }

  createResource(resourceData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}pedagogia/recursos/`, resourceData);
  }

  eliminarRecurso(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}pedagogia/recursos/${id}/`);
  }

  actualizarRecurso(id: number, nuevoHtml: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}pedagogia/recursos/${id}/`, { contenido: nuevoHtml });
  }

  getRecursosMock(): Observable<any[]> {
    // Retornamos de la API real
    return this.http.get<any[]>(`${this.baseUrl}pedagogia/recursos/`);
  }
}

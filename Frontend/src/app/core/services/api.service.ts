import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  private mapRecurso(recurso: any): any {
    return {
      id: recurso.id,
      titulo: recurso.titulo,
      categoria: recurso.categoria_nombre,
      asignatura: recurso.asignatura_nombre,
      html: recurso.contenido,
      url: recurso.url,
      imagen: this.getImagenParaCategoria(recurso.categoria_nombre),
      icono: this.getIconoParaCategoria(recurso.categoria_nombre)
    };
  }

  private getImagenParaCategoria(cat: string) {
    if (cat === 'ORGANIZADOR') return '/assets/images/edu_card_organizer.png';
    if (cat === 'RESALTADO') return '/assets/images/edu_card_highlight.png';
    return '/assets/images/edu_card_cta.png';
  }

  private getIconoParaCategoria(cat: string) {
    if (cat === 'ORGANIZADOR') return 'view_day';
    if (cat === 'RESALTADO') return 'warning';
    return 'play_circle';
  }

  getCategorias(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}pedagogia/categorias/`);
  }

  getAsignaturas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}pedagogia/asignaturas/`);
  }

  getRecursosMock(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}pedagogia/recursos/`).pipe(
      map(data => data.map(r => this.mapRecurso(r)))
    );
  }

  createResource(resourceData: any): Observable<any> {
    const payload = {
      titulo: resourceData.titulo,
      categoria: resourceData.categoria,
      asignatura: resourceData.asignatura,
      contenido: resourceData.html_content || '<div class="p-md bg-surface text-center font-bold">Nuevo Componente Vacío</div>',
      url: resourceData.url || '',
      tipo: 'video' // Valor por defecto requerido
    };
    return this.http.post(`${this.baseUrl}pedagogia/recursos/`, payload);
  }

  eliminarRecurso(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}pedagogia/recursos/${id}/`);
  }

  actualizarRecurso(id: number, nuevoHtml: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}pedagogia/recursos/${id}/`, { contenido: nuevoHtml });
  }

  enviarContacto(data: {nombre: string, email: string, mensaje: string}): Observable<any> {
    return this.http.post(`https://formsubmit.co/ajax/tecnologia.sied@ucc.edu.ar`, data);
  }
}

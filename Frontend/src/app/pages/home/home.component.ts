import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { TestData } from '../../models/api-response.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private apiService = inject(ApiService);
  
  recursos: any[] = [];
  cargando: boolean = true;

  ngOnInit(): void {
    // Consumimos los datos directamente desde el servicio simulado
    this.apiService.getRecursosMock().subscribe({
      next: (data) => {
        this.recursos = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar recursos:', err);
        this.cargando = false;
      }
    });
  }

  copiarHTML(recurso: any): void {
    // Generamos un HTML de prueba basado en el recurso seleccionado
    const htmlGenerado = `<!-- EduTools: ${recurso.titulo} -->\n<div class="edutools-plantilla edutools-${recurso.categoria.toLowerCase()}">\n  <h2>${recurso.titulo}</h2>\n  <p>Contenido oficial para Canvas LMS.</p>\n</div>`;
    
    navigator.clipboard.writeText(htmlGenerado).then(() => {
      alert(`¡Listo! El código HTML de "${recurso.titulo}" se ha copiado al portapapeles.`);
    }).catch(err => {
      console.error('Error al copiar al portapapeles: ', err);
    });
  }
}

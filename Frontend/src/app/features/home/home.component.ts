import { Component, OnInit, inject } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { TestData } from '../../core/models/api-response.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  host: {
    class: 'w-full flex flex-grow',
  },
})
export class HomeComponent implements OnInit {
  private apiService = inject(ApiService);
  private fb = inject(FormBuilder);

  recursos: any[] = [];
  cargando: boolean = true;

  recursoForm: FormGroup;
  mensajeExito: boolean = false;

  constructor() {
    this.recursoForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      categoria: ['', Validators.required],
      url: ['', [Validators.required, Validators.pattern('https?://.+')]],
    });
  }

  ngOnInit(): void {
    // Consumimos los datos directamente desde el servicio simulado
    this.cargarRecursos();
  }

  cargarRecursos(): void {
    this.apiService.getRecursosMock().subscribe({
      next: (data) => {
        this.recursos = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar recursos:', err);
        this.cargando = false;
      },
    });
  }

  onSubmit(): void {
    if (this.recursoForm.valid) {
      // Simular envío a la API
      this.apiService.createResource(this.recursoForm.value).subscribe(() => {
        this.mensajeExito = true;
        this.recursoForm.reset();

        // Recargar la lista simulada
        this.cargando = true;
        this.cargarRecursos();

        setTimeout(() => {
          this.mensajeExito = false;
        }, 3000);
      });
    }
  }

  esCampoInvalido(campo: string): boolean {
    const control = this.recursoForm.get(campo);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  copiarHTML(recurso: any): void {
    // Generamos un HTML de prueba basado en el recurso seleccionado
    const htmlGenerado = `<!-- EduTools: ${recurso.titulo} -->\n<div class="edutools-plantilla edutools-${recurso.categoria.toLowerCase()}">\n  <h2>${recurso.titulo}</h2>\n  <p>Contenido oficial para Canvas LMS.</p>\n</div>`;

    navigator.clipboard
      .writeText(htmlGenerado)
      .then(() => {
        alert(`¡Listo! El código HTML de "${recurso.titulo}" se ha copiado al portapapeles.`);
      })
      .catch((err) => {
        console.error('Error al copiar al portapapeles: ', err);
      });
  }
}

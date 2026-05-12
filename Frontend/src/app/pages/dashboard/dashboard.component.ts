import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  private fb = inject(FormBuilder);
  private apiService = inject(ApiService);

  recursoForm: FormGroup;
  mensajeExito: boolean = false;
  seccionActiva: string = 'recursos';

  // Recursos del Sandbox
  recursos: any[] = [];
  cargando: boolean = true;

  // Estado Configuración
  modoOscuro: boolean = false;
  prefijoClases: string = 'UCC-';

  setSeccion(seccion: string) {
    this.seccionActiva = seccion;
  }

  constructor() {
    this.recursoForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      categoria: ['', Validators.required],
      url: ['', [Validators.required, Validators.pattern('https?://.+')]]
    });
  }

  ngOnInit(): void {
    this.cargarRecursos();
  }

  cargarRecursos(): void {
    this.cargando = true;
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

  onSubmit(): void {
    if (this.recursoForm.valid) {
      this.apiService.createResource(this.recursoForm.value).subscribe(() => {
        this.mensajeExito = true;
        this.recursoForm.reset();
        this.cargarRecursos(); // Recargar recursos

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
    const htmlGenerado = `<!-- EduTools: ${recurso.titulo} -->\n<div class="${this.prefijoClases}plantilla ${this.prefijoClases}${recurso.categoria?.toLowerCase()}">\n  <h2>${recurso.titulo}</h2>\n  <p>Contenido oficial para Canvas LMS.</p>\n</div>`;
    
    navigator.clipboard.writeText(htmlGenerado).then(() => {
      alert(`¡Listo! El código HTML de "${recurso.titulo}" se ha copiado al portapapeles.`);
    }).catch(err => {
      console.error('Error al copiar al portapapeles: ', err);
    });
  }

  simularClickComponente(nombre: string) {
    alert(`Has hecho clic en el componente "${nombre}".\nEl código se copiaría al portapapeles con el prefijo ${this.prefijoClases}`);
  }

  toggleModoOscuro() {
    this.modoOscuro = !this.modoOscuro;
  }
}

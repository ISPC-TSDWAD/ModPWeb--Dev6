import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private fb = inject(FormBuilder);
  private apiService = inject(ApiService);
  private route = inject(ActivatedRoute);

  recursoForm: FormGroup;
  mensajeExito: boolean = false;
  seccionActiva: string = 'recursos';

  // Recursos del Sandbox
  recursos: any[] = [];
  cargando: boolean = true;
  recursoSeleccionado: any = null;

  // Estado Configuración
  modoOscuro: boolean = false;

  setSeccion(seccion: string) {
    this.seccionActiva = seccion;
  }

  seleccionarRecurso(recurso: any) {
    this.recursoSeleccionado = recurso;
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

    // Escuchar parámetros de URL para abrir la sección correcta
    this.route.queryParams.subscribe(params => {
      if (params['seccion']) {
        this.seccionActiva = params['seccion'];
      }
    });
  }

  cargarRecursos(): void {
    this.cargando = true;
    this.apiService.getRecursosMock().subscribe({
      next: (data) => {
        this.recursos = data;
        this.cargando = false;
        if (this.recursos.length > 0) {
          this.recursoSeleccionado = this.recursos[0];
        }
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

  copiarHTML(): void {
    if (!this.recursoSeleccionado || !this.recursoSeleccionado.html) return;
    
    // Si quisieran prefijos en un futuro se puede hacer un replace, pero por ahora se copia tal cual
    const htmlParaCopiar = this.recursoSeleccionado.html;
    
    navigator.clipboard.writeText(htmlParaCopiar).then(() => {
      alert(`¡Listo! El código HTML de "${this.recursoSeleccionado.titulo}" se ha copiado al portapapeles.`);
    }).catch(err => {
      console.error('Error al copiar al portapapeles: ', err);
    });
  }

  simularClickComponente(nombre: string) {
    alert(`Has hecho clic en el componente "${nombre}".`);
  }

  toggleModoOscuro() {
    this.modoOscuro = !this.modoOscuro;
  }
}

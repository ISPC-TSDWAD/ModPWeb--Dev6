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

  recursos: any[] = [];
  cargando: boolean = true;
  recursoSeleccionado: any = null;

  filtroMateria: string = 'Todas';

  // Configuración de elemento en Sandbox
  configElemento = {
    color: '#003087',
    mostrarIcono: true
  };
  
  // Tab state in Sandbox
  modoEditor: 'visual' | 'html' = 'visual';

  // Configuración Institucional Mock
  fotoInstitucional: string | ArrayBuffer | null = null;

  setSeccion(seccion: string) {
    this.seccionActiva = seccion;
  }

  seleccionarRecurso(recurso: any) {
    this.recursoSeleccionado = recurso;
    if(!this.recursoSeleccionado.htmlEditado) {
       this.recursoSeleccionado.htmlEditado = this.recursoSeleccionado.html;
    }
  }

  enviarASandbox(recurso: any) {
    this.seleccionarRecurso(recurso);
    this.seccionActiva = 'sandbox';
  }

  constructor() {
    this.recursoForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      categoria: ['', Validators.required],
      url: [''],
      html_content: ['']
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
          this.seleccionarRecurso(this.recursos[0]);
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

  onHtmlChange(event: Event) {
    const element = event.target as HTMLTextAreaElement;
    if (this.recursoSeleccionado) {
      this.recursoSeleccionado.htmlEditado = element.value;
    }
  }

  onVisualEdit(event: Event) {
    const element = event.target as HTMLElement;
    if (this.recursoSeleccionado) {
      this.recursoSeleccionado.htmlEditado = element.innerHTML;
    }
  }

  copiarHTML(): void {
    if (!this.recursoSeleccionado) return;
    const htmlParaCopiar = this.recursoSeleccionado.htmlEditado || this.recursoSeleccionado.html;
    
    navigator.clipboard.writeText(htmlParaCopiar).then(() => {
      alert(`¡Listo! El código HTML de "${this.recursoSeleccionado.titulo}" se ha copiado al portapapeles.`);
    }).catch(err => {
      console.error('Error al copiar al portapapeles: ', err);
    });
  }

  simularClickComponente(nombre: string) {
    this.seccionActiva = 'sandbox';
    let recurso = null;
    
    if (nombre === 'Tablas Comparativas' || nombre === 'Listas Dinámicas') {
      recurso = this.recursos.find(r => r.categoria === 'ORGANIZADOR');
    } else {
      recurso = this.recursos.find(r => r.categoria === 'CTA');
    }
    
    if (recurso) {
      this.seleccionarRecurso(recurso);
    }
  }

  onImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.fotoInstitucional = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  cambiarContrasena() {
    alert('¡Conexión de Seguridad Exitosa! Se ha enviado un token encriptado al backend para actualizar las credenciales de su cuenta.');
  }

  eliminarRecurso(id: number) {
    if (confirm('¿Está seguro de que desea eliminar este recurso del repositorio institucional?')) {
      this.apiService.eliminarRecurso(id).subscribe(() => {
        this.cargarRecursos();
      });
    }
  }

  exportarDoc() { alert('Exportando a DOC para ' + this.filtroMateria); }
  guardar() {
    if (this.recursoSeleccionado) {
      this.apiService.actualizarRecurso(this.recursoSeleccionado.id, this.recursoSeleccionado.htmlEditado).subscribe(() => {
        alert(`¡Cambios guardados en "${this.recursoSeleccionado.titulo}" exitosamente!`);
        this.cargarRecursos();
      });
    } else {
      alert('Seleccione un recurso para guardar.');
    }
  }

  descargarTxtHtml() {
    if (this.recursoSeleccionado && this.recursoSeleccionado.htmlEditado) {
      const blob = new Blob([this.recursoSeleccionado.htmlEditado], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `recurso_${this.recursoSeleccionado.id}.html`;
      a.click();
      window.URL.revokeObjectURL(url);
    } else {
      alert('No hay contenido HTML para descargar.');
    }
  }

  descargarHtml() {
    alert('Descargando compendio HTML de todos los recursos en ' + this.filtroMateria);
  }
  copiarComoImagen() { alert('Copiando previsualización como imagen al portapapeles...'); }
  deshacer() { alert('Deshacer acción (Mock)'); }
  rehacer() { alert('Rehacer acción (Mock)'); }

  getRecursosFiltrados() {
    if (this.filtroMateria === 'Todas') return this.recursos;
    return this.recursos; 
  }

  getRecursosPorCategoria(catStr: string) {
    return this.recursos.filter(r => r.categoria === catStr);
  }
}

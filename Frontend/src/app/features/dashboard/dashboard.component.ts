import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';

import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  private fb = inject(FormBuilder);
  private apiService = inject(ApiService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  recursoForm: FormGroup;
  mensajeExito: boolean = false;
  successMsg: string = '';
  seccionActiva: string = 'recursos';

  recursos: any[] = [];
  cargando: boolean = true;
  recursoSeleccionado: any = null;

  categorias: any[] = [];
  asignaturas: any[] = [];

  filtroMateria: string = 'Todas';

  // Configuración de elemento en Sandbox
  configElemento = {
    color: '#003087',
    mostrarIcono: true,
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
    if (!this.recursoSeleccionado.htmlEditado) {
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
      asignatura: ['Todas', Validators.required],
      url: [''],
      html_content: [''],
    });
  }

  ngOnInit(): void {
    this.cargarDatosMaestros();
    this.cargarRecursos();

    // Escuchar parámetros de URL para abrir la sección correcta
    this.route.queryParams.subscribe((params) => {
      if (params['seccion']) {
        this.seccionActiva = params['seccion'];
      }
    });
  }

  cargarDatosMaestros(): void {
    this.apiService.getCategorias().subscribe(data => this.categorias = data);
    this.apiService.getAsignaturas().subscribe(data => this.asignaturas = data);
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
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar recursos:', err);
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  onSubmit(): void {
    if (this.recursoForm.valid) {
      this.apiService.createResource(this.recursoForm.value).subscribe(() => {
        this.recursoForm.reset();
        this.cargarRecursos(); // Recargar recursos
        this.successMsg = '¡Recurso creado en el repositorio institucional con éxito!';

        setTimeout(() => {
          this.successMsg = '';
          this.cdr.detectChanges();
        }, 4000);
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

  formatText(command: string, value: string | undefined = undefined) {
    document.execCommand(command, false, value);
    const el = document.getElementById('rich-editor');
    if (el && this.recursoSeleccionado) {
      this.recursoSeleccionado.htmlEditado = el.innerHTML;
    }
  }

  copiarHTML(): void {
    if (!this.recursoSeleccionado) return;
    const htmlParaCopiar = this.recursoSeleccionado.htmlEditado || this.recursoSeleccionado.html;

    navigator.clipboard
      .writeText(htmlParaCopiar)
      .then(() => {
        alert(
          `¡Listo! El código HTML de "${this.recursoSeleccionado.titulo}" se ha copiado al portapapeles.`,
        );
      })
      .catch((err) => {
        console.error('Error al copiar al portapapeles: ', err);
      });
  }

  simularClickComponente(nombre: string) {
    this.seccionActiva = 'sandbox';
    let recurso = null;

    if (nombre === 'Tablas Comparativas' || nombre === 'Listas Dinámicas') {
      recurso = this.recursos.find((r) => r.categoria === 'ORGANIZADOR');
    } else {
      recurso = this.recursos.find((r) => r.categoria === 'CTA');
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
    alert(
      '¡Conexión de Seguridad Exitosa! Se ha enviado un token encriptado al backend para actualizar las credenciales de su cuenta.',
    );
  }

  eliminarRecurso(id: number) {
    if (confirm('¿Estás seguro de que querés eliminar este recurso del repositorio institucional?')) {
      this.apiService.eliminarRecurso(id).subscribe(() => {
        this.successMsg = '¡Recurso eliminado del repositorio institucional con éxito!';
        this.cargarRecursos();
        setTimeout(() => {
          this.successMsg = '';
          this.cdr.detectChanges();
        }, 4000);
      });
    }
  }

  exportarDoc() {
    const html = this.getRecursosFiltrados()
      .map((r) => r.htmlEditado || r.html)
      .join('<br><hr><br>');
    const blob = new Blob(
      [
        '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"></head><body>' +
          html +
          '</body></html>',
      ],
      { type: 'application/msword' },
    );
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recursos_${this.filtroMateria}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  guardar() {
    if (this.recursoSeleccionado) {
      this.apiService
        .actualizarRecurso(this.recursoSeleccionado.id, this.recursoSeleccionado.htmlEditado)
        .subscribe(() => {
          this.successMsg = `¡Cambios guardados en "${this.recursoSeleccionado.titulo}" exitosamente!`;
          this.cargarRecursos();
          setTimeout(() => {
            this.successMsg = '';
            this.cdr.detectChanges();
          }, 4000);
        });
    } else {
      alert('Seleccione un recurso para guardar.');
    }
  }

  menuPerfilAbierto = false;

  descargarHtml() {
    const html = this.getRecursosFiltrados()
      .map((r) => r.htmlEditado || r.html)
      .join('\n<hr>\n');
    const blob = new Blob(
      [
        '<!DOCTYPE html>\n<html>\n<head>\n<meta charset="utf-8">\n</head>\n<body>\n' +
          html +
          '\n</body>\n</html>',
      ],
      { type: 'text/html;charset=utf-8' },
    );
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recursos_${this.filtroMateria}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  copiarComoImagen() {
    alert('Copiando previsualización como imagen al portapapeles...');
  }
  deshacer() {
    alert('Deshacer acción (Mock)');
  }
  rehacer() {
    alert('Rehacer acción (Mock)');
  }

  onFiltroMateriaChange(event: Event) {
    this.filtroMateria = (event.target as HTMLSelectElement).value;
  }

  onColorChange(event: Event) {
    this.configElemento.color = (event.target as HTMLInputElement).value;
  }

  onMostrarIconoChange(event: Event) {
    this.configElemento.mostrarIcono = (event.target as HTMLInputElement).checked;
  }

  cerrarSesion() {
    alert('Cerrando sesión...');
    this.menuPerfilAbierto = false;
  }

  getRecursosFiltrados() {
    if (this.filtroMateria === 'Todas') return this.recursos;
    return this.recursos.filter((r) => r.asignatura === this.filtroMateria);
  }

  getRecursosPorCategoria(catStr: string) {
    return this.recursos.filter((r) => r.categoria === catStr);
  }
}

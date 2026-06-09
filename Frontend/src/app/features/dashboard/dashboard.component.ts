import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef, AfterViewInit } from '@angular/core';

import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  private fb = inject(FormBuilder);
  private apiService = inject(ApiService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  recursoForm: FormGroup;
  mensajeExito: boolean = false;
  successMsg: string = '';
  seccionActiva: string = 'recursos';
  rol: string = '';

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
    iconoNombre: ''
  };

  // Tab state in Sandbox
  modoEditor: 'visual' | 'html' | 'preview' = 'visual';

  // Configuración Institucional Mock
  fotoInstitucional: string | ArrayBuffer | null = null;

  // Observer para mantener LTR en el editor
  private rtlObserver: MutationObserver | null = null;

  setSeccion(seccion: string) {
    this.seccionActiva = seccion;
  }

  seleccionarRecurso(recurso: any) {
    this.recursoSeleccionado = recurso;
    if (!this.recursoSeleccionado.htmlEditado) {
      this.recursoSeleccionado.htmlEditado = this.recursoSeleccionado.html;
    }
    // Cargar el HTML manualmente en el editor (sin [innerHTML] binding de Angular)
    setTimeout(() => {
      const editor = document.getElementById('rich-editor');
      if (editor) {
        editor.innerHTML = this.recursoSeleccionado.htmlEditado || '';
      }
    }, 0);
  }

  sanitizarRTL(html: string): string {
    if (!html) return html;
    // Eliminar direction:rtl y dir=rtl del HTML del recurso
    return html
      .replace(/direction\s*:\s*rtl/gi, 'direction:ltr')
      .replace(/dir\s*=\s*["']rtl["']/gi, 'dir="ltr"');
  }

  enviarASandbox(recurso: any) {
    this.seleccionarRecurso(recurso);
    this.seccionActiva = 'sandbox';
    setTimeout(() => this.aplicarLTRConObserver(), 150);
  }

  ngAfterViewInit(): void {
    this.aplicarLTRConObserver();
  }

  ngOnDestroy(): void {
    if (this.rtlObserver) {
      this.rtlObserver.disconnect();
    }
  }

  aplicarLTRConObserver(): void {
    const editor = document.getElementById('rich-editor');
    if (!editor) return;

    // Aplicar LTR directamente en el editor y todos sus hijos
    this.forzarLTRRecursivo(editor);

    // Observar cambios en el DOM del editor y re-aplicar LTR
    if (this.rtlObserver) this.rtlObserver.disconnect();
    this.rtlObserver = new MutationObserver(() => {
      this.forzarLTRRecursivo(editor);
    });
    this.rtlObserver.observe(editor, { childList: true, subtree: true, attributes: true });
  }

  forzarLTRRecursivo(el: HTMLElement): void {
    el.setAttribute('dir', 'ltr');
    el.style.setProperty('direction', 'ltr', 'important');
    el.style.setProperty('unicode-bidi', 'normal', 'important');
    el.style.setProperty('text-align', 'left', 'important');
    // Aplicar a todos los elementos hijos también
    el.querySelectorAll('*').forEach((child) => {
      const htmlChild = child as HTMLElement;
      htmlChild.setAttribute('dir', 'ltr');
      htmlChild.style.setProperty('direction', 'ltr', 'important');
    });
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

    this.rol = localStorage.getItem('rol') || 'asesor';

    // Escuchar parámetros de URL para abrir la sección correcta
    this.route.queryParams.subscribe((params) => {
      if (params['seccion']) {
        this.seccionActiva = params['seccion'];
      } else if (this.rol === 'asesor') {
        this.seccionActiva = 'sandbox';
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

  onHtmlKeydown(event: KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault();
      const textarea = event.target as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      // Insert tab character
      textarea.value = textarea.value.substring(0, start) + '  ' + textarea.value.substring(end);
      
      // Update cursor position
      textarea.selectionStart = textarea.selectionEnd = start + 2;

      // Update model
      if (this.recursoSeleccionado) {
        this.recursoSeleccionado.htmlEditado = textarea.value;
      }
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

  insertLink() {
    const url = prompt('Ingrese la URL del enlace:', 'https://');
    if (url) {
      this.formatText('createLink', url);
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
          if (this.rol === 'asesor') {
            this.successMsg = `¡Copia personal creada exitosamente!`;
          } else {
            this.successMsg = `¡Cambios guardados en "${this.recursoSeleccionado.titulo}" exitosamente!`;
          }
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
    const selector = this.modoEditor === 'preview' ? '#preview-container' : '#rich-editor';
    const element = document.querySelector(selector) as HTMLElement;
    
    if (element) {
      this.successMsg = 'Generando imagen, por favor espere...';
      this.cdr.detectChanges();
      
      html2canvas(element, { useCORS: true, backgroundColor: '#ffffff' }).then((canvas) => {
        canvas.toBlob((blob) => {
          if (blob) {
            const item = new ClipboardItem({ 'image/png': blob });
            navigator.clipboard.write([item]).then(() => {
              this.successMsg = '¡Imagen copiada al portapapeles con éxito!';
              this.cdr.detectChanges();
              setTimeout(() => {
                this.successMsg = '';
                this.cdr.detectChanges();
              }, 4000);
            }).catch(err => {
              console.error('Error al copiar imagen:', err);
              this.successMsg = 'Error al copiar al portapapeles. Intente copiar el HTML.';
              this.cdr.detectChanges();
            });
          }
        });
      });
    }
  }

  deshacer() {
    this.formatText('undo');
  }

  rehacer() {
    this.formatText('redo');
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

  onIconoNombreChange(event: Event) {
    this.configElemento.iconoNombre = (event.target as HTMLInputElement).value;
  }

  activarVistaPrevia(): void {
    // Sincronizar el HTML del editor antes de mostrar la vista previa
    const editor = document.getElementById('rich-editor');
    if (editor && this.recursoSeleccionado && this.modoEditor === 'visual') {
      this.recursoSeleccionado.htmlEditado = editor.innerHTML;
    }
    this.modoEditor = 'preview';

    // Esperar a que Angular renderice el contenedor de vista previa
    setTimeout(() => {
      this.iniciarInteractividadVistaPrevia();
    }, 50);
  }

  iniciarInteractividadVistaPrevia(): void {
    const container = document.getElementById('preview-container');
    if (!container) return;

    // 1. Acordeones (.dp-accordion-default)
    const accordions = container.querySelectorAll('.dp-accordion-default');
    accordions.forEach((acc) => {
      const groups = acc.querySelectorAll('.dp-panel-group');
      groups.forEach((group, index) => {
        const heading = group.querySelector('.dp-panel-heading') as HTMLElement;
        const content = group.querySelector('.dp-panel-content') as HTMLElement;
        if (heading && content) {
          // Estilizar el heading para que parezca interactivo
          heading.style.cursor = 'pointer';
          heading.style.padding = '10px';
          heading.style.backgroundColor = '#f1f1f1';
          heading.style.border = '1px solid #ccc';
          heading.style.marginTop = '5px';
          heading.style.position = 'relative';
          
          // Ocultar todos los contenidos por defecto excepto el primero (opcional)
          content.style.display = 'none';
          content.style.padding = '10px';
          content.style.border = '1px solid #ccc';
          content.style.borderTop = 'none';

          // Agregar evento de click
          heading.addEventListener('click', () => {
            const isVisible = content.style.display === 'block';
            content.style.display = isVisible ? 'none' : 'block';
          });
        }
      });
    });

    // 2. Tabs (.dp-tabs)
    const tabsWrappers = container.querySelectorAll('.dp-tabs');
    tabsWrappers.forEach((tabsWrapper) => {
      const groups = tabsWrapper.querySelectorAll('.dp-panel-group');
      if (groups.length === 0) return;

      // Crear el contenedor de los botones de los tabs
      const tabsNav = document.createElement('div');
      tabsNav.style.display = 'flex';
      tabsNav.style.gap = '2px';
      tabsNav.style.marginBottom = '10px';
      tabsNav.style.borderBottom = '2px solid #003087';

      tabsWrapper.insertBefore(tabsNav, tabsWrapper.firstChild);

      groups.forEach((group, index) => {
        const heading = group.querySelector('.dp-panel-heading') as HTMLElement;
        const content = group.querySelector('.dp-panel-content') as HTMLElement;
        if (heading && content) {
          // Ocultar los headings originales
          heading.style.display = 'none';
          
          // Crear un botón para este tab
          const btn = document.createElement('button');
          btn.innerHTML = heading.innerHTML;
          btn.style.padding = '10px 20px';
          btn.style.cursor = 'pointer';
          btn.style.border = '1px solid #ccc';
          btn.style.borderBottom = 'none';
          btn.style.backgroundColor = index === 0 ? '#003087' : '#f1f1f1';
          btn.style.color = index === 0 ? 'white' : 'black';
          
          // Inicialmente mostrar solo el primer tab
          content.style.display = index === 0 ? 'block' : 'none';

          // Evento de click para cambiar de tab
          btn.addEventListener('click', () => {
            // Ocultar todos los contenidos
            groups.forEach(g => {
              const c = g.querySelector('.dp-panel-content') as HTMLElement;
              if (c) c.style.display = 'none';
            });
            // Resetear todos los botones
            Array.from(tabsNav.children).forEach((b: any) => {
              b.style.backgroundColor = '#f1f1f1';
              b.style.color = 'black';
            });
            
            // Mostrar este contenido y activar este botón
            content.style.display = 'block';
            btn.style.backgroundColor = '#003087';
            btn.style.color = 'white';
          });

          tabsNav.appendChild(btn);
        }
      });
    });
  }

  activarEditorHtml(): void {
    const editor = document.getElementById('rich-editor');
    if (editor && this.recursoSeleccionado && this.modoEditor === 'visual') {
      this.recursoSeleccionado.htmlEditado = editor.innerHTML;
    }
    this.modoEditor = 'html';
  }

  activarEditorVisual(): void {
    this.modoEditor = 'visual';
    // Esperar a que Angular renderice el div y cargar el contenido
    setTimeout(() => {
      const editor = document.getElementById('rich-editor');
      if (editor && this.recursoSeleccionado) {
        editor.innerHTML = this.recursoSeleccionado.htmlEditado || '';
      }
      this.aplicarLTRConObserver();
    }, 0);
  }

  aplicarEstilo(): void {
    const editor = document.getElementById('rich-editor');
    if (!editor || !this.recursoSeleccionado) return;

    const nuevoColor = this.configElemento.color;
    const mostrarIconos = this.configElemento.mostrarIcono;

    // 1. Cambiar border-color en el contenedor principal (dp-callout / card)
    editor.querySelectorAll('[style*="border-color"]').forEach((el) => {
      (el as HTMLElement).style.borderColor = nuevoColor;
    });
    // También aplicar a elementos con clase dp-callout que tengan borde
    editor.querySelectorAll('.dp-callout, .card').forEach((el) => {
      const htmlEl = el as HTMLElement;
      if (htmlEl.style.borderColor) {
        htmlEl.style.borderColor = nuevoColor;
      }
    });

    // 2. Cambiar background-color en las barras de título (card-title con fondo)
    editor.querySelectorAll('[style*="background-color"]').forEach((el) => {
      const htmlEl = el as HTMLElement;
      const bg = htmlEl.style.backgroundColor;
      // Solo cambiar fondos que no sean blancos/transparentes (los de título/header)
      if (bg && bg !== 'white' && bg !== 'transparent' && bg !== 'rgb(255, 255, 255)') {
        htmlEl.style.backgroundColor = nuevoColor;
      }
    });

    // 3. Cambiar color y nombre de íconos (material-symbols-outlined con color inline)
    editor.querySelectorAll('.material-symbols-outlined').forEach((el) => {
      const htmlEl = el as HTMLElement;
      if (htmlEl.style.color || htmlEl.getAttribute('style')?.includes('color')) {
        htmlEl.style.color = nuevoColor;
      }
      // Cambiar nombre del ícono si se proveyó uno
      if (this.configElemento.iconoNombre && this.configElemento.iconoNombre.trim() !== '') {
        htmlEl.innerText = this.configElemento.iconoNombre.trim();
      }
      // Controlar visibilidad de íconos
      htmlEl.style.display = mostrarIconos ? '' : 'none';
    });

    // 4. Cambiar color en textos con color de marca (links, spans con color específico)
    editor.querySelectorAll('[style*="color"]').forEach((el) => {
      const htmlEl = el as HTMLElement;
      const color = htmlEl.style.color;
      // Cambiar colores de marca (azules institucionales), no blanco ni negro
      if (color && color !== 'white' && color !== 'black' &&
          color !== 'rgb(255, 255, 255)' && color !== 'rgb(0, 0, 0)' &&
          !htmlEl.classList.contains('material-symbols-outlined')) {
        htmlEl.style.color = nuevoColor;
      }
    });

    // 5. Cambiar border-left en elementos con borde lateral decorativo
    editor.querySelectorAll('[class*="border-l"]').forEach((el) => {
      (el as HTMLElement).style.borderLeftColor = nuevoColor;
    });

    // Sincronizar el HTML editado con el modelo
    this.recursoSeleccionado.htmlEditado = editor.innerHTML;
    this.successMsg = `¡Estilo aplicado con color ${nuevoColor}!`;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.successMsg = '';
      this.cdr.detectChanges();
    }, 3000);
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

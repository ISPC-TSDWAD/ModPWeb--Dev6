import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';

import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ApiService } from '../../core/services/api.service';
import { UserService } from '../../core/services/user.service';
import { I18nService, Lang } from '../../core/services/i18n.service';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import html2canvas from 'html2canvas';

type A11yIssue = { tipo: 'error' | 'warn'; mensaje: string };

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, TranslatePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  private fb = inject(FormBuilder);
  private apiService = inject(ApiService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  private sanitizer = inject(DomSanitizer);
  private userService = inject(UserService);
  private i18n = inject(I18nService);

  recursoForm: FormGroup;

  // --- Configuración: perfil real del usuario ---
  perfilForm: FormGroup;
  passwordForm: FormGroup;
  usuarioId: number | null = null;
  usuarioRolDisplay = '';
  perfilMsg = '';
  passwordMsg = '';
  passwordError = '';
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
  modoEditor: 'visual' | 'html' | 'preview' | 'paneles' = 'visual';

  // Guías de edición (etiquetas Título/Contenido) en el editor visual
  mostrarGuias = true;

  // Configuración Institucional Mock
  fotoInstitucional: string | ArrayBuffer | null = null;

  // --- Accesibilidad del contenido generado ---
  a11yIssues: A11yIssue[] = [];
  a11yPanelAbierto = false;
  private a11yDebounce: any = null;

  // HTML "confiable" para la vista previa (se renderiza fiel, sin que Angular
  // recorte estilos en línea). Se recalcula sólo al entrar a Vista Previa.
  previewSafeHtml: SafeHtml = '';

  // --- Editor estructurado de paneles (tabs / acordeón) ---
  tipoPanel: 'tabs' | 'acordeon' | null = null;
  paneles: { titulo: string; contenido: string }[] = [];
  private panelWrapperClass = '';

  setSeccion(seccion: string) {
    this.seccionActiva = seccion;
  }

  seleccionarRecurso(recurso: any) {
    this.recursoSeleccionado = recurso;
    if (!this.recursoSeleccionado.htmlEditado) {
      // Limpiamos el RTL una sola vez, en el origen, al traer el recurso.
      this.recursoSeleccionado.htmlEditado = this.sanitizarRTL(this.recursoSeleccionado.html || '');
    }
    this.actualizarDeteccionPaneles();
    if (this.modoEditor === 'paneles') {
      this.parsearPaneles();
    } else if (this.modoEditor === 'preview') {
      // Si estamos en vista previa, refrescamos el render en vez del editor.
      this.activarVistaPrevia();
    } else {
      // Cargar el HTML en el editor (sin [innerHTML] binding de Angular)
      setTimeout(() => this.cargarHtmlEnEditor(), 0);
    }
    this.revisarAccesibilidad();
  }

  /** Detecta si el recurso actual es un componente de paneles (tabs/acordeón). */
  private actualizarDeteccionPaneles(): void {
    this.tipoPanel = this.detectarTipoPanel(this.recursoSeleccionado?.htmlEditado || '');
  }

  private detectarTipoPanel(html: string): 'tabs' | 'acordeon' | null {
    if (!html) return null;
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const wrapper = doc.querySelector('.dp-panels-wrapper');
    if (!wrapper || !wrapper.querySelector('.dp-panel-group')) return null;
    if (wrapper.classList.contains('dp-tabs')) return 'tabs';
    if (wrapper.classList.contains('dp-accordion-default')) return 'acordeon';
    return 'tabs';
  }

  /** Vuelca el HTML del recurso seleccionado dentro del contenteditable. */
  private cargarHtmlEnEditor(): void {
    const editor = document.getElementById('rich-editor');
    if (editor && this.recursoSeleccionado) {
      editor.innerHTML = this.sanitizarRTL(this.recursoSeleccionado.htmlEditado || '');
    }
  }

  sanitizarRTL(html: string): string {
    if (!html) return html;
    // Eliminar direction:rtl y dir=rtl del HTML del recurso (causa del "texto al revés")
    return html
      .replace(/direction\s*:\s*rtl/gi, 'direction:ltr')
      .replace(/dir\s*=\s*["']rtl["']/gi, 'dir="ltr"');
  }

  enviarASandbox(recurso: any) {
    this.seccionActiva = 'sandbox';
    this.modoEditor = 'visual';
    this.seleccionarRecurso(recurso);
  }

  constructor() {
    this.recursoForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      categoria: ['', Validators.required],
      asignatura: ['Todas', Validators.required],
      url: [''],
      html_content: [''],
    });

    this.perfilForm = this.fb.group({
      first_name: [''],
      last_name: [''],
      email: ['', [Validators.email]],
    });

    this.passwordForm = this.fb.group({
      actual: ['', [Validators.required]],
      nueva: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    this.cargarDatosMaestros();
    this.cargarRecursos();
    this.cargarPerfil();

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
    this.apiService.getRecursos().subscribe({
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
      this.revisarAccesibilidadDebounced();
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
      this.revisarAccesibilidadDebounced();
    }
  }

  formatText(command: string, value: string | undefined = undefined) {
    const el = document.getElementById('rich-editor');
    if (!el) return;
    // Enfocar el editor antes de ejecutar el comando: así la alineación,
    // el color y deshacer/rehacer funcionan aunque el foco esté en la toolbar.
    el.focus();
    document.execCommand(command, false, value);
    if (this.recursoSeleccionado) {
      this.recursoSeleccionado.htmlEditado = el.innerHTML;
      this.revisarAccesibilidadDebounced();
    }
  }

  insertLink() {
    const url = prompt('Ingrese la URL del enlace:', 'https://');
    if (url) {
      this.formatText('createLink', url);
    }
  }

  /** Inserta una imagen exigiendo texto alternativo (accesibilidad / WCAG 1.1.1). */
  insertImage() {
    const url = prompt('URL de la imagen:', 'https://');
    if (!url) return;
    const alt = prompt(
      'Texto alternativo (alt): describí la imagen para personas que usan lectores de pantalla.\n' +
        'Dejalo vacío sólo si la imagen es puramente decorativa.',
      '',
    );
    if (alt === null) return; // canceló
    const el = document.getElementById('rich-editor');
    if (!el) return;
    el.focus();
    const html = `<img src="${this.escaparHtml(url)}" alt="${this.escaparHtml(
      alt.trim(),
    )}" style="max-width:100%;height:auto;" />`;
    document.execCommand('insertHTML', false, html);
    if (this.recursoSeleccionado) {
      this.recursoSeleccionado.htmlEditado = el.innerHTML;
      this.revisarAccesibilidad();
    }
  }

  private escaparHtml(texto: string): string {
    return texto
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
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

  private rolLabels: Record<string, string> = {
    admin: 'Administrador',
    asesor: 'Asesor Pedagógico',
    maquetador: 'Maquetador',
  };

  // --- Idioma de la plataforma ---
  get idiomaActual(): Lang {
    return this.i18n.lang;
  }

  onIdiomaChange(event: Event): void {
    const lang = (event.target as HTMLSelectElement).value as Lang;
    this.i18n.setLang(lang);
  }

  guardarPreferencias(): void {
    // El idioma ya se aplica al instante al elegirlo; el botón solo confirma.
    this.successMsg = this.i18n.t('config.langSaved');
    this.cdr.detectChanges();
    setTimeout(() => {
      this.successMsg = '';
      this.cdr.detectChanges();
    }, 3000);
  }

  cargarPerfil(): void {
    this.userService.getMe().subscribe({
      next: (u) => {
        this.usuarioId = u.id ?? null;
        this.usuarioRolDisplay = this.rolLabels[u.rol || ''] || (u.rol || '—');
        this.perfilForm.patchValue({
          first_name: u.first_name || '',
          last_name: u.last_name || '',
          email: u.email || '',
        });
        this.cdr.detectChanges();
      },
      error: (err) => console.error('No se pudo cargar el perfil:', err),
    });
  }

  guardarPerfil(): void {
    if (this.perfilForm.invalid) {
      this.perfilForm.markAllAsTouched();
      return;
    }
    this.userService.updateMe(this.perfilForm.value).subscribe({
      next: () => {
        this.perfilMsg = 'Perfil actualizado correctamente.';
        this.cdr.detectChanges();
        setTimeout(() => {
          this.perfilMsg = '';
          this.cdr.detectChanges();
        }, 4000);
      },
      error: () => {
        this.perfilMsg = 'No se pudo actualizar el perfil.';
        this.cdr.detectChanges();
      },
    });
  }

  cambiarContrasena() {
    this.passwordMsg = '';
    this.passwordError = '';
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    const { actual, nueva } = this.passwordForm.value;
    this.userService.changePassword(actual, nueva).subscribe({
      next: () => {
        this.passwordMsg = 'Contraseña actualizada correctamente.';
        this.passwordForm.reset();
        this.cdr.detectChanges();
        setTimeout(() => {
          this.passwordMsg = '';
          this.cdr.detectChanges();
        }, 4000);
      },
      error: (err) => {
        this.passwordError = err?.error?.detail || 'No se pudo cambiar la contraseña.';
        this.cdr.detectChanges();
      },
    });
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
    // Render fiel: marcamos el HTML como confiable para que Angular no recorte
    // estilos en línea ni atributos del recurso institucional.
    const limpio = this.sanitizarRTL(this.recursoSeleccionado?.htmlEditado || '');
    this.previewSafeHtml = this.sanitizer.bypassSecurityTrustHtml(limpio);
    this.modoEditor = 'preview';

    // Esperar a que Angular renderice el contenedor de vista previa
    setTimeout(() => {
      this.iniciarInteractividadVistaPrevia();
    }, 50);
  }

  iniciarInteractividadVistaPrevia(): void {
    const container = document.getElementById('preview-container');
    if (!container) return;

    // 1. Acordeones (.dp-accordion-default) — patrón WAI-ARIA "Accordion"
    const accordions = container.querySelectorAll('.dp-accordion-default');
    accordions.forEach((acc, accIndex) => {
      const groups = acc.querySelectorAll('.dp-panel-group');
      groups.forEach((group, index) => {
        const heading = group.querySelector('.dp-panel-heading') as HTMLElement;
        const content = group.querySelector('.dp-panel-content') as HTMLElement;
        if (!heading || !content) return;

        const headingId = `acc-${accIndex}-head-${index}`;
        const contentId = `acc-${accIndex}-panel-${index}`;

        // Estilizar el heading para que parezca interactivo
        heading.style.cursor = 'pointer';
        heading.style.padding = '10px';
        heading.style.backgroundColor = '#f1f1f1';
        heading.style.border = '1px solid #ccc';
        heading.style.marginTop = '5px';
        heading.style.position = 'relative';

        // Semántica accesible: el encabezado se comporta como botón expandible
        heading.id = headingId;
        heading.setAttribute('role', 'button');
        heading.setAttribute('tabindex', '0');
        heading.setAttribute('aria-expanded', 'false');
        heading.setAttribute('aria-controls', contentId);

        // El contenido es una región controlada por el encabezado
        content.id = contentId;
        content.setAttribute('role', 'region');
        content.setAttribute('aria-labelledby', headingId);
        content.style.display = 'none';
        content.style.padding = '10px';
        content.style.border = '1px solid #ccc';
        content.style.borderTop = 'none';

        const toggle = () => {
          const abierto = heading.getAttribute('aria-expanded') === 'true';
          heading.setAttribute('aria-expanded', String(!abierto));
          content.style.display = abierto ? 'none' : 'block';
        };

        heading.addEventListener('click', toggle);
        heading.addEventListener('keydown', (e: KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggle();
          }
        });
      });
    });

    // 2. Tabs (.dp-tabs) — patrón WAI-ARIA "Tabs" con navegación por flechas
    const tabsWrappers = container.querySelectorAll('.dp-tabs');
    tabsWrappers.forEach((tabsWrapper, tabsIndex) => {
      const groups = Array.from(tabsWrapper.querySelectorAll('.dp-panel-group'));
      if (groups.length === 0) return;

      const tabsNav = document.createElement('div');
      tabsNav.setAttribute('role', 'tablist');
      tabsNav.style.display = 'flex';
      tabsNav.style.gap = '2px';
      tabsNav.style.marginBottom = '10px';
      tabsNav.style.borderBottom = '2px solid #003087';

      tabsWrapper.insertBefore(tabsNav, tabsWrapper.firstChild);

      const botones: HTMLButtonElement[] = [];

      const activar = (index: number) => {
        groups.forEach((g, i) => {
          const c = g.querySelector('.dp-panel-content') as HTMLElement;
          const b = botones[i];
          const activo = i === index;
          if (c) c.style.display = activo ? 'block' : 'none';
          if (b) {
            b.setAttribute('aria-selected', String(activo));
            b.tabIndex = activo ? 0 : -1;
            b.style.backgroundColor = activo ? '#003087' : '#f1f1f1';
            b.style.color = activo ? 'white' : 'black';
          }
        });
      };

      groups.forEach((group, index) => {
        const heading = group.querySelector('.dp-panel-heading') as HTMLElement;
        const content = group.querySelector('.dp-panel-content') as HTMLElement;
        if (!heading || !content) return;

        const tabId = `tab-${tabsIndex}-${index}`;
        const panelId = `tabpanel-${tabsIndex}-${index}`;

        heading.style.display = 'none';

        const btn = document.createElement('button');
        btn.innerHTML = heading.innerHTML;
        btn.id = tabId;
        btn.type = 'button';
        btn.setAttribute('role', 'tab');
        btn.setAttribute('aria-controls', panelId);
        btn.style.padding = '10px 20px';
        btn.style.cursor = 'pointer';
        btn.style.border = '1px solid #ccc';
        btn.style.borderBottom = 'none';

        content.id = panelId;
        content.setAttribute('role', 'tabpanel');
        content.setAttribute('aria-labelledby', tabId);

        btn.addEventListener('click', () => activar(index));
        btn.addEventListener('keydown', (e: KeyboardEvent) => {
          let destino = -1;
          if (e.key === 'ArrowRight') destino = (index + 1) % botones.length;
          else if (e.key === 'ArrowLeft') destino = (index - 1 + botones.length) % botones.length;
          else if (e.key === 'Home') destino = 0;
          else if (e.key === 'End') destino = botones.length - 1;
          if (destino >= 0) {
            e.preventDefault();
            activar(destino);
            botones[destino].focus();
          }
        });

        botones.push(btn);
        tabsNav.appendChild(btn);
      });

      activar(0);
    });
  }

  /** Vuelca lo que está en el contenteditable hacia el modelo (antes de cambiar de modo). */
  private sincronizarDesdeEditor(): void {
    const editor = document.getElementById('rich-editor');
    if (editor && this.recursoSeleccionado && this.modoEditor === 'visual') {
      this.recursoSeleccionado.htmlEditado = editor.innerHTML;
    }
  }

  activarEditorHtml(): void {
    this.sincronizarDesdeEditor();
    this.modoEditor = 'html';
    this.actualizarDeteccionPaneles();
  }

  activarEditorVisual(): void {
    this.modoEditor = 'visual';
    this.actualizarDeteccionPaneles();
    // Esperar a que Angular renderice el div y cargar el contenido
    setTimeout(() => this.cargarHtmlEnEditor(), 0);
  }

  toggleGuias(): void {
    this.mostrarGuias = !this.mostrarGuias;
  }

  /** Restaura el componente al HTML original del recurso (red de seguridad). */
  restaurarComponente(): void {
    if (!this.recursoSeleccionado) return;
    if (
      !confirm(
        '¿Restaurar este componente a su versión original? Se perderán los cambios no guardados.',
      )
    ) {
      return;
    }
    this.recursoSeleccionado.htmlEditado = this.sanitizarRTL(this.recursoSeleccionado.html || '');
    this.actualizarDeteccionPaneles();
    if (this.modoEditor === 'paneles') {
      this.parsearPaneles();
    } else if (this.modoEditor === 'preview') {
      this.activarVistaPrevia();
    } else {
      setTimeout(() => this.cargarHtmlEnEditor(), 0);
    }
    this.revisarAccesibilidad();
    this.successMsg = 'Componente restaurado a su versión original.';
    this.cdr.detectChanges();
    setTimeout(() => {
      this.successMsg = '';
      this.cdr.detectChanges();
    }, 3000);
  }

  // ============================================================
  //  Editor estructurado de paneles (tabs / acordeón)
  // ============================================================

  activarEditorPaneles(): void {
    this.sincronizarDesdeEditor();
    this.actualizarDeteccionPaneles();
    this.parsearPaneles();
    this.modoEditor = 'paneles';
  }

  /** Lee el HTML del recurso y arma la lista editable de paneles. */
  private parsearPaneles(): void {
    const html = this.recursoSeleccionado?.htmlEditado || '';
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const wrapper = doc.querySelector('.dp-panels-wrapper');
    if (!wrapper) {
      this.paneles = [];
      this.panelWrapperClass = '';
      return;
    }
    this.panelWrapperClass = wrapper.className;
    const grupos = Array.from(wrapper.children).filter((c) =>
      c.classList.contains('dp-panel-group'),
    );
    this.paneles = grupos.map((g) => ({
      titulo: (g.querySelector('.dp-panel-heading')?.textContent || '').trim(),
      contenido: ((g.querySelector('.dp-panel-content') as HTMLElement)?.innerHTML || '').trim(),
    }));
  }

  /** Reconstruye el HTML del componente a partir de la lista de paneles. */
  private serializarPaneles(): void {
    if (!this.recursoSeleccionado) return;
    const wrapperClass = this.panelWrapperClass || 'dp-panels-wrapper dp-tabs';
    const grupos = this.paneles
      .map(
        (p) =>
          `  <div class="dp-panel-group">\n` +
          `    <h3 class="dp-panel-heading">${this.escaparHtml(p.titulo)}</h3>\n` +
          `    <div class="dp-panel-content">${p.contenido || '<p></p>'}</div>\n` +
          `  </div>`,
      )
      .join('\n');
    this.recursoSeleccionado.htmlEditado = `<div class="${wrapperClass}">\n${grupos}\n</div>`;
    this.revisarAccesibilidadDebounced();
  }

  onPanelTituloChange(index: number, event: Event): void {
    this.paneles[index].titulo = (event.target as HTMLInputElement).value;
    this.serializarPaneles();
  }

  onPanelContenidoChange(index: number, event: Event): void {
    this.paneles[index].contenido = (event.target as HTMLTextAreaElement).value;
    this.serializarPaneles();
  }

  agregarPanel(): void {
    const n = this.paneles.length + 1;
    this.paneles.push({ titulo: `Nuevo título ${n}`, contenido: '<p>Nuevo contenido</p>' });
    this.serializarPaneles();
  }

  eliminarPanel(index: number): void {
    const etiqueta = this.tipoPanel === 'acordeon' ? 'sección' : 'pestaña';
    if (!confirm(`¿Eliminar la ${etiqueta} "${this.paneles[index].titulo}"?`)) return;
    this.paneles.splice(index, 1);
    this.serializarPaneles();
  }

  moverPanel(index: number, direccion: -1 | 1): void {
    const destino = index + direccion;
    if (destino < 0 || destino >= this.paneles.length) return;
    [this.paneles[index], this.paneles[destino]] = [this.paneles[destino], this.paneles[index]];
    this.serializarPaneles();
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
    this.revisarAccesibilidad();
    this.successMsg = `¡Estilo aplicado con color ${nuevoColor}!`;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.successMsg = '';
      this.cdr.detectChanges();
    }, 3000);
  }

  // ============================================================
  //  Accesibilidad del contenido generado (WCAG)
  // ============================================================

  private revisarAccesibilidadDebounced(): void {
    clearTimeout(this.a11yDebounce);
    this.a11yDebounce = setTimeout(() => {
      this.revisarAccesibilidad();
      this.cdr.detectChanges();
    }, 500);
  }

  /** Analiza el HTML del recurso y reporta problemas de accesibilidad. */
  revisarAccesibilidad(): void {
    const html = this.recursoSeleccionado?.htmlEditado || '';
    const issues: A11yIssue[] = [];
    const doc = new DOMParser().parseFromString(html, 'text/html');

    // 1.1.1 Imágenes con texto alternativo
    doc.querySelectorAll('img').forEach((img) => {
      const src = (img.getAttribute('src') || '').slice(0, 40);
      if (!img.hasAttribute('alt')) {
        issues.push({ tipo: 'error', mensaje: `Imagen sin atributo alt (${src}…).` });
      } else if (img.getAttribute('alt')!.trim() === '') {
        issues.push({
          tipo: 'warn',
          mensaje: 'Imagen con alt vacío: válido sólo si es decorativa.',
        });
      }
    });

    // 2.4.4 Enlaces con texto descriptivo
    doc.querySelectorAll('a').forEach((a) => {
      const txt = (a.textContent || '').trim();
      const tieneImgConAlt = !!a.querySelector('img[alt]:not([alt=""])');
      if (!txt && !tieneImgConAlt) {
        issues.push({ tipo: 'error', mensaje: 'Enlace sin texto descriptivo.' });
      } else if (/^(aqu[íi]|clic[k]? aqu[íi]|m[áa]s|leer m[áa]s|ver|link|este enlace)$/i.test(txt)) {
        issues.push({ tipo: 'warn', mensaje: `Enlace poco descriptivo: "${txt}".` });
      }
    });

    // 1.3.1 Jerarquía de encabezados sin saltos
    const headings = Array.from(doc.querySelectorAll('h1,h2,h3,h4,h5,h6'));
    let nivelPrevio = 0;
    headings.forEach((h) => {
      const nivel = Number(h.tagName.charAt(1));
      if (nivelPrevio && nivel > nivelPrevio + 1) {
        issues.push({
          tipo: 'warn',
          mensaje: `Salto en la jerarquía de encabezados (de H${nivelPrevio} a H${nivel}).`,
        });
      }
      nivelPrevio = nivel;
    });

    // 1.3.1 Tablas con encabezados
    doc.querySelectorAll('table').forEach((t) => {
      if (!t.querySelector('th')) {
        issues.push({ tipo: 'warn', mensaje: 'Tabla sin celdas de encabezado (<th>).' });
      }
    });

    // 2.2.x / 1.1.1 iframes (videos) sin título
    doc.querySelectorAll('iframe').forEach((f) => {
      if (!(f.getAttribute('title') || '').trim()) {
        issues.push({ tipo: 'warn', mensaje: 'Video/iframe sin atributo title.' });
      }
    });

    this.a11yIssues = issues;
  }

  get a11yErrores(): number {
    return this.a11yIssues.filter((i) => i.tipo === 'error').length;
  }

  get a11yAdvertencias(): number {
    return this.a11yIssues.filter((i) => i.tipo === 'warn').length;
  }

  toggleA11yPanel(): void {
    this.a11yPanelAbierto = !this.a11yPanelAbierto;
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

import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import emailjs from '@emailjs/browser';
import { environment } from '../../../environments/environment';
import { I18nService } from '../../core/services/i18n.service';
import { TranslatePipe } from '../../core/pipes/translate.pipe';

const EMAILJS_SERVICE_ID  = environment.emailjs.serviceId;
const EMAILJS_TEMPLATE_ID = environment.emailjs.templateId;
const EMAILJS_PUBLIC_KEY  = environment.emailjs.publicKey;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  host: {
    class: 'w-full flex flex-grow',
  },
})
export class HomeComponent {
  private fb = inject(FormBuilder);
  private i18n = inject(I18nService);

  contactoForm: FormGroup;
  mostrarModalContacto: boolean = false;
  mensajeContactoExito: boolean = false;
  enviando: boolean = false;
  mensajeError: string | null = null;

  constructor() {
    this.contactoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      mensaje: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  abrirModalContacto(): void {
    this.mostrarModalContacto = true;
  }

  cerrarModalContacto(): void {
    this.mostrarModalContacto = false;
    this.contactoForm.reset();
  }

  enviarContacto(): void {
    if (this.contactoForm.valid) {
      this.enviando = true;
      this.mensajeError = null;

      const templateParams = {
        nombre:  this.contactoForm.value.nombre,
        email:   this.contactoForm.value.email,
        mensaje: this.contactoForm.value.mensaje,
      };

      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY)
        .then(() => {
          this.enviando = false;
          this.mensajeContactoExito = true;
          setTimeout(() => {
            this.mensajeContactoExito = false;
            this.cerrarModalContacto();
          }, 3000);
        })
        .catch((err) => {
          this.enviando = false;
          this.mensajeError = this.i18n.t('home.errorSend');
          console.error('EmailJS error:', err);
        });
    }
  }

  esCampoContactoInvalido(campo: string): boolean {
    const control = this.contactoForm.get(campo);
    return !!control && control.invalid && (control.dirty || control.touched);
  }
}


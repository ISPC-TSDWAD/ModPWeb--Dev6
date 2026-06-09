import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID  = 'service_3y3pw1p';
const EMAILJS_TEMPLATE_ID = 'template_9vvt6sp';
const EMAILJS_PUBLIC_KEY  = '9cN1Mkf-LhR9V2aoy';

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
export class HomeComponent {
  private fb = inject(FormBuilder);

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
          this.mensajeError = 'Hubo un error al enviar el mensaje. Inténtalo de nuevo más tarde.';
          console.error('EmailJS error:', err);
        });
    }
  }

  esCampoContactoInvalido(campo: string): boolean {
    const control = this.contactoForm.get(campo);
    return !!control && control.invalid && (control.dirty || control.touched);
  }
}


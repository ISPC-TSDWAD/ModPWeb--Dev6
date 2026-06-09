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
export class HomeComponent {
  private fb = inject(FormBuilder);

  contactoForm: FormGroup;
  mostrarModalContacto: boolean = false;
  mensajeContactoExito: boolean = false;
  enviando: boolean = false;
  mensajeError: string | null = null;
  private apiService = inject(ApiService);

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
      
      this.apiService.enviarContacto(this.contactoForm.value).subscribe({
        next: (res) => {
          this.enviando = false;
          this.mensajeContactoExito = true;
          setTimeout(() => {
            this.mensajeContactoExito = false;
            this.cerrarModalContacto();
          }, 3000);
        },
        error: (err) => {
          this.enviando = false;
          this.mensajeError = 'Hubo un error al enviar el mensaje. Inténtalo de nuevo más tarde.';
          console.error('Error al enviar contacto', err);
        }
      });
    }
  }

  esCampoContactoInvalido(campo: string): boolean {
    const control = this.contactoForm.get(campo);
    return !!control && control.invalid && (control.dirty || control.touched);
  }
}

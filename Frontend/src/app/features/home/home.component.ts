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
      // Simular envío de email
      console.log('Enviando email de contacto:', this.contactoForm.value);
      this.mensajeContactoExito = true;
      setTimeout(() => {
        this.mensajeContactoExito = false;
        this.cerrarModalContacto();
      }, 3000);
    }
  }

  esCampoContactoInvalido(campo: string): boolean {
    const control = this.contactoForm.get(campo);
    return !!control && control.invalid && (control.dirty || control.touched);
  }
}

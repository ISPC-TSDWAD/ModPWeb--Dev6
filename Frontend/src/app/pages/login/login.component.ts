import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  host: {
    'class': 'w-full flex flex-grow'
  }
})
export class LoginComponent {
  private router = inject(Router);

  username = '';
  password = '';
  errorMsg = '';
  showPassword = false;

  // Credenciales válidas (frontend-only, según README)
  private readonly VALID_USER = 'admin';
  private readonly VALID_EMAIL = 'admin@edutools.edu.ar';
  private readonly VALID_PASS = 'Admin1234!';

  login() {
    this.errorMsg = '';

    if (!this.username.trim() || !this.password.trim()) {
      this.errorMsg = 'Por favor completá usuario y contraseña.';
      return;
    }

    const userOk = this.username.trim() === this.VALID_USER || this.username.trim() === this.VALID_EMAIL;
    const passOk = this.password === this.VALID_PASS;

    if (userOk && passOk) {
      localStorage.setItem('isLoggedIn', 'true');
      this.router.navigate(['/home']);
    } else {
      this.errorMsg = 'Usuario o contraseña incorrectos.';
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}

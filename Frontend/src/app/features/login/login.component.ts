import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  host: {
    class: 'w-full flex flex-grow',
  },
})
export class LoginComponent {
  private router = inject(Router);

  username = '';
  password = '';
  errorMsg = '';
  showPassword = false;

  private authService = inject(AuthService);

  login() {
    this.errorMsg = '';

    if (!this.username.trim() || !this.password.trim()) {
      this.errorMsg = 'Por favor completá usuario y contraseña.';
      return;
    }

    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: () => {
        this.errorMsg = 'Usuario o contraseña incorrectos.';
      }
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}

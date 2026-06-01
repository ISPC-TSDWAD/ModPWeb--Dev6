import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

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
  private apiService = inject(ApiService);

  username = '';
  password = '';
  errorMsg = '';
  showPassword = false;

  login() {
    this.errorMsg = '';
    if (!this.username.trim() || !this.password.trim()) {
      this.errorMsg = 'Por favor completá usuario y contraseña.';
      return;
    }

    this.apiService.login(this.username, this.password).subscribe({
      next: (res) => {
        localStorage.setItem('access_token', res.access);
        localStorage.setItem('refresh_token', res.refresh);
        localStorage.setItem('isLoggedIn', 'true');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.errorMsg = 'Usuario o contraseña incorrectos.';
      }
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}

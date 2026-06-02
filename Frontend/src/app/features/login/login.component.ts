import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
export class LoginComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);

  username = '';
  password = '';
  errorMsg = '';
  showPassword = false;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['sessionExpired'] === 'true') {
        this.errorMsg = 'Tu sesión expiró, por favor volvé a iniciar sesión.';
      } else if (params['loginRequired'] === 'true') {
        this.errorMsg = 'Por favor, iniciá sesión para acceder a esta página.';
      }
    });
  }

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

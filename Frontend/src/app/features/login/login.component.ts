import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { I18nService } from '../../core/services/i18n.service';
import { TranslatePipe } from '../../core/pipes/translate.pipe';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './login.component.html',
  host: {
    class: 'w-full flex flex-grow',
  },
})
export class LoginComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private i18n = inject(I18nService);

  loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  errorMsg = '';
  showPassword = false;
  cargando = false;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['sessionExpired'] === 'true') {
        this.errorMsg = this.i18n.t('login.errSessionExpired');
      } else if (params['loginRequired'] === 'true') {
        this.errorMsg = this.i18n.t('login.errLoginRequired');
      }
    });
  }

  login() {
    this.errorMsg = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.cargando = true;
    const { username, password } = this.loginForm.value;

    this.authService.login(username!, password!).subscribe({
      next: () => {
        this.cargando = false;
        this.router.navigate(['/home']);
      },
      error: () => {
        this.cargando = false;
        this.errorMsg = this.i18n.t('login.errInvalid');
      }
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}

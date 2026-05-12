import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  host: {
    'class': 'w-full flex flex-grow'
  }
})
export class LoginComponent {
  private router = inject(Router);

  login() {
    localStorage.setItem('isLoggedIn', 'true');
    this.router.navigate(['/home']);
  }
}

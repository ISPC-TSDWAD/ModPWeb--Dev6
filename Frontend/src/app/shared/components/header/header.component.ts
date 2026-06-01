import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  private router = inject(Router);
  menuPerfilAbierto = false;
  menuMovilAbierto = false;

  get isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  logout() {
    localStorage.removeItem('isLoggedIn');
    this.menuPerfilAbierto = false;
    this.menuMovilAbierto = false;
    this.router.navigate(['/login']);
  }
}

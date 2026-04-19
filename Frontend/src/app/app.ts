import { Component, signal, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('Frontend');
  // Usamos 'inject' que es la forma moderna de Angular 18
  private http = inject(HttpClient); 

  ngOnInit() {
    console.log("¡ATENCIÓN: Intentando conectar con el Backend!");
    
    this.http.get('http://localhost:8000/api/test/').subscribe({
      next: (data) => {
        console.log('EXITO: Recibí estos datos:', data);
      },
      error: (err) => {
        console.error('FALLO: No pude conectar. El error es:', err);
      }
    });
  }
}
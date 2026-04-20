import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Necesitás esto para pedir datos

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent implements OnInit {
  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Esta es la línea que hace la magia:
    this.http.get('http://localhost:8000/api/test/').subscribe({
      next: (data) => console.log('Datos del Backend:', data),
      error: (err) => console.error('Error de conexión:', err)
    });
  }
}
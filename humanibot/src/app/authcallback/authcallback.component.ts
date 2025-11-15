import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-authcallback',
  imports: [],
  templateUrl: './authcallback.component.html',
  styleUrl: './authcallback.component.scss'
})
export class AuthcallbackComponent {
constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const token = params.get('token');
      if (token) {
        localStorage.setItem('token', token); // Guarda el token en el navegador
        console.log('Token guardado en localStorage:', token);
        window.location.href = '/chat'; 
      } else {
        console.warn('No se encontró el parámetro id_token en la URL');
      }
    });
  }
}

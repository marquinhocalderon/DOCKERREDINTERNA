import { Component, inject, OnInit } from '@angular/core';
import { ApirestService } from '../servicios/apirest/apirest.service';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { ActivatedRoute, Router } from '@angular/router';
import * as jwt from 'jwt-decode';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-registrarse',
    imports: [Toast, CommonModule],
    templateUrl: './registrarse.component.html',
    styleUrl: './registrarse.component.scss'
})
export class RegistrarseComponent implements OnInit {

    servicio = inject(ApirestService);
    loading = false;
    verPassword = false;

    datos = {
        email: '',
        password: '',
        nombre: '',
        usuario: '',
        avatar: ''
    };

    tokenGeneral: string | null = null;

    constructor(
        private messageService: MessageService,
        private route: ActivatedRoute,
        private http: HttpClient
    ) { }


    avatarFoto: any

    ngOnInit(): void {
        this.route.queryParamMap.subscribe(params => {
            this.tokenGeneral = params.get('token');

            if (!this.tokenGeneral) {
                console.warn('No se encontró el parámetro token en la URL');
                window.location.href = '/login';
                return;
            }

            try {
                const decoded: any = jwt.jwtDecode(this.tokenGeneral);
                const currentTime = Math.floor(Date.now() / 1000);

                // Verificar expiración
                if (decoded.exp && decoded.exp < currentTime) {
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Sesión expirada',
                        detail: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
                        life: 10000
                    });
                    window.location.href = '/login';
                    return;
                }

            // Autocompletar datos
if (decoded.email || decoded.firstName) {
    this.datos.email = decoded.email ?? '';
    this.datos.nombre = `${decoded.firstName ?? ''} ${decoded.lastName ?? ''}`.trim();
    this.datos.avatar = decoded.avatar ?? '';
} else {
    window.location.href = '/login';
}


                // ✅ Probar token en /perfiles
                this.validarTokenConPerfiles();

            } catch (error) {
                console.error('Error al decodificar token:', error);
                window.location.href = '/login';
            }
        });
    }

agarrar_el_valor_formulario(evento: Event, inputreferido: string) {
    const valor = (evento.target as HTMLInputElement).value;

    if (inputreferido === 'email') {
        this.datos.email = valor;
    } else if (inputreferido === 'password') {
        this.datos.password = valor;
    } else if (inputreferido === 'nombre') {
        this.datos.nombre = valor;
    } else if (inputreferido === 'usuario') {
        // Permitir solo letras, números, guion bajo y punto
        let valorLimpio = valor.replace(/[^a-zA-Z0-9._]/g, '').toLowerCase();

        // Guardamos el valor limpio
        this.datos.usuario = valorLimpio;

        // Actualizamos el input para que el usuario vea los cambios en tiempo real
        (evento.target as HTMLInputElement).value = valorLimpio;
    }
}



registrarNuevoCliente() {
  if (this.loading) return; // Evita múltiples envíos

  console.log('Datos del formulario:', this.datos);

  if (!this.tokenGeneral) {
    this.messageService.add({
      severity: 'error',
      summary: 'Token no encontrado',
      detail: 'No se puede enviar la solicitud sin un token válido.',
      life: 2000
    });
    return;
  }

  this.loading = true;

  const headers = new HttpHeaders({
    Authorization: `Bearer ${this.tokenGeneral}`
  });

  this.http.post(`${environment.apiUrl}/usuarios/regis/cliente`, this.datos, { headers }).subscribe({
    next: () => {
      this.messageService.add({
        severity: 'success',
        summary: 'Iniciando sesión',
        detail: 'Estamos redirigiéndote al chat...',
        life: 2000
      });

      const credenciales = {
        usuario: this.datos.usuario.toLowerCase(),
        password: this.datos.password
      };

      setTimeout(() => {
        this.servicio.login(credenciales).subscribe({
          next: (loginResponse) => {
            localStorage.setItem('token', (loginResponse as any).token);
            window.location.href = '/chat';
            // No es necesario poner loading = false porque vas a redirigir
          },
          error: (loginError) => {
            console.error('Error en el inicio de sesión:', loginError);
            this.messageService.add({
              severity: 'error',
              summary: 'Error al iniciar sesión',
              detail: 'Por favor inicia sesión manualmente.',
              life: 2000
            });
            this.loading = false; // Habilitar botón porque hubo error en login
          }
        });
      }, 2000);

    },
    error: (error) => {
      this.loading = false; // Habilita botón porque hubo error en registro
      console.error('Error en el registro:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error en el registro',
        detail: error?.error?.message || 'No se pudo completar el registro.',
        life: 2000
      });
    }
  });
}




    // 🔹 Nuevo método para validar el token en /perfiles
    validarTokenConPerfiles() {
        if (!this.tokenGeneral) {
            console.warn('Token no encontrado');
            window.location.href = '/login';
            return;
        }

        const headers = new HttpHeaders({
            Authorization: `Bearer ${this.tokenGeneral}`
        });

        this.http.get(`${environment.apiUrl}/perfiles`, { headers })
            .subscribe({
                next: (response) => {
                    console.log("Siguiente paso para que puedas usar la aplicación complete los datos de registro.");
                    // Aquí puedes manejar la respuesta si es necesario
                },
                error: (error) => {
                    window.location.href = '/login';
                }
            });
    }
}

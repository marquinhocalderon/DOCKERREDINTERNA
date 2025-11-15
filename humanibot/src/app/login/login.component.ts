import { Component, inject, OnInit } from '@angular/core';
import { ApirestService } from '../servicios/apirest/apirest.service';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { environment } from '../../environments/environment';
import * as jwt from 'jwt-decode';

@Component({
    selector: 'app-login',
    imports: [Toast],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
    providers: [MessageService]
})
export class LoginComponent implements OnInit {
    servicio = inject(ApirestService);
    email_global: string = '';
    password_global: string = '';
    loading: boolean = false;
    verPassword: boolean = false; // Por defecto oculto

    constructor(private messageService: MessageService) { }

    agarrar_el_valor_formulario(evento: any, inputreferido: string) {
        if (inputreferido === 'email') {
            this.email_global = evento.target.value.toLowerCase();
        } else {
            this.password_global = evento.target.value;
        }
    }

    ngOnInit() {

    }

    iniciar_session() {
        this.loading = true;

        const datos_enviar = {
            usuario: this.email_global.toLowerCase(),
            password: this.password_global
        };

        this.servicio.login(datos_enviar).subscribe({
            next: (response) => {
                console.log('Respuesta del servidor:', response);
                localStorage.setItem('token', response.token);
                this.loading = false;
                const decoded: any = jwt.jwtDecode(response.token);
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

                if (decoded.usuario?.perfil?.perfil === 'CLIENTE') {
                    window.location.href = '/chat';
                }
                else {
                    window.location.href = '/dashboard';
                }
            },
            error: (error) => {

                this.loading = false;
            }
        });
    }


    logearGoogle() {
        window.location.href = environment.apiUrl + '/google';
    }

}

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import * as jwt from 'jwt-decode';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private router: Router) {}

    canActivate(): boolean {
        const token = localStorage.getItem('token');

        if (!token) {
            window.location.href = '/login';
            return false;
        }

        try {
            const decoded: any = jwt.jwtDecode(token);

            const currentTime = Math.floor(Date.now() / 1000); // en segundos

            // Validar expiración
            if (decoded.exp && decoded.exp < currentTime) {
                console.warn('Token expirado');
                window.location.href = '/login';
                return false;
            }

            // 👇 Aquí validamos que sea ADMINISTRADOR
            // OJO: depende cómo venga en tu token. 
            // Según tu JSON parece ser algo así: decoded.usuario.perfil.perfil
            if (decoded.usuario?.perfil?.perfil !== 'ADMIN') {
                console.warn('Acceso denegado. Solo administradores');
                window.location.href = '/login';
                return false;
            }

            return true;
        } catch (e) {
            console.error('Token inválido');
            window.location.href = '/login';
            return false;
        }
    }
}

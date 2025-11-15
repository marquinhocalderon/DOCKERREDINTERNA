import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import * as jwt from 'jwt-decode';
import { MessageService } from 'primeng/api';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    private excludedUrls: string[] = ['/auth', '/auth/register'];

    constructor(
        private router: Router,
        private messageService: MessageService
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const isExcluded = this.excludedUrls.some((url) => req.url.includes(url));
        const token = localStorage.getItem('token');

        if (!isExcluded && token) {
            try {
                const decoded: any = jwt.jwtDecode(token);
                const currentTime = Math.floor(Date.now() / 1000); // en segundos

                if (decoded.exp && decoded.exp < currentTime) {
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Sesión expirada',
                        detail: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
                        life: 10000
                    });
                    localStorage.removeItem('token');
                    this.router.navigate(['/login']);
                    return throwError(() => new Error('Token expirado'));
                }

                const authReq = req.clone({
                    setHeaders: {
                        Authorization: `Bearer ${token}`
                    }
                });

                return next.handle(authReq).pipe(catchError((err) => this.handleError(err)));
            } catch (err) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Token inválido',
                    detail: 'El token es inválido o está mal formado. Por favor, inicia sesión nuevamente.',
                    life: 10000
                });
                localStorage.removeItem('token');
                this.router.navigate(['/login']);
                return throwError(() => new Error('Token inválido'));
            }
        }

        return next.handle(req).pipe(catchError((err) => this.handleError(err)));
    }

    private handleError(error: HttpErrorResponse): Observable<never> {
        switch (error.error.statusCode) {
            case 400:
                this.messageService.add({
                    severity: 'error',
                    summary: 'Solicitud incorrecta',
                    detail: error.error?.message || 'La solicitud no fue procesada correctamente.',
                    life: 10000
                });
                break;
            case 401:
                this.messageService.add({
                    severity: 'warn',
                    summary: 'No autorizado',
                    detail: error.error?.message || 'No tienes permisos para realizar esta acción. Por favor, inicia sesión.',
                    life: 10000
                });
                localStorage.removeItem('token');
                this.router.navigate(['/login']);
                break;
            case 403:
                this.messageService.add({
                    severity: 'error',
                    summary: 'Acceso prohibido',
                    detail: error.error?.message || 'Acceso denegado. No tienes permisos suficientes para acceder a este recurso.',
                    life: 10000
                });
                break;
            case 404:
                this.messageService.add({
                    severity: 'error',
                    summary: 'No encontrado',
                    detail: error.error?.message || 'El recurso solicitado no fue encontrado.',
                    life: 10000
                });
                break;
            case 500:
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error del servidor',
                    detail: 'Se ha producido un error en el servidor debido a una actualización. Estamos trabajando para solucionarlo y el servicio estará disponible en breve, posiblemente dentro de 5 a 10 minutos. Por favor, intente nuevamente en unos minutos. Gracias por su paciencia.',

                    life: 10000
                });
                break;
            default:

        }

        return throwError(() => error);
    }
}

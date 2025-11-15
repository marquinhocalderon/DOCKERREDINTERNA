import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApirestService {
    private apiUrl = environment.apiUrl; // ejemplo base

    constructor(private http: HttpClient) {}

    obtenertodo(url: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${url}`);
    }

    obtenerporid(url: any, id: any): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${url}/${id}`);
    }

    crearRegistro(endpoint: string, payload: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/${endpoint}`, payload);
    }

    // Actualizar registro: también envolviendo en "data"
    actualizarRegistro(endpoint: string, payload: any, id: number | string): Observable<any> {
        return this.http.patch<any>(`${this.apiUrl}/${endpoint}/${id}`, payload);
    }

    restablecerPassword(endpoint: string, payload: any): Observable<any> {
        return this.http.patch<any>(`${this.apiUrl}/${endpoint}`, payload);
    }

    // Eliminar un registro
    eliminarRegistro(endpoint: string, id: number | string): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${endpoint}/${id}`);
    }

    login(credentials: any): Observable<any> {
        return this.http.post<any>(environment.apiUrl + '/auth', credentials);
    }
}

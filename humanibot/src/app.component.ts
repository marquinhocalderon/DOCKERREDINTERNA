import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast'; // Importa el módulo para usar su componente

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, ToastModule], // Importa ToastModule aquí para poder usar <p-toast>
    template: `
        <p-toast></p-toast>
        <!-- Aquí va el Toast para que esté visible siempre -->
        <router-outlet></router-outlet>
    `
})
export class AppComponent {}

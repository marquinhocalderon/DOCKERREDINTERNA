import { Routes } from '@angular/router';
import { CategoriasComponent } from './categorias/categorias.component';
import { ProductosComponent } from './productos/productos.component';

export const almacenRoutes: Routes = [
    { path: 'categorias', component: CategoriasComponent },
    { path: 'productos', component: ProductosComponent }
];

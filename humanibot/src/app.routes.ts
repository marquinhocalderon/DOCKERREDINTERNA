import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { AuthGuard } from './app/guardauth/guardauth.guard';
import { ChatAuthGuard } from './app/guardauth/chatguard.guard';
import { Landing } from './app/pages/landing/landing';
import { Dashboard } from './app/pages/dashboard/dashboard';

export const appRoutes: Routes = [
  {
    title: 'Login',
    path: 'login',
    loadComponent: () => import('./app/login/login.component').then(m => m.LoginComponent)
  },
  {
    title: 'Pago de Servicio',
    path: 'pago',
    loadComponent: () => import('./app/paginas/pago/pago.component').then(m => m.PagoComponent)
  },
  {
    title: 'Crear Cuenta',
    path: 'auth/register',
    loadComponent: () => import('./app/registrarse/registrarse.component').then(m => m.RegistrarseComponent)
  },
  {
    title: 'Recuperar Contraseña',
    path: 'restablecer-password',
    loadComponent: () => import('./app/paginas/recuperarconpassword/recuperarconpassword.component').then(m => m.RecuperarconpasswordComponent)
  },
  {
    path: 'dashboard',
    component: AppLayout,
    canActivate: [AuthGuard],
    children: [
        {
          path: '',
          component: Dashboard
        },

      {
        path: 'seguridad',
        loadChildren: () => import('./app/modulos/seguridad/seguridad.routes').then(m => m.seguridadRutasd)
      }
    ]
  },
  {
    title: 'Chat HumaniBot',
    path: 'chat',
    canActivate: [ChatAuthGuard],
    loadComponent: () => import('./app/serviciochathumanizador/serviciochathumanizador.component').then(m => m.ServiciochathumanizadorComponent)
  },
  { path: 'auth/callback', loadComponent: () => import('./app/authcallback/authcallback.component').then(m => m.AuthcallbackComponent) },
  {
    path: '',
    component: Landing
  },
  { path: 'siencuentrasestoeraunapruebadesoluciones', loadComponent: () => import('./app/paginas/solucioneshumanibot/solucioneshumanibot.component').then(m => m.SolucioneshumanibotComponent) },
  { path: 'academico', loadComponent: () => import('./app/paginas/academiahumanibot/academiahumanibot.component').then(m => m.AcademiahumanibotComponent) },
  { path: 'cardthreejs', loadComponent: () => import('./app/paginas/solucioneshumanibot/gallery/gallery.component').then(m => m.GalleryComponent) },
  { path: 'solutions', loadComponent: () => import('./app/paginas/solutions/solutions.component').then(m => m.SolutionsComponent) },
  { path: '**', loadComponent: () => import('./app/pages/notfound/notfound').then(m => m.Notfound) }
];

import { Component, inject, OnInit } from '@angular/core';
import { ApirestService } from '../../servicios/apirest/apirest.service';
import * as jwt from 'jwt-decode';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-avisarusuariodelplanexpirado',
  templateUrl: './avisarusuariodelplanexpirado.component.html',
  styleUrls: ['./avisarusuariodelplanexpirado.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class AvisarusuariodelplanexpiradoComponent implements OnInit {

  servicio = inject(ApirestService);

  datosDelUsuario: any;
  datosPlanCuenta: any;
  mostrarModal: boolean = false; 
  mensajeMarketing: string | null = null;

  ngOnInit(): void {
    this.obtenerInfoDelUsuario();
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  obtenerInfoDelUsuario(): void {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const decoded: any = jwt.jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);

      // Verificar expiración del token
      if (decoded.exp && decoded.exp < currentTime) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }

      const idusuario = decoded.usuario?.id;
      if (!idusuario) {
        window.location.href = '/login';
        return;
      }

      this.servicio.obtenerporid('usuarios/info', idusuario).subscribe({
        next: (response) => {
          this.datosDelUsuario = response;
          this.datosPlanCuenta = response?.Cuenta;

          const plan = this.datosPlanCuenta?.plan;

          // 🔹 Si es plan 'free', eliminar localStorage y no mostrar modal
          if (plan === 'free') {
            localStorage.removeItem('modalPlanMostrado');
            this.mostrarModal = false;
            return;
          }

          const fechaExpiracionRaw = this.datosPlanCuenta?.fechaExpiracion;

          if (fechaExpiracionRaw) {
            this.mensajeMarketing = 'Desbloquea más beneficios migrando hoy mismo a un plan premium 🚀';

            const fechaExpiracion = new Date(fechaExpiracionRaw);
            const hoy = new Date();
            const diffMs = fechaExpiracion.getTime() - hoy.getTime();
            const diasRestantes = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

            const hoyStr = hoy.toISOString().split('T')[0];
            const fechaExpStr = fechaExpiracion.toISOString().split('T')[0];

            // Leer configuración guardada en localStorage
            const modalData = localStorage.getItem('modalPlanMostrado');
            let modalConfig: { fechaExpiracion: string; ultimaFechaMostrado: string } | null = null;
            if (modalData) {
              try { modalConfig = JSON.parse(modalData); } catch {}
            }

            // 🔹 Siempre actualizar la fecha del backend
            if (!modalConfig || modalConfig.fechaExpiracion !== fechaExpStr) {
              modalConfig = { fechaExpiracion: fechaExpStr, ultimaFechaMostrado: '' };
              localStorage.setItem('modalPlanMostrado', JSON.stringify(modalConfig));
            }

            // Mostrar modal si faltan 3 días o menos
            if (diasRestantes <= 3 && modalConfig.ultimaFechaMostrado !== hoyStr) {
              this.mostrarModal = true;

              // Actualizar última fecha mostrado
              modalConfig.ultimaFechaMostrado = hoyStr;
              localStorage.setItem('modalPlanMostrado', JSON.stringify(modalConfig));
            }
          }
        },
        error: () => {
          window.location.href = '/login';
        }
      });

    } catch (error) {
      window.location.href = '/login';
    }
  }
}

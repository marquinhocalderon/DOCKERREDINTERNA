import { CommonModule } from '@angular/common';
import { Component, computed, inject, Input, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from '../../layout/component/app.configurator';
import { Menu } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { ApirestService } from '../../servicios/apirest/apirest.service';
import { MenuItem } from 'primeng/api';
import { LayoutService } from '../../layout/service/layout.service';
import { Tag } from 'primeng/tag';
import { Tooltip } from 'primeng/tooltip';

@Component({
  selector: 'app-cabecera',
  standalone: true,
  imports: [RouterModule, CommonModule, StyleClassModule, AppConfigurator, Menu, ButtonModule, Tag, Tooltip],
  templateUrl: './cabecera.component.html',
  styleUrls: ['./cabecera.component.scss']
})
export class CabeceraComponent implements OnInit {

  private _datosCabecera: any;

  @Input()
  set datoscabecera(value: any) {
    this._datosCabecera = value;
    this.datosInfoUsuario = value;
    this.actualizarConfiguracion();
  }
  get datoscabecera() {
    return this._datosCabecera;
  }

  servicio = inject(ApirestService);
  darkTheme = computed(() => this.layoutService.layoutConfig().darkTheme);

  datosInfoUsuario: any;
  items!: MenuItem[];
  configuracion: MenuItem[] = [];

  constructor(public layoutService: LayoutService , private router: Router) { }

  ngOnInit() {
    // Opcional: inicializar configuracion vacío o con valores por defecto
    this.actualizarConfiguracion();
  }

  actualizarConfiguracion() {
    this.configuracion = [
      {
        items: [
          {
            label: `${this.datosInfoUsuario?.User?.nombre || 'Usuario'}`,
            icon: 'pi pi-user',
            disabled: true  // bloqueado y con estilo deshabilitado
          },
          {
            label: `${this.datosInfoUsuario?.User?.email || 'Usuario'}`,
            icon: 'pi pi-envelope',
            disabled: true  // bloqueado y con estilo deshabilitado
          },
          {
            label: 'Cerrar sesión',
            icon: 'pi pi-sign-out',
            command: () => this.cerrarSesion()
          }
        ]
      }
    ];
  }

  toggleDarkMode() {
    this.layoutService.layoutConfig.update(state => ({
      ...state,
      darkTheme: !state.darkTheme
    }));
  }

  verPerfil() {
    console.log('Ver perfil');
  }

  abrirConfiguracion() {
    console.log('Abrir configuración');
  }

cerrarSesion() {
  localStorage.removeItem('token');
  this.router.navigate(['/'], { replaceUrl: true });
}
}

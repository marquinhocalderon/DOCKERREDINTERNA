import { Component } from '@angular/core';
import { NotificationsWidget } from './components/notificationswidget';
import { StatsWidget } from './components/statswidget';
import { RecentSalesWidget } from './components/recentsaleswidget';
import { BestSellingWidget } from './components/bestsellingwidget';
import { RevenueStreamWidget } from './components/revenuestreamwidget';
import { ApirestService } from '../../servicios/apirest/apirest.service';

@Component({
    selector: 'app-dashboard',
    imports: [StatsWidget, BestSellingWidget, RevenueStreamWidget],
    template: `
        <div class="grid grid-cols-12 gap-8">
            <app-stats-widget class="contents" [TotalCuentasClientes]="TotalCuentasClientes"/>
            <div class="col-span-12 xl:col-span-6">
                <app-best-selling-widget [listaDatosEstadisticas]="listaDatosEstadisticas" />
            </div>
            <div class="col-span-12 xl:col-span-6">
                                <app-revenue-stream-widget [listaDatosEstadisticas]="listaDatosEstadisticas" />
            </div>
        </div>
    `
})
export class Dashboard {

    cargando: boolean = false;
    listaDatosEstadisticas: any[] = [];
    listaDatosCuentas: any[] = [];
    TotalCuentasClientes: any[] = [];
    TotalCuentasFree: number = 0;
    TotalCuentasStarter: number = 0;
    TotalCuentasPlus: number = 0;
    TotalCuentasPremium: number = 0;

    constructor(
        private servicio: ApirestService
    ) { }

    ngOnInit(): void {
        this.getAllEstadisticas();
        this.getAllCuentas();
    }

    getAllEstadisticas(): void {
        this.cargando = true;
        this.servicio.obtenertodo('estadisticas').subscribe({
            next: (response) => {
                this.listaDatosEstadisticas = response;
                // console.log("Datos de estadísticas:");
                // console.log(this.listaDatosEstadisticas);
                this.cargando = false;
            },
            error: (error) => {
                console.log(error);
                this.cargando = true;
            }
        });
    }

    getAllCuentas(): void {
        this.cargando = true;
        this.servicio.obtenertodo('cuenta').subscribe({
            next: (response) => {
                this.listaDatosCuentas = response;
                // console.log("Datos de cuentas:");
                // console.log(this.listaDatosCuentas);
                this.cargando = false;
                this.obtenerTotalCuentasClientes();
            },
            error: (error) => {
                console.log(error);
                this.cargando = true;
            }
        });

    }

    //Funcion para obtener el total de cuentas de usuarios con perfil cliente
    obtenerTotalCuentasClientes(): void {
        this.TotalCuentasClientes = this.listaDatosCuentas.filter(cuenta => cuenta.usuario.perfil.perfil === 'CLIENTE');
        // console.log("Total de cuentas de clientes:");
        // console.log(this.TotalCuentasClientes.length);
    }


}

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    selector: 'app-stats-widget',
    imports: [CommonModule],
    template: `<div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block font-medium mb-4 text-blue-500">FREE</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ TotalCuentasFree }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-user text-blue-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">{{ PorcentajeCuentasFree}} % </span>
                <span class="text-muted-color">del TOTAL</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block font-medium mb-4 text-orange-500">STARTER</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ TotalCuentasStarter }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-user text-orange-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">{{ PorcentajeCuentasStarter }} % </span>
                <span class="text-muted-color">del TOTAL</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block font-medium mb-4 text-cyan-500">PLUS</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ TotalCuentasPlus }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-user text-cyan-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">{{ PorcentajeCuentasPlus }} % </span>
                <span class="text-muted-color">del TOTAL</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block font-medium mb-4 text-purple-500">PREMIUM</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ TotalCuentasPremium }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-purple-100 dark:bg-purple-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-user text-purple-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">{{ PorcentajeCuentasPremium }} % </span>
                <span class="text-muted-color">del TOTAL</span>
            </div>
        </div>`
})
export class StatsWidget {

    @Input() TotalCuentasClientes: any[] = [];

    TotalCuentasFree: number = 0;
    TotalCuentasStarter: number = 0;
    TotalCuentasPlus: number = 0;
    TotalCuentasPremium: number = 0;

    PorcentajeCuentasFree: number = 0;
    PorcentajeCuentasStarter: number = 0;
    PorcentajeCuentasPlus: number = 0;
    PorcentajeCuentasPremium: number = 0;

    ngOnChanges(): void {
        this.obtenerTotalCuentasPorPlan();
        this.obtenerPorcentajeCuentasPorPlan();
        // console.log("Total cuentas por plann desde StatsWidget:");
        // console.log("Free: " + this.TotalCuentasFree);
        // console.log("Starter: " + this.TotalCuentasStarter);
        // console.log("Plus: " + this.TotalCuentasPlus);
        // console.log("Premium: " + this.TotalCuentasPremium);
    }


    obtenerTotalCuentasPorPlan(): void {
        //Son solo 4 planes: free, starter, plus y premium
        this.TotalCuentasFree = this.TotalCuentasClientes.filter(cuenta => cuenta.plan === 'free').length;
        this.TotalCuentasStarter = this.TotalCuentasClientes.filter(cuenta => cuenta.plan === 'starter').length;
        this.TotalCuentasPlus = this.TotalCuentasClientes.filter(cuenta => cuenta.plan === 'plus').length;
        this.TotalCuentasPremium = this.TotalCuentasClientes.filter(cuenta => cuenta.plan === 'premium').length;
    }

    //Obtener el porcentaje de cuentas por plan respecto al total de cuentas conmaximo de 2 decimales
    obtenerPorcentajeCuentasPorPlan(): void {
        const totalCuentas = this.TotalCuentasClientes.length;
        if (totalCuentas > 0) {
            this.PorcentajeCuentasFree = parseFloat(((this.TotalCuentasFree / totalCuentas) * 100).toFixed(2));
            this.PorcentajeCuentasStarter = parseFloat(((this.TotalCuentasStarter / totalCuentas) * 100).toFixed(2));
            this.PorcentajeCuentasPlus = parseFloat(((this.TotalCuentasPlus / totalCuentas) * 100).toFixed(2));
            this.PorcentajeCuentasPremium = parseFloat(((this.TotalCuentasPremium / totalCuentas) * 100).toFixed(2));
        } else {
            this.PorcentajeCuentasFree = 0;
            this.PorcentajeCuentasStarter = 0;
            this.PorcentajeCuentasPlus = 0;
            this.PorcentajeCuentasPremium = 0;
        }
    }
}

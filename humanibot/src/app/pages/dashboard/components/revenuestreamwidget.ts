import { Component, Input } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { debounceTime, Subscription } from 'rxjs';
import { LayoutService } from '../../../layout/service/layout.service';
import { Form, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
    standalone: true,
    selector: 'app-revenue-stream-widget',
    imports: [ChartModule, FormsModule],
    template: `
    
    <div class="card !mb-8"> 
        <div class="font-semibold text-xl mb-4">Total de peticiones</div>
        <hr> 
        <span class="p-1">Filtrar por: </span>
                <div class="relative inline-block text-left p-1">
    <div class="group">
        <button type="button" (click)="selectFiltrado=!selectFiltrado"
            class="p-inputtext p-component p-filled !mr-2 bg-gray-900 border rounded-lg p-1 inline-flex justify-center w-full">
            {{FiltrarPor}}
            <!-- Dropdown arrow -->
            <svg class="w-4 h-4 ml-2 -mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 12l-5-5h10l-5 5z" />
            </svg>
        </button>

        @if(selectFiltrado){
        <!-- Dropdown menu -->
        <div
            class="bg-gray-300 border rounded-lg p-1 inline-flex justify-center absolute right-0 origin-top-right border-gray-200 divide-y divide-gray-100 transition-opacity duration-300 z-10">
            <div class="py-1" (click)="selectFiltrado=!selectFiltrado">
                <a (click)="FiltrarPor = 'Día'" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Día</a>
                <a (click)="FiltrarPor = 'Mes'" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Mes</a>
                <a (click)="FiltrarPor = 'Año'" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Año</a>
            </div>
        </div>
        }
    </div>
</div>
         @if(FiltrarPor == 'Día'){
        <input [(ngModel)]="selectedDate" class="p-inputtext p-component p-filled !mr-2 bg-gray-900 border rounded-lg p-1" type="date"> 
        }
        @else if(FiltrarPor == 'Mes'){
        <input [(ngModel)]="selectedDate" class="p-inputtext p-component p-filled !mr-2 bg-gray-900 border rounded-lg p-1" type="month"> 
        }
        @else if(FiltrarPor == 'Año'){
        <input [(ngModel)]="selectedDate" class="p-inputtext p-component p-filled !mr-2 bg-gray-900 border rounded-lg p-1" type="number" min="1900" max="2100" placeholder="Año"> 
        }
        @else{
        <input [(ngModel)]="selectedDate" class="p-inputtext p-component p-filled !mr-2 bg-gray-900 border rounded-lg p-1" type="date"> 
        }

        <button class="p-inputtext p-component p-filled !mr-2 bg-gray-900 border rounded-lg p-1 hover:bg-slate-700" (click)="applyFilter()">Aplicar</button>
        <hr> <p-chart type="bar" [data]="chartData" [options]="chartOptions" class="h-80" /> 
        </div>
        `
})
export class RevenueStreamWidget {

    @Input() listaDatosEstadisticas: any[] = [];

    chartData: any;

    chartOptions: any;

    subscription!: Subscription;

    selectedDate: string = new Date().toISOString().split('T')[0];

    FiltrarPor: string = 'Día';

    selectFiltrado: boolean = false;

    filteredData: any[] = [];

    //ESTO ES PARA LOS QUE SON CLIENTES

    freeFilter: number = 0;

    startersFilter: number = 0;

    plusFilter: number = 0;

    premiumFilter: number = 0;

    //PARA LOS QUE SON ADMINISTRADORES

    freeAdminFilter: number = 0;

    startersAdminFilter: number = 0;

    plusAdminFilter: number = 0;

    premiumAdminFilter: number = 0;



    constructor(public layoutService: LayoutService) {
        this.subscription = this.layoutService.configUpdate$.pipe(debounceTime(25)).subscribe(() => {
            this.initChart();
        });
    }


    ngOnChanges() {
        if (this.listaDatosEstadisticas && this.listaDatosEstadisticas.length > 0) {
            // console.log("✅ Datos recibidos en RevenueStreamWidget:", this.listaDatosEstadisticas);
            this.applyFilter();
        } else {
            console.log("⏳ Esperando datos...");
        }
    }

    applyFilter() {
        // console.log("📌 Filtrando por:", this.FiltrarPor);
        // console.log("📅 Fecha seleccionada:", this.selectedDate);

        const normalizeDate = (dateString: string) => {
            return new Date(dateString.split('T')[0]); // Cortar la hora, solo fecha YYYY-MM-DD
        };

        if (this.FiltrarPor === 'Día') {
            const selected = normalizeDate(this.selectedDate);

            this.filteredData = this.listaDatosEstadisticas.filter(data => {
                const d = normalizeDate(data.fechadia);
                return d.getTime() === selected.getTime();
            });

        } else if (this.FiltrarPor === 'Mes') {
            const [year, month] = this.selectedDate.split('-').map(Number); // <-- aquí está la magia

            this.filteredData = this.listaDatosEstadisticas.filter(data => {
                const d = new Date(data.fechadia);
                return (
                    d.getFullYear() === year &&
                    (d.getMonth() + 1) === month // <-- ahora sí cuadra exacto
                );
            });
        } else if (this.FiltrarPor === 'Año') {
            const selectedYear = parseInt(this.selectedDate, 10);
            this.filteredData = this.listaDatosEstadisticas.filter(data => {
                const d = normalizeDate(data.fechadia);
                return d.getFullYear() === selectedYear;
            });
        }

        // console.log("✅ Resultado filtrado:", this.filteredData);

        //Cuando tengamos la data filtrada, hacemos el conteo por planes
        this.freeFilter = this.filteredData
            .filter(item => item.plan === 'free')
            .reduce((sum, item) => sum + item.totalpeticiones, 0);

        this.startersFilter = this.filteredData
            .filter(item => item.plan === 'starters')
            .reduce((sum, item) => sum + item.totalpeticiones, 0);

        this.plusFilter = this.filteredData
            .filter(item => item.plan === 'plus')
            .reduce((sum, item) => sum + item.totalpeticiones, 0);

        this.premiumFilter = this.filteredData
            .filter(item => item.plan === 'premium')
            .reduce((sum, item) => sum + item.totalpeticiones, 0);

        this.freeAdminFilter = this.filteredData
            .filter(item => item.plan === 'free' && item.usuario.perfil.perfil === 'ADMIN')
            .reduce((sum, item) => sum + item.totalpeticiones, 0);

        this.startersAdminFilter = this.filteredData
            .filter(item => item.plan === 'starters' && item.usuario.perfil.perfil === 'ADMIN')
            .reduce((sum, item) => sum + item.totalpeticiones, 0);

        this.plusAdminFilter = this.filteredData
            .filter(item => item.plan === 'plus' && item.usuario.perfil.perfil === 'ADMIN')
            .reduce((sum, item) => sum + item.totalpeticiones, 0);

        this.premiumAdminFilter = this.filteredData
            .filter(item => item.plan === 'premium' && item.usuario.perfil.perfil === 'ADMIN')
            .reduce((sum, item) => sum + item.totalpeticiones, 0);

        // console.log("📊 Totales por plan - Free:", this.freeFilter, "Starters:", this.startersFilter, "Plus:", this.plusFilter, "Premium:", this.premiumFilter);

        // console.log("📊 Totales por plan para ADMIN - Free:", this.freeAdminFilter, "Starters:", this.startersAdminFilter, "Plus:", this.plusAdminFilter, "Premium:", this.premiumAdminFilter);

        this.initChart();
    }



    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const borderColor = documentStyle.getPropertyValue('--surface-border');
        const textMutedColor = documentStyle.getPropertyValue('--text-color-secondary');

        this.chartData = {
            labels: ['FREE', 'STARTER', 'PLUS', 'PREMIUM'],
            datasets: [
                {
                    type: 'bar',
                    label: 'Admin',
                    backgroundColor: documentStyle.getPropertyValue('--p-primary-400'),
                    data: [this.freeAdminFilter, this.startersAdminFilter, this.plusAdminFilter, this.premiumAdminFilter],
                    barThickness: 32
                },
                {
                    type: 'bar',
                    label: 'Cliente',
                    backgroundColor: documentStyle.getPropertyValue('--p-primary-300'),
                    data: [this.freeFilter, this.startersFilter, this.plusFilter, this.premiumFilter],
                    barThickness: 32
                },
            ]
        };

        this.chartOptions = {
            maintainAspectRatio: false,
            aspectRatio: 1.01,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    stacked: true,
                    ticks: {
                        color: textMutedColor
                    },
                    grid: {
                        color: 'transparent',
                        borderColor: 'transparent'
                    }
                },
                y: {
                    stacked: true,
                    ticks: {
                        color: textMutedColor
                    },
                    grid: {
                        color: borderColor,
                        borderColor: 'transparent',
                        drawTicks: false
                    }
                }
            }
        };
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}

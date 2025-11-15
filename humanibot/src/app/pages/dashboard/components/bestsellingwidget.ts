import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { FormsModule } from '@angular/forms';

@Component({
    standalone: true,
    selector: 'app-best-selling-widget',
    imports: [CommonModule, ButtonModule, MenuModule, FormsModule],
    template: ` <div class="card">
        <div class="justify-between items-center mb-6">
            <div class="font-semibold text-xl">Migraciones de Plan</div>
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
        <hr>
        </div>
        <ul class="list-none p-0 m-0">
            <li class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                    <span class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0">FREE - STARTER</span>
                    <div class="mt-1 text-muted-color">Plan</div>
                </div>
                <div class="mt-2 md:mt-0 flex items-center">
                    <div class="bg-surface-300 dark:bg-surface-500 rounded-border overflow-hidden w-40 lg:w-24" style="height: 8px">
                        <div class="bg-green-500 h-full" [style.width.%]="(freetoStarter / TotalUserChanges) * 100"></div>
                    </div>
                    <span class="text-green-500 ml-4 font-medium">{{ freetoStarter }} / {{ TotalUserChanges }}</span>
                </div>
            </li>
            <li class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                    <span class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0">FREE - PLUS</span>
                    <div class="mt-1 text-muted-color">Plan</div>
                </div>
                <div class="mt-2 md:mt-0 ml-0 md:ml-20 flex items-center">
                    <div class="bg-surface-300 dark:bg-surface-500 rounded-border overflow-hidden w-40 lg:w-24" style="height: 8px">
                        <div class="bg-cyan-500 h-full" [style.width.%]="(freetoPlus / TotalUserChanges) * 100"></div>
                    </div>
                    <span class="text-cyan-500 ml-4 font-medium">{{ freetoPlus }} / {{ TotalUserChanges }}</span>
                </div>
            </li>
            <li class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                    <span class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0">FREE - PREMIUM</span>
                    <div class="mt-1 text-muted-color">Plan</div>
                </div>
                <div class="mt-2 md:mt-0 ml-0 md:ml-20 flex items-center">
                    <div class="bg-surface-300 dark:bg-surface-500 rounded-border overflow-hidden w-40 lg:w-24" style="height: 8px">
                        <div class="bg-purple-500 h-full" [style.width.%]="(freetoPremium / TotalUserChanges) * 100"></div>
                    </div>
                    <span class="text-purple-500 ml-4 font-medium">{{ freetoPremium }} / {{ TotalUserChanges }}</span>
                </div>
            </li>
            <li class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                    <span class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0">PLAN DE PAGA - FREE</span>
                    <div class="mt-1 text-muted-color">Perdida</div>
                </div>
                <div class="mt-2 md:mt-0 ml-0 md:ml-20 flex items-center">
                    <div class="bg-surface-300 dark:bg-surface-500 rounded-border overflow-hidden w-40 lg:w-24" style="height: 8px">
                        <div class="bg-red-500 h-full" [style.width.%]="(pagotofree / TotalUserChanges) * 100"></div>
                    </div>
                    <span class="text-red-500 ml-4 font-medium">{{ pagotofree }} / {{ TotalUserChanges }}</span>
                </div>
            </li>
            <li class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                    <span class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0">PLAN SUPERIOR - INFERIOR</span>
                    <div class="mt-1 text-muted-color">Perdida</div>
                </div>
                <div class="mt-2 md:mt-0 ml-0 md:ml-20 flex items-center">
                    <div class="bg-surface-300 dark:bg-surface-500 rounded-border overflow-hidden w-40 lg:w-24" style="height: 8px">
                        <div class="bg-red-500 h-full" [style.width.%]="(planSuperiortoPlanInferior / TotalUserChanges) * 100"></div>
                    </div>
                    <span class="text-red-500 ml-4 font-medium">{{ planSuperiortoPlanInferior }} / {{ TotalUserChanges }}</span>
                </div>
            </li>
            <li class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                    <span class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0">PLAN INFERIOR - SUPERIOR</span>
                    <div class="mt-1 text-muted-color">Ganancia</div>
                </div>
                <div class="mt-2 md:mt-0 ml-0 md:ml-20 flex items-center">
                    <div class="bg-surface-300 dark:bg-surface-500 rounded-border overflow-hidden w-40 lg:w-24" style="height: 8px">
                        <div class="bg-teal-500 h-full" [style.width.%]="(planInferiorToPlanSuperior / TotalUserChanges) * 100"></div>
                    </div>
                    <span class="text-teal-500 ml-4 font-medium">{{ planInferiorToPlanSuperior }} / {{ TotalUserChanges }}</span>
                </div>
            </li>
        </ul>
    </div>`
})
export class BestSellingWidget {

    @Input() listaDatosEstadisticas: any[] = [];

    selectedDate: string = new Date().toISOString().split('T')[0];

    FiltrarPor: string = 'Día';

    selectFiltrado: boolean = false;

    filteredData: any[] = [];

    freetoStarter: number = 0;
    freetoPlus: number = 0
    freetoPremium: number = 0;
    pagotofree: number = 0;
    planSuperiortoPlanInferior: number = 0;
    planInferiorToPlanSuperior: number = 0;

    TotalUserChanges: number = 0;

    ngOnChanges(): void {
        if (this.listaDatosEstadisticas && this.listaDatosEstadisticas.length > 0) {
            // console.log("✅ Datos recibidos en RevenueStreamWidget:", this.listaDatosEstadisticas);
            this.applyFilter();
        } else {
            // console.log("⏳ Esperando datos...");
        }
    }

    applyFilter() {

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

        //Ahora nos aseguramos de que esa data solo sea de clientes nada de administradores
        this.filteredData = this.filteredData.filter(data => data.usuario.perfil.perfil === 'CLIENTE');

        // console.log("✅ Resultado filtrado solo clientes:", this.filteredData);

        //AHORA LO QUE NOS INTEREZA SABER PRIMERO CUANTOS FREE PASARON A STARTER, PLUS Y PREMIUM
        this.freetoStarter = this.filteredData.filter(data => data.planAnterior === 'FREE' && data.planNuevo === 'STARTER').length;
        this.freetoPlus = this.filteredData.filter(data => data.planAnterior === 'FREE' && data.planNuevo === 'PLUS').length;
        this.freetoPremium = this.filteredData.filter(data => data.planAnterior === 'FREE' && data.planNuevo === 'PREMIUM').length;

        // console.log("Free a Starter:", this.freetoStarter);
        // console.log("Free a Plus:", this.freetoPlus);
        // console.log("Free a Premium:", this.freetoPremium);

        //AHORA QUEREMOS SABER SOLO 2 COSAS CUANDO UNO QUE BAGA SE HACE FREE O BAJA DE PLAN O SUBE DE PLAN
        this.pagotofree = this.filteredData.filter(data => data.planNuevo === 'FREE' && data.planAnterior !== 'FREE').length;
        this.planSuperiortoPlanInferior = this.filteredData.filter(data => {
            const planes = ['FREE', 'STARTER', 'PLUS', 'PREMIUM'];
            return planes.indexOf(data.planNuevo) < planes.indexOf(data.planAnterior);
        }).length;
        this.planInferiorToPlanSuperior = this.filteredData.filter(data => {
            const planes = ['FREE', 'STARTER', 'PLUS', 'PREMIUM'];
            return planes.indexOf(data.planNuevo) > planes.indexOf(data.planAnterior);
        }).length;
        // console.log("Pago a Free:", this.pagotofree);
        // console.log("Plan Superior a Plan Inferior:", this.planSuperiortoPlanInferior);
        // console.log("Plan Inferior a Plan Superior:", this.planInferiorToPlanSuperior);

        //Ahora quiero el total de usuarios que hay usando el sistema, recordando que teemos que usar el isuario como unico. Osea el total de usuarios monitoreados
        const uniqueUsers = new Set(this.filteredData.map(data => data.usuario.id));
        this.TotalUserChanges = uniqueUsers.size;
        // console.log("Total de usuarios únicos que hicieron cambios de plan:", this.TotalUserChanges);
    }




}

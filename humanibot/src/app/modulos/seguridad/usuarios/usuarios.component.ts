import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ApirestService } from '../../../servicios/apirest/apirest.service';
import { Tooltip } from 'primeng/tooltip';
import { FormulariodeusuariosComponent } from "./formulariodeusuarios/formulariodeusuarios.component";
import { VistacambiarplanComponent } from "./vistacambiarplan/vistacambiarplan.component";

@Component({
    selector: 'app-usuarios',
    imports: [CommonModule, InputTextModule, TableModule, FormsModule, ButtonModule, RippleModule, ToastModule, ToolbarModule, DialogModule, TagModule, InputIconModule, IconFieldModule, ConfirmDialogModule, Tooltip, FormulariodeusuariosComponent, VistacambiarplanComponent],
    templateUrl: './usuarios.component.html',
    styleUrl: './usuarios.component.scss',
    providers: [MessageService, ConfirmationService]

})
export class UsuariosComponent {
    abriDialog: boolean = false;
    abriModalPlan: boolean = false;
    selectorTabla: any[] | null = null;
    submitted: boolean = false;

    cols: any[] = [];

    @ViewChild('dt') dt!: Table;
    tituloDialog: any;
    listaDatosTabla: any[] = [];
    cargando: boolean = false;
    datosEnvio = {
        operacion: 'registrar',
        datos: {}
    };

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private servicio: ApirestService
    ) { }

    ngOnInit(): void {
        this.getAll();
    }

    datosPerfiles: any


    getAll(): void {
        this.cargando = true;
        this.servicio.obtenertodo('usuarios').subscribe({
            next: (response) => {
                this.listaDatosTabla = response;
                // console.log(this.listaDatosTabla);
                this.cargando = false;
            },
            error: (error) => {
                console.log(error);
                this.cargando = true;
            }
        });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    getLabel(status: boolean): string {
        return status ? 'Activo' : 'Inactivo';
    }

    getSeverity(status: boolean): "success" | "danger" {
        return status ? "success" : "danger";
    }

    //Ahora haremos lo mismo pero para los planes free, starter, plus y premium
    getLabelPlan(plan: string): string {
        switch (plan) {
            case 'free':
                return 'FREE';
            case 'starter':
                return 'STARTER';
            case 'plus':
                return 'PLUS';
            case 'premium':
                return 'PREMIUM';
            default:
                return 'Desconocido';
        }
    }

    getSeverityPlan(plan: string): "info" | "success" | "warn" | "danger" {
        switch (plan) {
            case 'free':
                return 'info';
            case 'starter':
                return 'success';
            case 'plus':
                return 'warn';
            case 'premium':
                return 'danger';
            default:
                return 'info';
        }
    }

    abrirModelParaRegistrar() {
        this.submitted = false;
        this.abriDialog = true;
        this.tituloDialog = 'Agregar Registro';
        this.datosEnvio = {
            operacion: 'registrar',
            datos: {}
        };
    }

    editarRegistrosModal(data: any) {
        this.abriDialog = true;
        this.tituloDialog = 'Editar Registro';
        this.datosEnvio = {
            operacion: 'editar',
            datos: data
        };
    }

    editarplanCuenta(data: any) {
        this.abriModalPlan = true;
        this.tituloDialog = 'Editar Plan';
        this.datosEnvio = {
            operacion: 'editar',
            datos: data
        };
    }

    eliminarFila(datarecogido: any) {
        this.confirmationService.confirm({
            message: '¿Seguro que deseas eliminar ' + datarecogido.nombre + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.servicio.eliminarRegistro(`usuarios`, datarecogido.id).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Eliminado',
                            detail: 'EL usuario fue eliminado correctamente',
                            life: 1000 // el mensaje se muestra 2 segundos
                        });

                        // Esperar 2.1 segundos antes de recargar la página
                        setTimeout(() => {
                            window.location.reload();
                        }, 1100);
                    },
                    error: (err) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'No se pudo eliminar EL usuario',
                            life: 3000
                        });
                    }
                });
            }
        });
    }


    respuesta_del_hijo(valor: boolean): void {
        this.abriDialog = valor;
    }

    respuesta_del_modal_2(valor: boolean): void {
        this.abriModalPlan = valor;
    }
}

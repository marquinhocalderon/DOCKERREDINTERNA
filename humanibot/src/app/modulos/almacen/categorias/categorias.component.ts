import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FormulariocategoriasComponent } from './formulariocategorias/formulariocategorias.component';
import { InputTextModule } from 'primeng/inputtext';
import { ApirestService } from '../../../servicios/apirest/apirest.service';

@Component({
    selector: 'app-categorias',
    standalone: true,
    imports: [CommonModule, InputTextModule, TableModule, FormsModule, ButtonModule, RippleModule, ToastModule, ToolbarModule, DialogModule, TagModule, InputIconModule, IconFieldModule, ConfirmDialogModule, FormulariocategoriasComponent],
    templateUrl: './categorias.component.html',
    styleUrls: ['./categorias.component.scss'],
    providers: [MessageService, ConfirmationService]
})
export class CategoriasComponent implements OnInit {
    abriDialog: boolean = false;
    selectedCategorias: any[] | null = null;
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

    getAll(): void {
        this.cargando = true;
        this.servicio.obtenertodo('categorias').subscribe({
            next: (response) => {
                this.listaDatosTabla = response.data;
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

    getSeverity(status: boolean): string {
        return status ? 'success' : 'danger';
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

    deleteCategoria(categoria: any) {
        this.confirmationService.confirm({
            message: '¿Seguro que deseas eliminar ' + categoria.nombre + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.servicio.eliminarRegistro(`categorias`, categoria.id).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Eliminado',
                            detail: 'La categoría fue eliminada correctamente',
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
                            detail: 'No se pudo eliminar la categoría',
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
}

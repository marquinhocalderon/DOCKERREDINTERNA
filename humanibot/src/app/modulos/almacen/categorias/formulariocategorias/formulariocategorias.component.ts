import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ModeloCategoria } from '../../../../modelos/ModeloEnvios';
import { ApirestService } from '../../../../servicios/apirest/apirest.service';

@Component({
    selector: 'app-formulariocategorias',
    imports: [InputTextModule, TextareaModule, CommonModule, FormsModule, ButtonModule],
    templateUrl: './formulariocategorias.component.html',
    styleUrl: './formulariocategorias.component.scss'
})
export class FormulariocategoriasComponent implements OnChanges {
    @Output() respuesta_al_padre = new EventEmitter<boolean>();
    @Input() datorecogidos: any;
    servicio = inject(ApirestService);

    modeloenvio: ModeloCategoria = {
        categoria: null
    };
    loading: boolean = false;

    cerraMOdal(): void {
        this.respuesta_al_padre.emit(false); // Emite false
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['datorecogidos'] && this.datorecogidos?.operacion === 'editar') {
            this.modeloenvio = { ...this.datorecogidos.datos }; // Hacer copia para evitar mutaciones
            console.log('Datos cargados en el formulario:', this.modeloenvio);
        } else {
            this.modeloenvio = { categoria: '' };
        }
    }

    enviarDatos() {
        this.loading = true;
        if (this.datorecogidos.operacion === 'registrar') {
            this.servicio.crearRegistro('categorias', this.modeloenvio).subscribe({
                next: (data) => {
                    window.location.reload();
                    this.loading = false;
                },
                error: (error) => {
                    console.log(error);
                    this.loading = false;
                }
            });
        } else {
            const idcategoria = this.modeloenvio.id;
            const datosParaActualizar = {
                categoria: this.modeloenvio.categoria,
                descripcion: this.modeloenvio.descripcion
            };
            this.servicio.actualizarRegistro('categorias', datosParaActualizar, String(idcategoria)).subscribe({
                next: (data) => {
                    window.location.reload();
                },
                error: (error) => {
                    console.log(error);
                    this.loading = false;
                }
            });
        }
    }
}

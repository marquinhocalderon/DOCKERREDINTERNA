import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { ApirestService } from '../../../../servicios/apirest/apirest.service';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-formulariodeusuarios',
  imports: [InputTextModule, TextareaModule, CommonModule, FormsModule, ButtonModule],
  templateUrl: './formulariodeusuarios.component.html',
  styleUrl: './formulariodeusuarios.component.scss'
})
export class FormulariodeusuariosComponent {
  @Output() respuesta_al_padre = new EventEmitter<boolean>();
  @Input() datorecogidos: any;
  servicio = inject(ApirestService);

  modeloenvio: any = {
    nombre: null,
    email: null,
    usuario: null,
    password: null,
  };
  loading: boolean = false;

  cerraMOdal(): void {
    this.respuesta_al_padre.emit(false); // Emite false
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['datorecogidos'] && this.datorecogidos?.operacion === 'editar') {
      this.modeloenvio = {
        ...this.datorecogidos.datos,
        password: ""   // sobreescribo el campo password con vacío
      };

    } else {
      this.modeloenvio = { categoria: '' };
    }
  }

  enviarDatos() {
    this.loading = true;
    if (this.datorecogidos.operacion === 'registrar') {
     /*  this.servicio.crearRegistro('usuariospruebas_checarcuandoestayaecholapixdseviencoistgas', this.modeloenvio).subscribe({
        next: (data) => {
          window.location.reload();
          this.loading = false;
        },
        error: (error) => {
          console.log(error);
          this.loading = false;
        }
      }); */

      alert("espera bbe esta en proceso esto, ya avisare al grupo cuando funcione xd")
      this.loading = false;
    } else {
    /*   const id = this.modeloenvio.id;
    
      this.servicio.actualizarRegistro('usuariospruebas_checarcuandoestayaecholapixdseviencoistgas', this.modeloenvio, String(id)).subscribe({
        next: (data) => {
          window.location.reload();
        },
        error: (error) => {
          console.log(error);
          this.loading = false;
        }
      }); */

      alert("espera bbe esta en proceso esto, ya avisare al grupo cuando funcione xd")
      this.loading = false;
    }
  }
}

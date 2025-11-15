import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { ApirestService } from '../../../../servicios/apirest/apirest.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
@Component({
  selector: 'app-vistacambiarplan',
  imports: [CommonModule, FormsModule, ButtonModule, SelectModule],
  templateUrl: './vistacambiarplan.component.html',
  styleUrl: './vistacambiarplan.component.scss'
})
export class VistacambiarplanComponent {
  @Input() datorecogidos: any;
  @Output() respuestadelModal2 = new EventEmitter<boolean>();

  servicio = inject(ApirestService);

  modeloenvio: any = { plan: null };
  loading: boolean = false;
  planes: any;
  planseleccionado: any;

  cerraMOdal(): void {
    this.respuestadelModal2.emit(false);
  }

  enviarDatos() {
    const datosenviar = {
      plan: this.planseleccionado.code
    }

    this.loading = true; // 🔹 activa el estado de carga
    console.log("➡️ Plan seleccionado:", this.planseleccionado);

    // Simulación de actualización (llamada real al backend)
    this.servicio.actualizarRegistro('cuenta', datosenviar, this.datorecogidos.datos.id)
      .subscribe({
        next: (resp) => {
          console.log('✅ Plan actualizado:', resp);
          window.location.reload();
        },
        error: (err) => {
          console.error('❌ Error al actualizar plan:', err);
          this.loading = false;
        }
      }); 
  }

  // 🔹 Detecta cada vez que cambian los datos del padre
  ngOnChanges(changes: SimpleChanges) {
    if (changes['datorecogidos'] && this.datorecogidos?.operacion === 'editar') {
      this.loading = true; // 🔹 activa el estado de carga
      this.cargarDatosCuenta();
    }
  }

  peticionporminuto: any
  peticion_dia: any

  cargarDatosCuenta() {
    this.servicio.obtenerporid('cuenta', this.datorecogidos.datos.id).subscribe({
      next: (data) => {
        console.log('✅ Perfiles obtenidos:', data);
        this.planes = [
          { name: 'Plan Free', code: 'free' },
          { name: 'Plan Starter', code: 'starter' },
          { name: 'Plan Plus', code: 'plus' },
          { name: 'Plan Premium', code: 'premium' }
        ];
        this.planseleccionado = this.planes.find((p: any) => p.code === data.plan);
        this.peticionporminuto = data.p_minuto;
        this.peticion_dia = data.p_dia;
        this.loading = false; // 🔹 apaga el estado de carga cuando ya tengo la info
      },
      error: () => {
        console.log('Error al obtener los datos de la cuenta');
        this.loading = false;
      }
    });
  }

}

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modalprecios',
  imports: [CommonModule],
  templateUrl: './modalprecios.component.html',
  styleUrl: './modalprecios.component.scss'
})
export class ModalpreciosComponent {

  @Input() datosDelUsuario: any; // Datos del usuario para mostrar en el modal

  @Output() cerrar = new EventEmitter<void>(); // Evento para avisar que se cierre

  cerrarModal() {
    this.cerrar.emit();
  }

  datosInfoUsuario: any
  datosPlanCuenta: any
  mensajeMarketing: any
  ngOnInit() {
    this.datosInfoUsuario = this.datosDelUsuario.InfoUsuario
    this.datosPlanCuenta = this.datosDelUsuario.Cuenta;

    const plan = this.datosPlanCuenta?.plan;

    if (plan === 'free') {
      this.mensajeMarketing = 'Desbloquea más beneficios migrando hoy mismo a un plan premium 🚀';
    }
    else if (plan === 'starter') {
      this.mensajeMarketing = 'Sube al siguiente nivel y aprovecha más consultas y velocidad ⚡';
    }
    else if (plan === 'plus') {
      this.mensajeMarketing = 'Lleva tu productividad al máximo con consultas ilimitadas 📈';
    }
    else if (plan === 'premium') {
      this.mensajeMarketing = 'Ya tienes el mejor plan, pero puedes ajustar según tus necesidades 😉';
    }
    else {
      this.mensajeMarketing = 'Elige el plan ideal y migra tu cuenta en un click. Sin sorpresas.';
    }
  }

  constructor(private router: Router) { }

  migrar(plan: string) {
    // Podrías guardar el plan que eligió, por ejemplo en query params o en un servicio
    this.router.navigate(['/pago'], { queryParams: { plan } });
  }
}

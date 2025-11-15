import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { ButtonModule } from 'primeng/button';
import { CabeceraComponent } from "./cabecera/cabecera.component";
import { FormsModule } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { InputIcon } from 'primeng/inputicon';
import { IconField } from 'primeng/iconfield';
import { ModalpreciosComponent } from './modalprecios/modalprecios.component';
import { ApirestService } from '../servicios/apirest/apirest.service';
import * as jwt from 'jwt-decode';
import { lastValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { AvisarusuariodelplanexpiradoComponent } from '../modales/avisarusuariodelplanexpirado/avisarusuariodelplanexpirado.component';
import { NuestrobotComponent } from "../nuestrobot/nuestrobot.component";
@Component({
  selector: 'app-serviciochathumanizador',
  imports: [
    RouterModule, CommonModule, StyleClassModule, ButtonModule,
    CabeceraComponent, FormsModule, TextareaModule, InputIcon,
    IconField, ModalpreciosComponent, AvisarusuariodelplanexpiradoComponent,
    NuestrobotComponent
],
  templateUrl: './serviciochathumanizador.component.html',
  styleUrl: './serviciochathumanizador.component.scss'
})
export class ServiciochathumanizadorComponent implements OnInit, OnDestroy {

  // --- Variables de datos ---
  servicio = inject(ApirestService);
  datosPlanCuenta: any;
  datosDelUsuario: any;

  // --- Variables UI ---
  textoBotonMarketing = '';
  modalVisible = false;

  valorprimertextarea = '';
  valorsegundotextarea = '';
  pegoTexto = false;
  humanizando = false; // para bloquear botón y mostrar spinner

  constructor() { }

  // --- Ciclo de vida ---
  ngOnInit() {
    this.obtenerInfoDelUsuario();

    // Ocultar scroll si es PC
    if (window.innerWidth >= 1024) {
      document.body.style.overflow = 'hidden';
    }

    // Petición de ejemplo (no depende de plan)
    this.servicio.obtenertodo('perfiles').subscribe({
      next: (data) => console.log('✅ Saludos desde Peru mi gente , Ojala les guste la herramienta recuerda Compartir con todos sus amigos'),
      error: () => window.location.href = '/login'
    });
  }

  ngOnDestroy() {
    // Restaurar scroll al salir
    document.body.style.overflow = '';
  }

  // --- Métodos UI ---
  clickAbrirModal() {
    this.modalVisible = true;
  }

  actualizarTextoBotonMarketing() {
    const plan = this.datosPlanCuenta?.plan;

    if (plan === 'free') {
      this.textoBotonMarketing = '🚀 Mejora tu plan ahora';
    } else if (plan === 'starter') {
      this.textoBotonMarketing = '⚡ Sube a Plus o Premium';
    } else if (plan === 'plus') {
      this.textoBotonMarketing = '📈 Pásate a Premium';
    } else if (plan === 'premium') {
      this.textoBotonMarketing = '🔄 Ajustar mi plan';
    } else {
      this.textoBotonMarketing = '🚀 Migrar de plan';
    }
  }

  // --- Métodos de portapapeles ---
  pegarTexto() {
    if (navigator.clipboard) {
      navigator.clipboard.readText()
        .then(text => {
          this.valorprimertextarea = text;
          this.pegoTexto = true;
        })
        .catch(err => console.error('Error al leer portapapeles:', err));
    } else {
      console.warn('API de portapapeles no disponible en este navegador.');
    }
  }

  copiarTexto() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(this.valorsegundotextarea || '')
        .then(() => console.log('Texto copiado'))
        .catch(err => console.error('Error al copiar texto:', err));
    }
  }

  limpiarTodo() {
    this.valorprimertextarea = '';
    this.valorsegundotextarea = '';
  }

  // --- Métodos de texto ---
  /*   async humanizarTexto() {
      this.valorsegundotextarea = this.valorprimertextarea;
      this.humanizando = true;
      this.valorsegundotextarea = '';
  
      const textoHumanizado = this.valorprimertextarea;
      for (let i = 0; i < textoHumanizado.length; i++) {
        this.valorsegundotextarea += textoHumanizado[i];
        await new Promise(res => setTimeout(res, 15));
      }
  
      this.humanizando = false;
    } */

  getContadorTextoYCaracteres(texto: string) {
    const palabras = texto.trim().split(/\s+/).filter(Boolean).length;
    const caracteres = texto.length;
    const faltan = 100 - caracteres;

    if (caracteres < 100) {
      return `${palabras} palabras | ${caracteres} caracteres (faltan ${faltan})`;
    }

    return `${palabras} palabras | ${caracteres} caracteres ✅`;
  }


  // --- Métodos de usuario ---
  obtenerInfoDelUsuario() {
    const decoded: any = jwt.jwtDecode(localStorage.getItem('token') || '');
    const currentTime = Math.floor(Date.now() / 1000);

    // Verificar expiración
    if (decoded.exp && decoded.exp < currentTime) {
      window.location.href = '/login';
      return;
    }

    const idusuario = decoded.usuario?.id;
    this.servicio.obtenerporid('usuarios/info', idusuario).subscribe({
      next: (response) => {
        this.datosDelUsuario = response;
        this.datosPlanCuenta = response.Cuenta;

        // Ahora que tenemos el plan → actualizamos el texto del botón
        this.actualizarTextoBotonMarketing();
      },
      error: () => window.location.href = '/login'
    });
  }

  modalVisibleParaLimite = false;
  mensajeError: any        // Modal de límite alcanzado
  modalVisiblePlanExpirado = false;
  modalVisibleErrorServidor = false;
  modalVisibleErrorCaracteres = false;
  // Modal de precios
  abrirModalPrecios() {
    this.modalVisibleParaLimite = false;
    this.modalVisible = true;
  }


  tituloModalCaracteres = '';
  parrafoModalCaracteres = '';

  subMensaje: any = '';

async humanizarTexto() {
  if (!this.valorprimertextarea.trim()) return;

  // ✅ Validar mínimo 100 caracteres
  if (this.valorprimertextarea.trim().length < 100) {
    this.modalVisibleErrorCaracteres = true;
    this.tituloModalCaracteres = 'Texto demasiado corto';
    this.parrafoModalCaracteres = `Por favor, escribe un texto más largo antes de enviarlo.  
                Esto nos ayuda a procesar y mejorar tu contenido de manera más efectiva.`
    this.mensajeError = 'El texto debe tener al menos 100 caracteres.';
    return;
  }

  // ✅ Validar máximo 1230 caracteres
  if (this.valorprimertextarea.trim().length > 1230) {
    this.modalVisibleErrorCaracteres = true;
    this.tituloModalCaracteres = 'Texto demasiado largo';
    this.parrafoModalCaracteres = `Por favor, acorta tu texto antes de enviarlo.  
                Esto nos ayuda a procesar y mejorar tu contenido de manera más efectiva.`
    this.mensajeError = 'El texto no puede superar los 1230 caracteres.';
    return;
  }

  this.humanizando = true;
  this.valorsegundotextarea = '';

  try {
    const data: any = await lastValueFrom(
      this.servicio.crearRegistro('chathumanice', { parrafo: this.valorprimertextarea })
    );

    const textoHumanizado = data?.parrafo_rescrito || '';

    // 🖊️ Animación con cálculo de tiempo
    const delay = 1; // milisegundos por letra
    let index = 0;
    const startTime = Date.now();

    const escribir = async () => {
      while (index < textoHumanizado.length) {
        const elapsed = Date.now() - startTime;
        const expectedChars = Math.floor(elapsed / delay);

        // escribir las letras que correspondan
        while (index < expectedChars && index < textoHumanizado.length) {
          this.valorsegundotextarea += textoHumanizado[index++];
        }

        await new Promise((res) => setTimeout(res, delay));
      }
    };

    await escribir();

  } catch (error) {
    console.log('Error al humanizar texto:', error);
    if (error instanceof HttpErrorResponse) {
      console.error('Error del backend:', error.error);

      if (error.error?.statusCode === 429) {
        this.mensajeError = error.error?.message || 'Has excedido el límite de peticiones';

        if (this.mensajeError == "Límite de peticiones por día excedido") {
          this.subMensaje = `Espera 1 día antes de intentarlo de nuevo. Tu límite de intentos se renovará automáticamente.`;
          this.modalVisibleParaLimite = true;
        } else {
          this.subMensaje = `Esperar 1 minuto antes de intentar de nuevo.`;
          this.modalVisibleParaLimite = true;
        }

      } else if (error.error?.statusCode === 409) {
        this.mensajeError = error.error?.message || 'Tu plan ha expirado o no tienes un plan activo';
        this.modalVisiblePlanExpirado = true;
      } else {
        this.modalVisibleErrorServidor = true;
      }
    } else {
      console.error('Error inesperado:', error);
    }
  } finally {
    this.humanizando = false;
  }
}


  cerrarModalexperiado() {
    window.location.reload();
    this.modalVisiblePlanExpirado = false

  }

}

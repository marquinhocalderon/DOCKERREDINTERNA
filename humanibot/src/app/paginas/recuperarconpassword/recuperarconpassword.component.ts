import { Component, computed, inject, Input } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ApirestService } from '../../servicios/apirest/apirest.service';
import { LayoutService } from '../../layout/service/layout.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from '../../layout/component/app.configurator';

@Component({
  selector: 'app-recuperarconpassword',
  imports: [CommonModule, FormsModule, StyleClassModule, AppConfigurator, ReactiveFormsModule],
  templateUrl: './recuperarconpassword.component.html',
  styleUrl: './recuperarconpassword.component.scss'
})
export class RecuperarconpasswordComponent {

  servicio = inject(ApirestService);
  darkTheme = computed(() => this.layoutService.layoutConfig().darkTheme);

  datosInfoUsuario: any;
  items!: MenuItem[];
  configuracion: MenuItem[] = [];

  isLoading = false;

  toggleDarkMode() {
    this.layoutService.layoutConfig.update(state => ({
      ...state,
      darkTheme: !state.darkTheme
    }));
  }

  mostrarSegundoFormulario: boolean = false;

  showPassword = false;
  showConfirmPassword = false;


  resetForm: FormGroup;

  resetForm2: FormGroup;
  constructor(public layoutService: LayoutService, private router: Router, private fb: FormBuilder) {

    // Aquí sí usas fb, ya está inyectado
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });


    this.resetForm2 = this.fb.group(
      {
        codigo: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]], // solo números
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required]
      },
      { validators: this.passwordsCoinciden } // validación personalizada
    );
  }

  // 🔒 Validación personalizada para verificar contraseñas iguales
  passwordsCoinciden(formGroup: AbstractControl): ValidationErrors | null {
    const pass = formGroup.get('password')?.value;
    const confirmPass = formGroup.get('confirmPassword')?.value;
    return pass === confirmPass ? null : { passwordMismatch: true };
  }

  ngOnInit() {
      localStorage.removeItem('token'); // Elimina token al entrar en esta página
  }


  correo: any
  // Getter para acceso rápido
  get email() {
    return this.resetForm.get('email');
  }

  abrirModaldeExitoCorreo: boolean = false;

  enviarCodigoAlCorreo() {
    if (this.resetForm.valid) {

      this.isLoading = true; // 🔄 Inicia loading

      this.servicio.crearRegistro("usuarios/solicitarresetpassword", { email: this.resetForm.value.email }).subscribe({
        next: (response) => {
          this.correo = this.resetForm.value.email;
          this.abrirModaldeExitoCorreo = true;
          this.mostrarSegundoFormulario = true;
          this.isLoading = false; // 🔄 Inicia loading

        },
        error: (error) => {
          console.error('Error al enviar el código de verificación:', error);
          this.abrirModaldeExitoCorreo = false;
          this.mostrarSegundoFormulario = false;
          this.isLoading = false; // 🔄 Detiene loading
        }
      });

    } else {
      this.resetForm.markAllAsTouched();
    }
  }



  agarrar_el_valor_formulario(evento: any) {
    let valor = evento.target.value.replace(/\D/g, ''); // elimina todo lo que no sea número
    evento.target.value = valor; // lo reescribe en el input
  }


  abrirGmail() {
    this.abrirModaldeExitoCorreo = false;
    // Abre Gmail en una nueva pestaña
    window.open("https://mail.google.com/mail/u/0/#inbox", "_blank");

  }


  abrirModalPasswordCambiada: boolean = false;
  // 🔐 Función de submit
  restablecerPassword() {
    if (this.resetForm2.valid) {

      this.isLoading = true;
      const valores = this.resetForm2.value;

      const enviarValores = {
        resetCode: valores.codigo,
        password: valores.confirmPassword
      };

      this.servicio.restablecerPassword("usuarios/actualizar/password", enviarValores).subscribe({
        next: (response) => {
          this.correo = this.resetForm.value.email;
          this.abrirModalPasswordCambiada = true;
          this.mostrarSegundoFormulario = true;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error al enviar el código de verificación:', error);
          this.abrirModalPasswordCambiada = false;
          this.isLoading = false;
        }
      });


    } else {
      this.resetForm2.markAllAsTouched();
    }
  }

  // Helpers para el HTML
  get codigo() { return this.resetForm2.get('codigo'); }
  get password() { return this.resetForm2.get('password'); }
  get confirmPassword() { return this.resetForm2.get('confirmPassword'); }

  // 🔄 Cerrar modal y redirigir al login
  volverAlLogin() {
    this.abrirModalPasswordCambiada = false;
    this.router.navigate(['/login']);
  }
}

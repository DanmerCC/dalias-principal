import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

type TipoUsuario = 'residente' | 'enfermeria' | null;

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  tipoSeleccionado: TipoUsuario = null;
  mostrarPassword = false;
  cargando = false;
  errorMensaje = '';

  formulario = {
    usuario: '',
    password: ''
  };

  constructor(private router: Router) {}

  seleccionarTipo(tipo: TipoUsuario): void {
    this.tipoSeleccionado = tipo;
    this.errorMensaje = '';
    this.formulario = { usuario: '', password: '' };
  }

  volverSeleccion(): void {
    this.tipoSeleccionado = null;
    this.errorMensaje = '';
    this.formulario = { usuario: '', password: '' };
  }

  togglePassword(): void {
    this.mostrarPassword = !this.mostrarPassword;
  }

  iniciarSesion(): void {
    if (!this.formulario.usuario || !this.formulario.password) {
      this.errorMensaje = 'Por favor completa todos los campos.';
      return;
    }

    this.cargando = true;
    this.errorMensaje = '';

    // Simulación de login — aquí conectarías con tu backend
    setTimeout(() => {
      this.cargando = false;

      if (this.tipoSeleccionado === 'residente') {
        // Credenciales demo residente
        if (this.formulario.usuario === 'residente' && this.formulario.password === '1234') {
          this.router.navigate(['/portal-residente']);
        } else {
          this.errorMensaje = 'Usuario o contraseña incorrectos.';
        }
      } else if (this.tipoSeleccionado === 'enfermeria') {
        // Credenciales demo enfermería
        if (this.formulario.usuario === 'enfermeria' && this.formulario.password === '1234') {
          this.router.navigate(['/portal-enfermeria']);
        } else {
          this.errorMensaje = 'Usuario o contraseña incorrectos.';
        }
      }
    }, 1200);
  }
}
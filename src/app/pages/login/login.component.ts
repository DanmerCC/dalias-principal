import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

type TipoUsuario = 'residente' | 'personal' | null;

// Usuarios estáticos demo — reemplazar con backend real
const USUARIOS_DEMO = [
  { username: 'residente',  password: '1234', tipo: 'residente', ruta: '/portal-residente' },
  { username: 'enfermeria', password: '1234', tipo: 'personal',  ruta: '/portal-enfermeria' },
  { username: 'admin',      password: '1234', tipo: 'personal',  ruta: '/portal-administrador' },
];

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

    setTimeout(() => {
      this.cargando = false;

      const match = USUARIOS_DEMO.find(
        (u) =>
          u.username === this.formulario.usuario &&
          u.password === this.formulario.password &&
          u.tipo === this.tipoSeleccionado
      );

      if (match) {
        this.router.navigate([match.ruta]);
      } else {
        this.errorMensaje = 'Usuario o contraseña incorrectos.';
      }
    }, 1200);
  }
}
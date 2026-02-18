import { Component, AfterViewInit, ElementRef, ViewChild, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface FormularioVisita {
  nombre: string;
  telefono: string;
  correo: string;
  servicio: string;
  mensaje: string;
}

interface ErroresVisita {
  nombre: string;
  telefono: string;
  correo: string;
  servicio: string;
}

@Component({
  selector: 'app-contactanos',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './contactanos.component.html',
  styleUrl: './contactanos.component.css'
})
export class ContactanosComponent implements AfterViewInit {
  @ViewChild('metrica1') metrica1!: ElementRef;
  @ViewChild('metrica2') metrica2!: ElementRef;
  @ViewChild('metrica3') metrica3!: ElementRef;

  nivelSatisfaccion = 0;
  cuidadoMedico = '0';
  areasVerdes = 0;

  private animacionIniciada = false;

  formularioVisita: FormularioVisita = {
    nombre: '',
    telefono: '',
    correo: '',
    servicio: '',
    mensaje: '',
  };

  erroresVisita: ErroresVisita = {
    nombre: '',
    telefono: '',
    correo: '',
    servicio: '',
  };

  mostrarModalConfirmacionVisita = false;
  enviandoFormularioVisita = false;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.observarMetricas();
    }
  }

  scrollToServicios() {
    const seccionServicios = document.getElementById('servicio__estadia');
    if (seccionServicios) {
      const offset = 60;
      const top = seccionServicios.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }

  observarMetricas(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.animacionIniciada) {
            this.animacionIniciada = true;
            this.animarMetricas();
          }
        });
      },
      { threshold: 0.5 }
    );

    if (this.metrica1) {
      observer.observe(this.metrica1.nativeElement);
    }
  }

  animarMetricas(): void {
    this.animarNumero(0, 99, 2000, (val) => {
      this.nivelSatisfaccion = val;
    });

    let horas = 0;
    const intervalHoras = setInterval(() => {
      horas++;
      this.cuidadoMedico = `${horas}/7`;
      if (horas >= 24) clearInterval(intervalHoras);
    }, 60);

    this.animarNumero(0, 5000, 2000, (val) => {
      this.areasVerdes = val;
    });
  }

  animarNumero(inicio: number, fin: number, duracion: number, callback: (val: number) => void): void {
    const rango = fin - inicio;
    const incremento = rango / (duracion / 16);
    let actual = inicio;

    const timer = setInterval(() => {
      actual += incremento;
      if (actual >= fin) {
        actual = fin;
        clearInterval(timer);
      }
      callback(Math.floor(actual));
    }, 16);
  }

  // Validaciones
  validarNombreVisita(): void {
    const valor = this.formularioVisita.nombre.trim();
    if (!valor) {
      this.erroresVisita.nombre = 'El nombre es obligatorio';
    } else if (valor.length < 3) {
      this.erroresVisita.nombre = 'Debe tener al menos 3 caracteres';
    } else if (!/^[a-záéíóúñ\s]+$/i.test(valor)) {
      this.erroresVisita.nombre = 'Solo se permiten letras y espacios';
    } else {
      this.erroresVisita.nombre = '';
    }
  }

  validarTelefonoVisita(): void {
    const valor = this.formularioVisita.telefono.trim();
    const telRegex = /^[0-9]{9,15}$/;
    if (!valor) {
      this.erroresVisita.telefono = 'El teléfono es obligatorio';
    } else if (!/^[0-9]+$/.test(valor)) {
      this.erroresVisita.telefono = 'Solo se permiten números';
    } else if (!telRegex.test(valor)) {
      this.erroresVisita.telefono = 'Ingresa un número válido (9-15 dígitos)';
    } else {
      this.erroresVisita.telefono = '';
    }
  }

  validarCorreoVisita(): void {
    const valor = this.formularioVisita.correo.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!valor) {
      this.erroresVisita.correo = 'El correo es obligatorio';
    } else if (!emailRegex.test(valor)) {
      this.erroresVisita.correo = 'Ingresa un correo válido';
    } else {
      this.erroresVisita.correo = '';
    }
  }

  validarServicioVisita(): void {
    if (!this.formularioVisita.servicio) {
      this.erroresVisita.servicio = 'Selecciona un servicio de interés';
    } else {
      this.erroresVisita.servicio = '';
    }
  }

  enviarFormularioVisita(): void {
    this.validarNombreVisita();
    this.validarTelefonoVisita();
    this.validarCorreoVisita();
    this.validarServicioVisita();

    const hayErrores = Object.values(this.erroresVisita).some((error) => error !== '');
    if (hayErrores) return;

    this.enviandoFormularioVisita = true;

    const payload = {
      tipoConsulta: this.formularioVisita.servicio,
      nombre: this.formularioVisita.nombre,
      correo: this.formularioVisita.correo,
      numeroMovil: this.formularioVisita.telefono,
      mensaje: this.formularioVisita.mensaje || '',
    };

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .post('https://backend-dalias.onrender.com/contacto', payload, { headers })
      .subscribe({
        next: (response: any) => {
          console.log('Respuesta exitosa:', response);
          this.enviandoFormularioVisita = false;
          this.mostrarModalConfirmacionVisita = true;
          this.limpiarFormularioVisita();
        },
        error: (error) => {
          console.error('Error al enviar formulario:', error);
          this.enviandoFormularioVisita = false;

          if (error.status === 400) {
            alert('Error en los datos enviados. Por favor verifica el formulario.');
          } else {
            alert('Ocurrió un error al enviar el mensaje. Por favor intenta nuevamente.');
          }
        },
      });
  }

  cerrarModalConfirmacionVisita(): void {
    this.mostrarModalConfirmacionVisita = false;
  }

  limpiarFormularioVisita(): void {
    this.formularioVisita = {
      nombre: '',
      telefono: '',
      correo: '',
      servicio: '',
      mensaje: '',
    };

    this.erroresVisita = {
      nombre: '',
      telefono: '',
      correo: '',
      servicio: '',
    };
  }
}
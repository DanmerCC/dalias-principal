import { Component, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface ActividadDiaria {
  hora: string;
  titulo: string;
  descripcion: string;
  destacado?: boolean;
}

interface PreguntaFrecuente {
  id: number;
  pregunta: string;
  respuesta: string;
  activo: boolean;
}

interface FormularioContacto {
  mensaje: string;
  nombre: string;
  correo: string;
  numeroMovil: string;
}

interface ErroresContacto {
  nombre: string;
  correo: string;
  numeroMovil: string;
}

@Component({
  selector: 'app-centro-de-dia',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './centro-de-dia.component.html',
  styleUrl: './centro-de-dia.component.css',
})
export class CentroDeDiaComponent {
  // Formulario de contacto
  formularioContacto: FormularioContacto = {
    mensaje: '',
    nombre: '',
    correo: '',
    numeroMovil: '',
  };

  erroresContacto: ErroresContacto = {
    nombre: '',
    correo: '',
    numeroMovil: '',
  };

  mostrarModalConfirmacionContacto = false;

  // Preguntas frecuentes
  preguntasFrecuentes: PreguntaFrecuente[] = [
    {
      id: 1,
      pregunta: '¿Cómo sé si mi familiar se adaptará bien a la dinámica grupal?',
      respuesta:
        'Antes de iniciar, realizamos una evaluación médica inicial utilizando el índice de Barthel. Esto nos permite medir la capacidad funcional e independencia de su familiar, asegurando que las actividades y el nivel de acompañamiento sean los adecuados para su condición específica desde el primer día.',
      activo: false,
    },
    {
      id: 2,
      pregunta:
        '¿Qué sucede si ocurre una emergencia médica durante su estancia de día?',
      respuesta:
        'La seguridad es nuestra prioridad. Estamos afiliados a un Sistema de Emergencias Médicas domiciliarias (Ambulancia), que brinda primeros auxilios inmediatos y transporte a una clínica u hospital si fuera necesario. Además, contamos con pulsadores de emergencia móviles y una central de monitoreo para asistencia inmediata.',
      activo: false,
    },
    {
      id: 3,
      pregunta: '¿Qué artículos debo enviar con mi familiar cada mañana?',
      respuesta:
        'El servicio de día no incluye artículos de higiene personal ni consumibles médicos específicos. Recomendamos enviar una pequeña mochila con sus medicinas para tratamientos crónicos, artículos personales como peine, cremas o toallitas húmedas y, de ser necesario, pañales o suplementos nutricionales formulados.',
      activo: false,
    },
    {
      id: 4,
      pregunta:
        'Como familiar, ¿qué nivel de participación puedo tener en la Residencia de Día?',
      respuesta:
        'Fomentamos la integración familiar total. Usted tiene acceso a un horario de visitas de 9:00 am a 5:00 pm y puede acompañar a su familiar en los almuerzos. También facilitamos el uso de áreas comunes como jardines, piscinas y parrillas para que puedan compartir momentos inolvidables con nietos y amigos',
      activo: false,
    },
  ];

  actividadesDiarias: ActividadDiaria[] = [
    {
      hora: '8:30 - 9:00',
      titulo: 'RECEPCIÓN',
      descripcion: 'Bienvenida personalizada y evaluación del estado general',
      destacado: false,
    },
    {
      hora: '9:00 - 10:00',
      titulo: 'ACTIVIDADES COGNITIVAS',
      descripcion: 'Ejercicios de memoria, lectura y estimulación mental',
      destacado: true,
    },
    {
      hora: '10:00 - 10:30',
      titulo: 'MEDIA MAÑANA',
      descripcion: 'Refrigerio nutritivo y momento de socialización',
      destacado: false,
    },
    {
      hora: '10:30 - 11:00',
      titulo: 'ACTIVIDADES LÚDICAS',
      descripcion: 'Juegos, manualidades y actividades recreativas',
      destacado: false,
    },
    {
      hora: '11:00 - 12:00',
      titulo: 'ACTIVIDADES FÍSICAS',
      descripcion: 'Ejercicios suaves, yoga adaptado y fisioterapia',
      destacado: true,
    },
    {
      hora: '12:00 - 13:00',
      titulo: 'ALMUERZO',
      descripcion: 'Comida balanceada adaptada a necesidades especiales',
      destacado: false,
    },
    {
      hora: '13:00 - 14:00',
      titulo: 'DESCANSO / OCIO',
      descripcion: 'Tiempo de relajación y actividades tranquilas',
      destacado: false,
    },
    {
      hora: '14:00 - 15:00',
      titulo: 'TERAPIA',
      descripcion: 'Terapia ocupacional y seguimiento personalizado',
      destacado: true,
    },
    {
      hora: '15:00 - 16:00',
      titulo: 'ACTIVIDADES FÍSICAS',
      descripcion: 'Segunda sesión de ejercicios y bailoterapia',
      destacado: false,
    },
    {
      hora: '16:00 - 16:30',
      titulo: 'MERIENDA',
      descripcion: 'Refrigerio de la tarde con bebidas nutritivas',
      destacado: false,
    },
    {
      hora: '16:30 - 17:00',
      titulo: 'ACTIVIDADES SOCIALES',
      descripcion: 'Interacción grupal, música y conversaciones',
      destacado: false,
    },
    {
      hora: '17:00',
      titulo: 'DESPEDIDA',
      descripcion: 'Reporte a familiares y preparación para el retorno',
      destacado: false,
    },
  ];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private http: HttpClient
  ) {}

  get preguntasColumna1(): PreguntaFrecuente[] {
    return this.preguntasFrecuentes.filter((_, index) => index % 2 === 0);
  }

  get preguntasColumna2(): PreguntaFrecuente[] {
    return this.preguntasFrecuentes.filter((_, index) => index % 2 !== 0);
  }

  togglePregunta(id: number): void {
    this.preguntasFrecuentes = this.preguntasFrecuentes.map((pregunta) => ({
      ...pregunta,
      activo: pregunta.id === id ? !pregunta.activo : pregunta.activo,
    }));
  }

  scrollToServicios() {
    const seccionServicios = document.getElementById('section_filosofia');

    if (seccionServicios) {
      const offset = 60;
      const top =
        seccionServicios.getBoundingClientRect().top +
        window.pageYOffset -
        offset;

      window.scrollTo({
        top,
        behavior: 'smooth',
      });
    }
  }

  // Métodos de validación del formulario
  validarNombreContacto(): void {
    const valor = this.formularioContacto.nombre.trim();
    if (!valor) {
      this.erroresContacto.nombre = 'El nombre es obligatorio';
    } else if (valor.length < 3) {
      this.erroresContacto.nombre = 'Debe tener al menos 3 caracteres';
    } else if (!/^[a-záéíóúñ\s]+$/i.test(valor)) {
      this.erroresContacto.nombre = 'Solo se permiten letras y espacios';
    } else {
      this.erroresContacto.nombre = '';
    }
  }

  validarCorreoContacto(): void {
    const valor = this.formularioContacto.correo.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!valor) {
      this.erroresContacto.correo = 'El correo electrónico es obligatorio';
    } else if (!emailRegex.test(valor)) {
      this.erroresContacto.correo = 'Ingresa un correo electrónico válido';
    } else {
      this.erroresContacto.correo = '';
    }
  }

  validarNumeroMovil(): void {
    const valor = this.formularioContacto.numeroMovil.trim();
    const telRegex = /^[0-9]{9,15}$/;

    if (!valor) {
      this.erroresContacto.numeroMovil = 'El número de móvil es obligatorio';
    } else if (!/^[0-9]+$/.test(valor)) {
      this.erroresContacto.numeroMovil = 'Solo se permiten números';
    } else if (!telRegex.test(valor)) {
      this.erroresContacto.numeroMovil =
        'Ingresa un número válido (9-15 dígitos)';
    } else {
      this.erroresContacto.numeroMovil = '';
    }
  }

  enviarFormularioContacto(): void {
    this.validarNombreContacto();
    this.validarCorreoContacto();
    this.validarNumeroMovil();

    const hayErrores = Object.values(this.erroresContacto).some(
      (error) => error !== ''
    );

    if (hayErrores) {
      return;
    }

    const payload = {
      nombre: this.formularioContacto.nombre,
      correo: this.formularioContacto.correo,
      numeroMovil: this.formularioContacto.numeroMovil,
      mensaje: this.formularioContacto.mensaje || '',
    };

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .post('https://backend-dalias.onrender.com/contacto', payload, {
        headers,
      })
      .subscribe({
        next: (response: any) => {
          console.log('Respuesta exitosa:', response);
          this.mostrarModalConfirmacionContacto = true;
          this.limpiarFormulario();
        },
        error: (error) => {
          console.error('Error al enviar formulario:', error);
          alert(
            'Ocurrió un error al enviar el mensaje. Por favor intenta nuevamente.'
          );
        },
      });
  }

  cerrarModalConfirmacionContacto(): void {
    this.mostrarModalConfirmacionContacto = false;
  }

  limpiarFormulario(): void {
    this.formularioContacto = {
      mensaje: '',
      nombre: '',
      correo: '',
      numeroMovil: '',
    };

    this.erroresContacto = {
      nombre: '',
      correo: '',
      numeroMovil: '',
    };
  }
}
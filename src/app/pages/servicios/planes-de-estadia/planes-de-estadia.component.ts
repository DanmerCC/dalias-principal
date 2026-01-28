import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface Servicio {
  id: string;
  titulo: string;
  icono: string;
  descripcion: string;
  detalles: string[];
  color: string;
  imagen: string;
  ruta: string;
}

interface Testimonio {
  nombre: string;
  servicio: string;
  comentario: string;
  imagen: string;
}

interface PreguntaFrecuente {
  id: number;
  pregunta: string;
  respuesta: string;
  activo: boolean;
}

interface FormularioContacto {
  tipoConsulta: string;
  mensaje: string;
  nombre: string;
  correo: string;
  numeroMovil: string;
}

interface ErroresContacto {
  tipoConsulta: string;
  nombre: string;
  correo: string;
  numeroMovil: string;
}

@Component({
  selector: 'app-planes-de-estadia',
  standalone: true, // Asegúrate de tener esta línea
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './planes-de-estadia.component.html',
  styleUrl: './planes-de-estadia.component.css',
})
export class PlanesDeEstadiaComponent {
  constructor(
    private router: Router,
    private http: HttpClient,
  ) {}

  formularioContacto: FormularioContacto = {
    tipoConsulta: '',
    mensaje: '',
    nombre: '',
    correo: '',
    numeroMovil: '',
  };

  erroresContacto: ErroresContacto = {
    tipoConsulta: '',
    nombre: '',
    correo: '',
    numeroMovil: '',
  };

  mostrarModalConfirmacionContacto = false;

  // Servicios principales (Sección 1)
  serviciosPrincipales: Servicio[] = [
    {
      id: 'permanente',
      titulo: 'Residencia Permanente',
      icono: 'fa-solid fa-house-medical',
      descripcion:
        'Hogar integral con atención continua, calidez y profesionalismo',
      detalles: [
        'Atención médica y de enfermería 24/7',
        'Alimentación balanceada con superalimentos',
        'Actividades recreativas y terapéuticas',
        'Habitaciones cómodas y seguras',
      ],
      color: '#758f94',
      imagen: '/permanente1.jpg',
      ruta: '/servicios/planes-de-estadia/residencia-permanente',
    },
    {
      id: 'temporal',
      titulo: 'Residencia Temporal',
      icono: 'fa-solid fa-calendar-days',
      descripcion: 'Estadías cortas con atención profesional completa',
      detalles: [
        'Flexibilidad según tiempo de estadía',
        'Dinámicas diarias de estimulación',
        'Ideal para descanso del cuidador',
        'Adaptación progresiva',
      ],
      color: '#D9B756',
      imagen: 'permanente2.jpg',
      ruta: '/servicios/residencia-temporal',
    },
    {
      id: 'centro-dia',
      titulo: 'Centro de Día',
      icono: 'fa-solid fa-sun',
      descripcion: 'Acompañamiento diurno con actividades y terapias',
      detalles: [
        'Jornada diurna estructurada',
        'Terapias ocupacionales y físicas',
        'Estimulación cognitiva',
        'Alimentación supervisada',
      ],
      color: '#758f94',
      imagen: '/permanente3.jpg',
      ruta: '/servicios/planes-de-estadia/centro-de-dia',
    },
    {
      id: 'post-operatoria',
      titulo: 'Residencia Post Operatoria',
      icono: 'fa-solid fa-heart-pulse',
      descripcion: 'Recuperación supervisada con atención médica especializada',
      detalles: [
        'Observación médica constante',
        'Enfermería especializada',
        'Rutinas de rehabilitación guiadas',
        'Administración segura de tratamientos',
      ],
      color: '#D9B756',
      imagen: '/permanente4.jpg',
      ruta: '/servicios/residencia-post-operatoria',
    },
  ];

  // Solo la parte modificada del componente TypeScript

  preguntasFrecuentes: PreguntaFrecuente[] = [
    {
      id: 1,
      pregunta:
        '¿Cual es la diferencia entre Residencia Permanente y Temporal?',
      respuesta:
        'La Residencia Permanente está diseñada como un nuevo hogar a largo plazo con asistencia total. La Residencia Temporal ofrece los mismos beneficios de cuidado y alimentación, pero está enfocada en periodos específicos, como vacaciones familiares o descansos del cuidador principal.',
      activo: false,
    },
    {
      id: 2,
      pregunta:
        '¿Puedo cambiar de plan de estadía si las necesidades del adulto mayor evolucionan con el tiempo?',
      respuesta:
        'Sí. Los planes de estadía están pensados para ser flexibles. Si las necesidades del adulto mayor cambian, es posible reevaluar su situación y ajustar el plan (por ejemplo, pasar de un centro de día a una residencia temporal o permanente), siempre con una evaluación geriátrica previa que garantice continuidad y bienestar en el cuidado.',
      activo: false,
    },
    {
      id: 3,
      pregunta:
        '¿Qué sucede si el adulto mayor requiere cuidados adicionales durante su estadía?',
      respuesta:
        'Ante cualquier cambio en el estado de salud, se realiza una evaluación profesional para definir ajustes en el plan de atención, terapias o acompañamiento. El objetivo es brindar un cuidado oportuno y personalizado, manteniendo una comunicación clara con la familia en todo momento.',
      activo: false,
    },
    {
      id: 4,
      pregunta:
        '¿Cómo se decide qué plan es el más seguro para el nivel de movilidad de mi familiar?',
      respuesta:
        'Antes de la contratación, nuestra geriatra realiza una valoración de independencia física. Esta evaluación profesional nos permite recomendarle si el adulto mayor es apto para el Centro de Día o si requiere el soporte de una Residencia Permanente o Temporal con monitoreo de enfermería las 24 horas.',
      activo: false,
    },
  ];

  get preguntasColumna1(): PreguntaFrecuente[] {
    return this.preguntasFrecuentes.filter((_, index) => index % 2 === 0);
  }

  get preguntasColumna2(): PreguntaFrecuente[] {
    return this.preguntasFrecuentes.filter((_, index) => index % 2 !== 0);
  }

  testimonios: Testimonio[] = [
    {
      nombre: 'María González',
      servicio: 'Residencia Permanente',
      comentario:
        'Mi madre está feliz aquí. El personal es muy atento y profesional. Las instalaciones son excelentes y siempre está participando en actividades.',
      imagen: '/nosotros5.jpg',
    },
    {
      nombre: 'Carlos Mendoza',
      servicio: 'Centro de Día',
      comentario:
        'El centro de día ha sido una gran solución para nuestra familia. Mi padre disfruta mucho las terapias y ha mejorado notablemente su movilidad.',
      imagen: '/nosotros6.jpg',
    },
    {
      nombre: 'Ana Pérez',
      servicio: 'Residencia Post Operatoria',
      comentario:
        'Después de la cirugía de mi abuela, encontramos en Las Dalias el lugar perfecto para su recuperación. El seguimiento médico fue impecable.',
      imagen: '/nosotros7.jpg',
    },
  ];

  irAServicio(ruta: string): void {
    this.router.navigate([ruta]);
  }

  abrirModalVisita(): void {
    // Aquí puedes emitir un evento o llamar a un servicio
    // para abrir el modal que ya tienes en el inicio
    console.log('Abrir modal de visita');
  }

  togglePregunta(id: number): void {
    this.preguntasFrecuentes = this.preguntasFrecuentes.map((pregunta) => ({
      ...pregunta,
      activo: pregunta.id === id ? !pregunta.activo : pregunta.activo,
    }));
  }

  validarTipoConsulta(): void {
    if (!this.formularioContacto.tipoConsulta) {
      this.erroresContacto.tipoConsulta = 'Selecciona un tipo de consulta';
    } else {
      this.erroresContacto.tipoConsulta = '';
    }
  }

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
    this.validarTipoConsulta();
    this.validarNombreContacto();
    this.validarCorreoContacto();
    this.validarNumeroMovil();

    const hayErrores = Object.values(this.erroresContacto).some(
      (error) => error !== '',
    );

    if (hayErrores) {
      return;
    }

    const payload = {
      tipoConsulta: this.formularioContacto.tipoConsulta,
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
            'Ocurrió un error al enviar el mensaje. Por favor intenta nuevamente.',
          );
        },
      });
  }

  cerrarModalConfirmacionContacto(): void {
    this.mostrarModalConfirmacionContacto = false;
  }

  limpiarFormulario(): void {
    this.formularioContacto = {
      tipoConsulta: '',
      mensaje: '',
      nombre: '',
      correo: '',
      numeroMovil: '',
    };

    this.erroresContacto = {
      tipoConsulta: '',
      nombre: '',
      correo: '',
      numeroMovil: '',
    };
  }

  scrollToServicios(): void {
    const element = document.getElementById('seccion-servicios');
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }
}

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
        'Alimentación balanceada personalizada',
        'Actividades recreativas y terapéuticas',
        'Habitaciones cómodas y seguras',
      ],
      color: '#758f94',
      imagen: '/nosotros1.jpg',
      ruta: '/servicios/planes-de-estadia/residencia-permanente',
    },
    {
      id: 'temporal',
      titulo: 'Residencia Temporal',
      icono: 'fa-solid fa-calendar-days',
      descripcion: 'Estadías cortas con atención profesional completa',
      detalles: [
        'Flexibilidad en días de estadía',
        'Mismo nivel de atención que residencia permanente',
        'Ideal para descanso del cuidador',
        'Adaptación progresiva',
      ],
      color: '#D9B756',
      imagen: '/nosotros2.jpg',
      ruta: '/servicios/residencia-temporal',
    },
    {
      id: 'centro-dia',
      titulo: 'Centro de Día',
      icono: 'fa-solid fa-sun',
      descripcion: 'Acompañamiento diurno con actividades y terapias',
      detalles: [
        'Atención de 8:00 am a 5:00 pm',
        'Terapias ocupacionales y físicas',
        'Estimulación cognitiva',
        'Alimentación incluida',
      ],
      color: '#758f94',
      imagen: '/servicios1.png',
      ruta: '/servicios/planes-de-estadia/centro-de-dia',
    },
    {
      id: 'post-operatoria',
      titulo: 'Residencia Post Operatoria',
      icono: 'fa-solid fa-heart-pulse',
      descripcion: 'Recuperación supervisada con atención médica especializada',
      detalles: [
        'Seguimiento médico personalizado',
        'Enfermería especializada',
        'Terapia física y rehabilitación',
        'Control de medicación',
      ],
      color: '#D9B756',
      imagen: '/servicios2.png',
      ruta: '/servicios/residencia-post-operatoria',
    },
  ];

  preguntasFrecuentes: PreguntaFrecuente[] = [
    {
      id: 1,
      pregunta:
        '¿Cuándo debería considerar una residencia geriátrica para mi familiar?',
      respuesta:
        'Es recomendable considerar una residencia geriátrica para adultos mayores cuando el familiar comienza a necesitar mayor acompañamiento, supervisión, apoyo en actividades diarias o cuando la familia busca mejorar su calidad de vida, previniendo riesgos como caídas o aislamiento. <br><br>👉 Revise nuestra guía para elegir la residencia adecuada: <a href="https://goo.su/Lis06yx" target="_blank" rel="noopener noreferrer">https://goo.su/Lis06yx</a>',
      activo: false,
    },
    {
      id: 2,
      pregunta:
        '¿Qué tipo de adultos mayores pueden vivir la experiencia Las Dalias?',
      respuesta:
        'Residencia Las Dalias está orientada principalmente a adultos mayores independientes o semi dependientes que desean vivir en un entorno cómodo, seguro y acompañado, manteniendo su autonomía y recibiendo apoyo profesional cuando lo necesiten.',
      activo: false,
    },
    {
      id: 3,
      pregunta:
        '¿Cuáles son los servicios de cuidado para un adulto mayor y en qué se diferencian?',
      respuesta:
        'Ofrecemos residencia permanente, residencia temporal, centro de día, residencia post operatoria y consultas geriátricas, adaptándonos a distintas necesidades.<br><br>Cada servicio se diferencia por el nivel de acompañamiento, duración de la estadía y tipo de cuidado requerido, siempre con un enfoque personalizado.',
      activo: false,
    },
    {
      id: 4,
      pregunta:
        '¿Cómo se garantiza la seguridad y el bienestar de los residentes?',
      respuesta:
        'La seguridad del adulto mayor es prioritaria. Contamos con personal de enfermería las 24 horas, monitoreo permanente, protocolos de salud, sistema de emergencias médicas, instalaciones adaptadas y seguimiento geriátrico continuo para actuar de forma rápida y segura ante cualquier situación.',
      activo: false,
    },
    {
      id: 5,
      pregunta:
        '¿Cómo pueden los familiares participar en la vida del residente y cómo es la comunicación con el personal?',
      respuesta:
        'En Residencia Las Dalias, la familia participa activamente mediante visitas, actividades compartidas y una comunicación constante y transparente con el equipo, fortaleciendo la confianza y el bienestar del residente.',
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
      .post('https://backend-dalias.onrender.com/contacto', payload, { headers })
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

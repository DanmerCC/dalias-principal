import {
  Component,
  OnInit,
  AfterViewInit,
  PLATFORM_ID,
  Inject,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormsModule } from '@angular/forms';

interface AcordeonItem {
  id: number;
  titulo: string;
  contenido: string;
  activo: boolean;
}

interface SlideItem {
  titulo: string;
  subtitulo: string;
  imagen: string;
  icono: string;
  items: {
    titulo: string;
    descripcion: string;
  }[];
}

interface Noticia {
  id: number;
  fecha: string;
  titulo: string;
  descripcion: string;
  imagen: string;
  link: string;
}

interface FormularioContacto {
  tipoConsulta: string;
  mensaje: string;
  nombre: string;
}

interface PreguntaFrecuente {
  id: number;
  pregunta: string;
  respuesta: string;
  activo: boolean;
}

interface FormularioVisita {
  nombreApellido: string;
  edadAdultoMayor: string;
  nivelDependencia: string;
  observacionesSalud: string;
  fechaSeleccionada: string;
  horaSeleccionada: string;
}

interface Actividad {
  titulo: string;
  descripcion: string;
  imagen: string;
}

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css',
  animations: [
    trigger('fadeInOut', [
      transition('* => *', [
        style({ opacity: 0, transform: 'scale(1.05)' }),
        animate('800ms ease-in-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class InicioComponent implements OnInit, OnDestroy {
  @ViewChild('actividadesCarrusel') actividadesCarrusel!: ElementRef;

  slideActual = 0;
  indicePaginaNoticias = 0;
  noticiasPorPagina = 2;
  noticiasVisibles: Noticia[] = [];
  paginasNoticias: number[] = [];
  slideActualActividades = 0;

  // Carrusel de imágenes nosotros
  imagenActualNosotros = 0;
  imagenesNosotros: string[] = [
    '/nosotros1.png',
    '/nosotros2.png',
    '/nosotros3.png',
    '/nosotros4.png',
    '/nosotros5.png',
    '/nosotros6.png',
  ];
  intervaloNosotros: any;

  // Modal de visita
  mostrarModalVisita = false;
  mesActual = new Date().getMonth();
  anioActual = new Date().getFullYear();
  diasDelMes: { dia: number; esHoy: boolean; disponible: boolean }[] = [];
  horasDisponibles: string[] = [
    '09:00 - 10:00',
    '10:00 - 11:00',
    '11:00 - 12:00',
    '14:00 - 15:00',
    '15:00 - 16:00',
    '16:00 - 17:00',
  ];

  formularioVisita: FormularioVisita = {
    nombreApellido: '',
    edadAdultoMayor: '',
    nivelDependencia: '',
    observacionesSalud: '',
    fechaSeleccionada: '',
    horaSeleccionada: '',
  };

  // Actividades para el carrusel
  actividades: Actividad[] = [
    {
      titulo: 'Club de Lectura',
      descripcion:
        'Fomentamos el amor por la lectura con sesiones grupales donde compartimos historias, reflexiones y debates literarios, estimulando la mente y creando vínculos entre nuestros residentes. Un espacio de encuentro donde la literatura nos une y enriquece nuestras experiencias compartidas.',
      imagen: '/actividades1.jpeg',
    },
    {
      titulo: 'Musicoterapia',
      descripcion:
        'La música como herramienta terapéutica para mejorar el bienestar emocional, estimular la memoria y promover la expresión artística a través de sesiones de canto, instrumentos y baile. Aprovechamos el poder sanador de la música para conectar con las emociones y revivir momentos especiales.',
      imagen: '/actividades2.jpeg',
    },
    {
      titulo: 'Danza y Movimiento',
      descripcion:
        'Clases adaptadas de baile y movimiento rítmico que ayudan a mantener la movilidad, mejorar el equilibrio y disfrutar de momentos alegres llenos de música y compañía. Cada sesión está diseñada para que todos puedan participar según sus capacidades, promoviendo la actividad física de forma divertida.',
      imagen: '/actividades3.jpeg',
    },
    {
      titulo: 'Celebraciones Especiales',
      descripcion:
        'Organizamos celebraciones de cumpleaños, Día de la Madre, Día del Padre, Navidad y otras festividades para mantener vivas las tradiciones y crear momentos inolvidables con familiares. Cada evento es una oportunidad para reunirnos, compartir alegría y fortalecer los lazos afectivos en un ambiente festivo.',
      imagen: '/actividades4.jpeg',
    },
    {
      titulo: 'Meditación y Relajación',
      descripcion:
        'Sesiones de mindfulness y técnicas de relajación que promueven la paz interior, reducen el estrés y mejoran la calidad del sueño de nuestros residentes en un ambiente tranquilo. Aprendemos a conectar con el presente, respirar conscientemente y encontrar serenidad en nuestro día a día.',
      imagen: '/actividades5.jpeg',
    },
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  slidesCarrusel: SlideItem[] = [
    {
      titulo: 'Salud médica',
      subtitulo: 'Seguimiento profesional',
      imagen: '/servicios1.png',
      icono: 'bx bx-plus',
      items: [
        {
          titulo: 'Consulta Geriátrica',
          descripcion:
            'Evaluación y control del estado de salud del residente.',
        },
        {
          titulo: 'Monitoreo Continuo',
          descripcion:
            'Control de signos vitales y seguimiento médico permanente.',
        },
      ],
    },
    {
      titulo: 'Rehabilitación',
      subtitulo: 'Movimiento y autonomía',
      imagen: '/servicios2.png',
      icono: 'bx bx-dumbbell',
      items: [
        {
          titulo: 'Fisioterapia',
          descripcion:
            'Tratamientos para mejorar la movilidad y el equilibrio.',
        },
        {
          titulo: 'Terapia Ocupacional',
          descripcion: 'Estimulación de capacidades físicas para la autonomía.',
        },
      ],
    },
    {
      titulo: 'Apoyo emocional',
      subtitulo: 'Bienestar psicológico',
      imagen: '/servicios3.png',
      icono: 'bx bx-brain',
      items: [
        {
          titulo: 'Atención psicogeriátrica',
          descripcion: 'Acompañamiento emocional especializado.',
        },
        {
          titulo: 'Terapia Individual',
          descripcion: 'Sesiones personalizadas para el bienestar emocional.',
        },
      ],
    },
    {
      titulo: 'Alimentación',
      subtitulo: 'Cuidado nutricional',
      imagen: '/servicios4.png',
      icono: 'bx bx-bowl-hot',
      items: [
        {
          titulo: 'Nutrición Personalizada',
          descripcion: 'Dietas equilibradas adaptadas a cada residente.',
        },
        {
          titulo: 'Supervisión Dietética',
          descripcion: 'Control de ingesta y necesidades nutricionales.',
        },
      ],
    },
    {
      titulo: 'Planes de Estadía',
      subtitulo: 'Opciones flexibles',
      imagen: '/servicios5.png',
      icono: 'bx bx-calendar-check',
      items: [
        {
          titulo: 'Estadía Permanente',
          descripcion: 'Residencia completa con todos los servicios incluidos.',
        },
        {
          titulo: 'Estadía Temporal',
          descripcion: 'Estancias cortas para recuperación o descanso.',
        },
      ],
    },
  ];

  acordeonItems: AcordeonItem[] = [
    {
      id: 1,
      titulo: 'Consulta Geriátrica',
      contenido:
        'Atención médica especializada orientada al control y seguimiento del adulto mayor.',
      activo: false,
    },
    {
      id: 2,
      titulo: 'Terapias y Rehabilitación',
      contenido:
        'Programas de fisioterapia y terapia ocupacional orientados a la autonomía.',
      activo: false,
    },
    {
      id: 3,
      titulo: 'Nutrición',
      contenido:
        'Alimentación equilibrada y adaptada a las necesidades del residente.',
      activo: false,
    },
    {
      id: 4,
      titulo: 'Planes de Estadía',
      contenido:
        'Opciones flexibles de residencia: permanente, temporal, centro de día y respiro familiar.',
      activo: false,
    },
  ];

  preguntasFrecuentes: PreguntaFrecuente[] = [
    {
      id: 1,
      pregunta: '¿Qué servicios incluye la residencia permanente?',
      respuesta:
        'La residencia permanente incluye alojamiento completo, alimentación personalizada, atención médica y de enfermería 24/7, terapias de rehabilitación, actividades recreativas y seguimiento geriátrico continuo.',
      activo: false,
    },
    {
      id: 2,
      pregunta: '¿Puedo visitar a mi familiar en cualquier momento?',
      respuesta:
        'Sí, contamos con horarios de visita flexibles. Puedes visitar a tu familiar todos los días. Te recomendamos consultar los horarios específicos con nuestro personal para coordinar mejor tu visita.',
      activo: false,
    },
    {
      id: 3,
      pregunta: '¿Cómo funciona el centro de día?',
      respuesta:
        'El centro de día es una modalidad donde el residente participa de actividades terapéuticas, recreativas y sociales durante el día, regresando a su hogar por la noche. Incluye alimentación, transporte y todas las terapias necesarias.',
      activo: false,
    },
    {
      id: 4,
      pregunta: '¿Qué medidas de seguridad tienen implementadas?',
      respuesta:
        'Contamos con monitoreo 24/7, personal de seguridad, sistemas de llamado de emergencia en todas las habitaciones, protocolos de prevención de caídas y equipamiento médico de última generación.',
      activo: false,
    },
    {
      id: 5,
      pregunta: '¿Aceptan personas con necesidades especiales?',
      respuesta:
        'Sí, nuestra residencia está preparada para atender personas con diversas necesidades especiales, incluyendo movilidad reducida, demencia y otras condiciones. Evaluamos cada caso individualmente para brindar el mejor cuidado.',
      activo: false,
    },
  ];

  get preguntasColumna1(): PreguntaFrecuente[] {
    return this.preguntasFrecuentes.filter((_, index) => index % 2 === 0);
  }

  get preguntasColumna2(): PreguntaFrecuente[] {
    return this.preguntasFrecuentes.filter((_, index) => index % 2 !== 0);
  }

  noticias: Noticia[] = [
    {
      id: 1,
      fecha: '15/01/2026',
      titulo:
        'Nuevos programas de estimulación cognitiva para prevenir el deterioro mental',
      descripcion:
        'Implementamos actividades innovadoras basadas en neurociencia que ayudan a mantener activa la mente de nuestros residentes, mejorando memoria, atención y capacidades cognitivas mediante ejercicios personalizados y dinámicas grupales.',
      imagen:
        'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80',
      link: '#',
    },
    {
      id: 2,
      fecha: '10/01/2026',
      titulo:
        'La importancia de la hidratación en el adulto mayor durante el verano',
      descripcion:
        'Nuestro equipo médico comparte recomendaciones esenciales sobre hidratación adecuada, signos de deshidratación y mejores prácticas para mantener a los residentes saludables durante las altas temperaturas del verano peruano.',
      imagen:
        'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80',
      link: '#',
    },
    {
      id: 3,
      fecha: '05/01/2026',
      titulo:
        'Beneficios de la musicoterapia en pacientes con Alzheimer y demencia',
      descripcion:
        'Descubre cómo la música se convierte en una poderosa herramienta terapéutica que mejora el estado de ánimo, reduce la ansiedad y estimula la memoria en personas con deterioro cognitivo, creando conexiones emocionales profundas.',
      imagen:
        'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80',
      link: '#',
    },
    {
      id: 4,
      fecha: '28/12/2025',
      titulo:
        'Celebramos las fiestas navideñas con actividades especiales para residentes',
      descripcion:
        'Revive los momentos más emotivos de nuestras celebraciones navideñas, donde familiares y residentes compartieron villancicos, cenas especiales y regalos en un ambiente lleno de amor, tradición y alegría festiva.',
      imagen:
        'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80',
      link: '#',
    },
    {
      id: 5,
      fecha: '20/12/2025',
      titulo: 'Guía completa sobre nutrición saludable para adultos mayores',
      descripcion:
        'Conoce las recomendaciones nutricionales específicas para la tercera edad, incluyendo alimentos esenciales, porciones adecuadas y cómo prevenir deficiencias vitamínicas que afectan la salud y vitalidad de los adultos mayores.',
      imagen:
        'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80',
      link: '#',
    },
    {
      id: 6,
      fecha: '15/12/2025',
      titulo:
        'Ejercicios de bajo impacto: Mantén la movilidad y previene caídas',
      descripcion:
        'Nuestros fisioterapeutas presentan una serie de ejercicios seguros y efectivos diseñados específicamente para mejorar el equilibrio, fortalecer músculos y reducir significativamente el riesgo de caídas en adultos mayores.',
      imagen:
        'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80',
      link: '#',
    },
  ];

  ngOnInit(): void {
    this.inicializarNoticias();
    this.generarCalendario();
    this.iniciarCarruselNosotros();
  }

  ngOnDestroy(): void {
    this.detenerCarruselNosotros();
  }

  iniciarCarruselNosotros(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.intervaloNosotros = setInterval(() => {
        this.imagenActualNosotros =
          (this.imagenActualNosotros + 1) % this.imagenesNosotros.length;
      }, 3000);
    }
  }

  detenerCarruselNosotros(): void {
    if (this.intervaloNosotros) {
      clearInterval(this.intervaloNosotros);
    }
  }

  // Métodos del carrusel de actividades
  siguienteActividad(): void {
    if (this.slideActualActividades < this.actividades.length - 1) {
      this.slideActualActividades++;
      this.scrollToActividad();
    }
  }

  anteriorActividad(): void {
    if (this.slideActualActividades > 0) {
      this.slideActualActividades--;
      this.scrollToActividad();
    }
  }

  irAActividad(indice: number): void {
    this.slideActualActividades = indice;
    this.scrollToActividad();
  }

  scrollToActividad(): void {
    if (isPlatformBrowser(this.platformId) && this.actividadesCarrusel) {
      const container = this.actividadesCarrusel.nativeElement;
      const articuloAncho =
        container.querySelector('.art__atv')?.clientWidth || 0;
      const gap = 16; // 1rem en píxeles
      const scrollAmount = (articuloAncho + gap) * this.slideActualActividades;

      container.scrollTo({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  }

  toggleAcordeon(id: number): void {
    this.acordeonItems = this.acordeonItems.map((item) => ({
      ...item,
      activo: item.id === id ? !item.activo : false,
    }));
  }

  siguienteSlide(): void {
    this.slideActual = (this.slideActual + 1) % this.slidesCarrusel.length;
  }

  anteriorSlide(): void {
    this.slideActual =
      this.slideActual === 0
        ? this.slidesCarrusel.length - 1
        : this.slideActual - 1;
  }

  inicializarNoticias(): void {
    const totalPaginas = Math.ceil(
      this.noticias.length / this.noticiasPorPagina
    );
    this.paginasNoticias = Array.from({ length: totalPaginas }, (_, i) => i);
    this.actualizarNoticiasVisibles();
  }

  actualizarNoticiasVisibles(): void {
    const inicio = this.indicePaginaNoticias * this.noticiasPorPagina;
    const fin = inicio + this.noticiasPorPagina;
    this.noticiasVisibles = this.noticias.slice(inicio, fin);
  }

  siguienteNoticia(): void {
    if (this.indicePaginaNoticias < this.paginasNoticias.length - 1) {
      this.indicePaginaNoticias++;
      this.actualizarNoticiasVisibles();
    }
  }

  anteriorNoticia(): void {
    if (this.indicePaginaNoticias > 0) {
      this.indicePaginaNoticias--;
      this.actualizarNoticiasVisibles();
    }
  }

  irAPaginaNoticia(indice: number): void {
    this.indicePaginaNoticias = indice;
    this.actualizarNoticiasVisibles();
  }

  togglePregunta(id: number): void {
    this.preguntasFrecuentes = this.preguntasFrecuentes.map((pregunta) => ({
      ...pregunta,
      activo: pregunta.id === id ? !pregunta.activo : pregunta.activo,
    }));
  }

  opcionesContacto = [
    { value: 'informacion-general', label: 'Información General' },
    { value: 'planes-estadia', label: 'Planes de Estadía' },
    { value: 'consulta-geriatrica', label: 'Consulta Geriátrica' },
    { value: 'terapias-rehabilitacion', label: 'Terapias y Rehabilitación' },
  ];

  formularioContacto: FormularioContacto = {
    tipoConsulta: 'informacion-general',
    mensaje: '',
    nombre: '',
  };

  enviarFormulario(): void {
    if (this.formularioContacto.nombre && this.formularioContacto.mensaje) {
      console.log('Formulario enviado:', this.formularioContacto);
      alert('Gracias por contactarnos. Pronto nos comunicaremos con usted.');
      this.formularioContacto = {
        tipoConsulta: 'residencia-permanente',
        mensaje: '',
        nombre: '',
      };
    } else {
      alert('Por favor complete todos los campos requeridos.');
    }
  }

  abrirModalVisita(): void {
    this.mostrarModalVisita = true;
    document.body.style.overflow = 'hidden';
  }

  cerrarModalVisita(): void {
    this.mostrarModalVisita = false;
    document.body.style.overflow = 'auto';
  }

  generarCalendario(): void {
    const primerDia = new Date(this.anioActual, this.mesActual, 1).getDay();
    const ultimoDia = new Date(
      this.anioActual,
      this.mesActual + 1,
      0
    ).getDate();
    const hoy = new Date();

    this.diasDelMes = [];

    for (let i = 0; i < primerDia; i++) {
      this.diasDelMes.push({ dia: 0, esHoy: false, disponible: false });
    }

    for (let dia = 1; dia <= ultimoDia; dia++) {
      const fecha = new Date(this.anioActual, this.mesActual, dia);
      const esHoy = fecha.toDateString() === hoy.toDateString();
      const disponible = fecha >= hoy;

      this.diasDelMes.push({ dia, esHoy, disponible });
    }
  }

  mesAnterior(): void {
    if (this.mesActual === 0) {
      this.mesActual = 11;
      this.anioActual--;
    } else {
      this.mesActual--;
    }
    this.generarCalendario();
  }

  mesSiguiente(): void {
    if (this.mesActual === 11) {
      this.mesActual = 0;
      this.anioActual++;
    } else {
      this.mesActual++;
    }
    this.generarCalendario();
  }

  get nombreMes(): string {
    const meses = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];
    return meses[this.mesActual];
  }

  seleccionarFecha(dia: number): void {
    if (dia > 0) {
      this.formularioVisita.fechaSeleccionada = `${dia}/${this.mesActual + 1}/${
        this.anioActual
      }`;
    }
  }

  seleccionarHora(hora: string): void {
    this.formularioVisita.horaSeleccionada = hora;
  }

  enviarSolicitudVisita(): void {
    if (
      this.formularioVisita.nombreApellido &&
      this.formularioVisita.edadAdultoMayor &&
      this.formularioVisita.nivelDependencia &&
      this.formularioVisita.fechaSeleccionada &&
      this.formularioVisita.horaSeleccionada
    ) {
      console.log('Solicitud de visita:', this.formularioVisita);
      alert(
        '¡Gracias! Tu solicitud de visita ha sido registrada. Pronto nos contactaremos contigo.'
      );

      this.formularioVisita = {
        nombreApellido: '',
        edadAdultoMayor: '',
        nivelDependencia: '',
        observacionesSalud: '',
        fechaSeleccionada: '',
        horaSeleccionada: '',
      };

      this.cerrarModalVisita();
    } else {
      alert('Por favor completa todos los campos obligatorios.');
    }
  }
}

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
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

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
  correo: string;
  numeroMovil: string;
}

interface ErroresContacto {
  tipoConsulta: string;
  nombre: string;
  correo: string;
  numeroMovil: string;
}

interface PreguntaFrecuente {
  id: number;
  pregunta: string;
  respuesta: string;
  activo: boolean;
}

interface FormularioVisita {
  nombreApellido: string;
  correoElectronico: string;
  edadAdultoMayor: string;
  nivelDependencia: string;
  observacionesSalud: string;
  fechaSeleccionada: string;
  horaSeleccionada: string;
}

interface ErroresFormulario {
  nombreApellido: string;
  correoElectronico: string;
  edadAdultoMayor: string;
  nivelDependencia: string;
  fechaSeleccionada: string;
  horaSeleccionada: string;
}

interface Actividad {
  id: number;
  titulo: string;
  subtitulo: string;
  descripcion: string;
  imagen: string;
  imagePublicId: string;
  createdAt: string;
  updatedAt: string;
}

interface EvaluacionForm {
  movilidad: string;
  avd: string;
  cognitivo: string;
  emocional: string;
  condiciones: {
    hipertension: boolean;
    diabetes: boolean;
    dificultadesCaminar: boolean;
    incontinencia: boolean;
    problemasAudicionVision: boolean;
    postOperatoria: boolean;
    otra: boolean;
  };
  medicacion: string;
  motivo: string;
}

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HttpClientModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css',
  animations: [
    trigger('fadeInOut', [
      transition('* => *', [
        style({ opacity: 0, transform: 'scale(1.05)' }),
        animate(
          '1500ms ease-in-out',
          style({ opacity: 1, transform: 'scale(1)' }),
        ),
      ]),
    ]),
  ],
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
    '/nosotros1.jpg',
    '/nosotros2.jpg',
    '/nosotros3.jpg',
    '/nosotros4.jpg',
    '/nosotros5.jpg',
    '/nosotros6.jpg',
    '/nosotros7.jpg',
  ];
  intervaloNosotros: any;

  get esPrimeraImagen(): boolean {
    return this.imagenActualNosotros === 0;
  }

  // Modal de visita
  mostrarModalConfirmacion = false;
  evaluacionIniciada = false;
  erroresEvaluacion = {
    movilidad: false,
    avd: false,
    cognitivo: false,
    emocional: false,
    medicacion: false,
    motivo: false,
    condiciones: false,
  };

  mostrarModalVisita = false;
  mostrarEvaluacion = false;
  mostrarModalEvaluacion = false;
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
    correoElectronico: '',
    edadAdultoMayor: '',
    nivelDependencia: '',
    observacionesSalud: '',
    fechaSeleccionada: '',
    horaSeleccionada: '',
  };

  erroresVisita: ErroresFormulario = {
    nombreApellido: '',
    correoElectronico: '',
    edadAdultoMayor: '',
    nivelDependencia: '',
    fechaSeleccionada: '',
    horaSeleccionada: '',
  };

  // Formulario de evaluación
  evaluacionForm: EvaluacionForm = {
    movilidad: '',
    avd: '',
    cognitivo: '',
    emocional: '',
    condiciones: {
      hipertension: false,
      diabetes: false,
      dificultadesCaminar: false,
      incontinencia: false,
      problemasAudicionVision: false,
      postOperatoria: false,
      otra: false,
    },
    medicacion: '',
    motivo: '',
  };

  // Actividades para el carrusel
  actividades: Actividad[] = [];

  get actividadesConFinal() {
    return [...this.actividades, { final: true }];
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
    private router: Router,
  ) {}

  navegarAPlan(plan: string): void {
    if (!plan) {
      return;
    }

    const rutasPlanes: { [key: string]: string } = {
      'residencia-permanente':
        '/servicios/planes-de-estadia/residencia-permanente',
      'centro-de-dia': '/servicios/planes-de-estadia/centro-de-dia',
      temporal: '/servicios/planes-de-estadia/temporal',
      'post-operatoria': '/servicios/planes-de-estadia/post-operatoria',
    };

    const ruta = rutasPlanes[plan];
    if (ruta) {
      this.router.navigate([ruta]);
    }
  }

  slidesCarrusel: SlideItem[] = [
    {
      titulo: 'Planes de Estadía',
      subtitulo: 'Opciones Variadas',
      imagen: '/servicios1.png',
      icono: 'bx bx-calendar-check',
      items: [
        {
          titulo: 'Estadía Permanente',
          descripcion: 'Cuidado integral y acompañamiento continuo.',
        },
        {
          titulo: 'Estadía Temporal',
          descripcion: 'Estancias cortas con atención profesional.',
        },
        {
          titulo: 'Centro de Día',
          descripcion: 'Acompañamiento diurno y actividades.',
        },
        {
          titulo: 'Post Operatoria',
          descripcion: 'Recuperación segura y supervisada.',
        },
      ],
    },
    {
      titulo: 'Salud Médica',
      subtitulo: 'Revisión Preventiva Profesional',
      imagen: '/servicios2.png',
      icono: 'bx bx-plus',
      items: [
        {
          titulo: 'Consulta Geriátrica',
          descripcion:
            'Evaluación integral de la salud, adaptada a las necesidades del adulto mayor.',
        },
        {
          titulo: 'Consulta a Domicilio',
          descripcion:
            'Atención médica en casa, facilitando un diagnóstico más preciso.',
        },
        {
          titulo: 'Consulta Online',
          descripcion:
            'Seguimiento médico virtual, ideal para consultas de control.',
        },
      ],
    },
    {
      titulo: 'Rehabilitación',
      subtitulo: 'Movimiento y Autonomía',
      imagen: '/servicios3.png',
      icono: 'bx bx-dumbbell',
      items: [
        {
          titulo: 'Fisioterapia',
          descripcion:
            'Mejora movilidad y equilibrio, favoreciendo su autonomía y previniendo caídas.',
        },
        {
          titulo: 'Terapia Ocupacional',
          descripcion:
            'Fomenta independencia diaria, estimulando funciones cognitivas.',
        },
        {
          titulo: 'Spa Geriátrico',
          descripcion:
            'Relajación y bienestar integral, reduce el estrés y mejora el descanso.',
        },
      ],
    },
  ];

  acordeonItems: AcordeonItem[] = [
    {
      id: 1,
      titulo: 'Planes de Estadía',
      contenido:
        'Incluye alojamiento, alimentación balanceada, atención de enfermería, seguimiento geriátrico, terapias y actividades.',
      activo: false,
    },
    {
      id: 2,
      titulo: 'Consulta Geriátrica',
      contenido:
        'Atención médica especializada orientada al control y seguimiento del adulto mayor.',
      activo: false,
    },
    {
      id: 3,
      titulo: 'Terapias y Rehabilitación',
      contenido:
        'Programas de fisioterapia y terapia ocupacional orientados a la autonomía.',
      activo: false,
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
    this.precargarImagenes();
    this.cargarActividades();
  }
  cargarActividades(): void {
    this.http
      .get<Actividad[]>('https://backend-dalias.onrender.com/actividades')
      .subscribe({
        next: (response) => {
          this.actividades = response.map((actividad) => ({
            ...actividad,
            fecha: actividad.subtitulo, // Mapear subtitulo a fecha para mantener compatibilidad
          })) as any;
          console.log('Actividades cargadas:', this.actividades);
        },
        error: (error) => {
          console.error('Error al cargar actividades:', error);
          // Mantener actividades vacías o mostrar mensaje de error
          this.actividades = [];
        },
      });
  }

  ngOnDestroy(): void {
    this.detenerCarruselNosotros();
  }

  precargarImagenes(): void {
    if (isPlatformBrowser(this.platformId)) {
      let imagenesPreCargadas = 0;
      const totalImagenes = this.imagenesNosotros.length;

      this.imagenesNosotros.forEach((src) => {
        const img = new Image();
        img.onload = () => {
          imagenesPreCargadas++;
          if (imagenesPreCargadas === totalImagenes) {
            this.iniciarCarruselNosotros();
          }
        };
        img.onerror = () => {
          imagenesPreCargadas++;
          console.error(`Error cargando imagen: ${src}`);
          if (imagenesPreCargadas === totalImagenes) {
            this.iniciarCarruselNosotros();
          }
        };
        img.src = src;
      });
    }
  }

  carruselKey = 0;

  iniciarCarruselNosotros(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.intervaloNosotros = setInterval(() => {
        this.imagenActualNosotros =
          (this.imagenActualNosotros + 1) % this.imagenesNosotros.length;
        this.carruselKey++;
      }, 5000);
    }
  }

  detenerCarruselNosotros(): void {
    if (this.intervaloNosotros) {
      clearInterval(this.intervaloNosotros);
    }
  }

  siguienteActividad(): void {
    if (this.slideActualActividades < this.actividadesConFinal.length - 1) {
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
      const gap = 16;
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

    // Cambiar el slide cuando se hace clic
    this.slideActual = id - 1;
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
      this.noticias.length / this.noticiasPorPagina,
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
    tipoConsulta: '',
    mensaje: '',
    nombre: '',
    correo: '',
    numeroMovil: '',
  };

  // AGREGAR errores de validación
  erroresContacto: ErroresContacto = {
    tipoConsulta: '',
    nombre: '',
    correo: '',
    numeroMovil: '',
  };

  enviarFormularioContacto(): void {
    // Ejecutar todas las validaciones
    this.validarTipoConsulta();
    this.validarNombreContacto();
    this.validarCorreoContacto();
    this.validarNumeroMovil();

    // Verificar si hay errores
    const hayErrores = Object.values(this.erroresContacto).some(
      (error) => error !== '',
    );

    if (hayErrores) {
      return;
    }

    // Preparar el payload según el formato de la API
    const payload = {
      tipoConsulta: this.formularioContacto.tipoConsulta,
      nombre: this.formularioContacto.nombre,
      correo: this.formularioContacto.correo,
      numeroMovil: this.formularioContacto.numeroMovil,
      mensaje: this.formularioContacto.mensaje || '',
    };

    // Realizar la petición POST a la API
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .post('https://backend-dalias.onrender.com/contacto', payload, {
        headers,
      })
      .subscribe({
        next: (response: any) => {
          console.log('Respuesta exitosa:', response);
          // Mostrar modal de confirmación
          this.mostrarModalConfirmacionContacto = true;
        },
        error: (error) => {
          console.error('Error al enviar formulario:', error);

          if (error.status === 400) {
            alert(
              'Error en los datos enviados. Por favor verifica el formulario.',
            );
          } else {
            alert(
              'Ocurrió un error al enviar el mensaje. Por favor intenta nuevamente.',
            );
          }
        },
      });
  }

  mostrarModalConfirmacionContacto = false;

  // AGREGAR métodos de validación
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
    // Solo números, puede tener 9 dígitos (Perú) o más dependiendo del país
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

  // AGREGAR método para cerrar modal de confirmación
  cerrarModalConfirmacionContacto(): void {
    this.mostrarModalConfirmacionContacto = false;

    // Limpiar formulario
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

  abrirModalVisita(): void {
    this.mostrarModalVisita = true;
    document.body.style.overflow = 'hidden';
  }

  cerrarModalVisita(): void {
    this.mostrarModalVisita = false;
    this.mostrarEvaluacion = false;
    document.body.style.overflow = 'auto';
  }

  toggleEvaluacion(): void {
    if (this.mostrarEvaluacion) {
      this.cerrarModalVisita();
      setTimeout(() => {
        this.mostrarModalEvaluacion = true;
      }, 300);
    }
  }

  cerrarModalEvaluacion(): void {
    this.mostrarModalEvaluacion = false;
    document.body.style.overflow = 'auto';
  }

  volverAAgendarVisita(): void {
    this.mostrarModalEvaluacion = false;
    this.mostrarEvaluacion = false;
    setTimeout(() => {
      this.mostrarModalVisita = true;
    }, 300);
  }

  verificarEvaluacionIniciada(): void {
    const tieneRespuestas =
      this.evaluacionForm.movilidad !== '' ||
      this.evaluacionForm.avd !== '' ||
      this.evaluacionForm.cognitivo !== '' ||
      this.evaluacionForm.emocional !== '' ||
      this.evaluacionForm.medicacion !== '' ||
      this.evaluacionForm.motivo !== '' ||
      Object.values(this.evaluacionForm.condiciones).some((v) => v === true);

    this.evaluacionIniciada = tieneRespuestas;

    if (tieneRespuestas) {
      this.limpiarErroresEvaluacion();
    }
  }

  limpiarErroresEvaluacion(): void {
    if (this.evaluacionForm.movilidad !== '')
      this.erroresEvaluacion.movilidad = false;
    if (this.evaluacionForm.avd !== '') this.erroresEvaluacion.avd = false;
    if (this.evaluacionForm.cognitivo !== '')
      this.erroresEvaluacion.cognitivo = false;
    if (this.evaluacionForm.emocional !== '')
      this.erroresEvaluacion.emocional = false;
    if (this.evaluacionForm.medicacion !== '')
      this.erroresEvaluacion.medicacion = false;
    if (this.evaluacionForm.motivo !== '')
      this.erroresEvaluacion.motivo = false;

    const tieneCondiciones = Object.values(
      this.evaluacionForm.condiciones,
    ).some((v) => v === true);
    if (tieneCondiciones) this.erroresEvaluacion.condiciones = false;
  }

  validarEvaluacionCompleta(): boolean {
    if (!this.evaluacionIniciada) {
      return true;
    }

    this.erroresEvaluacion = {
      movilidad: false,
      avd: false,
      cognitivo: false,
      emocional: false,
      medicacion: false,
      motivo: false,
      condiciones: false,
    };

    let esValido = true;

    if (this.evaluacionForm.movilidad === '') {
      this.erroresEvaluacion.movilidad = true;
      esValido = false;
    }
    if (this.evaluacionForm.avd === '') {
      this.erroresEvaluacion.avd = true;
      esValido = false;
    }
    if (this.evaluacionForm.cognitivo === '') {
      this.erroresEvaluacion.cognitivo = true;
      esValido = false;
    }
    if (this.evaluacionForm.emocional === '') {
      this.erroresEvaluacion.emocional = true;
      esValido = false;
    }
    if (this.evaluacionForm.medicacion === '') {
      this.erroresEvaluacion.medicacion = true;
      esValido = false;
    }
    if (this.evaluacionForm.motivo === '') {
      this.erroresEvaluacion.motivo = true;
      esValido = false;
    }

    const tieneCondiciones = Object.values(
      this.evaluacionForm.condiciones,
    ).some((v) => v === true);
    if (!tieneCondiciones) {
      this.erroresEvaluacion.condiciones = true;
      esValido = false;
    }

    return esValido;
  }

  guardarEvaluacionYContinuar(): void {
    this.verificarEvaluacionIniciada();

    if (!this.evaluacionIniciada) {
      this.mostrarModalEvaluacion = false;
      setTimeout(() => {
        this.mostrarModalVisita = true;
      }, 300);
      return;
    }

    if (!this.validarEvaluacionCompleta()) {
      setTimeout(() => {
        const primerError = document.querySelector(
          '.evaluacion__pregunta--error',
        );
        if (primerError) {
          primerError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      return;
    }

    console.log('Evaluación guardada:', this.evaluacionForm);

    this.mostrarEvaluacion = true;

    this.mostrarModalEvaluacion = false;
    setTimeout(() => {
      this.mostrarModalVisita = true;
    }, 300);
  }

  generarCalendario(): void {
    const primerDia = new Date(this.anioActual, this.mesActual, 1).getDay();
    const ultimoDia = new Date(
      this.anioActual,
      this.mesActual + 1,
      0,
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

    // Verificar disponibilidad si ya hay fecha seleccionada
    if (this.formularioVisita.fechaSeleccionada) {
      this.verificarDisponibilidadAPI(
        this.formularioVisita.fechaSeleccionada,
        hora,
      );
    }
  }

  validarNombreApellido(): void {
    const valor = this.formularioVisita.nombreApellido.trim();
    if (!valor) {
      this.erroresVisita.nombreApellido = 'El nombre y apellido es obligatorio';
    } else if (valor.length < 3) {
      this.erroresVisita.nombreApellido = 'Debe tener al menos 3 caracteres';
    } else if (!/^[a-záéíóúñ\s]+$/i.test(valor)) {
      this.erroresVisita.nombreApellido = 'Solo se permiten letras y espacios';
    } else {
      this.erroresVisita.nombreApellido = '';
    }
  }

  validarCorreoElectronico(): void {
    const valor = this.formularioVisita.correoElectronico.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!valor) {
      this.erroresVisita.correoElectronico =
        'El correo electrónico es obligatorio';
    } else if (!emailRegex.test(valor)) {
      this.erroresVisita.correoElectronico =
        'Ingresa un correo electrónico válido';
    } else {
      this.erroresVisita.correoElectronico = '';
    }
  }

  validarEdadAdultoMayor(): void {
    const valor = this.formularioVisita.edadAdultoMayor;
    const edad = parseInt(valor);

    if (!valor) {
      this.erroresVisita.edadAdultoMayor = 'La edad es obligatoria';
    } else if (isNaN(edad)) {
      this.erroresVisita.edadAdultoMayor = 'Ingresa un número válido';
    } else if (edad < 60) {
      this.erroresVisita.edadAdultoMayor = 'La edad debe ser 60 años o mayor';
    } else if (edad > 120) {
      this.erroresVisita.edadAdultoMayor = 'Ingresa una edad válida';
    } else {
      this.erroresVisita.edadAdultoMayor = '';
    }
  }

  validarNivelDependencia(): void {
    if (!this.formularioVisita.nivelDependencia) {
      this.erroresVisita.nivelDependencia =
        'Selecciona un nivel de dependencia';
    } else {
      this.erroresVisita.nivelDependencia = '';
    }
  }

  validarFechaSeleccionada(): void {
    if (!this.formularioVisita.fechaSeleccionada) {
      this.erroresVisita.fechaSeleccionada =
        'Selecciona una fecha para la visita';
    } else {
      this.erroresVisita.fechaSeleccionada = '';
    }
  }

  validarHoraSeleccionada(): void {
    if (!this.formularioVisita.horaSeleccionada) {
      this.erroresVisita.horaSeleccionada =
        'Selecciona un horario para la visita';
    } else {
      this.erroresVisita.horaSeleccionada = '';
    }
  }

  enviarSolicitudVisita(): void {
    // Validar todos los campos
    this.validarNombreApellido();
    this.validarCorreoElectronico();
    this.validarEdadAdultoMayor();
    this.validarNivelDependencia();
    this.validarFechaSeleccionada();
    this.validarHoraSeleccionada();

    // Verificar si hay errores
    const hayErrores = Object.values(this.erroresVisita).some(
      (error) => error !== '',
    );

    if (hayErrores) {
      return;
    }

    // Preparar el payload según el formato de la API
    const payload: any = {
      nombreApellido: this.formularioVisita.nombreApellido,
      correoElectronico: this.formularioVisita.correoElectronico,
      edadAdultoMayor: parseInt(this.formularioVisita.edadAdultoMayor),
      nivelDependencia: this.formularioVisita.nivelDependencia,
      observacionesSalud: this.formularioVisita.observacionesSalud || undefined,
      fechaSeleccionada: this.formularioVisita.fechaSeleccionada,
      horaSeleccionada: this.formularioVisita.horaSeleccionada,
    };

    // Si hay evaluación completada, agregarla al payload
    if (this.mostrarEvaluacion && this.evaluacionIniciada) {
      payload.evaluacion = {
        movilidad: this.evaluacionForm.movilidad,
        avd: this.evaluacionForm.avd,
        cognitivo: this.evaluacionForm.cognitivo,
        emocional: this.evaluacionForm.emocional,
        condiciones: this.evaluacionForm.condiciones,
        medicacion: this.evaluacionForm.medicacion,
        motivo: this.evaluacionForm.motivo,
      };
    }

    // Realizar la petición POST a la API
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .post('https://backend-dalias.onrender.com/visitas/agendar', payload, {
        headers,
      })
      .subscribe({
        next: (response: any) => {
          console.log('Respuesta exitosa:', response);
          // Mostrar modal de confirmación
          this.mostrarModalConfirmacion = true;
        },
        error: (error) => {
          console.error('Error al enviar solicitud:', error);

          // Manejar error de fecha/hora ocupada (409)
          if (error.status === 409) {
            this.erroresVisita.horaSeleccionada =
              'Esta fecha y hora ya está reservada. Por favor, selecciona otro horario.';
          } else if (error.status === 400) {
            // Error de validación
            alert(
              'Error en los datos enviados. Por favor verifica el formulario.',
            );
          } else {
            // Error genérico
            alert(
              'Ocurrió un error al agendar la visita. Por favor intenta nuevamente.',
            );
          }
        },
      });
  }

  verificarDisponibilidadAPI(fecha: string, hora: string): void {
    this.http
      .get(
        `https://backend-dalias.onrender.com/visitas/verificar-disponibilidad`,
        {
          params: { fecha, hora },
        },
      )
      .subscribe({
        next: (response: any) => {
          if (!response.disponible) {
            this.erroresVisita.horaSeleccionada =
              'Este horario ya está ocupado';
          }
        },
        error: (error) => {
          console.error('Error al verificar disponibilidad:', error);
        },
      });
  }

  // Agregar este nuevo método
  cerrarModalConfirmacion(): void {
    this.mostrarModalConfirmacion = false;

    // Limpiar formularios
    this.formularioVisita = {
      nombreApellido: '',
      correoElectronico: '',
      edadAdultoMayor: '',
      nivelDependencia: '',
      observacionesSalud: '',
      fechaSeleccionada: '',
      horaSeleccionada: '',
    };

    this.erroresVisita = {
      nombreApellido: '',
      correoElectronico: '',
      edadAdultoMayor: '',
      nivelDependencia: '',
      fechaSeleccionada: '',
      horaSeleccionada: '',
    };

    this.evaluacionForm = {
      movilidad: '',
      avd: '',
      cognitivo: '',
      emocional: '',
      condiciones: {
        hipertension: false,
        diabetes: false,
        dificultadesCaminar: false,
        incontinencia: false,
        problemasAudicionVision: false,
        postOperatoria: false,
        otra: false,
      },
      medicacion: '',
      motivo: '',
    };

    this.cerrarModalVisita();
  }
}

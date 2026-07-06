import {
  Component,
  OnInit,
  AfterViewInit,
  PLATFORM_ID,
  Inject,
  OnDestroy,
  ViewChild,
  ElementRef,
  NgZone,
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
import { AgendarVisitaModalComponent } from '../../components/agendar-visita-modal/agendar-visita-modal.component';
import { CmsService, BannerInicio } from '../../services/cms.service';
import { environment } from '../../../environments/environment';
import { subscribe, unsubscribe, ready } from '@payloadcms/live-preview';

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

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    HttpClientModule,
    AgendarVisitaModalComponent,
  ],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css',
  animations: [
    trigger('fadeInOut', [
      transition('* => *', [
        style({ opacity: 0 }),
        animate('1500ms ease-in-out', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class InicioComponent implements OnInit, OnDestroy {
  @ViewChild('actividadesCarrusel') actividadesCarrusel!: ElementRef;
  @ViewChild('modalVisita') modalVisita!: AgendarVisitaModalComponent;

  slideActual = 0;
  indicePaginaNoticias = 0;
  noticiasPorPagina = 2;
  noticiasVisibles: Noticia[] = [];
  paginasNoticias: number[] = [];
  slideActualActividades = 0;
  enviandoFormularioContacto = false;

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

  mostrarModalConfirmacionContacto = false;

  // Actividades para el carrusel
  actividades: Actividad[] = [];

  get actividadesConFinal() {
    return [...this.actividades, { final: true }];
  }

  banner: BannerInicio = {
    imagenFondo: '/slider1.png',
    logo: '/logo_slider2.png',
    descripcion:
      'En Residencia Las Dalias ofrecemos planes de estadía pensados para el bienestar, cuidado y tranquilidad de nuestros residentes, adaptándonos a cada necesidad y etapa.',
    textoCTA: 'Explora nuestros planes de estadía',
    planes: [
      { etiqueta: 'Residencia Permanente', slug: 'residencia-permanente', link: '/servicios/planes-de-estadia/residencia-permanente' },
      { etiqueta: 'Residencia Temporal', slug: 'temporal', link: '/servicios/planes-de-estadia/residencia-temporal' },
      { etiqueta: 'Centro de Día', slug: 'centro-de-dia', link: '/servicios/planes-de-estadia/centro-de-dia' },
      { etiqueta: 'Residencia Post Operatoria', slug: 'post-operatoria', link: '/servicios/planes-de-estadia/residencia-post-operatoria' },
    ],
  };

  // Handlers de Live Preview (para desuscribir en destroy).
  private livePreviewUnsub?: (event: MessageEvent) => void;
  private bannerPreviewHandler?: (event: MessageEvent) => void;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
    private router: Router,
    private cms: CmsService,
    private ngZone: NgZone,
  ) {}

  // Navega al destino del plan. `enlace` viene configurado desde el CMS: puede
  // ser una ruta interna del sitio (ej. /servicios/...) o una URL externa
  // (https://...). Ya no hay rutas fijas en el código.
  navegarAPlan(enlace: string): void {
    if (!enlace) {
      return;
    }

    if (/^https?:\/\//i.test(enlace)) {
      window.open(enlace, '_blank', 'noopener');
    } else {
      this.router.navigate([enlace]);
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
    this.precargarImagenes();
    this.cargarActividades();
    this.cargarBanner();
    this.initLivePreview();
    this.initBannerLivePreview();
  }

  cargarBanner(): void {
    this.cms.getBannerInicio().subscribe((b) => {
      this.banner = b;
    });
  }

  cargarActividades(): void {
    // Fuente única: CMS (Payload). El servicio ya mapea y tolera errores (devuelve []).
    this.cms.getActividades().subscribe((acts) => {
      this.actividades = acts as any;
    });
  }

  private getPreviewEmbedOrigin(): string | null {
    if (isPlatformBrowser(this.platformId) && document.referrer) {
      try {
        return new URL(document.referrer).origin;
      } catch {
        return null;
      }
    }
    return null;
  }

  private getPreviewServerURL(): string | null {
    const embedOrigin = this.getPreviewEmbedOrigin();
    if (embedOrigin && environment.previewOrigins.includes(embedOrigin)) return embedOrigin;
    if (environment.cmsUrl && environment.previewOrigins.includes(environment.cmsUrl)) return environment.cmsUrl;
    return environment.previewOrigins[0] || null;
  }

  private isAllowedPreviewOrigin(origin: string, embedOrigin: string | null): boolean {
    return environment.previewOrigins.includes(origin) && (!embedOrigin || origin === embedOrigin);
  }

  // Live Preview de Payload: solo se activa dentro del iframe del admin. Recibe el
  // documento de actividad editado por postMessage y lo inyecta en el carrusel, en vivo.
  private initLivePreview(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (window.self === window.top) return; // solo dentro del iframe del admin
    const serverURL = this.getPreviewServerURL();
    if (!serverURL) return;
    this.livePreviewUnsub = subscribe({
      serverURL,
      depth: 1,
      initialData: {} as any,
      // Fusión del lado CLIENTE: el app es de otro origen que el CMS, así que el fetch
      // por defecto de mergeData (a /api) lo bloquearía por CORS. Los datos del
      // formulario ya vienen en el postMessage, así que los devolvemos tal cual.
      requestHandler: (args: any) =>
        Promise.resolve({ json: async () => args?.data?.data ?? {} }) as any,
      callback: (doc: any) =>
        this.ngZone.run(() => this.handleLivePreviewDoc(doc)),
    });
    ready({ serverURL });
  }

  // Listener directo para el global banner-inicio: lee globalSlug del evento raw
  // antes de que la librería lo consuma, evitando detección frágil por campos.
  // Llama al endpoint de merge de Payload para poblar relaciones (imágenes).
  private initBannerLivePreview(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (window.self === window.top) return;
    const serverURL = this.getPreviewServerURL();
    if (!serverURL) return;
    const embedOrigin = this.getPreviewEmbedOrigin();

    this.bannerPreviewHandler = (event: MessageEvent) => {
      if (
        !this.isAllowedPreviewOrigin(event.origin, embedOrigin) ||
        event.data?.type !== 'payload-live-preview' ||
        event.data?.globalSlug !== 'banner-inicio'
      ) return;

      const incomingData = event.data?.data;
      if (!incomingData) return;

      // Llama al mismo endpoint que usa mergeData internamente; el servidor
      // devuelve el doc con depth=1 (imágenes y relaciones pobladas).
      // Usa ruta relativa para que el proxy de Angular evite el bloqueo CORS.
      fetch(`/api/globals/banner-inicio`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Payload-HTTP-Method-Override': 'GET',
        },
        body: JSON.stringify({ data: incomingData, depth: 1, flattenLocales: false }),
      })
        .then((res) => res.json())
        .then((doc) => {
          const resolveImg = (url?: string) =>
            url ? (url.startsWith('http') ? url : `${serverURL}${url}`) : '';

          this.ngZone.run(() => {
            this.banner = {
              imagenFondo: resolveImg(doc?.imagenFondo?.url) || this.banner.imagenFondo,
              logo: resolveImg(doc?.logo?.url) || this.banner.logo,
              descripcion: doc?.descripcion || this.banner.descripcion,
              textoCTA: doc?.textoCTA || this.banner.textoCTA,
              planes: Array.isArray(doc?.planes) && doc.planes.length
                ? doc.planes.map((p: any) => ({ etiqueta: p.etiqueta ?? '', slug: p.slug ?? '', link: p.link ?? '' }))
                : this.banner.planes,
            };
          });
        })
        .catch(() => {
          // Fallback sin populate: al menos actualizamos los campos de texto
          const resolveImg = (url?: string) =>
            url ? (url.startsWith('http') ? url : `${serverURL}${url}`) : '';
          this.ngZone.run(() => {
            this.banner = {
              imagenFondo: resolveImg(incomingData?.imagenFondo?.url) || this.banner.imagenFondo,
              logo: resolveImg(incomingData?.logo?.url) || this.banner.logo,
              descripcion: incomingData?.descripcion || this.banner.descripcion,
              textoCTA: incomingData?.textoCTA || this.banner.textoCTA,
              planes: Array.isArray(incomingData?.planes) && incomingData.planes.length
                ? incomingData.planes.map((p: any) => ({ etiqueta: p.etiqueta ?? '', slug: p.slug ?? '', link: p.link ?? '' }))
                : this.banner.planes,
            };
          });
        });
    };

    window.addEventListener('message', this.bannerPreviewHandler);
  }

  private handleLivePreviewDoc(doc: any): void {
    if (!doc) return;
    this.upsertActividadPreview(doc);
  }

  private upsertActividadPreview(doc: any): void {
    if (!doc || !doc.id || !doc.titulo) return;
    const mapped = this.cms.mapActividad(doc) as any;
    const idx = this.actividades.findIndex((a: any) => a.id === doc.id);
    if (idx >= 0) {
      // conservar la imagen previa si el preview aún no la trae poblada
      if (!mapped.imagen && (this.actividades[idx] as any).imagen) {
        mapped.imagen = (this.actividades[idx] as any).imagen;
      }
      this.actividades[idx] = mapped;
    } else {
      this.actividades = [mapped, ...this.actividades];
    }
    // nueva referencia para forzar el refresco del carrusel
    this.actividades = [...this.actividades];
  }

  ngOnDestroy(): void {
    this.detenerCarruselNosotros();
    if (this.bannerPreviewHandler) {
      window.removeEventListener('message', this.bannerPreviewHandler);
    }
    if (this.livePreviewUnsub) {
      unsubscribe(this.livePreviewUnsub);
    }
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

  erroresContacto: ErroresContacto = {
    tipoConsulta: '',
    nombre: '',
    correo: '',
    numeroMovil: '',
  };

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

    this.enviandoFormularioContacto = true;

    const payload = {
      tipoConsulta: this.formularioContacto.tipoConsulta,
      nombre: this.formularioContacto.nombre,
      correo: this.formularioContacto.correo,
      numeroMovil: this.formularioContacto.numeroMovil,
      mensaje: this.formularioContacto.mensaje || '',
    };

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .post(`${environment.apiUrl}/contacto`, payload, {
        headers,
      })
      .subscribe({
        next: (response: any) => {
          console.log('Respuesta exitosa:', response);
          this.enviandoFormularioContacto = false;
          this.mostrarModalConfirmacionContacto = true;
        },
        error: (error) => {
          console.error('Error al enviar formulario:', error);
          this.enviandoFormularioContacto = false;

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

  cerrarModalConfirmacionContacto(): void {
    this.mostrarModalConfirmacionContacto = false;

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
}

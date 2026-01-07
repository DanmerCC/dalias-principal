import { Component, OnInit, AfterViewInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
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

interface Estadistica {
  icono: string;
  valor: number;
  prefijo: string;
  sufijo: string;
  descripcion: string;
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

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css',
})
export class InicioComponent implements OnInit, AfterViewInit {
  slideActual = 0;
  private observerEstadisticas?: IntersectionObserver;

  // Paginación de noticias
  indicePaginaNoticias = 0;
  noticiasPorPagina = 2;
  noticiasVisibles: Noticia[] = [];
  paginasNoticias: number[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  // ===== ESTADÍSTICAS =====
  estadisticas: Estadistica[] = [
    {
      icono: 'bx bx-group',
      valor: 34000,
      prefijo: '+',
      sufijo: '',
      descripcion: 'Personas atendidas',
    },
    {
      icono: 'bx bx-timer',
      valor: 20,
      prefijo: '+',
      sufijo: ' años',
      descripcion: 'De experiencia',
    },
    {
      icono: 'bx bx-medal',
      valor: 98,
      prefijo: '',
      sufijo: '%',
      descripcion: 'Satisfacción familiar',
    },
  ];

  // ===== 5 SERVICIOS (4 originales + 1 nuevo) =====
  slidesCarrusel: SlideItem[] = [
    {
      titulo: 'Salud médica',
      subtitulo: 'Seguimiento profesional',
      imagen:
        'https://www.vitaliahome.es/wp-content/uploads/2024/12/vitalia-ambiente-hogareno.webp',
      icono: 'bx bx-plus',
      items: [
        {
          titulo: 'Consulta Geriátrica',
          descripcion: 'Evaluación y control del estado de salud del residente.',
        },
        {
          titulo: 'Monitoreo Continuo',
          descripcion: 'Control de signos vitales y seguimiento médico permanente.',
        },
      ],
    },
    {
      titulo: 'Rehabilitación',
      subtitulo: 'Movimiento y autonomía',
      imagen:
        'https://www.vitaliahome.es/wp-content/uploads/2024/04/vitalia-decalogo-2-1200x675.webp',
      icono: 'bx bx-dumbbell',
      items: [
        {
          titulo: 'Fisioterapia',
          descripcion: 'Tratamientos para mejorar la movilidad y el equilibrio.',
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
      imagen:
        'https://www.vitaliahome.es/wp-content/uploads/2024/04/vitalia-decalogo-3-1200x675.webp',
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
      imagen:
        'https://www.vitaliahome.es/wp-content/uploads/2024/04/vitalia-decalogo-4-1200x675.webp',
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
      imagen:
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
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

  // ===== ACORDEÓN (5 SERVICIOS) =====
  acordeonItems: AcordeonItem[] = [
    {
      id: 1,
      titulo: 'Consulta Geriátrica',
      contenido: 'Atención médica especializada orientada al control y seguimiento del adulto mayor.',
      activo: false,
    },
    {
      id: 2,
      titulo: 'Terapias y Rehabilitación',
      contenido: 'Programas de fisioterapia y terapia ocupacional orientados a la autonomía.',
      activo: false,
    },
    // {
    //   id: 3,
    //   titulo: 'Atención psicogeriátrica',
    //   contenido: 'Apoyo psicológico especializado para el bienestar emocional.',
    //   activo: false,
    // },
    {
      id: 3,
      titulo: 'Nutrición',
      contenido: 'Alimentación equilibrada y adaptada a las necesidades del residente.',
      activo: false,
    },
    {
      id: 4,
      titulo: 'Planes de Estadía',
      contenido: 'Opciones flexibles de residencia: permanente, temporal, centro de día y respiro familiar.',
      activo: false,
    },
  ];

  // ===== NOTICIAS =====
  noticias: Noticia[] = [
    {
      id: 1,
      fecha: '16/12/2025',
      titulo: 'DomusVi impulsa la movilidad sostenible en sus residencias en colaboración con ChargeGuru',
      descripcion: 'El proyecto incluye la instalación y gestión de puntos de recarga en 21 residencias de personas mayores DomusVi de 11 provincias.',
      imagen: 'https://images.unsplash.com/photo-1593642532400-2682810df593?w=600&q=80',
      link: '#'
    },
    {
      id: 2,
      fecha: '11/12/2025',
      titulo: '150 comercios de Chantada exponen árboles de Navidad con un ganchillo creado por personas residentes en DomusVi',
      descripcion: 'Gracias a la colaboración de Empresarios de Chantada, las creaciones de 15 residencias en Chantada se exponen en comercios.',
      imagen: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80',
      link: '#'
    },
    {
      id: 3,
      fecha: '05/12/2025',
      titulo: 'Nueva colaboración con centros educativos para actividades intergeneracionales',
      descripcion: 'Iniciamos un programa que conecta a nuestros residentes con estudiantes locales para fomentar el intercambio cultural y emocional.',
      imagen: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=600&q=80',
      link: '#'
    },
    {
      id: 4,
      fecha: '28/11/2025',
      titulo: 'Ampliación de servicios de fisioterapia y rehabilitación',
      descripcion: 'Incorporamos nuevos equipos especializados y profesionales para mejorar la calidad de vida de nuestros residentes.',
      imagen: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80',
      link: '#'
    },
    {
      id: 5,
      fecha: '20/11/2025',
      titulo: 'Celebración del Día Universal del Niño con actividades especiales',
      descripcion: 'Nuestros residentes participaron en talleres y actividades junto a niños de la comunidad, celebrando la importancia de la infancia.',
      imagen: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&q=80',
      link: '#'
    },
    {
      id: 6,
      fecha: '15/11/2025',
      titulo: 'Nuevo programa de alimentación saludable y nutrición personalizada',
      descripcion: 'Lanzamos un programa de nutrición adaptado a las necesidades individuales de cada residente, con asesoramiento especializado.',
      imagen: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=600&q=80',
      link: '#'
    }
  ];

  ngOnInit(): void {
    this.inicializarNoticias();
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.inicializarObservadorEstadisticas();
    }
  }

  // ===== MÉTODOS DE ACORDEÓN =====
  toggleAcordeon(id: number): void {
    this.acordeonItems = this.acordeonItems.map((item) => ({
      ...item,
      activo: item.id === id ? !item.activo : false,
    }));
  }

  // ===== MÉTODOS DE CARRUSEL DE SERVICIOS =====
  siguienteSlide(): void {
    this.slideActual = (this.slideActual + 1) % this.slidesCarrusel.length;
  }

  anteriorSlide(): void {
    this.slideActual =
      this.slideActual === 0
        ? this.slidesCarrusel.length - 1
        : this.slideActual - 1;
  }

  // ===== MÉTODOS DE NOTICIAS =====
  inicializarNoticias(): void {
    const totalPaginas = Math.ceil(this.noticias.length / this.noticiasPorPagina);
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

  // ===== ANIMACIÓN DE CONTADORES =====
  private inicializarObservadorEstadisticas(): void {
    this.observerEstadisticas = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.animarContadores();
            this.observerEstadisticas?.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    const seccionEstadisticas = document.querySelector('.nosotros__estadisticas');
    if (seccionEstadisticas) {
      this.observerEstadisticas.observe(seccionEstadisticas);
    }
  }

  private animarContadores(): void {
    const contadores = document.querySelectorAll('.contador');
    
    contadores.forEach((contador) => {
      const target = parseInt(contador.getAttribute('data-target') || '0');
      const duracion = 2000;
      const incremento = target / (duracion / 16);
      let valorActual = 0;

      const actualizarContador = () => {
        valorActual += incremento;
        
        if (valorActual < target) {
          contador.textContent = Math.floor(valorActual).toLocaleString('es-ES');
          requestAnimationFrame(actualizarContador);
        } else {
          contador.textContent = target.toLocaleString('es-ES');
        }
      };

      actualizarContador();
    });
  }

  // ===== FORMULARIO DE CONTACTO =====
  opcionesContacto = [
    { value: 'residencia-permanente', label: 'Residencia Permanente' },
    { value: 'centro-dia', label: 'Centro de Día' },
    { value: 'atencion-domiciliaria', label: 'Atención Domiciliaria' },
    { value: 'consulta-geriatrica', label: 'Consulta Geriátrica' },
    { value: 'planes-estadia', label: 'Planes de Estadía' },
    { value: 'informacion-general', label: 'Información General' }
  ];

  formularioContacto: FormularioContacto = {
    tipoConsulta: 'residencia-permanente',
    mensaje: '',
    nombre: ''
  };

  enviarFormulario(): void {
    if (this.formularioContacto.nombre && this.formularioContacto.mensaje) {
      console.log('Formulario enviado:', this.formularioContacto);
      
      // Aquí puedes agregar la lógica para enviar el formulario
      // Por ejemplo, llamar a un servicio HTTP
      
      alert('Gracias por contactarnos. Pronto nos comunicaremos con usted.');
      
      // Resetear formulario
      this.formularioContacto = {
        tipoConsulta: 'residencia-permanente',
        mensaje: '',
        nombre: ''
      };
    } else {
      alert('Por favor complete todos los campos requeridos.');
    }
  }

  ngOnDestroy(): void {
    if (this.observerEstadisticas) {
      this.observerEstadisticas.disconnect();
    }
  }
}
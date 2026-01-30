import { Component, ViewChild, ElementRef, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AgendarVisitaModalComponent } from '../../../../components/agendar-visita-modal/agendar-visita-modal.component';

interface PreguntaFrecuente {
  id: number;
  pregunta: string;
  respuesta: string;
  activo: boolean;
}

interface ImagenGaleria {
  src: string;
  alt: string;
}

@Component({
  selector: 'app-residencia-permanente',
  standalone: true,
  imports: [CommonModule, AgendarVisitaModalComponent],
  templateUrl: './residencia-permanente.component.html',
  styleUrl: './residencia-permanente.component.css',
})
export class ResidenciaPermanenteComponent {
  @ViewChild('modalVisita') modalVisita!: AgendarVisitaModalComponent;
  @ViewChild('instalacionesCarrusel') instalacionesCarrusel!: ElementRef;

  // Propiedades para las instalaciones
  indiceInstalacion = 0;
  instalacionesItems = [0, 1, 2, 3];

  // Propiedades para el modal de imágenes
  modalImagenAbierto = false;
  indiceSlideActual = 0;
  indiceImagenActual = 0;

  // Todas las imágenes organizadas por slide
  imagenesGaleria: ImagenGaleria[][] = [
    // Slide 1
    [
      { src: '/gallery1.png', alt: 'Habitación Principal' },
      { src: '/gallery2.png', alt: 'Habitación con Sala' },
      { src: '/gallery3.jpeg', alt: 'Baño 1' },
      { src: '/gallery4.jpeg', alt: 'Baño 2' },
    ],
    // Slide 2
    [
      { src: '/gallery5.png', alt: 'Comedor' },
      { src: '/gallery6.jpg', alt: 'Sala de Terapias' },
      { src: '/gallery7.png', alt: 'Cocina' },
      { src: '/gallery8.jpg', alt: 'Recepción' },
    ],
    // Slide 3
    [
      { src: '/gallery9.jpg', alt: 'Piscina' },
      { src: '/gallery10.jpg', alt: 'Área de Lectura' },
      { src: '/gallery11.jpeg', alt: 'Habitación Suite' },
      { src: '/gallery12.jpeg', alt: 'Terraza' },
    ],
    // Slide 4
    [
      { src: '/gallery13.jpg', alt: 'Gimnasio' },
      { src: '/gallery14.jpeg', alt: 'Sala de Actividades' },
      { src: '/gallery15.jpeg', alt: 'Capilla' },
      { src: '/gallery16.jpg', alt: 'Enfermería' },
    ],
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  get imagenesSlideActual(): ImagenGaleria[] {
    return this.imagenesGaleria[this.indiceSlideActual] || [];
  }

  get imagenActual(): ImagenGaleria {
    return this.imagenesSlideActual[this.indiceImagenActual] || { src: '', alt: '' };
  }

  preguntasFrecuentes: PreguntaFrecuente[] = [
    {
      id: 1,
      pregunta:
        '¿Qué criterios se toman en cuenta antes de aceptar el ingreso de un adulto mayor?',
      respuesta:
        'Previo al ingreso, se revisa información médica, funcional y emocional para asegurar que el entorno y los servicios sean adecuados. Este proceso permite garantizar un cuidado seguro, personalizado y alineado con las capacidades y necesidades del residente.',
      activo: false,
    },
    {
      id: 2,
      pregunta:
        '¿Qué sucede si mi familiar tiene una emergencia médica durante su estadía?',
      respuesta:
        'Todos nuestros planes incluyen la afiliación a un Sistema de Emergencias Médicas domiciliarias con ambulancia para primeros auxilios o traslados inmediatos. Además, contamos con convenios para realizar análisis de laboratorio y rayos X dentro de la misma residencia para evitar traslados innecesarios.',
      activo: false,
    },
    {
      id: 3,
      pregunta:
        '¿Qué nivel de adaptación se considera durante los primeros días de estadía?',
      respuesta:
        'Durante los primeros días se realiza un seguimiento cercano para observar la adaptación del adulto mayor a las rutinas, espacios y actividades. Este periodo permite ajustar horarios, alimentación y acompañamiento, favoreciendo una experiencia progresiva y positiva desde el inicio.',
      activo: false,
    },
    {
      id: 4,
      pregunta:
        '¿Podemos seguir compartiendo momentos especiales en familia como si estuviéramos en casa?',
      respuesta:
        '¡Totalmente! Fomentamos un vínculo familiar inquebrantable ofreciendo horarios de visita amplios y acceso exclusivo a nuestras áreas de piscina y parrilla para reuniones privadas. Queremos que Las Dalias sea una extensión de su hogar, donde los nietos y familiares puedan disfrutar momentos inolvidables en un entorno seguro y acogedor.',
      activo: false,
    },
  ];

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

  scrollToContenido() {
    const seccionConfort = document.querySelector('.seccion__experiencia');
    if (seccionConfort) {
      seccionConfort.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Métodos para la navegación de instalaciones
  anteriorInstalacion(): void {
    if (this.indiceInstalacion > 0) {
      this.indiceInstalacion--;
      this.scrollToInstalacion();
    }
  }

  siguienteInstalacion(): void {
    if (this.indiceInstalacion < this.instalacionesItems.length - 1) {
      this.indiceInstalacion++;
      this.scrollToInstalacion();
    }
  }

  irAInstalacion(indice: number): void {
    this.indiceInstalacion = indice;
    this.scrollToInstalacion();
  }

  scrollToInstalacion(): void {
    if (isPlatformBrowser(this.platformId) && this.instalacionesCarrusel) {
      const container = this.instalacionesCarrusel.nativeElement;
      const slideAncho = container.querySelector('.instalacion__slide')?.offsetWidth || 0;
      const gap = 24;
      const scrollAmount = (slideAncho + gap) * this.indiceInstalacion;

      container.scrollTo({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  }

  // Métodos para el modal de imágenes
  abrirModalImagen(indiceSlide: number, indiceImagen: number): void {
    this.indiceSlideActual = indiceSlide;
    this.indiceImagenActual = indiceImagen;
    this.modalImagenAbierto = true;
    
    // Prevenir scroll del body cuando el modal está abierto
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'hidden';
    }
  }

  cerrarModal(): void {
    this.modalImagenAbierto = false;
    
    // Restaurar scroll del body
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'auto';
    }
  }

  imagenAnterior(): void {
    if (this.indiceImagenActual > 0) {
      this.indiceImagenActual--;
    }
  }

  imagenSiguiente(): void {
    if (this.indiceImagenActual < this.imagenesSlideActual.length - 1) {
      this.indiceImagenActual++;
    }
  }
}
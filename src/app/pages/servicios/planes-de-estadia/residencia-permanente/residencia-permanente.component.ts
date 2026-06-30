import { Component, ViewChild, ElementRef, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AgendarVisitaModalComponent } from '../../../../components/agendar-visita-modal/agendar-visita-modal.component';
import { RouterLink } from '@angular/router';

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
  imports: [CommonModule, AgendarVisitaModalComponent, RouterLink],
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
    { src: 'https://res.cloudinary.com/depdqybjp/image/upload/f_auto,q_60,w_1200,c_limit/v1770050931/gallery1_lb5bfr.png', alt: 'Habitación Principal' },
    { src: 'https://res.cloudinary.com/depdqybjp/image/upload/f_auto,q_60,w_1200,c_limit/v1770050926/gallery2_qj7jgs.png', alt: 'Habitación con Sala' },
    { src: 'https://res.cloudinary.com/depdqybjp/image/upload/f_auto,q_60,w_1200,c_limit/v1770050929/gallery3_cpal4y.jpg', alt: 'Baño 1' },
    { src: 'https://res.cloudinary.com/depdqybjp/image/upload/f_auto,q_60,w_1200,c_limit/v1770049419/gallery4_pxur9t.jpg', alt: 'Baño 2' },
  ],
  // Slide 2
  [
    { src: 'https://res.cloudinary.com/depdqybjp/image/upload/f_auto,q_60,w_1200,c_limit/v1770049640/gallery5_vztful.png', alt: 'Comedor' },
    { src: 'https://res.cloudinary.com/depdqybjp/image/upload/f_auto,q_60,w_1200,c_limit/v1770049640/gallery6_ge32y4.jpg', alt: 'Sala de Terapias' },
    { src: 'https://res.cloudinary.com/depdqybjp/image/upload/f_auto,q_60,w_1200,c_limit/v1770049640/gallery7_nnfes5.png', alt: 'Cocina' },
    { src: 'https://res.cloudinary.com/depdqybjp/image/upload/f_auto,q_60,w_1200,c_limit/v1770049642/gallery8_dtdr4s.jpg', alt: 'Recepción' },
  ],
  // Slide 3
  [
    { src: 'https://res.cloudinary.com/depdqybjp/image/upload/f_auto,q_60,w_1200,c_limit/v1770049781/gallery9_qulhj4.jpg', alt: 'Piscina' },
    { src: 'https://res.cloudinary.com/depdqybjp/image/upload/f_auto,q_60,w_1200,c_limit/v1770049781/gallery10_pxtddx.jpg', alt: 'Área de Lectura' },
    { src: 'https://res.cloudinary.com/depdqybjp/image/upload/f_auto,q_60,w_1200,c_limit/v1770049781/gallery11_t7bpje.jpg', alt: 'Habitación Suite' },
    { src: 'https://res.cloudinary.com/depdqybjp/image/upload/f_auto,q_60,w_1200,c_limit/v1770049781/gallery12_rsw3ip.jpg', alt: 'Terraza' },
  ],
  // Slide 4
  [
    { src: 'https://res.cloudinary.com/depdqybjp/image/upload/f_auto,q_60,w_1200,c_limit/v1770049947/gallery13_xide0z.jpg', alt: 'Gimnasio' },
    { src: 'https://res.cloudinary.com/depdqybjp/image/upload/f_auto,q_60,w_1200,c_limit/v1770049948/gallery14_yii0or.jpg', alt: 'Sala de Actividades' },
    { src: 'https://res.cloudinary.com/depdqybjp/image/upload/f_auto,q_60,w_1200,c_limit/v1770049949/gallery15_tleh0z.jpg', alt: 'Capilla' },
    { src: 'https://res.cloudinary.com/depdqybjp/image/upload/f_auto,q_60,w_1200,c_limit/v1770049948/gallery16_nxmmdr.jpg', alt: 'Enfermería' },
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
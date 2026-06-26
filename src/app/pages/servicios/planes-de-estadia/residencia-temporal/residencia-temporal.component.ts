import {
  Component,
  ViewChild,
  ElementRef,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { environment } from '../../../../../environments/environment';

interface ImagenGaleria {
  src: string;
  alt: string;
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
  selector: 'app-residencia-temporal',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterLink],
  templateUrl: './residencia-temporal.component.html',
  styleUrl: './residencia-temporal.component.css',
})
export class ResidenciaTemporalComponent {
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
      {
        src: 'https://res.cloudinary.com/dd5mnpde5/image/upload/f_auto,q_60,w_1200,c_limit/v1770770414/gallery1_eewi4e.jpg',
        alt: 'Habitación Principal',
      },
      {
        src: 'https://res.cloudinary.com/dd5mnpde5/image/upload/f_auto,q_60,w_1200,c_limit/v1770770415/gallery2_tabp74.jpg',
        alt: 'Habitación con Sala',
      },
      {
        src: 'https://res.cloudinary.com/dd5mnpde5/image/upload/f_auto,q_60,w_1200,c_limit/v1770770414/gallery3_wnjuta.jpg',
        alt: 'Baño 1',
      },
      {
        src: 'https://res.cloudinary.com/dd5mnpde5/image/upload/f_auto,q_60,w_1200,c_limit/v1770770414/gallery4_ebhvti.jpg',
        alt: 'Baño 2',
      },
    ],
    // Slide 2
    [
      {
        src: 'https://res.cloudinary.com/dd5mnpde5/image/upload/f_auto,q_60,w_1200,c_limit/v1770770513/gallery5_cdjjk7.jpg',
        alt: 'Comedor',
      },
      {
        src: 'https://res.cloudinary.com/dd5mnpde5/image/upload/f_auto,q_60,w_1200,c_limit/v1770770515/gallery6_srr3if.jpg',
        alt: 'Sala de Terapias',
      },
      {
        src: 'https://res.cloudinary.com/dd5mnpde5/image/upload/f_auto,q_60,w_1200,c_limit/v1770770514/gallery7_mmxso9.jpg',
        alt: 'Cocina',
      },
      {
        src: 'https://res.cloudinary.com/dd5mnpde5/image/upload/f_auto,q_60,w_1200,c_limit/v1770770514/gallery8_ekedtm.png',
        alt: 'Recepción',
      },
    ],
    // Slide 3
    [
      {
        src: 'https://res.cloudinary.com/dd5mnpde5/image/upload/f_auto,q_60,w_1200,c_limit/v1770770674/gallery9_ttjwjf.jpg',
        alt: 'Piscina',
      },
      {
        src: 'https://res.cloudinary.com/dd5mnpde5/image/upload/f_auto,q_60,w_1200,c_limit/v1770770689/gallery10_wr2j7z.jpg',
        alt: 'Área de Lectura',
      },
      {
        src: 'https://res.cloudinary.com/dd5mnpde5/image/upload/f_auto,q_60,w_1200,c_limit/v1770770677/gallery11_ztskys.jpg',
        alt: 'Habitación Suite',
      },
      {
        src: 'https://res.cloudinary.com/dd5mnpde5/image/upload/f_auto,q_60,w_1200,c_limit/v1770770677/gallery12_upywwv.jpg',
        alt: 'Terraza',
      },
    ],
    // Slide 4
    [
      {
        src: 'https://res.cloudinary.com/dd5mnpde5/image/upload/f_auto,q_60,w_1200,c_limit/v1770770677/gallery13_wijvv4.jpg',
        alt: 'Gimnasio',
      },
      {
        src: 'https://res.cloudinary.com/dd5mnpde5/image/upload/f_auto,q_60,w_1200,c_limit/v1770770681/gallery14_sfgg98.jpg',
        alt: 'Sala de Actividades',
      },
      {
        src: 'https://res.cloudinary.com/dd5mnpde5/image/upload/f_auto,q_60,w_1200,c_limit/v1770770678/gallery15_zfve6c.jpg',
        alt: 'Capilla',
      },
      {
        src: 'https://res.cloudinary.com/dd5mnpde5/image/upload/f_auto,q_60,w_1200,c_limit/v1770770679/gallery16_zpvkev.jpg',
        alt: 'Enfermería',
      },
    ],
  ];

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
      pregunta: '¿Qué sucede si hay una urgencia médica?',
      respuesta:
        'Contamos con afiliación a un sistema de ambulancias para primeros auxilios y traslado inmediato a centros de salud.',
      activo: false,
    },
    {
      id: 2,
      pregunta: '¿El personal de salud está disponible todo el tiempo?',
      respuesta:
        'Sí, se dispone del personal de enfermería calificado para asistir en actividades cotidianas y monitoreo durante las 24 horas.',
      activo: false,
    },
    {
      id: 3,
      pregunta: '¿Cómo se maneja el lavado de la ropa del residente?',
      respuesta:
        'Las Dalias ofrece servicio de lavandería (prendas ligeras) incluido para la comodidad de los residentes temporales.',
      activo: false,
    },
    {
      id: 4,
      pregunta: '¿Puedo ver a mi familiar de forma remota?',
      respuesta:
        'Sí, disponemos de un sistema de vigilancia con cámaras web accesible desde un celular o computadora para áreas comunes.',
      activo: false,
    },
  ];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
  ) {}

  get imagenesSlideActual(): ImagenGaleria[] {
    return this.imagenesGaleria[this.indiceSlideActual] || [];
  }

  get imagenActual(): ImagenGaleria {
    return (
      this.imagenesSlideActual[this.indiceImagenActual] || { src: '', alt: '' }
    );
  }

  get preguntasColumna1(): PreguntaFrecuente[] {
    return this.preguntasFrecuentes.filter((_, index) => index % 2 === 0);
  }

  get preguntasColumna2(): PreguntaFrecuente[] {
    return this.preguntasFrecuentes.filter((_, index) => index % 2 !== 0);
  }

  scrollToServicios() {
    const seccionServicios = document.getElementById('servicio__estadia');

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
      const slideAncho =
        container.querySelector('.instalacion__slide')?.offsetWidth || 0;
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

    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'hidden';
    }
  }

  cerrarModal(): void {
    this.modalImagenAbierto = false;

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

  // Métodos para preguntas frecuentes
  togglePregunta(id: number): void {
    this.preguntasFrecuentes = this.preguntasFrecuentes.map((pregunta) => ({
      ...pregunta,
      activo: pregunta.id === id ? !pregunta.activo : pregunta.activo,
    }));
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
      (error) => error !== '',
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
      .post(`${environment.apiUrl}/contacto`, payload, {
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

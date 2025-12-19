import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface AcordeonItem {
  id: number;
  titulo: string;
  contenido: string;
  activo: boolean;
}

interface SlideItem {
  titulo: string; // título corto (header)
  subtitulo: string;
  imagen: string;
  icono: string;
  items: {
    titulo: string; // nombre real del servicio
    descripcion: string;
  }[];
}

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css',
})
export class InicioComponent {
  slideActual = 0;

  // ===== 4 SERVICIOS (SEGÚN LA IMAGEN) =====
  slidesCarrusel: SlideItem[] = [
    {
      // Header corto
      titulo: 'Salud médica',
      subtitulo: 'Seguimiento profesional',
      imagen:
        'https://www.vitaliahome.es/wp-content/uploads/2024/12/vitalia-ambiente-hogareno.webp',
      icono: 'bx bx-plus',
      items: [
        {
          titulo: 'Consulta Geriátrica',
          descripcion:
            'Evaluación y control del estado de salud del residente.',
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
          descripcion:
            'Tratamientos para mejorar la movilidad y el equilibrio.',
        },
        {
          titulo: 'Terapia Ocupacional y Cognitiva',
          descripcion: 'Estimulación de capacidades físicas y mentales.',
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
          titulo: 'Nutrición',
          descripcion: 'Dietas equilibradas adaptadas a cada residente.',
        },
      ],
    },
  ];

  // ===== ACORDEÓN (4 SERVICIOS) =====
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
      titulo: 'Atención psicogeriátrica',
      contenido: 'Apoyo psicológico especializado para el bienestar emocional.',
      activo: false,
    },
    {
      id: 4,
      titulo: 'Nutrición',
      contenido:
        'Alimentación equilibrada y adaptada a las necesidades del residente.',
      activo: false,
    },
  ];

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
}

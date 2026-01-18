import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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

@Component({
  selector: 'app-servicios',
  imports: [CommonModule],
  templateUrl: './servicios.component.html',
  styleUrl: './servicios.component.css'
})
export class ServiciosComponent {
  
  constructor(private router: Router) {}

  // Servicios principales (Sección 1)
  serviciosPrincipales: Servicio[] = [
    {
      id: 'permanente',
      titulo: 'Residencia Permanente',
      icono: 'fa-solid fa-house-medical',
      descripcion: 'Hogar integral con atención continua, calidez y profesionalismo',
      detalles: [
        'Atención médica y de enfermería 24/7',
        'Alimentación balanceada personalizada',
        'Actividades recreativas y terapéuticas',
        'Habitaciones cómodas y seguras'
      ],
      color: '#758f94',
      imagen: '/nosotros1.jpg',
      ruta: '/servicios/residencia-permanente'
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
        'Adaptación progresiva'
      ],
      color: '#D9B756',
      imagen: '/nosotros2.jpg',
      ruta: '/servicios/residencia-temporal'
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
        'Alimentación incluida'
      ],
      color: '#758f94',
      imagen: '/servicios1.png',
      ruta: '/servicios/centro-dia'
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
        'Control de medicación'
      ],
      color: '#D9B756',
      imagen: '/servicios2.png',
      ruta: '/servicios/residencia-post-operatoria'
    }
  ];

  testimonios: Testimonio[] = [
    {
      nombre: 'María González',
      servicio: 'Residencia Permanente',
      comentario: 'Mi madre está feliz aquí. El personal es muy atento y profesional. Las instalaciones son excelentes y siempre está participando en actividades.',
      imagen: '/nosotros5.jpg'
    },
    {
      nombre: 'Carlos Mendoza',
      servicio: 'Centro de Día',
      comentario: 'El centro de día ha sido una gran solución para nuestra familia. Mi padre disfruta mucho las terapias y ha mejorado notablemente su movilidad.',
      imagen: '/nosotros6.jpg'
    },
    {
      nombre: 'Ana Pérez',
      servicio: 'Residencia Post Operatoria',
      comentario: 'Después de la cirugía de mi abuela, encontramos en Las Dalias el lugar perfecto para su recuperación. El seguimiento médico fue impecable.',
      imagen: '/nosotros7.jpg'
    }
  ];

  irAServicio(ruta: string): void {
    this.router.navigate([ruta]);
  }

  abrirModalVisita(): void {
    // Aquí puedes emitir un evento o llamar a un servicio
    // para abrir el modal que ya tienes en el inicio
    console.log('Abrir modal de visita');
  }
}
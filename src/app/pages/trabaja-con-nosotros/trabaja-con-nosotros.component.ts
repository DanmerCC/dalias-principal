import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Puesto {
  id: number;
  titulo: string;
  area: string;
  tipo: string;
  descripcion: string;
  requisitos: string[];
  icono: string;
}

@Component({
  selector: 'app-trabaja-con-nosotros',
  imports: [CommonModule, FormsModule],
  templateUrl: './trabaja-con-nosotros.component.html',
  styleUrl: './trabaja-con-nosotros.component.css'
})
export class TrabajaConNosotrosComponent {

  formulario = {
    nombre: '',
    email: '',
    telefono: '',
    puesto: '',
    mensaje: ''
  };

  formularioEnviado = false;
  archivoNombre = '';

  puestos: Puesto[] = [
    {
      id: 1,
      titulo: 'Enfermero/a Geriátrico/a',
      area: 'Salud',
      tipo: 'Tiempo completo',
      descripcion: 'Buscamos enfermeros/as con vocación de servicio para brindar atención integral y personalizada a nuestros residentes.',
      requisitos: [
        'Título en Enfermería',
        'Experiencia mínima 1 año en geriatría',
        'Disponibilidad para turnos rotativos',
        'Empatía y trato cálido'
      ],
      icono: 'fa-solid fa-user-nurse'
    },
    {
      id: 2,
      titulo: 'Terapeuta Ocupacional',
      area: 'Terapias',
      tipo: 'Tiempo completo',
      descripcion: 'Profesional para diseñar y ejecutar programas de estimulación cognitiva, física y emocional para nuestros residentes.',
      requisitos: [
        'Título en Terapia Ocupacional',
        'Experiencia con adultos mayores',
        'Creatividad y dinamismo',
        'Trabajo en equipo'
      ],
      icono: 'fa-solid fa-hands-helping'
    },
    {
      id: 3,
      titulo: 'Auxiliar de Cuidados',
      area: 'Cuidados',
      tipo: 'Tiempo completo',
      descripcion: 'Personal de apoyo para asistir en las actividades de la vida diaria de nuestros residentes con calidez y respeto.',
      requisitos: [
        'Secundaria completa',
        'Curso de auxiliar de enfermería (deseable)',
        'Paciencia y vocación de servicio',
        'Disponibilidad inmediata'
      ],
      icono: 'fa-solid fa-heart-circle-check'
    },
    {
      id: 4,
      titulo: 'Psicólogo/a',
      area: 'Salud',
      tipo: 'Medio tiempo',
      descripcion: 'Profesional para brindar acompañamiento emocional a residentes y sus familias, promoviendo el bienestar integral.',
      requisitos: [
        'Título en Psicología',
        'Experiencia en adultos mayores o clínica',
        'Habilidades de comunicación',
        'Sensibilidad y escucha activa'
      ],
      icono: 'fa-solid fa-brain'
    },
    {
      id: 5,
      titulo: 'Cocinero/a',
      area: 'Nutrición',
      tipo: 'Tiempo completo',
      descripcion: 'Responsable de preparar menús nutritivos y adaptados a las necesidades específicas de cada residente.',
      requisitos: [
        'Experiencia en cocina institucional',
        'Conocimiento en dietas terapéuticas',
        'Certificado de manipulación de alimentos',
        'Organización y limpieza'
      ],
      icono: 'fa-solid fa-utensils'
    },
    {
      id: 6,
      titulo: 'Personal de Limpieza',
      area: 'Servicios',
      tipo: 'Tiempo completo',
      descripcion: 'Encargado/a de mantener las instalaciones impecables, garantizando un ambiente seguro y acogedor para todos.',
      requisitos: [
        'Experiencia en limpieza institucional',
        'Responsabilidad y puntualidad',
        'Discreción y respeto',
        'Disponibilidad para turnos'
      ],
      icono: 'fa-solid fa-broom'
    }
  ];

  valores = [
    {
      icono: 'fa-solid fa-heart',
      titulo: 'Vocación de servicio',
      descripcion: 'Buscamos personas que sientan genuina pasión por el cuidado y bienestar de los adultos mayores.'
    },
    {
      icono: 'fa-solid fa-users',
      titulo: 'Trabajo en equipo',
      descripcion: 'Somos una familia que trabaja unida. Aquí cada colaborador es parte fundamental de nuestra comunidad.'
    },
    {
      icono: 'fa-solid fa-graduation-cap',
      titulo: 'Crecimiento profesional',
      descripcion: 'Ofrecemos capacitaciones constantes y oportunidades reales de desarrollo dentro de la institución.'
    },
    {
      icono: 'fa-solid fa-shield-heart',
      titulo: 'Ambiente seguro',
      descripcion: 'Trabajamos en un entorno que prioriza el bienestar tanto de nuestros residentes como de nuestro equipo.'
    }
  ];

  beneficios = [
    { icono: 'fa-solid fa-money-bill-wave', texto: 'Remuneración competitiva' },
    { icono: 'fa-solid fa-clock', texto: 'Horarios organizados' },
    { icono: 'fa-solid fa-book-open', texto: 'Capacitación continua' },
    { icono: 'fa-solid fa-handshake', texto: 'Buen clima laboral' },
    { icono: 'fa-solid fa-file-contract', texto: 'Contrato formal' },
    { icono: 'fa-solid fa-utensils', texto: 'Alimentación incluida' }
  ];

  seleccionarPuesto(titulo: string): void {
    this.formulario.puesto = titulo;
    const formEl = document.querySelector('.seccion__formulario');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
  }

  onArchivoSeleccionado(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.archivoNombre = input.files[0].name;
    }
  }

  scrollAPuestos(): void {
    const section = document.querySelector('.seccion__puestos');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }

  enviarFormulario(): void {
    if (
      this.formulario.nombre &&
      this.formulario.email &&
      this.formulario.telefono &&
      this.formulario.puesto
    ) {
      this.formularioEnviado = true;
      console.log('Postulación enviada:', this.formulario);
    }
  }
}
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nosotros',
  imports: [CommonModule, RouterLink],
  templateUrl: './nosotros.component.html',
  styleUrl: './nosotros.component.css'
})
export class NosotrosComponent {

  estadisticas = [
    { numero: '+15', label: 'Años de experiencia' },
    { numero: '+200', label: 'Familias atendidas' },
    { numero: '24/7', label: 'Atención continua' },
    { numero: '+5000', label: 'm² de instalaciones' }
  ];

  valores = [
    {
      icono: 'fa-solid fa-heart',
      titulo: 'Amor y Vocación',
      descripcion: 'Cada acción que realizamos nace del genuino amor por las personas mayores y la convicción de que merecen lo mejor.'
    },
    {
      icono: 'fa-solid fa-shield-heart',
      titulo: 'Dignidad y Respeto',
      descripcion: 'Tratamos a cada residente como parte de nuestra familia, honrando su historia, sus preferencias y su autonomía.'
    },
    {
      icono: 'fa-solid fa-star',
      titulo: 'Excelencia',
      descripcion: 'Nos esforzamos continuamente por mejorar nuestros servicios, protocolos y espacios para ofrecer la mejor experiencia.'
    },
    {
      icono: 'fa-solid fa-users',
      titulo: 'Comunidad',
      descripcion: 'Fomentamos vínculos genuinos entre residentes, familias y equipo, construyendo una comunidad cálida y unida.'
    },
    {
      icono: 'fa-solid fa-lightbulb',
      titulo: 'Innovación',
      descripcion: 'Incorporamos nuevas metodologías de cuidado geriátrico para mantenernos a la vanguardia del bienestar integral.'
    },
    {
      icono: 'fa-solid fa-handshake',
      titulo: 'Transparencia',
      descripcion: 'Mantenemos una comunicación abierta y honesta con las familias en cada etapa del cuidado de sus seres queridos.'
    }
  ];

  equipo = [
    {
      nombre: 'Dra. Carmen Vásquez',
      cargo: 'Directora Médica',
      especialidad: 'Geriatra con 20 años de experiencia',
      imagen: '/nosotros1.jpg',
      icono: 'fa-solid fa-user-doctor'
    },
    {
      nombre: 'Lic. Patricia Morales',
      cargo: 'Coordinadora de Enfermería',
      especialidad: 'Especialista en cuidados paliativos',
      imagen: '/nosotros1.jpg',
      icono: 'fa-solid fa-user-nurse'
    },
    {
      nombre: 'Lic. Roberto Sánchez',
      cargo: 'Psicólogo Clínico',
      especialidad: 'Especialista en psicogerontología',
      imagen: '/nosotros1.jpg',
      icono: 'fa-solid fa-brain'
    },
    {
      nombre: 'Lic. Ana Gutiérrez',
      cargo: 'Terapeuta Ocupacional',
      especialidad: 'Coordinadora de actividades y bienestar',
      imagen: '/nosotros1.jpg',
      icono: 'fa-solid fa-hands-helping'
    }
  ];

  hitos = [
    {
      anio: '2008',
      titulo: 'Fundación',
      descripcion: 'Abrimos nuestras puertas con la misión de ofrecer un hogar digno y cálido para los adultos mayores de Lima.'
    },
    {
      anio: '2012',
      titulo: 'Ampliación',
      descripcion: 'Expandimos nuestras instalaciones a más de 5,000 m², incorporando nuevos jardines, zonas recreativas y áreas terapéuticas.'
    },
    {
      anio: '2016',
      titulo: 'Certificación',
      descripcion: 'Obtuvimos la certificación de calidad en atención geriátrica, reconocida por el Ministerio de Salud del Perú.'
    },
    {
      anio: '2020',
      titulo: 'Innovación',
      descripcion: 'Implementamos nuevos protocolos de atención integral y tecnología para el monitoreo y bienestar de nuestros residentes.'
    },
    {
      anio: '2024',
      titulo: 'Hoy',
      descripcion: 'Seguimos creciendo con el mismo espíritu de siempre: brindar amor, dignidad y bienestar a quienes más lo merecen.'
    }
  ];

  acordeonItems = [
    {
      id: 1,
      pregunta: '¿Cómo garantizan la seguridad de los residentes?',
      respuesta: 'Contamos con monitoreo continuo 24/7, personal médico y de enfermería siempre disponible, instalaciones diseñadas para la movilidad segura y protocolos de emergencia actualizados.',
      activo: false
    },
    {
      id: 2,
      pregunta: '¿Qué diferencia a Las Dalias de otras residencias?',
      respuesta: 'Nuestro enfoque es genuinamente familiar. No somos solo una institución, somos un hogar donde cada residente es conocido por su nombre, historia y preferencias. La atención personalizada y el vínculo humano son nuestra prioridad.',
      activo: false
    },
    {
      id: 3,
      pregunta: '¿El personal está capacitado en geriatría?',
      respuesta: 'Sí. Todo nuestro equipo recibe capacitación continua en cuidados geriátricos, primeros auxilios, manejo de demencias y comunicación empática. Además contamos con especialistas en geriatría, psicología y terapia ocupacional.',
      activo: false
    }
  ];

  scrollANosotros(): void {
    const section = document.querySelector('#nosotros');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }

  toggleAcordeon(id: number): void {
    this.acordeonItems = this.acordeonItems.map(item => ({
      ...item,
      activo: item.id === id ? !item.activo : false
    }));
  }
}
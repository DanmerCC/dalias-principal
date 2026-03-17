import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Articulo {
  id: number;
  titulo: string;
  descripcion: string;
  imagen: string;
  fecha: string;
  categoria: string;
  tiempoLectura: string;
}

@Component({
  selector: 'app-blog',
  imports: [CommonModule, FormsModule],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})
export class BlogComponent {

  categorias = ['Todos', 'Bienestar', 'Actividades', 'Nutrición', 'Cuidados', 'Familia'];
  categoriaActiva = 'Todos';

  formularioGuia = { nombre: '', email: '' };
  guiaDescargada = false;

  articulos: Articulo[] = [
    {
      id: 1,
      titulo: 'Club de Lectura para Adultos Mayores',
      descripcion: 'Una actividad que fortalece la mente y genera bienestar emocional en un entorno cálido y participativo. Descubre cómo la lectura compartida transforma la vida de nuestros residentes.',
      imagen: '/act1-card.jpeg',
      fecha: '15 Mayo, 2024',
      categoria: 'Actividades',
      tiempoLectura: '4 min'
    },
    {
      id: 2,
      titulo: 'Beneficios del Yoga Suave en la Tercera Edad',
      descripcion: 'Sesiones adaptadas para mejorar la flexibilidad, el equilibrio y la paz interior. Conoce cómo el yoga transforma la calidad de vida de nuestros residentes día a día.',
      imagen: '/act5-card.png',
      fecha: '18 Mayo, 2024',
      categoria: 'Bienestar',
      tiempoLectura: '5 min'
    },
    {
      id: 3,
      titulo: 'Alimentación Saludable en el Adulto Mayor',
      descripcion: 'Planes nutricionales supervisados y adaptados a cada necesidad. Una dieta equilibrada es fundamental para mantener la vitalidad y la salud en cada etapa de la vida.',
      imagen: '/act2-card.jpeg',
      fecha: '22 Mayo, 2024',
      categoria: 'Nutrición',
      tiempoLectura: '6 min'
    },
    {
      id: 4,
      titulo: 'La Importancia de la Estimulación Cognitiva',
      descripcion: 'Desafíos mentales, juegos de estrategia y ejercicios de memoria para mantener la mente ágil. Descubre nuestro programa de estimulación cognitiva personalizada.',
      imagen: '/act6-card.jpeg',
      fecha: '28 Mayo, 2024',
      categoria: 'Cuidados',
      tiempoLectura: '5 min'
    },
    {
      id: 5,
      titulo: 'Cómo Mantener el Vínculo Familiar',
      descripcion: 'Facilitamos la participación activa de la familia en la vida diaria del residente. Tips y estrategias para fortalecer los lazos afectivos en todo momento.',
      imagen: '/moment1.jpeg',
      fecha: '02 Junio, 2024',
      categoria: 'Familia',
      tiempoLectura: '4 min'
    },
    {
      id: 6,
      titulo: 'Musicoterapia: Ritmo y Alegría Compartida',
      descripcion: 'Sesiones dinámicas de música y ritmo que estimulan la memoria musical y generan alegría. La musicoterapia es una de las actividades más queridas en Las Dalias.',
      imagen: '/act3-card.jpeg',
      fecha: '10 Junio, 2024',
      categoria: 'Actividades',
      tiempoLectura: '3 min'
    }
  ];

  get articulosFiltrados(): Articulo[] {
    if (this.categoriaActiva === 'Todos') return this.articulos;
    return this.articulos.filter(a => a.categoria === this.categoriaActiva);
  }

  filtrarPor(categoria: string): void {
    this.categoriaActiva = categoria;
  }

  scrollAArticulos(): void {
    const section = document.querySelector('.seccion__grid-blog');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }

  descargarGuia(): void {
    if (this.formularioGuia.nombre && this.formularioGuia.email) {
      this.guiaDescargada = true;
      console.log('Lead capturado:', this.formularioGuia);
    }
  }
}
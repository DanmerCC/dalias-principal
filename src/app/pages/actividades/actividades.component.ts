import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Noticia {
  id: number;
  fecha: string;
  titulo: string;
  descripcion: string;
  imagen: string;
  link: string;
}

@Component({
  selector: 'app-actividades',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './actividades.component.html',
  styleUrl: './actividades.component.css',
})
export class ActividadesComponent implements OnInit {
  indicePaginaNoticias = 0;
  noticiasPorPagina = 2;
  noticiasVisibles: Noticia[] = [];
  paginasNoticias: number[] = [];

  noticias: Noticia[] = [
    {
      id: 1,
      fecha: '15/01/2026',
      titulo: 'Nuevos programas de estimulación cognitiva para prevenir el deterioro mental',
      descripcion: 'Implementamos actividades innovadoras basadas en neurociencia que ayudan a mantener activa la mente de nuestros residentes, mejorando memoria, atención y capacidades cognitivas mediante ejercicios personalizados y dinámicas grupales.',
      imagen: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80',
      link: '#',
    },
    {
      id: 2,
      fecha: '10/01/2026',
      titulo: 'La importancia de la hidratación en el adulto mayor durante el verano',
      descripcion: 'Nuestro equipo médico comparte recomendaciones esenciales sobre hidratación adecuada, signos de deshidratación y mejores prácticas para mantener a los residentes saludables durante las altas temperaturas del verano peruano.',
      imagen: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80',
      link: '#',
    },
    {
      id: 3,
      fecha: '05/01/2026',
      titulo: 'Beneficios de la musicoterapia en pacientes con Alzheimer y demencia',
      descripcion: 'Descubre cómo la música se convierte en una poderosa herramienta terapéutica que mejora el estado de ánimo, reduce la ansiedad y estimula la memoria en personas con deterioro cognitivo, creando conexiones emocionales profundas.',
      imagen: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80',
      link: '#',
    },
    {
      id: 4,
      fecha: '28/12/2025',
      titulo: 'Celebramos las fiestas navideñas con actividades especiales para residentes',
      descripcion: 'Revive los momentos más emotivos de nuestras celebraciones navideñas, donde familiares y residentes compartieron villancicos, cenas especiales y regalos en un ambiente lleno de amor, tradición y alegría festiva.',
      imagen: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80',
      link: '#',
    },
    {
      id: 5,
      fecha: '20/12/2025',
      titulo: 'Guía completa sobre nutrición saludable para adultos mayores',
      descripcion: 'Conoce las recomendaciones nutricionales específicas para la tercera edad, incluyendo alimentos esenciales, porciones adecuadas y cómo prevenir deficiencias vitamínicas que afectan la salud y vitalidad de los adultos mayores.',
      imagen: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80',
      link: '#',
    },
    {
      id: 6,
      fecha: '15/12/2025',
      titulo: 'Ejercicios de bajo impacto: Mantén la movilidad y previene caídas',
      descripcion: 'Nuestros fisioterapeutas presentan una serie de ejercicios seguros y efectivos diseñados específicamente para mejorar el equilibrio, fortalecer músculos y reducir significativamente el riesgo de caídas en adultos mayores.',
      imagen: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80',
      link: '#',
    },
  ];

  ngOnInit(): void {
    this.inicializarNoticias();
  }

  scrollToServicios() {
    const seccionServicios = document.getElementById('section-actividades');
    if (seccionServicios) {
      const offset = 60;
      const top =
        seccionServicios.getBoundingClientRect().top +
        window.pageYOffset -
        offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }

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
}
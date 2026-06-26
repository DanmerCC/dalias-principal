import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CmsService } from '../../services/cms.service';
import { Noticia, ACTIVIDADES_RESPALDO } from '../../data/actividades-respaldo';

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

  noticias: Noticia[] = [];

  // Respaldo (estático): se usa solo si el CMS no devuelve actividades.
  noticiasRespaldo: Noticia[] = ACTIVIDADES_RESPALDO;

  constructor(private cms: CmsService) {}

  ngOnInit(): void {
    // Fuente única: CMS. Mapea actividad→noticia; si no hay datos, usa el respaldo.
    this.cms.getActividades().subscribe((acts) => {
      this.noticias = acts.length
        ? acts.map((a) => ({
            id: a.id,
            fecha: a.fecha,
            titulo: a.titulo,
            descripcion: a.descripcion,
            imagen: a.imagen,
            link: '#',
          }))
        : this.noticiasRespaldo;
      this.inicializarNoticias();
    });
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
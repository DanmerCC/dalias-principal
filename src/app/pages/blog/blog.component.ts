import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CmsService } from '../../services/cms.service';
import { Articulo, BLOG_RESPALDO } from '../../data/blog-respaldo';

@Component({
  selector: 'app-blog',
  imports: [CommonModule, FormsModule],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})
export class BlogComponent implements OnInit {

  categorias = ['Todos', 'Bienestar', 'Actividades', 'Nutrición', 'Cuidados', 'Familia'];
  categoriaActiva = 'Todos';

  formularioGuia = { nombre: '', email: '' };
  guiaDescargada = false;

  // CMS → etiqueta visible para los chips de categoría.
  private etiquetaCategoria: Record<string, string> = {
    bienestar: 'Bienestar',
    cuidado: 'Cuidados',
    salud: 'Nutrición',
    actividades: 'Actividades',
    familia: 'Familia',
  };

  articulos: Articulo[] = [];

  constructor(private cms: CmsService) {}

  ngOnInit(): void {
    // Fuente única: CMS. Si no hay artículos publicados, usa el respaldo.
    this.cms.getBlogs().subscribe((blogs) => {
      this.articulos = blogs.length
        ? blogs.map((b) => ({
            id: b.id,
            titulo: b.titulo,
            descripcion: b.descripcionCorta,
            imagen: b.imagen,
            fecha: b.fecha,
            categoria: this.etiquetaCategoria[b.categorias?.[0] ?? ''] ?? 'Bienestar',
            tiempoLectura: this.calcularTiempoLectura(b.cuerpo),
          }))
        : this.articulosRespaldo;
    });
  }

  // Estima minutos de lectura (~200 palabras/min), mínimo 1.
  private calcularTiempoLectura(texto: string): string {
    const palabras = (texto || '').trim().split(/\s+/).filter(Boolean).length;
    return `${Math.max(1, Math.round(palabras / 200))} min`;
  }

  // Respaldo (estático): se usa solo si el CMS no devuelve artículos.
  articulosRespaldo: Articulo[] = BLOG_RESPALDO;

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
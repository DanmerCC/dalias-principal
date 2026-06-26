import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Fuente ÚNICA de contenido público desde el CMS (Payload).
 * Centraliza fetch + mapeo Payload→modelo de vista para actividades, blog y galería,
 * para que todas las páginas consuman la misma forma de datos.
 */

export interface Actividad {
  id: string;
  titulo: string;
  subtitulo: string;
  fecha: string; // = subtitulo (compatibilidad con las vistas existentes)
  descripcion: string; // texto plano (richText aplanado)
  imagen: string;
}

export interface ArticuloBlog {
  id: string;
  titulo: string;
  descripcionCorta: string;
  imagen: string;
  cuerpo: string; // texto plano
  categorias: string[];
  fecha: string; // fechaPublicacion formateada
  slug: string;
}

export interface GaleriaItem {
  id: string;
  titulo: string;
  etiqueta: string;
  imagenes: string[];
}

// Forma estándar de la REST API de Payload (listados)
interface PayloadList<T> {
  docs: T[];
  totalDocs: number;
}

@Injectable({ providedIn: 'root' })
export class CmsService {
  private http = inject(HttpClient);
  private base = `${environment.cmsUrl}/api`;

  // Solo actividades activas; depth=1 para poblar la relación de imagen (media.url).
  getActividades(): Observable<Actividad[]> {
    const url = `${this.base}/actividades?where[estado][equals]=activo&depth=1&limit=100`;
    return this.http.get<PayloadList<any>>(url).pipe(
      map((res) => (res?.docs ?? []).map((d) => this.mapActividad(d))),
      catchError(() => of([])),
    );
  }

  // Solo artículos publicados, más recientes primero.
  getBlogs(): Observable<ArticuloBlog[]> {
    const url = `${this.base}/blogs?where[estado][equals]=publicado&depth=1&limit=100&sort=-fechaPublicacion`;
    return this.http.get<PayloadList<any>>(url).pipe(
      map((res) => (res?.docs ?? []).map((d) => this.mapBlog(d))),
      catchError(() => of([])),
    );
  }

  // Solo experiencias visibles.
  getGaleria(): Observable<GaleriaItem[]> {
    const url = `${this.base}/galeria?where[visible][equals]=true&depth=1&limit=100`;
    return this.http.get<PayloadList<any>>(url).pipe(
      map((res) => (res?.docs ?? []).map((d) => this.mapGaleria(d))),
      catchError(() => of([])),
    );
  }

  // ---- Mapeos Payload → modelo de vista ----

  private mapActividad(d: any): Actividad {
    return {
      id: d?.id,
      titulo: d?.titulo ?? '',
      subtitulo: d?.subtitulo ?? '',
      fecha: d?.subtitulo ?? '',
      descripcion: this.richTextToPlain(d?.descripcion),
      imagen: this.resolveImg(d?.imagen?.url),
    };
  }

  private mapBlog(d: any): ArticuloBlog {
    return {
      id: d?.id,
      titulo: d?.titulo ?? '',
      descripcionCorta: d?.descripcionCorta ?? '',
      imagen: this.resolveImg(d?.imagenPrincipal?.url),
      cuerpo: this.richTextToPlain(d?.cuerpo),
      categorias: Array.isArray(d?.categoria) ? d.categoria : d?.categoria ? [d.categoria] : [],
      fecha: this.formatFecha(d?.fechaPublicacion),
      slug: d?.slug ?? '',
    };
  }

  private mapGaleria(d: any): GaleriaItem {
    const media = Array.isArray(d?.media) ? d.media : [];
    return {
      id: d?.id,
      titulo: d?.titulo ?? '',
      etiqueta: d?.etiqueta ?? '',
      imagenes: media.map((m: any) => this.resolveImg(m?.url)).filter(Boolean),
    };
  }

  // Prefija cmsUrl a rutas relativas de imágenes (ej. /media/foo.jpg).
  private resolveImg(url?: string): string {
    if (!url) return '';
    return url.startsWith('http') ? url : `${environment.cmsUrl}${url}`;
  }

  private formatFecha(iso?: string): string {
    if (!iso) return '';
    const dt = new Date(iso);
    return isNaN(dt.getTime())
      ? ''
      : dt.toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' });
  }

  // Aplana un richText (Lexical) de Payload a texto plano; tolera string.
  private richTextToPlain(rt: any): string {
    if (!rt) return '';
    if (typeof rt === 'string') return rt;
    const walk = (node: any): string => {
      if (!node) return '';
      if (typeof node.text === 'string') return node.text;
      const children = node.children ?? [];
      return children.map(walk).join('');
    };
    return walk(rt.root ?? rt).trim();
  }
}

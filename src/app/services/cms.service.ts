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

export interface PlanBanner {
  etiqueta: string;
  slug: string;
  link: string; // destino configurable desde el CMS (ruta interna o URL externa)
}

export interface BannerInicio {
  imagenFondo: string;
  logo: string;
  facilitiesImage: string;
  descripcion: string;
  textoCTA: string;
  planes: PlanBanner[];
}

export interface Anuncio {
  activo: boolean;
  tipo: 'contenido' | 'solo-imagen';
  titulo: string;
  mensaje: string;
  imagen: string;
  imagenAlt: string;
  textoBoton: string;
  enlace: string;
}

// Item del menú de navegación (global `navegacion` del CMS). Una sola lista
// alimenta el header de escritorio y el panel móvil (ver
// dalias-cms/src/globals/Navegacion.ts).
export interface NavItem {
  etiqueta: string;
  enlace: string;
  icono: string;
  tipo: 'enlace' | 'boton';
  variante: 'primario' | 'secundario'; // solo aplica a tipo 'boton'
  subtexto: string; // segunda línea, solo botones (ej. contacto)
  nuevaPestana: boolean;
  visible: boolean;
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

  private readonly BANNER_DEFAULTS: BannerInicio = {
    imagenFondo: '/slider1.png',
    logo: '/logo_slider2.png',
    facilitiesImage: '/casa.png',
    descripcion:
      'En Residencia Las Dalias ofrecemos planes de estadía pensados para el bienestar, cuidado y tranquilidad de nuestros residentes, adaptándonos a cada necesidad y etapa.',
    textoCTA: 'Explora nuestros planes de estadía',
    planes: [
      { etiqueta: 'Residencia Permanente', slug: 'residencia-permanente', link: '/servicios/planes-de-estadia/residencia-permanente' },
      { etiqueta: 'Residencia Temporal', slug: 'temporal', link: '/servicios/planes-de-estadia/residencia-temporal' },
      { etiqueta: 'Centro de Día', slug: 'centro-de-dia', link: '/servicios/planes-de-estadia/centro-de-dia' },
      { etiqueta: 'Residencia Post Operatoria', slug: 'post-operatoria', link: '/servicios/planes-de-estadia/residencia-post-operatoria' },
    ],
  };

  getBannerInicio(): Observable<BannerInicio> {
    const url = `${this.base}/globals/banner-inicio?depth=1`;
    return this.http.get<any>(url).pipe(
      map((d) => ({
        imagenFondo: this.resolveImg(d?.imagenFondo, 'banner') || this.BANNER_DEFAULTS.imagenFondo,
        logo: this.resolveImg(d?.logo) || this.BANNER_DEFAULTS.logo,
        facilitiesImage: this.resolveImg(d?.facilitiesImage, 'banner') || this.BANNER_DEFAULTS.facilitiesImage,
        descripcion: d?.descripcion || this.BANNER_DEFAULTS.descripcion,
        textoCTA: d?.textoCTA || this.BANNER_DEFAULTS.textoCTA,
        planes: Array.isArray(d?.planes) && d.planes.length
          ? d.planes.map((p: any) => ({ etiqueta: p.etiqueta ?? '', slug: p.slug ?? '', link: p.link ?? '' }))
          : this.BANNER_DEFAULTS.planes,
      })),
      catchError(() => of(this.BANNER_DEFAULTS)),
    );
  }

  // Sin activo=true no hay popup que mostrar; ante error de red tampoco (evita
  // molestar al visitante con un popup vacío/roto).
  private readonly ANUNCIO_DEFAULTS: Anuncio = {
    activo: false,
    tipo: 'contenido',
    titulo: '',
    mensaje: '',
    imagen: '',
    imagenAlt: '',
    textoBoton: '',
    enlace: '',
  };

  getAnuncio(): Observable<Anuncio> {
    const url = `${this.base}/globals/anuncio?depth=1`;
    return this.http.get<any>(url).pipe(
      map((d): Anuncio => ({
        activo: !!d?.activo,
        tipo: d?.tipo === 'solo-imagen' ? 'solo-imagen' : 'contenido',
        titulo: d?.titulo ?? '',
        mensaje: d?.mensaje ?? '',
        imagen: this.resolveImg(d?.imagen?.url),
        imagenAlt: d?.imagen?.alt ?? '',
        textoBoton: d?.textoBoton ?? '',
        enlace: d?.enlace ?? '',
      })),
      catchError(() => of(this.ANUNCIO_DEFAULTS)),
    );
  }

  // Menú por defecto: el header es crítico (aparece en TODAS las páginas), así
  // que si el CMS no responde el sitio NUNCA debe quedar sin navegación. Estos
  // defaults replican el menú histórico hardcodeado y son también el estado
  // inicial síncrono del header en SSR (ver header.component.ts).
  readonly NAVEGACION_DEFAULTS: NavItem[] = [
    { etiqueta: 'Inicio', enlace: '/', icono: 'fas fa-home', tipo: 'enlace', variante: 'primario', subtexto: '', nuevaPestana: false, visible: true },
    { etiqueta: 'Nosotros', enlace: '/nosotros', icono: 'fas fa-building', tipo: 'enlace', variante: 'primario', subtexto: '', nuevaPestana: false, visible: true },
    { etiqueta: 'Servicios', enlace: '/servicios', icono: 'fas fa-cog', tipo: 'enlace', variante: 'primario', subtexto: '', nuevaPestana: false, visible: true },
    { etiqueta: 'Actividades', enlace: '/actividades', icono: 'fas fa-calendar-alt', tipo: 'enlace', variante: 'primario', subtexto: '', nuevaPestana: false, visible: true },
    { etiqueta: 'Trabaja con nosotros', enlace: '/trabaja-con-nosotros', icono: 'fas fa-briefcase', tipo: 'enlace', variante: 'primario', subtexto: '', nuevaPestana: false, visible: true },
    { etiqueta: 'Contáctanos', enlace: '/contactanos', icono: 'fas fa-envelope', tipo: 'enlace', variante: 'primario', subtexto: '', nuevaPestana: false, visible: true },
    { etiqueta: 'Blog', enlace: '/blog', icono: 'fas fa-newspaper', tipo: 'enlace', variante: 'primario', subtexto: '', nuevaPestana: false, visible: true },
    { etiqueta: '+51 981 776 156', enlace: 'https://wa.link/iv575a', icono: 'bx bx-phone', tipo: 'enlace', variante: 'primario', subtexto: '¿Alguna duda? Contáctanos', nuevaPestana: true, visible: true },
    { etiqueta: 'Portal Dalias', enlace: '/login', icono: 'bx bx-user', tipo: 'enlace', variante: 'secundario', subtexto: '', nuevaPestana: false, visible: true },
  ];

  // Menú del sitio. depth=0: no hay relaciones que poblar (todo son campos
  // planos). Filtra los items ocultos y cae a los defaults si el CMS no
  // responde o devuelve la lista vacía.
  getNavegacion(): Observable<NavItem[]> {
    const url = `${this.base}/globals/navegacion?depth=0`;
    return this.http.get<any>(url).pipe(
      map((d) => {
        const items = (Array.isArray(d?.items) ? d.items : [])
          .filter((i: any) => i?.visible !== false)
          .map((i: any) => this.mapNavItem(i));
        return items.length ? items : this.NAVEGACION_DEFAULTS;
      }),
      catchError(() => of(this.NAVEGACION_DEFAULTS)),
    );
  }

  private mapNavItem(i: any): NavItem {
    return {
      etiqueta: i?.etiqueta ?? '',
      enlace: i?.enlace ?? '',
      icono: i?.icono ?? '',
      tipo: i?.tipo === 'boton' ? 'boton' : 'enlace',
      variante: i?.variante === 'secundario' ? 'secundario' : 'primario',
      subtexto: i?.subtexto ?? '',
      nuevaPestana: !!i?.nuevaPestana,
      visible: i?.visible !== false,
    };
  }

  // Solo actividades activas; depth=1 para poblar la relación de imagen (media.url).
  // sort=createdAt: sin él Payload devuelve -createdAt y el carrusel sale invertido
  // respecto al orden del seed (issues #5 y #9).
  getActividades(): Observable<Actividad[]> {
    const url = `${this.base}/actividades?where[estado][equals]=activo&depth=1&limit=100&sort=createdAt`;
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

  // Público: lo usa Live Preview para mapear el doc editado en vivo.
  mapActividad(d: any): Actividad {
    return {
      id: d?.id,
      titulo: d?.titulo ?? '',
      subtitulo: d?.subtitulo ?? '',
      fecha: d?.subtitulo ?? '',
      descripcion: this.richTextToPlain(d?.descripcion),
      imagen: this.resolveImg(d?.imagen, 'actividad'),
    };
  }

  private mapBlog(d: any): ArticuloBlog {
    return {
      id: d?.id,
      titulo: d?.titulo ?? '',
      descripcionCorta: d?.descripcionCorta ?? '',
      imagen: this.resolveImg(d?.imagenPrincipal, 'blog'),
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

  // Acepta la url plana (compatibilidad) o el documento de media completo: si
  // se pide `crop` y el CMS lo expone (media.crops, ya recortado en Cloudinary
  // al punto focal — ver dalias-cms/src/collections/Media.ts), usa esa
  // variante; si no, cae a la url plana (mismo comportamiento que antes, sin
  // regresión). Prefija cmsUrl a rutas relativas (ej. /media/foo.jpg).
  private resolveImg(media?: { url?: string; crops?: Record<string, string> } | string, crop?: 'banner' | 'actividad' | 'blog'): string {
    const url = typeof media === 'string' ? media : (crop && media?.crops?.[crop]) || media?.url;
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

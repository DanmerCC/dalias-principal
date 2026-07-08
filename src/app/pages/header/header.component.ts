import { Component, HostListener, Inject, NgZone, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CmsService, NavItem } from '../../services/cms.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnDestroy {

  private cms = inject(CmsService);

  isFixed = false;
  menuAbierto = false;
  private enHome = false;
  private previewHandler?: (event: MessageEvent) => void;

  // Inicializado de forma síncrona con los defaults para que SSR renderice un
  // menú completo desde el primer paint (sin parpadeo); el fetch al CMS lo
  // actualiza luego en el cliente. Si el CMS no responde, getNavegacion() ya
  // cae a estos mismos defaults.
  items: NavItem[] = this.cms.NAVEGACION_DEFAULTS;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone,
  ) {
    this.cms.getNavegacion().subscribe((items) => (this.items = items));

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const currentRoute = event.urlAfterRedirects;
        this.enHome = currentRoute === '/' || currentRoute === '/inicio';
        this.cerrarMenu();
      });

    this.initLivePreview();
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId) && this.previewHandler) {
      window.removeEventListener('message', this.previewHandler);
    }
  }

  // ---- Live Preview de Payload para el global "navegacion" ----
  // Mismo patrón que initLivePreview en anuncio-popup.component.ts: solo se
  // activa dentro del iframe del admin; recibe el doc editado por postMessage
  // y llama al endpoint de merge de Payload (aquí no hay relaciones que poblar,
  // pero se mantiene el mismo endpoint por consistencia y para validar el doc).

  private getPreviewEmbedOrigin(): string | null {
    if (isPlatformBrowser(this.platformId) && document.referrer) {
      try {
        return new URL(document.referrer).origin;
      } catch {
        return null;
      }
    }
    return null;
  }

  private getPreviewServerURL(): string | null {
    const embedOrigin = this.getPreviewEmbedOrigin();
    if (embedOrigin && environment.previewOrigins.includes(embedOrigin)) return embedOrigin;
    if (environment.cmsUrl && environment.previewOrigins.includes(environment.cmsUrl)) return environment.cmsUrl;
    return environment.previewOrigins[0] || null;
  }

  private isAllowedPreviewOrigin(origin: string, embedOrigin: string | null): boolean {
    return environment.previewOrigins.includes(origin) && (!embedOrigin || origin === embedOrigin);
  }

  private initLivePreview(): void {
    if (!isPlatformBrowser(this.platformId) || window.self === window.top) return;
    const serverURL = this.getPreviewServerURL();
    if (!serverURL) return;
    const embedOrigin = this.getPreviewEmbedOrigin();

    this.previewHandler = (event: MessageEvent) => {
      if (
        !this.isAllowedPreviewOrigin(event.origin, embedOrigin) ||
        event.data?.type !== 'payload-live-preview' ||
        event.data?.globalSlug !== 'navegacion'
      ) return;

      const incomingData = event.data?.data;
      if (!incomingData) return;

      fetch(`/api/globals/navegacion`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Payload-HTTP-Method-Override': 'GET',
        },
        body: JSON.stringify({ data: incomingData, depth: 0, flattenLocales: false }),
      })
        .then((res) => res.json())
        .then((doc) => this.ngZone.run(() => (this.items = this.cms.mapNavegacionDoc(doc))))
        .catch(() => this.ngZone.run(() => (this.items = this.cms.mapNavegacionDoc(incomingData))));
    };

    window.addEventListener('message', this.previewHandler);
  }

  // Enlaces de la lista de navegación. El item "Inicio" (enlace '/') se oculta
  // cuando ya estás en el home (comportamiento histórico "showInicio").
  get enlaces(): NavItem[] {
    return this.items.filter(
      (i) => i.tipo === 'enlace' && !(this.enHome && i.enlace === '/'),
    );
  }

  // Botones destacados de la zona de acciones (contacto, Portal Dalias, ...).
  get botones(): NavItem[] {
    return this.items.filter((i) => i.tipo === 'boton');
  }

  // Un enlace externo (http/https) usa <a href> + target; uno interno usa routerLink.
  esExterno(enlace: string): boolean {
    return /^https?:\/\//i.test(enlace ?? '');
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.isFixed = window.scrollY > 10;
  }

  toggleMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }

  cerrarMenu(): void {
    this.menuAbierto = false;
  }
}

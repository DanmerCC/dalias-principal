import {
  Component,
  ElementRef,
  HostListener,
  Inject,
  NgZone,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Anuncio, CmsService } from '../../services/cms.service';
import { environment } from '../../../environments/environment';

const CLAVE_CERRADO = 'dalias_anuncio_cerrado';

@Component({
  selector: 'app-anuncio-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './anuncio-popup.component.html',
  styleUrl: './anuncio-popup.component.css',
})
export class AnuncioPopupComponent implements OnInit, OnDestroy {
  @ViewChild('contenedor') contenedor?: ElementRef<HTMLElement>;

  visible = false;
  anuncio?: Anuncio;

  private elementoConFocoPrevio: HTMLElement | null = null;
  private previewHandler?: (event: MessageEvent) => void;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cms: CmsService,
    private router: Router,
    private ngZone: NgZone,
  ) {}

  // Dentro del iframe de Live Preview del admin: el anuncio se muestra siempre
  // (ignora activo/sessionStorage) para que el editor vea el resultado en vivo.
  private get enLivePreview(): boolean {
    return isPlatformBrowser(this.platformId) && window.self !== window.top;
  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    if (!this.enLivePreview && sessionStorage.getItem(CLAVE_CERRADO)) return;

    this.cms.getAnuncio().subscribe((anuncio) => {
      if (!anuncio.activo && !this.enLivePreview) return;
      this.anuncio = anuncio;
      this.abrir();
    });

    this.initLivePreview();
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = '';
    }
    if (this.previewHandler) {
      window.removeEventListener('message', this.previewHandler);
    }
  }

  // ---- Live Preview de Payload para el global "anuncio" ----
  // Mismo patrón que initBannerLivePreview en inicio.component.ts: solo se activa
  // dentro del iframe del admin; recibe el doc editado por postMessage y llama al
  // endpoint de merge de Payload para poblar la relación de imagen.

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
    if (!this.enLivePreview) return;
    const serverURL = this.getPreviewServerURL();
    if (!serverURL) return;
    const embedOrigin = this.getPreviewEmbedOrigin();

    this.previewHandler = (event: MessageEvent) => {
      if (
        !this.isAllowedPreviewOrigin(event.origin, embedOrigin) ||
        event.data?.type !== 'payload-live-preview' ||
        event.data?.globalSlug !== 'anuncio'
      ) return;

      const incomingData = event.data?.data;
      if (!incomingData) return;

      fetch(`/api/globals/anuncio`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Payload-HTTP-Method-Override': 'GET',
        },
        body: JSON.stringify({ data: incomingData, depth: 1, flattenLocales: false }),
      })
        .then((res) => res.json())
        .then((doc) => this.ngZone.run(() => this.aplicarPreview(doc, serverURL)))
        .catch(() => this.ngZone.run(() => this.aplicarPreview(incomingData, serverURL)));
    };

    window.addEventListener('message', this.previewHandler);
  }

  private aplicarPreview(doc: any, serverURL: string): void {
    const resolveImg = (url?: string) => (url ? (url.startsWith('http') ? url : `${serverURL}${url}`) : '');
    this.anuncio = {
      activo: !!doc?.activo,
      tipo: doc?.tipo === 'solo-imagen' ? 'solo-imagen' : 'contenido',
      titulo: doc?.titulo ?? '',
      mensaje: doc?.mensaje ?? '',
      imagen: resolveImg(doc?.imagen?.url),
      imagenAlt: doc?.imagen?.alt ?? '',
      textoBoton: doc?.textoBoton ?? '',
      enlace: doc?.enlace ?? '',
    };
    if (!this.visible) {
      this.abrir();
    }
  }

  private abrir(): void {
    this.elementoConFocoPrevio = document.activeElement as HTMLElement | null;
    this.visible = true;
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      const cerrarBtn = this.contenedor?.nativeElement.querySelector<HTMLElement>('.anuncio-popup__cerrar');
      cerrarBtn?.focus();
    });
  }

  cerrar(): void {
    this.visible = false;
    document.body.style.overflow = '';
    sessionStorage.setItem(CLAVE_CERRADO, '1');
    this.elementoConFocoPrevio?.focus();
  }

  irAlEnlace(): void {
    const enlace = this.anuncio?.enlace;
    if (!enlace) return;

    if (/^https?:\/\//i.test(enlace)) {
      window.open(enlace, '_blank', 'noopener');
    } else {
      this.router.navigate([enlace]);
    }
    this.cerrar();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.visible) {
      this.cerrar();
    }
  }

  @HostListener('document:keydown.tab', ['$event'])
  onTab(event: KeyboardEvent): void {
    if (!this.visible || !this.contenedor) return;

    const focosDisponibles = Array.from(
      this.contenedor.nativeElement.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      ),
    );
    if (!focosDisponibles.length) return;

    const primero = focosDisponibles[0];
    const ultimo = focosDisponibles[focosDisponibles.length - 1];

    if (event.shiftKey && document.activeElement === primero) {
      event.preventDefault();
      ultimo.focus();
    } else if (!event.shiftKey && document.activeElement === ultimo) {
      event.preventDefault();
      primero.focus();
    }
  }
}

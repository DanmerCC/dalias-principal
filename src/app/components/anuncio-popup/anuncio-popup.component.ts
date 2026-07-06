import {
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Anuncio, CmsService } from '../../services/cms.service';

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

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cms: CmsService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (sessionStorage.getItem(CLAVE_CERRADO)) return;

    this.cms.getAnuncio().subscribe((anuncio) => {
      if (!anuncio.activo) return;
      this.anuncio = anuncio;
      this.abrir();
    });
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = '';
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

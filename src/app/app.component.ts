import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './pages/header/header.component';
import { FooterComponent } from './pages/footer/footer.component';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'dalias';
  showScrollButton = false;
  whatsappLink = 'https://wa.link/58djkj'; // Enlace por defecto

  private routerSubscription?: Subscription;

  // Mapa de enlaces de WhatsApp por ruta
  private whatsappLinks: { [key: string]: string } = {
    '/': 'https://wa.link/58djkj',
    '/inicio': 'https://wa.link/58djkj',
    '/servicios': 'https://wa.link/thafd4',
    '/servicios/planes-de-estadia': 'https://wa.link/3odmgg',
    '/servicios/planes-de-estadia/residencia-permanente':
      'https://wa.link/db4jzd',
    '/servicios/planes-de-estadia/residencia-temporal':
      'https://wa.link/k3fj0r',
    '/servicios/planes-de-estadia/centro-de-dia': 'https://wa.link/91v3xr',
    '/servicios/planes-de-estadia/residencia-post-operatoria':
      'https://wa.link/smm7ny',
    '/contactanos': 'https://wa.link/gglgal',
  };

  constructor(private router: Router) {}

  ngOnInit() {
    // Establecer el enlace inicial
    this.updateWhatsappLink(this.router.url);

    // Suscribirse a los cambios de ruta
    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updateWhatsappLink(event.urlAfterRedirects);
      });
  }

  ngOnDestroy() {
    // Limpiar la suscripción al destruir el componente
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  // Actualizar el enlace de WhatsApp según la ruta actual
  private updateWhatsappLink(url: string) {
    // Limpiar la URL de parámetros query y fragmentos
    const cleanUrl = url.split('?')[0].split('#')[0];

    // Buscar el enlace correspondiente o usar el por defecto
    this.whatsappLink = this.whatsappLinks[cleanUrl] || this.whatsappLinks['/'];
  }

  // Detectar el scroll para mostrar/ocultar el botón
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showScrollButton = window.pageYOffset > 300;
  }

  // Función para volver al top
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

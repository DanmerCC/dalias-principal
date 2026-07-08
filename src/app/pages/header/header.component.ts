import { Component, HostListener, inject } from '@angular/core';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { CmsService, NavItem } from '../../services/cms.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  private cms = inject(CmsService);

  isFixed = false;
  menuAbierto = false;
  private enHome = false;

  // Inicializado de forma síncrona con los defaults para que SSR renderice un
  // menú completo desde el primer paint (sin parpadeo); el fetch al CMS lo
  // actualiza luego en el cliente. Si el CMS no responde, getNavegacion() ya
  // cae a estos mismos defaults.
  items: NavItem[] = this.cms.NAVEGACION_DEFAULTS;

  constructor(private router: Router) {
    this.cms.getNavegacion().subscribe((items) => (this.items = items));

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const currentRoute = event.urlAfterRedirects;
        this.enHome = currentRoute === '/' || currentRoute === '/inicio';
        this.cerrarMenu();
      });
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

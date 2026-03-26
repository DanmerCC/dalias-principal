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
  whatsappLink = 'https://wa.link/58djkj';
  mostrarLayout = true;

  private routerSubscription?: Subscription;

  private rutasSinLayout: string[] = ['/login', '/portal-residente', '/portal-enfermeria'];

  private whatsappLinks: { [key: string]: string } = {
    '/': 'https://wa.link/58djkj',
    '/inicio': 'https://wa.link/58djkj',
    '/servicios': 'https://wa.link/thafd4',
    '/servicios/planes-de-estadia': 'https://wa.link/3odmgg',
    '/servicios/planes-de-estadia/residencia-permanente': 'https://wa.link/db4jzd',
    '/servicios/planes-de-estadia/residencia-temporal': 'https://wa.link/k3fj0r',
    '/servicios/planes-de-estadia/centro-de-dia': 'https://wa.link/91v3xr',
    '/servicios/planes-de-estadia/residencia-post-operatoria': 'https://wa.link/n2h3xa',
    '/servicios/terapias-y-rehabilitacion': 'https://wa.link/2fwpmn',
    '/contactanos': 'https://wa.link/dbfszi',
  };

  constructor(private router: Router) {}

  ngOnInit() {
    this.updateWhatsappLink(this.router.url);
    this.updateLayout(this.router.url);

    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updateWhatsappLink(event.urlAfterRedirects);
        this.updateLayout(event.urlAfterRedirects);
      });
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private updateLayout(url: string): void {
    const cleanUrl = url.split('?')[0].split('#')[0];
    this.mostrarLayout = !this.rutasSinLayout.includes(cleanUrl);
  }

  private updateWhatsappLink(url: string) {
    const cleanUrl = url.split('?')[0].split('#')[0];
    this.whatsappLink = this.whatsappLinks[cleanUrl] || this.whatsappLinks['/'];
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showScrollButton = window.pageYOffset > 300;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
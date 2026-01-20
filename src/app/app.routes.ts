import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { NosotrosComponent } from './pages/nosotros/nosotros.component';
import { ServiciosComponent } from './pages/servicios/servicios.component';
import { TrabajaConNosotrosComponent } from './pages/trabaja-con-nosotros/trabaja-con-nosotros.component';
import { ContactanosComponent } from './pages/contactanos/contactanos.component';
import { BlogComponent } from './pages/blog/blog.component';
import { ResidenteComponent } from './pages/residente/residente.component';
import { ActividadesComponent } from './pages/actividades/actividades.component';
import { PlanesDeEstadiaComponent } from './pages/servicios/planes-de-estadia/planes-de-estadia.component';

export const routes: Routes = [
  {
    path: 'inicio',
    component: InicioComponent,
  },
  {
    path: 'nosotros',
    component: NosotrosComponent,
  },
  {
    path: 'actividades',
    component: ActividadesComponent,
  },
  {
    path: 'servicios',
    children: [
      {
        path: '',
        component: ServiciosComponent
      },
      {
        path: 'planes-de-estadia',
        component: PlanesDeEstadiaComponent
      }
    ]
  },
  {
    path: 'trabaja-con-nosotros',
    component: TrabajaConNosotrosComponent,
  },
  {
    path: 'contactanos',
    component: ContactanosComponent,
  },
  {
    path: 'blog',
    component: BlogComponent,
  },
  {
    path: 'residente',
    component: ResidenteComponent,
  },
  {
    path: '',
    redirectTo: '/inicio',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/inicio',
  },
];

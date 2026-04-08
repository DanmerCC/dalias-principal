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
import { CentroDeDiaComponent } from './pages/servicios/planes-de-estadia/centro-de-dia/centro-de-dia.component';
import { ResidenciaPermanenteComponent } from './pages/servicios/planes-de-estadia/residencia-permanente/residencia-permanente.component';
import { ResidenciaTemporalComponent } from './pages/servicios/planes-de-estadia/residencia-temporal/residencia-temporal.component';
import { ResidenciaPostOperatoriaComponent } from './pages/servicios/planes-de-estadia/residencia-post-operatoria/residencia-post-operatoria.component';
import { TerapiasYRehabilitacionComponent } from './pages/servicios/terapias-y-rehabilitacion/terapias-y-rehabilitacion.component';
import { LoginComponent } from './pages/login/login.component';
import { PortalResidenteComponent } from './pages/portal-residente/portal-residente.component';
import { PortalEnfermeriaComponent } from './pages/portal-enfermeria/portal-enfermeria.component';
import { PortalDirectorComponent } from './pages/portal-director/portal-director.component';
import { PortalAdministradorComponent } from './pages/portal-administrador/portal-administrador.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'portal-director',
    component: PortalDirectorComponent,
  },
  {
    path: 'portal-administrador',
    component: PortalAdministradorComponent,
  },
  {
    path: 'portal-residente',
    component: PortalResidenteComponent,
  },
  {
    path: 'portal-enfermeria',
    component: PortalEnfermeriaComponent,
  },
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
      { path: '', component: ServiciosComponent },
      {
        path: 'planes-de-estadia',
        children: [
          {
            path: '',
            component: PlanesDeEstadiaComponent,
          },
          {
            path: 'residencia-permanente',
            component: ResidenciaPermanenteComponent,
          },
          {
            path: 'residencia-temporal',
            component: ResidenciaTemporalComponent,
          },
          {
            path: 'centro-de-dia',
            component: CentroDeDiaComponent,
          },
          {
            path: 'residencia-post-operatoria',
            component: ResidenciaPostOperatoriaComponent,
          },
        ],
      },
      {
        path: 'terapias-y-rehabilitacion',
        component: TerapiasYRehabilitacionComponent,
      },
    ],
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

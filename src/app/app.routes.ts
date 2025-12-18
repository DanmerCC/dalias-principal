import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';

export const routes: Routes = [
  {
    path: 'inicio',
    component: InicioComponent
  },
  {
    path: '',
    redirectTo: '/inicio',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/inicio' 
  }
];
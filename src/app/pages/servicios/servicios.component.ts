import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-servicios',
  imports: [RouterLink],
  templateUrl: './servicios.component.html',
  styleUrl: './servicios.component.css'
})
export class ServiciosComponent {
  scrollToServicios() {
    const seccionServicios = document.querySelector('.seccion__servicio');
    if (seccionServicios) {
      seccionServicios.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
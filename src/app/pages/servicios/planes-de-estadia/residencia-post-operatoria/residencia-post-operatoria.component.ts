import { Component } from '@angular/core';

@Component({
  selector: 'app-residencia-post-operatoria',
  imports: [],
  templateUrl: './residencia-post-operatoria.component.html',
  styleUrl: './residencia-post-operatoria.component.css',
})
export class ResidenciaPostOperatoriaComponent {
  scrollToServicios() {
    const seccionServicios = document.getElementById('servicio__estadia');

    if (seccionServicios) {
      const offset = 60;
      const top =
        seccionServicios.getBoundingClientRect().top +
        window.pageYOffset -
        offset;

      window.scrollTo({
        top,
        behavior: 'smooth',
      });
    }
  }
}

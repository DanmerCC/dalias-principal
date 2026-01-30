import { Component } from '@angular/core';

@Component({
  selector: 'app-residencia-temporal',
  imports: [],
  templateUrl: './residencia-temporal.component.html',
  styleUrl: './residencia-temporal.component.css'
})
export class ResidenciaTemporalComponent {
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

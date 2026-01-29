import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgendarVisitaModalComponent } from '../../../../components/agendar-visita-modal/agendar-visita-modal.component';

interface PreguntaFrecuente {
  id: number;
  pregunta: string;
  respuesta: string;
  activo: boolean;
}

@Component({
  selector: 'app-residencia-permanente',
  standalone: true,
  imports: [CommonModule, AgendarVisitaModalComponent],
  templateUrl: './residencia-permanente.component.html',
  styleUrl: './residencia-permanente.component.css',
})
export class ResidenciaPermanenteComponent {
  @ViewChild('modalVisita') modalVisita!: AgendarVisitaModalComponent;

  preguntasFrecuentes: PreguntaFrecuente[] = [
    {
      id: 1,
      pregunta:
        '¿Qué criterios se toman en cuenta antes de aceptar el ingreso de un adulto mayor?',
      respuesta:
        'Previo al ingreso, se revisa información médica, funcional y emocional para asegurar que el entorno y los servicios sean adecuados. Este proceso permite garantizar un cuidado seguro, personalizado y alineado con las capacidades y necesidades del residente.',
      activo: false,
    },
    {
      id: 2,
      pregunta:
        '¿Qué sucede si mi familiar tiene una emergencia médica durante su estadía?',
      respuesta:
        'Todos nuestros planes incluyen la afiliación a un Sistema de Emergencias Médicas domiciliarias con ambulancia para primeros auxilios o traslados inmediatos. Además, contamos con convenios para realizar análisis de laboratorio y rayos X dentro de la misma residencia para evitar traslados innecesarios.',
      activo: false,
    },
    {
      id: 3,
      pregunta:
        '¿Qué nivel de adaptación se considera durante los primeros días de estadía?',
      respuesta:
        'Durante los primeros días se realiza un seguimiento cercano para observar la adaptación del adulto mayor a las rutinas, espacios y actividades. Este periodo permite ajustar horarios, alimentación y acompañamiento, favoreciendo una experiencia progresiva y positiva desde el inicio.',
      activo: false,
    },
    {
      id: 4,
      pregunta:
        '¿Podemos seguir compartiendo momentos especiales en familia como si estuviéramos en casa?',
      respuesta:
        '¡Totalmente! Fomentamos un vínculo familiar inquebrantable ofreciendo horarios de visita amplios y acceso exclusivo a nuestras áreas de piscina y parrilla para reuniones privadas. Queremos que Las Dalias sea una extensión de su hogar, donde los nietos y familiares puedan disfrutar momentos inolvidables en un entorno seguro y acogedor.',
      activo: false,
    },
  ];

  get preguntasColumna1(): PreguntaFrecuente[] {
    return this.preguntasFrecuentes.filter((_, index) => index % 2 === 0);
  }

  get preguntasColumna2(): PreguntaFrecuente[] {
    return this.preguntasFrecuentes.filter((_, index) => index % 2 !== 0);
  }

  togglePregunta(id: number): void {
    this.preguntasFrecuentes = this.preguntasFrecuentes.map((pregunta) => ({
      ...pregunta,
      activo: pregunta.id === id ? !pregunta.activo : pregunta.activo,
    }));
  }

  scrollToContenido() {
    const seccionConfort = document.querySelector('.seccion__experiencia');
    if (seccionConfort) {
      seccionConfort.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
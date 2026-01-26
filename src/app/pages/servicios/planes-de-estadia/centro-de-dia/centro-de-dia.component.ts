import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface ActividadDiaria {
  hora: string;
  titulo: string;
  descripcion: string;
  destacado?: boolean;
}

@Component({
  selector: 'app-centro-de-dia',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './centro-de-dia.component.html',
  styleUrl: './centro-de-dia.component.css',
})
export class CentroDeDiaComponent {
  constructor(private router: Router) {}

  actividadesDiarias: ActividadDiaria[] = [
    {
      hora: '8:30 - 9:00',
      titulo: 'RECEPCIÓN',
      descripcion:
        'Bienvenida personalizada y evaluación del estado general',
      destacado: false,
    },
    {
      hora: '9:00 - 10:00',
      titulo: 'ACTIVIDADES COGNITIVAS',
      descripcion: 'Ejercicios de memoria, lectura y estimulación mental',
      destacado: true,
    },
    {
      hora: '10:00 - 10:30',
      titulo: 'MEDIA MAÑANA',
      descripcion: 'Refrigerio nutritivo y momento de socialización',
      destacado: false,
    },
    {
      hora: '10:30 - 11:00',
      titulo: 'ACTIVIDADES LÚDICAS',
      descripcion: 'Juegos, manualidades y actividades recreativas',
      destacado: false,
    },
    {
      hora: '11:00 - 12:00',
      titulo: 'ACTIVIDADES FÍSICAS',
      descripcion: 'Ejercicios suaves, yoga adaptado y fisioterapia',
      destacado: true,
    },
    {
      hora: '12:00 - 13:00',
      titulo: 'ALMUERZO',
      descripcion: 'Comida balanceada adaptada a necesidades especiales',
      destacado: false,
    },
    {
      hora: '13:00 - 14:00',
      titulo: 'DESCANSO / OCIO',
      descripcion: 'Tiempo de relajación y actividades tranquilas',
      destacado: false,
    },
    {
      hora: '14:00 - 15:00',
      titulo: 'TERAPIA',
      descripcion: 'Terapia ocupacional y seguimiento personalizado',
      destacado: true,
    },
    {
      hora: '15:00 - 16:00',
      titulo: 'ACTIVIDADES FÍSICAS',
      descripcion: 'Segunda sesión de ejercicios y bailoterapia',
      destacado: false,
    },
    {
      hora: '16:00 - 16:30',
      titulo: 'MERIENDA',
      descripcion: 'Refrigerio de la tarde con bebidas nutritivas',
      destacado: false,
    },
    {
      hora: '16:30 - 17:00',
      titulo: 'ACTIVIDADES SOCIALES',
      descripcion: 'Interacción grupal, música y conversaciones',
      destacado: false,
    },
    {
      hora: '17:00',
      titulo: 'DESPEDIDA',
      descripcion: 'Reporte a familiares y preparación para el retorno',
      destacado: false,
    },
  ];
}
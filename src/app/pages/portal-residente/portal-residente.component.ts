import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type SeccionActiva =
  | 'dashboard'
  | 'signos-vitales'
  | 'galeria'
  | 'chat'
  | 'citas'
  | 'historial';

interface SignoVital {
  nombre: string;
  valor: string;
  unidad: string;
  estado: 'normal' | 'atencion' | 'alerta';
  icono: string;
  fecha: string;
}

interface Foto {
  url: string;
  descripcion: string;
  fecha: string;
  tipo: 'foto' | 'video';
}

interface Cita {
  id: number;
  especialidad: string;
  doctor: string;
  fecha: string;
  hora: string;
  completada: boolean;
  icono: string;
}

interface RegistroClinico {
  fecha: string;
  hora: string;
  tipo: string;
  descripcion: string;
  generadoPor: string;
  icono: string;
  origen: 'signo' | 'medicacion' | 'cita';
}

interface MensajeChat {
  id: number;
  autor: 'familia' | 'geriatra';
  nombre: string;
  mensaje: string;
  hora: string;
  fecha: string;
}

@Component({
  selector: 'app-portal-residente',
  imports: [CommonModule, FormsModule],
  templateUrl: './portal-residente.component.html',
  styleUrl: './portal-residente.component.css',
})
export class PortalResidenteComponent {
  seccionActiva: SeccionActiva = 'dashboard';
  sidebarColapsado = false;
  mensajeNuevo = '';
  filtroGaleria: 'todos' | 'foto' | 'video' = 'todos';

  residente = {
    nombre: 'María Elena Sánchez',
    edad: 78,
    habitacion: '204',
    fechaIngreso: '12 Marzo, 2023',
    foto: '/nosotros1.jpg',
    familiar: 'Carlos Sánchez (hijo)',
    medico: 'Dra. Carmen Vásquez',
  };

  signosVitales: SignoVital[] = [
    {
      nombre: 'Presión Arterial',
      valor: '120/80',
      unidad: 'mmHg',
      estado: 'normal',
      icono: 'fa-solid fa-heart-pulse',
      fecha: 'Hoy 08:00 am',
    },
    {
      nombre: 'Frecuencia Cardíaca',
      valor: '72',
      unidad: 'bpm',
      estado: 'normal',
      icono: 'fa-solid fa-heart',
      fecha: 'Hoy 08:00 am',
    },
    {
      nombre: 'Temperatura',
      valor: '36.5',
      unidad: '°C',
      estado: 'normal',
      icono: 'fa-solid fa-temperature-half',
      fecha: 'Hoy 08:00 am',
    },
    {
      nombre: 'Saturación O₂',
      valor: '97',
      unidad: '%',
      estado: 'normal',
      icono: 'fa-solid fa-lungs',
      fecha: 'Hoy 08:00 am',
    },
    {
      nombre: 'Glucosa',
      valor: '105',
      unidad: 'mg/dL',
      estado: 'atencion',
      icono: 'fa-solid fa-droplet',
      fecha: 'Hoy 07:30 am',
    },
    {
      nombre: 'Peso',
      valor: '62',
      unidad: 'kg',
      estado: 'normal',
      icono: 'fa-solid fa-weight-scale',
      fecha: 'Lunes 09:00 am',
    },
  ];

  fotos: Foto[] = [
    {
      url: '/act1-card.jpeg',
      descripcion: 'Club de lectura',
      fecha: '10 Jun, 2024',
      tipo: 'foto',
    },
    {
      url: '/act2-card.jpeg',
      descripcion: 'Taller de pintura',
      fecha: '08 Jun, 2024',
      tipo: 'foto',
    },
    {
      url: '/act3-card.jpeg',
      descripcion: 'Sesión de musicoterapia',
      fecha: '05 Jun, 2024',
      tipo: 'foto',
    },
    {
      url: '/act4-card.jpeg',
      descripcion: 'Ejercicios matutinos',
      fecha: '03 Jun, 2024',
      tipo: 'foto',
    },
    {
      url: '/act5-card.png',
      descripcion: 'Yoga en el jardín',
      fecha: '01 Jun, 2024',
      tipo: 'foto',
    },
    {
      url: '/act6-card.jpeg',
      descripcion: 'Estimulación cognitiva',
      fecha: '28 May, 2024',
      tipo: 'foto',
    },
    {
      url: '/moment1.jpeg',
      descripcion: 'Celebración de cumpleaños',
      fecha: '25 May, 2024',
      tipo: 'video',
    },
    {
      url: '/moment2.jpeg',
      descripcion: 'Fiesta de Navidad',
      fecha: '20 May, 2024',
      tipo: 'video',
    },
  ];

  citas: Cita[] = [
    {
      id: 1,
      especialidad: 'Psicología',
      doctor: 'Lic. Roberto Sánchez',
      fecha: '28 Jun, 2024',
      hora: '03:00 pm',
      completada: false,
      icono: 'fa-solid fa-brain',
    },
    {
      id: 2,
      especialidad: 'Nutrición',
      doctor: 'Lic. Rosa Mendoza',
      fecha: '25 Jun, 2024',
      hora: '11:30 am',
      completada: false,
      icono: 'fa-solid fa-apple-whole',
    },
    {
      id: 3,
      especialidad: 'Geriatría',
      doctor: 'Dra. Carmen Vásquez',
      fecha: '20 Jun, 2024',
      hora: '10:00 am',
      completada: false,
      icono: 'fa-solid fa-user-doctor',
    },
    {
      id: 4,
      especialidad: 'Fisioterapia',
      doctor: 'Lic. Jorge Ramírez',
      fecha: '05 Jun, 2024',
      hora: '09:00 am',
      completada: true,
      icono: 'fa-solid fa-person-walking',
    },
  ];

  historialClinico: RegistroClinico[] = [
    {
      fecha: 'Hoy',
      hora: '08:00 am',
      tipo: 'Signos Vitales Registrados',
      descripcion:
        'Presión 120/80 mmHg · FC 72 bpm · Temp 36.5°C · Sat 97% · Glucosa 105 mg/dL · Peso 62 kg',
      generadoPor: 'Enf. Patricia Morales',
      icono: 'fa-solid fa-heart-pulse',
      origen: 'signo',
    },
    {
      fecha: 'Hoy',
      hora: '08:05 am',
      tipo: 'Medicación Administrada',
      descripcion: 'Enalapril 10mg — 1 tableta administrada correctamente.',
      generadoPor: 'Enf. Patricia Morales',
      icono: 'fa-solid fa-pills',
      origen: 'medicacion',
    },
    {
      fecha: '10 Jun, 2024',
      hora: '10:00 am',
      tipo: 'Cita Completada',
      descripcion:
        'Geriatría con Dra. Carmen Vásquez — Cita realizada correctamente.',
      generadoPor: 'Enf. Patricia Morales',
      icono: 'fa-solid fa-calendar-check',
      origen: 'cita',
    },
    {
      fecha: '05 Jun, 2024',
      hora: '09:00 am',
      tipo: 'Cita Completada',
      descripcion:
        'Fisioterapia con Lic. Jorge Ramírez — Cita realizada correctamente.',
      generadoPor: 'Enf. Rosa Quispe',
      icono: 'fa-solid fa-calendar-check',
      origen: 'cita',
    },
    {
      fecha: '03 Jun, 2024',
      hora: '08:00 am',
      tipo: 'Signos Vitales Registrados',
      descripcion:
        'Presión 118/78 mmHg · FC 70 bpm · Temp 36.4°C · Sat 98% · Glucosa 100 mg/dL · Peso 62 kg',
      generadoPor: 'Enf. Rosa Quispe',
      icono: 'fa-solid fa-heart-pulse',
      origen: 'signo',
    },
  ];

  mensajesChat: MensajeChat[] = [
    {
      id: 1,
      autor: 'geriatra',
      nombre: 'Dra. Carmen Vásquez',
      mensaje:
        'Buenos días familia Sánchez. El control de esta semana fue muy satisfactorio. María Elena está bien.',
      hora: '09:15 am',
      fecha: 'Hoy',
    },
    {
      id: 2,
      autor: 'familia',
      nombre: 'Carlos Sánchez',
      mensaje:
        'Buenos días doctora, muchas gracias por la actualización. ¿Cómo estuvo su presión arterial?',
      hora: '09:32 am',
      fecha: 'Hoy',
    },
    {
      id: 3,
      autor: 'geriatra',
      nombre: 'Dra. Carmen Vásquez',
      mensaje:
        'Muy bien, 120/80. Estable y dentro de los rangos normales. Continuamos con el mismo tratamiento.',
      hora: '09:45 am',
      fecha: 'Hoy',
    },
    {
      id: 4,
      autor: 'familia',
      nombre: 'Carlos Sánchez',
      mensaje: 'Perfecto, gracias doctora. ¿Podemos visitarla este sábado?',
      hora: '10:02 am',
      fecha: 'Hoy',
    },
    {
      id: 5,
      autor: 'geriatra',
      nombre: 'Dra. Carmen Vásquez',
      mensaje:
        'Por supuesto, las visitas son bienvenidas. El horario es de 10am a 6pm. María Elena siempre se alegra mucho.',
      hora: '10:10 am',
      fecha: 'Hoy',
    },
  ];

  get fotasFiltradas(): Foto[] {
    if (this.filtroGaleria === 'todos') return this.fotos;
    return this.fotos.filter((f) => f.tipo === this.filtroGaleria);
  }

  get signosNormales(): number {
    return this.signosVitales.filter((s) => s.estado === 'normal').length;
  }

  get proximaCita(): Cita | undefined {
    return this.citas.find((c) => !c.completada);
  }

  navegarA(seccion: SeccionActiva): void {
    this.seccionActiva = seccion;
  }

  toggleSidebar(): void {
    this.sidebarColapsado = !this.sidebarColapsado;
  }

  enviarMensaje(): void {
    if (!this.mensajeNuevo.trim()) return;
    const nuevoMensaje: MensajeChat = {
      id: this.mensajesChat.length + 1,
      autor: 'familia',
      nombre: 'Carlos Sánchez',
      mensaje: this.mensajeNuevo.trim(),
      hora: new Date().toLocaleTimeString('es-PE', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      fecha: 'Hoy',
    };
    this.mensajesChat.push(nuevoMensaje);
    this.mensajeNuevo = '';
  }

  cerrarSesion(): void {
    // Aquí conectarías con tu servicio de auth
    window.location.href = '/login';
  }
}

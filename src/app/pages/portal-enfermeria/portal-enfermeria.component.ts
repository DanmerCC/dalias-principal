import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type SeccionActiva =
  | 'dashboard'
  | 'residentes'
  | 'signos-vitales'
  | 'medicacion'
  | 'turnos';
type FichaTab =
  | 'signos'
  | 'medicacion'
  | 'citas'
  | 'galeria'
  | 'chat'
  | 'historial';

interface Residente {
  id: number;
  nombre: string;
  edad: number;
  habitacion: string;
  medico: string;
  foto: string;
  estado: 'estable' | 'atencion' | 'critico';
  diagnostico: string;
  fechaIngreso: string;
  familiar: string;
}

interface SignoVital {
  id: number;
  residenteId: number;
  residenteNombre: string;
  habitacion: string;
  presion: string;
  frecuencia: string;
  temperatura: string;
  saturacion: string;
  glucosa: string;
  peso: string;
  fecha: string;
  hora: string;
  registradoPor: string;
}

interface Medicacion {
  id: number;
  residenteId: number;
  medicamento: string;
  dosis: string;
  frecuencia: string;
  hora: string;
  administrado: boolean;
  administradoPor?: string;
  horaAdministrado?: string;
}

interface Cita {
  id: number;
  residenteId: number;
  especialidad: string;
  doctor: string;
  fecha: string;
  hora: string;
  completada: boolean;
  notas?: string;
}

interface FotoGaleria {
  id: number;
  residenteId: number;
  url: string;
  descripcion: string;
  fecha: string;
  tipo: 'foto' | 'video';
  subidoPor: string;
}

interface MensajeChat {
  id: number;
  residenteId: number;
  autor: 'familia' | 'enfermeria';
  nombre: string;
  mensaje: string;
  hora: string;
  fecha: string;
  leido: boolean;
}

interface HistorialClinico {
  id: number;
  residenteId: number;
  tipo: string;
  descripcion: string;
  generadoPor: string;
  fecha: string;
  hora: string;
  icono: string;
  origen: 'signo' | 'medicacion' | 'cita' | 'manual';
}

interface Turno {
  id: number;
  personal: string;
  cargo: string;
  turno: 'mañana' | 'tarde' | 'noche';
  horaInicio: string;
  horaFin: string;
  estado: 'activo' | 'pendiente' | 'completado';
}

@Component({
  selector: 'app-portal-enfermeria',
  imports: [CommonModule, FormsModule],
  templateUrl: './portal-enfermeria.component.html',
  styleUrl: './portal-enfermeria.component.css',
})
export class PortalEnfermeriaComponent {
  seccionActiva: SeccionActiva = 'dashboard';
  sidebarColapsado = false;
  busquedaResidente = '';

  residenteSeleccionado: Residente | null = null;
  fichaTab: FichaTab = 'signos';

  mostrarModalSigno = false;
  mostrarModalMedicacion = false;
  mostrarModalCita = false;
  mostrarModalFoto = false;

  nuevoSigno = {
    presion: '',
    frecuencia: '',
    temperatura: '',
    saturacion: '',
    glucosa: '',
    peso: '',
  };
  nuevaMedicacion = { medicamento: '', dosis: '', frecuencia: '', hora: '' };
  nuevaCita = { especialidad: '', doctor: '', fecha: '', hora: '', notas: '' };
  nuevaFoto = {
    descripcion: '',
    tipo: 'foto' as 'foto' | 'video',
    archivoNombre: '',
    url: '',
  };
  nuevoMensaje = '';

  personal = {
    nombre: 'Lic. Patricia Morales',
    cargo: 'Coordinadora de Enfermería',
    turno: 'Turno Mañana',
    foto: '/nosotros1.jpg',
  };

  residentes: Residente[] = [
    {
      id: 1,
      nombre: 'María Elena Sánchez',
      edad: 78,
      habitacion: '204',
      medico: 'Dra. Carmen Vásquez',
      foto: '/nosotros1.jpg',
      estado: 'estable',
      diagnostico: 'Hipertensión controlada',
      fechaIngreso: '12 Mar, 2023',
      familiar: 'Carlos Sánchez (hijo)',
    },
    {
      id: 2,
      nombre: 'José Antonio Ríos',
      edad: 82,
      habitacion: '105',
      medico: 'Dr. Luis Paredes',
      foto: '/nosotros1.jpg',
      estado: 'atencion',
      diagnostico: 'Diabetes tipo 2',
      fechaIngreso: '05 Ene, 2023',
      familiar: 'Laura Ríos (hija)',
    },
    {
      id: 3,
      nombre: 'Carmen Rosa Delgado',
      edad: 75,
      habitacion: '301',
      medico: 'Dra. Carmen Vásquez',
      foto: '/nosotros1.jpg',
      estado: 'estable',
      diagnostico: '',
      fechaIngreso: '20 Jun, 2023',
      familiar: 'Pedro Delgado (hijo)',
    },
    {
      id: 4,
      nombre: 'Roberto Huanca Flores',
      edad: 85,
      habitacion: '202',
      medico: 'Dr. Luis Paredes',
      foto: '/nosotros1.jpg',
      estado: 'critico',
      diagnostico: 'Insuficiencia cardíaca',
      fechaIngreso: '01 Feb, 2024',
      familiar: 'Ana Huanca (hija)',
    },
    {
      id: 5,
      nombre: 'Ana Lucía Torres',
      edad: 71,
      habitacion: '308',
      medico: 'Dra. Carmen Vásquez',
      foto: '/nosotros1.jpg',
      estado: 'estable',
      diagnostico: 'Post operatorio rodilla',
      fechaIngreso: '15 Abr, 2024',
      familiar: 'Miguel Torres (esposo)',
    },
    {
      id: 6,
      nombre: 'Luis Felipe Mendoza',
      edad: 79,
      habitacion: '110',
      medico: 'Dr. Luis Paredes',
      foto: '/nosotros1.jpg',
      estado: 'atencion',
      diagnostico: 'EPOC moderado',
      fechaIngreso: '08 Mar, 2024',
      familiar: 'Rosa Mendoza (esposa)',
    },
  ];

  signosVitales: SignoVital[] = [
    {
      id: 1,
      residenteId: 1,
      residenteNombre: 'María Elena Sánchez',
      habitacion: '204',
      presion: '120/80',
      frecuencia: '72',
      temperatura: '36.5',
      saturacion: '97',
      glucosa: '105',
      peso: '62',
      fecha: 'Hoy',
      hora: '08:00 am',
      registradoPor: 'Enf. Patricia Morales',
    },
    {
      id: 2,
      residenteId: 2,
      residenteNombre: 'José Antonio Ríos',
      habitacion: '105',
      presion: '135/88',
      frecuencia: '78',
      temperatura: '36.8',
      saturacion: '95',
      glucosa: '145',
      peso: '75',
      fecha: 'Hoy',
      hora: '08:10 am',
      registradoPor: 'Enf. Patricia Morales',
    },
    {
      id: 3,
      residenteId: 3,
      residenteNombre: 'Carmen Rosa Delgado',
      habitacion: '301',
      presion: '118/75',
      frecuencia: '68',
      temperatura: '36.4',
      saturacion: '98',
      glucosa: '98',
      peso: '58',
      fecha: 'Hoy',
      hora: '08:20 am',
      registradoPor: 'Enf. Rosa Quispe',
    },
    {
      id: 4,
      residenteId: 4,
      residenteNombre: 'Roberto Huanca Flores',
      habitacion: '202',
      presion: '160/95',
      frecuencia: '92',
      temperatura: '37.2',
      saturacion: '91',
      glucosa: '120',
      peso: '80',
      fecha: 'Hoy',
      hora: '08:30 am',
      registradoPor: 'Enf. Patricia Morales',
    },
    {
      id: 5,
      residenteId: 5,
      residenteNombre: 'Ana Lucía Torres',
      habitacion: '308',
      presion: '115/70',
      frecuencia: '65',
      temperatura: '36.3',
      saturacion: '99',
      glucosa: '92',
      peso: '65',
      fecha: 'Hoy',
      hora: '08:40 am',
      registradoPor: 'Enf. Rosa Quispe',
    },
    {
      id: 6,
      residenteId: 6,
      residenteNombre: 'Luis Felipe Mendoza',
      habitacion: '110',
      presion: '128/82',
      frecuencia: '85',
      temperatura: '36.9',
      saturacion: '93',
      glucosa: '110',
      peso: '70',
      fecha: 'Hoy',
      hora: '08:50 am',
      registradoPor: 'Enf. Patricia Morales',
    },
  ];

  medicaciones: Medicacion[] = [
    {
      id: 1,
      residenteId: 1,
      medicamento: 'Enalapril 10mg',
      dosis: '1 tableta',
      frecuencia: 'Cada 12h',
      hora: '08:00 am',
      administrado: true,
      administradoPor: 'Enf. Patricia Morales',
      horaAdministrado: '08:05 am',
    },
    {
      id: 2,
      residenteId: 2,
      medicamento: 'Metformina 850mg',
      dosis: '1 tableta',
      frecuencia: 'Con desayuno',
      hora: '08:00 am',
      administrado: true,
      administradoPor: 'Enf. Patricia Morales',
      horaAdministrado: '08:07 am',
    },
    {
      id: 3,
      residenteId: 4,
      medicamento: 'Furosemida 40mg',
      dosis: '1 tableta',
      frecuencia: 'Cada 24h',
      hora: '09:00 am',
      administrado: false,
    },
    {
      id: 4,
      residenteId: 3,
      medicamento: 'Ibuprofeno 400mg',
      dosis: '1 tableta',
      frecuencia: 'Cada 8h',
      hora: '10:00 am',
      administrado: false,
    },
    {
      id: 5,
      residenteId: 6,
      medicamento: 'Salbutamol inhalador',
      dosis: '2 puffs',
      frecuencia: 'Cada 6h',
      hora: '10:00 am',
      administrado: false,
    },
    {
      id: 6,
      residenteId: 5,
      medicamento: 'Ibuprofeno 400mg',
      dosis: '1 tableta',
      frecuencia: 'Cada 8h',
      hora: '12:00 pm',
      administrado: false,
    },
  ];

  citas: Cita[] = [
    {
      id: 1,
      residenteId: 1,
      especialidad: 'Geriatría',
      doctor: 'Dra. Carmen Vásquez',
      fecha: '20 Jun, 2024',
      hora: '10:00 am',
      completada: false,
    },
    {
      id: 2,
      residenteId: 2,
      especialidad: 'Nutrición',
      doctor: 'Lic. Rosa Mendoza',
      fecha: '25 Jun, 2024',
      hora: '11:30 am',
      completada: false,
    },
    {
      id: 3,
      residenteId: 3,
      especialidad: 'Fisioterapia',
      doctor: 'Lic. Jorge Ramírez',
      fecha: '05 Jun, 2024',
      hora: '09:00 am',
      completada: true,
    },
    {
      id: 4,
      residenteId: 4,
      especialidad: 'Cardiología',
      doctor: 'Dr. Luis Paredes',
      fecha: '18 Jun, 2024',
      hora: '08:00 am',
      completada: false,
    },
    {
      id: 5,
      residenteId: 5,
      especialidad: 'Traumatología',
      doctor: 'Dr. Raúl Torres',
      fecha: '22 Jun, 2024',
      hora: '02:00 pm',
      completada: false,
    },
    {
      id: 6,
      residenteId: 6,
      especialidad: 'Neumología',
      doctor: 'Dra. Sandra Cruz',
      fecha: '28 Jun, 2024',
      hora: '03:00 pm',
      completada: false,
    },
  ];

  galeria: FotoGaleria[] = [
    {
      id: 1,
      residenteId: 1,
      url: '/act1-card.jpeg',
      descripcion: 'Club de lectura',
      fecha: '10 Jun, 2024',
      tipo: 'foto',
      subidoPor: 'Enf. Patricia Morales',
    },
    {
      id: 2,
      residenteId: 1,
      url: '/act2-card.jpeg',
      descripcion: 'Taller de pintura',
      fecha: '08 Jun, 2024',
      tipo: 'foto',
      subidoPor: 'Enf. Rosa Quispe',
    },
    {
      id: 3,
      residenteId: 2,
      url: '/act3-card.jpeg',
      descripcion: 'Musicoterapia',
      fecha: '05 Jun, 2024',
      tipo: 'foto',
      subidoPor: 'Enf. Patricia Morales',
    },
    {
      id: 4,
      residenteId: 3,
      url: '/act4-card.jpeg',
      descripcion: 'Ejercicios matutinos',
      fecha: '03 Jun, 2024',
      tipo: 'foto',
      subidoPor: 'Enf. Rosa Quispe',
    },
    {
      id: 5,
      residenteId: 4,
      url: '/act5-card.png',
      descripcion: 'Yoga en jardín',
      fecha: '01 Jun, 2024',
      tipo: 'foto',
      subidoPor: 'Enf. Patricia Morales',
    },
    {
      id: 6,
      residenteId: 5,
      url: '/act6-card.jpeg',
      descripcion: 'Estimulación cognitiva',
      fecha: '28 May, 2024',
      tipo: 'foto',
      subidoPor: 'Enf. Rosa Quispe',
    },
    {
      id: 7,
      residenteId: 1,
      url: '/moment1.jpeg',
      descripcion: 'Cumpleaños',
      fecha: '25 May, 2024',
      tipo: 'video',
      subidoPor: 'Enf. Patricia Morales',
    },
    {
      id: 8,
      residenteId: 2,
      url: '/moment2.jpeg',
      descripcion: 'Navidad',
      fecha: '20 May, 2024',
      tipo: 'video',
      subidoPor: 'Enf. Rosa Quispe',
    },
  ];

  mensajesChat: MensajeChat[] = [
    {
      id: 1,
      residenteId: 1,
      autor: 'enfermeria',
      nombre: 'Enf. Patricia Morales',
      mensaje:
        'Buenos días familia Sánchez. El control de esta semana fue muy satisfactorio.',
      hora: '09:15 am',
      fecha: 'Hoy',
      leido: true,
    },
    {
      id: 2,
      residenteId: 1,
      autor: 'familia',
      nombre: 'Carlos Sánchez',
      mensaje: '¿Cómo estuvo su presión arterial?',
      hora: '09:32 am',
      fecha: 'Hoy',
      leido: true,
    },
    {
      id: 3,
      residenteId: 1,
      autor: 'familia',
      nombre: 'Carlos Sánchez',
      mensaje: '¿Podremos visitarla este sábado?',
      hora: '10:05 am',
      fecha: 'Hoy',
      leido: false,
    },
    {
      id: 4,
      residenteId: 2,
      autor: 'familia',
      nombre: 'Laura Ríos',
      mensaje: '¿Cómo está mi papá hoy?',
      hora: '10:00 am',
      fecha: 'Hoy',
      leido: false,
    },
    {
      id: 5,
      residenteId: 2,
      autor: 'enfermeria',
      nombre: 'Enf. Patricia Morales',
      mensaje: 'Buenos días Laura. Su papá está estable.',
      hora: '10:15 am',
      fecha: 'Hoy',
      leido: true,
    },
  ];

  historialClinico: HistorialClinico[] = [
    {
      id: 1,
      residenteId: 1,
      tipo: 'Signos Vitales Registrados',
      descripcion:
        'Presión 120/80 mmHg · FC 72 bpm · Temp 36.5°C · Sat 97% · Glucosa 105 mg/dL · Peso 62 kg',
      generadoPor: 'Enf. Patricia Morales',
      fecha: 'Hoy',
      hora: '08:00 am',
      icono: 'fa-solid fa-heart-pulse',
      origen: 'signo',
    },
    {
      id: 2,
      residenteId: 1,
      tipo: 'Medicación Administrada',
      descripcion: 'Enalapril 10mg — 1 tableta administrada correctamente.',
      generadoPor: 'Enf. Patricia Morales',
      fecha: 'Hoy',
      hora: '08:05 am',
      icono: 'fa-solid fa-pills',
      origen: 'medicacion',
    },
    {
      id: 3,
      residenteId: 2,
      tipo: 'Signos Vitales Registrados',
      descripcion:
        'Presión 135/88 mmHg · FC 78 bpm · Temp 36.8°C · Sat 95% · Glucosa 145 mg/dL · Peso 75 kg',
      generadoPor: 'Enf. Patricia Morales',
      fecha: 'Hoy',
      hora: '08:10 am',
      icono: 'fa-solid fa-heart-pulse',
      origen: 'signo',
    },
    {
      id: 4,
      residenteId: 3,
      tipo: 'Cita Completada',
      descripcion:
        'Fisioterapia con Lic. Jorge Ramírez — Cita realizada el 05 Jun, 2024 a las 09:00 am.',
      generadoPor: 'Enf. Rosa Quispe',
      fecha: '05 Jun, 2024',
      hora: '09:00 am',
      icono: 'fa-solid fa-calendar-check',
      origen: 'cita',
    },
    {
      id: 5,
      residenteId: 4,
      tipo: 'Signos Vitales Registrados',
      descripcion:
        'Presión 160/95 mmHg · FC 92 bpm · Temp 37.2°C · Sat 91% · Glucosa 120 mg/dL · Peso 80 kg',
      generadoPor: 'Enf. Patricia Morales',
      fecha: 'Hoy',
      hora: '08:30 am',
      icono: 'fa-solid fa-heart-pulse',
      origen: 'signo',
    },
  ];

  turnos: Turno[] = [
    {
      id: 1,
      personal: 'Lic. Patricia Morales',
      cargo: 'Coordinadora',
      turno: 'mañana',
      horaInicio: '07:00',
      horaFin: '15:00',
      estado: 'activo',
    },
    {
      id: 2,
      personal: 'Enf. Rosa Quispe',
      cargo: 'Enfermera',
      turno: 'mañana',
      horaInicio: '07:00',
      horaFin: '15:00',
      estado: 'activo',
    },
    {
      id: 3,
      personal: 'Enf. Carlos Vega',
      cargo: 'Enfermero',
      turno: 'tarde',
      horaInicio: '15:00',
      horaFin: '23:00',
      estado: 'pendiente',
    },
    {
      id: 4,
      personal: 'Enf. María Campos',
      cargo: 'Enfermera',
      turno: 'tarde',
      horaInicio: '15:00',
      horaFin: '23:00',
      estado: 'pendiente',
    },
    {
      id: 5,
      personal: 'Enf. Jorge Ruiz',
      cargo: 'Enfermero',
      turno: 'noche',
      horaInicio: '23:00',
      horaFin: '07:00',
      estado: 'pendiente',
    },
    {
      id: 6,
      personal: 'Enf. Ana Flores',
      cargo: 'Enfermera',
      turno: 'noche',
      horaInicio: '23:00',
      horaFin: '07:00',
      estado: 'pendiente',
    },
  ];

  private get ahora(): string {
    return new Date().toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  private agregarHistorial(entrada: Omit<HistorialClinico, 'id'>): void {
    this.historialClinico.unshift({
      id: this.historialClinico.length + 1,
      ...entrada,
    });
  }

  // ---- Getters ----
  get residentesFiltrados(): Residente[] {
    if (!this.busquedaResidente.trim()) return this.residentes;
    const q = this.busquedaResidente.toLowerCase();
    return this.residentes.filter(
      (r) =>
        r.nombre.toLowerCase().includes(q) ||
        r.habitacion.includes(q) ||
        r.diagnostico.toLowerCase().includes(q),
    );
  }

  get totalEstables(): number {
    return this.residentes.filter((r) => r.estado === 'estable').length;
  }
  get totalAtencion(): number {
    return this.residentes.filter((r) => r.estado === 'atencion').length;
  }
  get totalCriticos(): number {
    return this.residentes.filter((r) => r.estado === 'critico').length;
  }
  get totalMedicacionPendiente(): number {
    return this.medicaciones.filter((m) => !m.administrado).length;
  }

  get medicacionesDashboard(): Medicacion[] {
    return this.medicaciones.slice(0, 5);
  }

  get residentsConMensajesNoLeidos(): Residente[] {
    return this.residentes.filter((r) => this.mensajesNoLeidosDe(r.id) > 0);
  }

  get totalMensajesNoLeidos(): number {
    return this.mensajesChat.filter((m) => m.autor === 'familia' && !m.leido)
      .length;
  }

  mensajesNoLeidosDe(residenteId: number): number {
    return this.mensajesChat.filter(
      (m) => m.residenteId === residenteId && m.autor === 'familia' && !m.leido,
    ).length;
  }

  ultimoMensajeDe(residenteId: number): MensajeChat | undefined {
    const msgs = this.mensajesChat.filter((m) => m.residenteId === residenteId);
    return msgs[msgs.length - 1];
  }

  signosDe(id: number): SignoVital[] {
    return this.signosVitales.filter((s) => s.residenteId === id);
  }
  medicacionDe(id: number): Medicacion[] {
    return this.medicaciones.filter((m) => m.residenteId === id);
  }
  citasDe(id: number): Cita[] {
    return this.citas.filter((c) => c.residenteId === id);
  }
  galeriaDe(id: number): FotoGaleria[] {
    return this.galeria.filter((f) => f.residenteId === id);
  }
  chatDe(id: number): MensajeChat[] {
    return this.mensajesChat.filter((m) => m.residenteId === id);
  }
  historialDe(id: number): HistorialClinico[] {
    return this.historialClinico.filter((h) => h.residenteId === id);
  }

  nombreResidente(id: number): string {
    return this.residentes.find((r) => r.id === id)?.nombre || '—';
  }
  habitacionResidente(id: number): string {
    return this.residentes.find((r) => r.id === id)?.habitacion || '—';
  }

  // ---- Navegación ----
  navegarA(seccion: SeccionActiva): void {
    this.seccionActiva = seccion;
    this.residenteSeleccionado = null;
  }

  toggleSidebar(): void {
    this.sidebarColapsado = !this.sidebarColapsado;
  }

  abrirFicha(residente: Residente): void {
    this.residenteSeleccionado = residente;
    this.fichaTab = 'signos';
  }

  cerrarFicha(): void {
    this.residenteSeleccionado = null;
  }

  abrirChatResidente(residente: Residente): void {
    this.seccionActiva = 'residentes';
    this.residenteSeleccionado = residente;
    this.fichaTab = 'chat';
    this.marcarChatLeido(residente.id);
  }

  // ---- Signos vitales ----
  guardarSigno(): void {
    if (!this.residenteSeleccionado) return;
    const horaActual = this.ahora;
    const nuevo: SignoVital = {
      id: this.signosVitales.length + 1,
      residenteId: this.residenteSeleccionado.id,
      residenteNombre: this.residenteSeleccionado.nombre,
      habitacion: this.residenteSeleccionado.habitacion,
      ...this.nuevoSigno,
      fecha: 'Hoy',
      hora: horaActual,
      registradoPor: this.personal.nombre,
    };
    this.signosVitales.unshift(nuevo);

    this.agregarHistorial({
      residenteId: this.residenteSeleccionado.id,
      tipo: 'Signos Vitales Registrados',
      descripcion: `Presión ${nuevo.presion} mmHg · FC ${nuevo.frecuencia} bpm · Temp ${nuevo.temperatura}°C · Sat ${nuevo.saturacion}% · Glucosa ${nuevo.glucosa} mg/dL · Peso ${nuevo.peso} kg`,
      generadoPor: this.personal.nombre,
      fecha: 'Hoy',
      hora: horaActual,
      icono: 'fa-solid fa-heart-pulse',
      origen: 'signo',
    });

    this.nuevoSigno = {
      presion: '',
      frecuencia: '',
      temperatura: '',
      saturacion: '',
      glucosa: '',
      peso: '',
    };
    this.mostrarModalSigno = false;
  }

  // ---- Medicación ----
  guardarMedicacion(): void {
    if (!this.residenteSeleccionado) return;
    const nuevo: Medicacion = {
      id: this.medicaciones.length + 1,
      residenteId: this.residenteSeleccionado.id,
      ...this.nuevaMedicacion,
      administrado: false,
    };
    this.medicaciones.push(nuevo);
    this.nuevaMedicacion = {
      medicamento: '',
      dosis: '',
      frecuencia: '',
      hora: '',
    };
    this.mostrarModalMedicacion = false;
  }

  marcarAdministrado(med: Medicacion): void {
    const horaActual = this.ahora;
    med.administrado = true;
    med.administradoPor = this.personal.nombre;
    med.horaAdministrado = horaActual;

    const residente = this.residentes.find((r) => r.id === med.residenteId);
    if (residente) {
      this.agregarHistorial({
        residenteId: med.residenteId,
        tipo: 'Medicación Administrada',
        descripcion: `${med.medicamento} — ${med.dosis} administrado correctamente.`,
        generadoPor: this.personal.nombre,
        fecha: 'Hoy',
        hora: horaActual,
        icono: 'fa-solid fa-pills',
        origen: 'medicacion',
      });
    }
  }

  // ---- Citas ----
  guardarCita(): void {
    if (!this.residenteSeleccionado) return;
    const nueva: Cita = {
      id: this.citas.length + 1,
      residenteId: this.residenteSeleccionado.id,
      ...this.nuevaCita,
      completada: false,
    };
    this.citas.push(nueva);
    this.nuevaCita = {
      especialidad: '',
      doctor: '',
      fecha: '',
      hora: '',
      notas: '',
    };
    this.mostrarModalCita = false;
  }

  completarCita(cita: Cita): void {
    cita.completada = true;
    this.agregarHistorial({
      residenteId: cita.residenteId,
      tipo: 'Cita Completada',
      descripcion: `${cita.especialidad} con ${cita.doctor} — Cita realizada el ${cita.fecha} a las ${cita.hora}.`,
      generadoPor: this.personal.nombre,
      fecha: 'Hoy',
      hora: this.ahora,
      icono: 'fa-solid fa-calendar-check',
      origen: 'cita',
    });
  }

  // ---- Galería ----
  onArchivoSeleccionado(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.nuevaFoto.archivoNombre = file.name;
      this.nuevaFoto.tipo = file.type.startsWith('video') ? 'video' : 'foto';
      this.nuevaFoto.url = URL.createObjectURL(file);
    }
  }

  guardarFoto(): void {
    if (!this.residenteSeleccionado || !this.nuevaFoto.url) return;
    const nueva: FotoGaleria = {
      id: this.galeria.length + 1,
      residenteId: this.residenteSeleccionado.id,
      url: this.nuevaFoto.url,
      descripcion: this.nuevaFoto.descripcion,
      tipo: this.nuevaFoto.tipo,
      fecha: new Date().toLocaleDateString('es-PE', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      subidoPor: this.personal.nombre,
    };
    this.galeria.unshift(nueva);
    this.nuevaFoto = {
      descripcion: '',
      tipo: 'foto',
      archivoNombre: '',
      url: '',
    };
    this.mostrarModalFoto = false;
  }

  // ---- Chat ----
  enviarMensaje(): void {
    if (!this.nuevoMensaje.trim() || !this.residenteSeleccionado) return;
    const nuevo: MensajeChat = {
      id: this.mensajesChat.length + 1,
      residenteId: this.residenteSeleccionado.id,
      autor: 'enfermeria',
      nombre: this.personal.nombre,
      mensaje: this.nuevoMensaje.trim(),
      hora: this.ahora,
      fecha: 'Hoy',
      leido: true,
    };
    this.mensajesChat.push(nuevo);
    this.nuevoMensaje = '';
  }

  marcarChatLeido(residenteId: number): void {
    this.mensajesChat
      .filter((m) => m.residenteId === residenteId && m.autor === 'familia')
      .forEach((m) => (m.leido = true));
  }

  cerrarSesion(): void {
    window.location.href = '/login';
  }
}

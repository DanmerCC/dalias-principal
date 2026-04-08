import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type SeccionActiva =
  | 'dashboard'
  | 'residentes'
  | 'personal'
  | 'finanzas'
  | 'reportes'
  | 'configuracion';

interface KpiCard {
  label: string;
  valor: string | number;
  icono: string;
  color: 'azul' | 'verde' | 'dorado' | 'rojo' | 'morado';
  tendencia?: string;
  tendenciaPositiva?: boolean;
}

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
  planPago: string;
}

interface Personal {
  id: number;
  nombre: string;
  cargo: string;
  rol: string;
  turno: string;
  telefono: string;
  estado: 'activo' | 'inactivo' | 'vacaciones';
  fechaIngreso: string;
}

interface MovimientoFinanciero {
  id: number;
  concepto: string;
  tipo: 'ingreso' | 'egreso';
  monto: number;
  fecha: string;
  categoria: string;
}

interface AlertaDirector {
  id: number;
  tipo: 'critico' | 'advertencia' | 'info';
  titulo: string;
  descripcion: string;
  hora: string;
  icono: string;
}

@Component({
  selector: 'app-portal-director',
  imports: [CommonModule, FormsModule],
  templateUrl: './portal-director.component.html',
  styleUrl: './portal-director.component.css',
})
export class PortalDirectorComponent {
  seccionActiva: SeccionActiva = 'dashboard';
  sidebarColapsado = false;
  busquedaResidente = '';
  busquedaPersonal = '';
  filtroEstadoPersonal: string = 'todos';

  director = {
    nombre: 'Dr. Alejandro Medina',
    cargo: 'Director General',
    foto: '/nosotros1.jpg',
  };

  kpis: KpiCard[] = [
    {
      label: 'Total Residentes',
      valor: 42,
      icono: 'fa-solid fa-bed-pulse',
      color: 'azul',
      tendencia: '+3 este mes',
      tendenciaPositiva: true,
    },
    {
      label: 'Ocupación',
      valor: '87%',
      icono: 'fa-solid fa-building',
      color: 'verde',
      tendencia: '+5% vs mes anterior',
      tendenciaPositiva: true,
    },
    {
      label: 'Ingresos del Mes',
      valor: 'S/ 148,500',
      icono: 'fa-solid fa-sack-dollar',
      color: 'dorado',
      tendencia: '+12% vs mes anterior',
      tendenciaPositiva: true,
    },
    {
      label: 'Egresos del Mes',
      valor: 'S/ 89,200',
      icono: 'fa-solid fa-file-invoice',
      color: 'rojo',
      tendencia: '-3% vs mes anterior',
      tendenciaPositiva: true,
    },
    {
      label: 'Personal Activo',
      valor: 28,
      icono: 'fa-solid fa-users',
      color: 'morado',
      tendencia: '2 de vacaciones',
      tendenciaPositiva: true,
    },
    {
      label: 'Pacientes Críticos',
      valor: 3,
      icono: 'fa-solid fa-circle-exclamation',
      color: 'rojo',
      tendencia: '-1 vs ayer',
      tendenciaPositiva: true,
    },
    {
      label: 'Satisfacción Familiar',
      valor: '94%',
      icono: 'fa-solid fa-star',
      color: 'dorado',
      tendencia: '+2% este mes',
      tendenciaPositiva: true,
    },
    {
      label: 'Utilidad Neta',
      valor: 'S/ 59,300',
      icono: 'fa-solid fa-chart-line',
      color: 'verde',
      tendencia: '+18% vs mes anterior',
      tendenciaPositiva: true,
    },
  ];

  reportes = [
    { titulo: 'Reporte Clínico Mensual', desc: 'Resumen de signos vitales, medicación y citas del mes.', icono: 'fa-solid fa-file-medical', periodo: 'Junio 2024', color: 'azul' },
    { titulo: 'Reporte Financiero', desc: 'Ingresos, egresos y utilidad neta del período.', icono: 'fa-solid fa-file-invoice-dollar', periodo: 'Junio 2024', color: 'dorado' },
    { titulo: 'Reporte de Personal', desc: 'Asistencia, turnos y evaluaciones del equipo.', icono: 'fa-solid fa-file-contract', periodo: 'Junio 2024', color: 'morado' },
    { titulo: 'Reporte de Ocupación', desc: 'Estadísticas de ocupación y disponibilidad de habitaciones.', icono: 'fa-solid fa-building', periodo: 'Junio 2024', color: 'verde' },
    { titulo: 'Reporte de Incidentes', desc: 'Registro de eventos adversos y protocolos activados.', icono: 'fa-solid fa-triangle-exclamation', periodo: 'Junio 2024', color: 'rojo' },
    { titulo: 'Encuesta de Satisfacción', desc: 'Resultados de encuestas a familias de residentes.', icono: 'fa-solid fa-star', periodo: 'Junio 2024', color: 'dorado' },
  ];

  notificaciones = [
    { titulo: 'Alertas críticas por email', desc: 'Recibir notificaciones de pacientes críticos', activo: true },
    { titulo: 'Reporte diario automático', desc: 'Envío automático del resumen diario', activo: true },
    { titulo: 'Alertas de medicación', desc: 'Notificar medicación pendiente', activo: false },
  ];

  planes = [
    { nombre: 'Plan Estándar', precio: 'S/ 3,500/mes', detalle: '15 residentes', color: 'azul' },
    { nombre: 'Plan Premium', precio: 'S/ 5,200/mes', detalle: '20 residentes', color: 'dorado' },
    { nombre: 'Plan VIP', precio: 'S/ 7,800/mes', detalle: '7 residentes', color: 'morado' },
  ];

  get margenNeto(): string {
    return ((this.utilidadNeta / this.totalIngresos) * 100).toFixed(1);
  }
  alertas: AlertaDirector[] = [
    {
      id: 1,
      tipo: 'critico',
      titulo: 'Paciente en estado crítico',
      descripcion: 'Roberto Huanca Flores (Hab. 202) — Presión elevada 160/95 mmHg. Requiere atención inmediata.',
      hora: 'Hace 15 min',
      icono: 'fa-solid fa-circle-exclamation',
    },
    {
      id: 2,
      tipo: 'advertencia',
      titulo: 'Medicación pendiente',
      descripcion: '4 medicamentos sin administrar en turno mañana. Revisar con enfermería.',
      hora: 'Hace 32 min',
      icono: 'fa-solid fa-pills',
    },
    {
      id: 3,
      tipo: 'info',
      titulo: 'Nuevo residente ingresado',
      descripcion: 'Ingreso de nuevo residente programado para el día de hoy. Habitación 310 disponible.',
      hora: 'Hace 1h',
      icono: 'fa-solid fa-bed-pulse',
    },
    {
      id: 4,
      tipo: 'advertencia',
      titulo: 'Renovación de contrato pendiente',
      descripcion: 'Contrato de Enf. Carlos Vega vence en 15 días. Gestionar renovación.',
      hora: 'Hace 2h',
      icono: 'fa-solid fa-file-contract',
    },
    {
      id: 5,
      tipo: 'info',
      titulo: 'Reporte mensual disponible',
      descripcion: 'El reporte de junio 2024 está listo para su revisión en la sección de Reportes.',
      hora: 'Hace 3h',
      icono: 'fa-solid fa-chart-bar',
    },
  ];

  residentes: Residente[] = [
    { id: 1, nombre: 'María Elena Sánchez', edad: 78, habitacion: '204', medico: 'Dra. Carmen Vásquez', foto: '/nosotros1.jpg', estado: 'estable', diagnostico: 'Hipertensión controlada', fechaIngreso: '12 Mar, 2023', familiar: 'Carlos Sánchez (hijo)', planPago: 'Plan Premium' },
    { id: 2, nombre: 'José Antonio Ríos', edad: 82, habitacion: '105', medico: 'Dr. Luis Paredes', foto: '/nosotros1.jpg', estado: 'atencion', diagnostico: 'Diabetes tipo 2', fechaIngreso: '05 Ene, 2023', familiar: 'Laura Ríos (hija)', planPago: 'Plan Estándar' },
    { id: 3, nombre: 'Carmen Rosa Delgado', edad: 75, habitacion: '301', medico: 'Dra. Carmen Vásquez', foto: '/nosotros1.jpg', estado: 'estable', diagnostico: '', fechaIngreso: '20 Jun, 2023', familiar: 'Pedro Delgado (hijo)', planPago: 'Plan Premium' },
    { id: 4, nombre: 'Roberto Huanca Flores', edad: 85, habitacion: '202', medico: 'Dr. Luis Paredes', foto: '/nosotros1.jpg', estado: 'critico', diagnostico: 'Insuficiencia cardíaca', fechaIngreso: '01 Feb, 2024', familiar: 'Ana Huanca (hija)', planPago: 'Plan Estándar' },
    { id: 5, nombre: 'Ana Lucía Torres', edad: 71, habitacion: '308', medico: 'Dra. Carmen Vásquez', foto: '/nosotros1.jpg', estado: 'estable', diagnostico: 'Post operatorio rodilla', fechaIngreso: '15 Abr, 2024', familiar: 'Miguel Torres (esposo)', planPago: 'Plan VIP' },
    { id: 6, nombre: 'Luis Felipe Mendoza', edad: 79, habitacion: '110', medico: 'Dr. Luis Paredes', foto: '/nosotros1.jpg', estado: 'atencion', diagnostico: 'EPOC moderado', fechaIngreso: '08 Mar, 2024', familiar: 'Rosa Mendoza (esposa)', planPago: 'Plan Estándar' },
  ];

  personal: Personal[] = [
    { id: 1, nombre: 'Dra. Carmen Vásquez', cargo: 'Médico Geriatra', rol: 'Médico Geriatra', turno: 'Mañana', telefono: '987-654-321', estado: 'activo', fechaIngreso: '10 Ene, 2020' },
    { id: 2, nombre: 'Dr. Luis Paredes', cargo: 'Médico Geriatra', rol: 'Médico Geriatra', turno: 'Tarde', telefono: '987-654-322', estado: 'activo', fechaIngreso: '15 Mar, 2020' },
    { id: 3, nombre: 'Lic. Patricia Morales', cargo: 'Coordinadora de Enfermería', rol: 'Jefa de Turno', turno: 'Mañana', telefono: '987-654-323', estado: 'activo', fechaIngreso: '01 Jun, 2019' },
    { id: 4, nombre: 'Enf. Rosa Quispe', cargo: 'Enfermera', rol: 'Enfermero/a', turno: 'Mañana', telefono: '987-654-324', estado: 'activo', fechaIngreso: '20 Ago, 2021' },
    { id: 5, nombre: 'Enf. Carlos Vega', cargo: 'Enfermero', rol: 'Enfermero/a', turno: 'Tarde', telefono: '987-654-325', estado: 'activo', fechaIngreso: '05 Feb, 2022' },
    { id: 6, nombre: 'Enf. María Campos', cargo: 'Enfermera', rol: 'Enfermero/a', turno: 'Tarde', telefono: '987-654-326', estado: 'vacaciones', fechaIngreso: '12 Nov, 2021' },
    { id: 7, nombre: 'Enf. Jorge Ruiz', cargo: 'Enfermero', rol: 'Enfermero/a', turno: 'Noche', telefono: '987-654-327', estado: 'activo', fechaIngreso: '03 Mar, 2023' },
    { id: 8, nombre: 'Lic. Jorge Ramírez', cargo: 'Fisioterapeuta', rol: 'Fisioterapeuta', turno: 'Mañana', telefono: '987-654-328', estado: 'activo', fechaIngreso: '18 Jul, 2021' },
    { id: 9, nombre: 'Lic. Roberto Sánchez', cargo: 'Psicólogo', rol: 'Cuidador', turno: 'Mañana', telefono: '987-654-329', estado: 'activo', fechaIngreso: '22 Oct, 2022' },
  ];

  movimientos: MovimientoFinanciero[] = [
    { id: 1, concepto: 'Cuotas residentes - Plan Premium', tipo: 'ingreso', monto: 62000, fecha: 'Jun 2024', categoria: 'Cuotas' },
    { id: 2, concepto: 'Cuotas residentes - Plan Estándar', tipo: 'ingreso', monto: 48500, fecha: 'Jun 2024', categoria: 'Cuotas' },
    { id: 3, nombre: 'Servicios médicos adicionales', tipo: 'ingreso', monto: 18000, fecha: 'Jun 2024', categoria: 'Servicios', concepto: 'Servicios médicos adicionales' } as any,
    { id: 4, concepto: 'Planilla de personal', tipo: 'egreso', monto: 52000, fecha: 'Jun 2024', categoria: 'Planilla' },
    { id: 5, concepto: 'Medicamentos e insumos', tipo: 'egreso', monto: 18500, fecha: 'Jun 2024', categoria: 'Insumos' },
    { id: 6, concepto: 'Servicios (agua, luz, gas)', tipo: 'egreso', monto: 8200, fecha: 'Jun 2024', categoria: 'Servicios' },
    { id: 7, concepto: 'Alimentación y nutrición', tipo: 'egreso', monto: 10500, fecha: 'Jun 2024', categoria: 'Alimentación' },
    { id: 8, concepto: 'Mantenimiento instalaciones', tipo: 'egreso', monto: 3200, fecha: 'Jun 2024', categoria: 'Mantenimiento' },
  ];

  get residentesFiltrados(): Residente[] {
    if (!this.busquedaResidente.trim()) return this.residentes;
    const q = this.busquedaResidente.toLowerCase();
    return this.residentes.filter(r =>
      r.nombre.toLowerCase().includes(q) ||
      r.habitacion.includes(q) ||
      r.estado.includes(q)
    );
  }

  get personalFiltrado(): Personal[] {
    let lista = this.personal;
    if (this.filtroEstadoPersonal !== 'todos') {
      lista = lista.filter(p => p.estado === this.filtroEstadoPersonal);
    }
    if (this.busquedaPersonal.trim()) {
      const q = this.busquedaPersonal.toLowerCase();
      lista = lista.filter(p =>
        p.nombre.toLowerCase().includes(q) ||
        p.cargo.toLowerCase().includes(q)
      );
    }
    return lista;
  }

  get totalIngresos(): number {
    return this.movimientos.filter(m => m.tipo === 'ingreso').reduce((a, b) => a + b.monto, 0);
  }

  get totalEgresos(): number {
    return this.movimientos.filter(m => m.tipo === 'egreso').reduce((a, b) => a + b.monto, 0);
  }

  get utilidadNeta(): number {
    return this.totalIngresos - this.totalEgresos;
  }

  get totalEstables(): number { return this.residentes.filter(r => r.estado === 'estable').length; }
  get totalAtencion(): number { return this.residentes.filter(r => r.estado === 'atencion').length; }
  get totalCriticos(): number { return this.residentes.filter(r => r.estado === 'critico').length; }
  get alertasCriticas(): AlertaDirector[] { return this.alertas.filter(a => a.tipo === 'critico'); }

  navegarA(seccion: SeccionActiva): void {
    this.seccionActiva = seccion;
  }

  toggleSidebar(): void {
    this.sidebarColapsado = !this.sidebarColapsado;
  }

  cerrarSesion(): void {
    window.location.href = '/login';
  }
}
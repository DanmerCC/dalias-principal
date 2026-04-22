import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, DecimalPipe, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

type SeccionActiva = 'dashboard' | 'usuarios' | 'residentes' | 'detalle-residente' | 'medicacion' | 'productos' | 'roles' | 'configuracion';
type FichaTab = 'info' | 'emergencia' | 'documentos' | 'gastos';
type DetalleTab = 'info' | 'emergencia' | 'documentos' | 'gastos';
type TipoMovimiento = 'ingreso' | 'gasto';

export interface Usuario {
  id: number; nombre: string; username: string; password: string;
  rol: string; email: string; telefono: string; foto: string;
  activo: boolean; fechaCreacion: string;
}

export interface ContactoEmergencia {
  nombre: string; parentesco: string; telefono: string; telefonoAlt: string; direccion: string;
}

export interface FichaEmergencia {
  grupoSanguineo: string; factorRH: string; alergias: string;
  enfermedadesCronicas: string; medicamentosPermanentes: string; instrucciones: string;
}

export interface Evacuacion {
  lugar: string; nombreLugar: string; direccion: string; telefono: string;
}

export interface Residente {
  id: number;
  nombre: string;
  edad: number;
  habitacion: string;
  piso: string;
  medico: string;
  foto: string;
  estado: 'estable' | 'atencion' | 'critico';
  diagnostico: string;
  fechaIngreso: string;
  familiar: string;
  // Nuevos campos
  dni: string;
  fechaNacimiento: string;
  sexo: string;
  nacionalidad: string;
  altura: number;
  peso: number;
  apodo: string;
  tipoResidente: string;
  contactoEmergencia: ContactoEmergencia;
  fichaEmergencia: FichaEmergencia;
  evacuacion: Evacuacion;
}

export interface Documento {
  id: number; residenteId: number; nombre: string;
  tipo: 'pdf' | 'imagen' | 'doc'; tamano: string; fecha: string; url: string;
}

export interface Gasto {
  id: number; residenteId: number; tipo: 'ingreso' | 'gasto';
  descripcion: string; categoria: string; monto: number; fecha: string; registradoPor: string;
}

export interface Producto {
  id: number; nombre: string; categoria: string; proveedor: string;
  unidad: string; stockActual: number; stockMinimo: number;
  precioUnitario: number; icono: string;
}

export interface Proveedor {
  id: number; nombre: string; categoria: string; contacto: string;
  telefono: string; email: string; ruc: string; direccion: string;
  notas: string; activo: boolean;
}

export interface Rol {
  nombre: string; descripcion: string; icono: string;
  nivel: 'total' | 'medio' | 'basico'; permisosActivos: string[];
}

export interface GrupoPermisos {
  nombre: string; icono: string;
  permisos: { clave: string; nombre: string; descripcion: string }[];
}

export interface RegistroActividad {
  id: number; accion: 'crear' | 'editar' | 'eliminar' | 'login';
  descripcion: string; usuario: string; fecha: string; hora: string;
}

export interface Config {
  nombreInstitucion: string; direccion: string; telefono: string; email: string;
  turnoManana: string; turnoNoche: string;
}

@Component({
  selector: 'app-portal-administrador',
  imports: [CommonModule, FormsModule, DecimalPipe, TitleCasePipe],
  templateUrl: './portal-administrador.component.html',
  styleUrl: './portal-administrador.component.css',
})
export class PortalAdministradorComponent {
  @ViewChild('inputFotoResidente') inputFotoResidente!: ElementRef<HTMLInputElement>;
  @ViewChild('inputFotoUsuario') inputFotoUsuario!: ElementRef<HTMLInputElement>;
  @ViewChild('inputFotoNuevoResidente') inputFotoNuevoResidente!: ElementRef<HTMLInputElement>;

  seccionActiva: SeccionActiva = 'dashboard';
  sidebarColapsado = false;
  busquedaUsuario = '';
  busquedaResidente = '';
  busquedaProducto = '';
  filtroCategoria = '';

  mostrarModalUsuario = false;
  mostrarModalResidente = false;
  mostrarModalGasto = false;
  mostrarModalProducto = false;
  mostrarModalStock = false;
  mostrarModalProveedor = false;

  modoEdicionUsuario = false;
  modoEdicionProducto = false;
  modoEdicionProveedor = false;
  fichaTab: FichaTab = 'info';
  detalleTab: DetalleTab = 'info';

  residenteActivo: Residente | null = null;
  residenteDetalle: Residente | null = null;

  rolSeleccionado: Rol | null = null;
  tipoMovimiento: TipoMovimiento = 'ingreso';
  productoEnAjuste: Producto | null = null;

  gruposSanguineos = ['A', 'B', 'AB', 'O'];
  categoriasGasto = ['Medicamentos', 'Higiene personal', 'Ropa y calzado', 'Alimentación especial', 'Entretenimiento', 'Transporte', 'Otros'];
  categoriasProducto = ['Higiene y cuidado', 'Medicamentos', 'Alimentación', 'Limpieza', 'Ropa y textiles', 'Equipamiento médico', 'Otros'];

  admin = { nombre: 'Admin Sistema', cargo: 'Administrador', foto: '' };

  formularioUsuario: Partial<Usuario> & { foto: string } = { nombre: '', username: '', password: '', rol: '', email: '', telefono: '', foto: '' };

  formularioResidente: Omit<Residente, 'id' | 'contactoEmergencia' | 'fichaEmergencia' | 'evacuacion'> & { foto: string } = {
    nombre: '', edad: 0, habitacion: '', piso: '1', medico: '', foto: '', estado: 'estable',
    diagnostico: '', fechaIngreso: '', familiar: '',
    dni: '', fechaNacimiento: '', sexo: 'masculino', nacionalidad: 'Peruana',
    altura: 0, peso: 0, apodo: '', tipoResidente: 'Riesgo Bajo'
  };

  formularioGasto = { descripcion: '', categoria: '', monto: 0, fecha: '' };
  formularioProducto: Omit<Producto, 'id'> = { nombre: '', categoria: '', proveedor: '', unidad: 'unidades', stockActual: 0, stockMinimo: 5, precioUnitario: 0, icono: 'fa-solid fa-box' };
  formularioProveedor: Omit<Proveedor, 'id' | 'activo'> = { nombre: '', categoria: '', contacto: '', telefono: '', email: '', ruc: '', direccion: '', notas: '' };
  ajusteStock = { tipo: 'entrada', cantidad: 0, motivo: '' };

  config: Config = {
    nombreInstitucion: 'Residencia Las Dalias',
    direccion: 'Av. Principal 123, Cusco',
    telefono: '+51 981 776 156',
    email: 'contacto@lasdalias.pe',
    turnoManana: '07:00',
    turnoNoche: '19:00',
  };

  // ---- MEDICACIÓN ----
medTab: 'diaria' | 'condicional' | 'tratamiento' | 'suspendida' = 'diaria';
turnoMed: 'dia' | 'noche' = 'dia';
rangoHoraDesde = '07:00';
rangoHoraHasta = '19:00';
residentesFiltroMed: number[] = [];
dropdownResidentesAbierto = false;
mostrarModalMedicacion = false;
mostrarModalEvidencia = false;
evidenciaActiva: any = null;

formularioMedicacion: any = {
  residenteId: '', nombre: '', indicacion: '', tipo: 'diaria',
  hora: '', turno: 'dia', fechaTratamiento: '', condicion: '', notas: ''
};

medicaciones: any[] = [
  {
    id: 1, residenteId: 1, residente: 'María Elena Sánchez', habitacion: '204',
    alergia: 'PENICILINA', ultimaToma: '08:15 AM', tipo: 'diaria', turno: 'dia',
    medicamentos: [
      { nombre: 'Enalapril 10mg', indicacion: 'Con desayuno — Antihipertensivo', hora: '08:00', estado: 'tomado', evidencia: false, textoEvidencia: '', archivoEvidencia: '', tipoEvidencia: '' },
      { nombre: 'Aspirín 100mg', indicacion: 'Con almuerzo', hora: '13:00', estado: 'pendiente', evidencia: false, textoEvidencia: '', archivoEvidencia: '', tipoEvidencia: '' },
    ]
  },
  {
    id: 2, residenteId: 2, residente: 'José Antonio Ríos', habitacion: '105',
    alergia: '', ultimaToma: '07:50 AM', tipo: 'diaria', turno: 'dia',
    medicamentos: [
      { nombre: 'Metformina 850mg', indicacion: 'Con desayuno — Antidiabético', hora: '08:00', estado: 'pendiente', evidencia: false, textoEvidencia: '', archivoEvidencia: '', tipoEvidencia: '' },
      { nombre: 'Enalapril 5mg', indicacion: 'Cada 24h — Antihipertensivo', hora: '09:00', estado: 'no-tomado', evidencia: true, textoEvidencia: 'Residente se negó a tomar', archivoEvidencia: '', tipoEvidencia: '' },
    ]
  },
  {
    id: 3, residenteId: 3, residente: 'Carmen Rosa Delgado', habitacion: '301',
    alergia: 'IBUPROFENO', ultimaToma: '08:00 AM', tipo: 'condicional', turno: 'dia',
    condicion: 'Dolor > 7/10',
    medicamentos: [
      { nombre: 'Tramadol 50mg', indicacion: 'Máx. cada 6h — Verificar última dosis', hora: '', estado: 'pendiente', evidencia: false, textoEvidencia: '', archivoEvidencia: '', tipoEvidencia: '' },
    ]
  },
  {
    id: 4, residenteId: 1, residente: 'María Elena Sánchez', habitacion: '204',
    alergia: 'PENICILINA', ultimaToma: '', tipo: 'tratamiento', turno: 'dia',
    fechaTratamiento: '24/04/2026',
    medicamentos: [
      { nombre: 'Amoxicilina 500mg', indicacion: 'Cada 8h — 7 días', hora: '08:00', estado: 'pendiente', evidencia: false, textoEvidencia: '', archivoEvidencia: '', tipoEvidencia: '' },
    ]
  },
  {
    id: 5, residenteId: 2, residente: 'José Antonio Ríos', habitacion: '105',
    alergia: '', ultimaToma: '', tipo: 'suspendida', turno: 'dia',
    medicamentos: [
      { nombre: 'Ibuprofeno 400mg', indicacion: 'Suspendido por indicación médica', hora: '', estado: 'suspendida', evidencia: false, textoEvidencia: '', archivoEvidencia: '', tipoEvidencia: '' },
    ]
  },
  {
    id: 6, residenteId: 3, residente: 'Carmen Rosa Delgado', habitacion: '301',
    alergia: 'IBUPROFENO', ultimaToma: '20:00 PM', tipo: 'diaria', turno: 'noche',
    medicamentos: [
      { nombre: 'Atorvastatina 20mg', indicacion: 'Noche — Con o sin alimentos', hora: '21:00', estado: 'pendiente', evidencia: false, textoEvidencia: '', archivoEvidencia: '', tipoEvidencia: '' },
    ]
  },
];

alertasInventario = [
  { medicamento: 'Levotiroxina 50mcg', lote: '#A9902', unidades: 8, max: 100, deplecion: '24 Oct (3 días)' },
  { medicamento: 'Quetiapina 25mg', lote: '#C2203', unidades: 45, max: 100, deplecion: '12 Nov (21 días)' },
  { medicamento: 'Furosemida 40mg', lote: '#B1105', unidades: 12, max: 60, deplecion: '28 Oct (7 días)' },
];

get medicacionesFiltradas(): any[] {
  return this.medicaciones.filter(pm => {
    const matchTipo = pm.tipo === this.medTab;
    const matchTurno = pm.turno === this.turnoMed || pm.turno === 'ambos';
    const matchResidente = this.residentesFiltroMed.length === 0 || this.residentesFiltroMed.includes(pm.residenteId);
    const matchHora = pm.medicamentos.some((m: any) => {
      if (!m.hora) return true;
      return m.hora >= this.rangoHoraDesde && m.hora <= this.rangoHoraHasta;
    });
    return matchTipo && matchTurno && matchResidente && matchHora;
  });
}

contarPorTipo(tipo: string): number {
  return this.medicaciones.filter(m => m.tipo === tipo).length;
}

contarEstado(estado: string): number {
  let count = 0;
  this.medicaciones.forEach(pm => {
    pm.medicamentos.forEach((m: any) => { if (m.estado === estado) count++; });
  });
  return count;
}

toggleDropdownResidentes(): void {
  this.dropdownResidentesAbierto = !this.dropdownResidentesAbierto;
}

toggleResidenteFiltro(id: number): void {
  const idx = this.residentesFiltroMed.indexOf(id);
  if (idx > -1) this.residentesFiltroMed.splice(idx, 1);
  else this.residentesFiltroMed.push(id);
}

marcarMedicamento(pm: any, med: any, estado: string): void {
  med.estado = estado;
}

iniciarNoTomado(pm: any, med: any): void {
  med.estado = 'evidencia-pendiente';
  med.textoEvidencia = '';
}

adjuntarEvidencia(med: any, tipo: 'voz' | 'video'): void {
  med.tipoEvidencia = tipo;
  alert(`🎙️ ${tipo === 'voz' ? 'Grabación de voz' : 'Grabación de video'} iniciada (simulado)`);
}

onArchivoEvidencia(event: Event, med: any): void {
  const input = event.target as HTMLInputElement;
  if (input.files?.[0]) {
    med.archivoEvidencia = input.files[0].name;
    med.tipoEvidencia = 'archivo';
  }
}

confirmarNoTomado(pm: any, med: any): void {
  med.estado = 'no-tomado';
  med.evidencia = true;
}

verEvidencia(med: any): void {
  this.evidenciaActiva = med;
  this.mostrarModalEvidencia = true;
}

abrirModalNuevaMedicacion(): void {
  this.formularioMedicacion = {
    residenteId: '', nombre: '', indicacion: '', tipo: 'diaria',
    hora: '', turno: 'dia', fechaTratamiento: '', condicion: '', notas: ''
  };
  this.mostrarModalMedicacion = true;
}

guardarNuevaMedicacion(): void {
  if (!this.formularioMedicacion.residenteId || !this.formularioMedicacion.nombre) return;
  const residente = this.residentes.find(r => r.id == this.formularioMedicacion.residenteId);
  if (!residente) return;
  const nueva = {
    id: this.medicaciones.length + 1,
    residenteId: residente.id,
    residente: residente.nombre,
    habitacion: residente.habitacion,
    alergia: residente.fichaEmergencia.alergias || '',
    ultimaToma: '',
    tipo: this.formularioMedicacion.tipo,
    turno: this.formularioMedicacion.turno,
    fechaTratamiento: this.formularioMedicacion.fechaTratamiento || '',
    condicion: this.formularioMedicacion.condicion || '',
    medicamentos: [{
      nombre: this.formularioMedicacion.nombre,
      indicacion: this.formularioMedicacion.indicacion || '',
      hora: this.formularioMedicacion.hora || '',
      estado: 'pendiente',
      evidencia: false, textoEvidencia: '', archivoEvidencia: '', tipoEvidencia: ''
    }]
  };
  this.medicaciones.push(nueva);
  this.mostrarModalMedicacion = false;
}

  gruposPermisos: GrupoPermisos[] = [
    {
      nombre: 'Residentes', icono: 'fa-solid fa-bed-pulse',
      permisos: [
        { clave: 'res.ver', nombre: 'Ver residentes', descripcion: 'Acceso a la lista y fichas de residentes' },
        { clave: 'res.crear', nombre: 'Crear residente', descripcion: 'Añadir nuevos residentes al sistema' },
        { clave: 'res.editar', nombre: 'Editar residente', descripcion: 'Modificar datos de residentes existentes' },
        { clave: 'res.eliminar', nombre: 'Eliminar residente', descripcion: 'Dar de baja residentes del sistema' },
        { clave: 'res.documentos', nombre: 'Gestionar documentos', descripcion: 'Subir y ver documentos de residentes' },
        { clave: 'res.emergencia', nombre: 'Ver ficha de emergencia', descripcion: 'Acceso a datos médicos de emergencia' },
      ],
    },
    {
      nombre: 'Clínico', icono: 'fa-solid fa-heart-pulse',
      permisos: [
        { clave: 'cli.signos', nombre: 'Registrar signos vitales', descripcion: 'Ingresar y ver signos vitales' },
        { clave: 'cli.medicacion', nombre: 'Gestionar medicación', descripcion: 'Ver y administrar medicamentos' },
        { clave: 'cli.citas', nombre: 'Gestionar citas', descripcion: 'Crear, editar y completar citas médicas' },
        { clave: 'cli.historial', nombre: 'Ver historial clínico', descripcion: 'Acceso al historial médico completo' },
      ],
    },
    {
      nombre: 'Comunicación', icono: 'fa-solid fa-comments',
      permisos: [
        { clave: 'com.chat', nombre: 'Chat con familias', descripcion: 'Enviar y recibir mensajes de familiares' },
        { clave: 'com.galeria', nombre: 'Gestionar galería', descripcion: 'Subir fotos y videos de residentes' },
      ],
    },
    {
      nombre: 'Administración', icono: 'fa-solid fa-user-shield',
      permisos: [
        { clave: 'adm.usuarios', nombre: 'Gestionar usuarios', descripcion: 'Crear, editar y desactivar usuarios' },
        { clave: 'adm.roles', nombre: 'Gestionar roles', descripcion: 'Modificar roles y permisos del sistema' },
        { clave: 'adm.config', nombre: 'Configuración', descripcion: 'Acceso a la configuración del sistema' },
        { clave: 'adm.gastos', nombre: 'Gestionar gastos', descripcion: 'Registrar y ver gastos de residentes' },
        { clave: 'adm.turnos', nombre: 'Gestionar turnos', descripcion: 'Ver y modificar turnos del personal' },
        { clave: 'adm.stock', nombre: 'Gestionar stock', descripcion: 'Ver y actualizar productos e inventario' },
        { clave: 'adm.proveedores', nombre: 'Gestionar proveedores', descripcion: 'Administrar proveedores de la residencia' },
      ],
    },
  ];

  roles: Rol[] = [
    { nombre: 'Director General', descripcion: 'Acceso total a la plataforma', icono: 'fa-solid fa-star', nivel: 'total', permisosActivos: ['res.ver','res.crear','res.editar','res.eliminar','res.documentos','res.emergencia','cli.signos','cli.medicacion','cli.citas','cli.historial','com.chat','com.galeria','adm.usuarios','adm.roles','adm.config','adm.gastos','adm.turnos','adm.stock','adm.proveedores'] },
    { nombre: 'Coordinador de Marketing', descripcion: 'Acceso total a la plataforma', icono: 'fa-solid fa-bullhorn', nivel: 'total', permisosActivos: ['res.ver','res.documentos','cli.historial','com.chat','com.galeria'] },
    { nombre: 'Administrador', descripcion: 'Gestión de usuarios y configuración', icono: 'fa-solid fa-user-shield', nivel: 'total', permisosActivos: ['res.ver','res.crear','res.editar','res.documentos','res.emergencia','adm.usuarios','adm.roles','adm.config','adm.gastos','adm.turnos','adm.stock','adm.proveedores'] },
    { nombre: 'Director Médico', descripcion: 'Supervisión clínica completa', icono: 'fa-solid fa-user-doctor', nivel: 'total', permisosActivos: ['res.ver','res.editar','res.documentos','res.emergencia','cli.signos','cli.medicacion','cli.citas','cli.historial','com.chat','adm.turnos'] },
    { nombre: 'Médico Geriatra', descripcion: 'Atención médica especializada', icono: 'fa-solid fa-stethoscope', nivel: 'medio', permisosActivos: ['res.ver','res.emergencia','cli.signos','cli.medicacion','cli.citas','cli.historial','com.chat'] },
    { nombre: 'Fisioterapeuta', descripcion: 'Rehabilitación y fisioterapia', icono: 'fa-solid fa-person-walking', nivel: 'basico', permisosActivos: ['res.ver','cli.citas','cli.historial'] },
    { nombre: 'Jefa de Turno', descripcion: 'Coordinación del personal de turno', icono: 'fa-solid fa-clipboard-user', nivel: 'medio', permisosActivos: ['res.ver','res.editar','res.emergencia','cli.signos','cli.medicacion','cli.citas','cli.historial','com.chat','com.galeria','adm.turnos'] },
    { nombre: 'Enfermero/a', descripcion: 'Cuidado y atención de residentes', icono: 'fa-solid fa-user-nurse', nivel: 'basico', permisosActivos: ['res.ver','res.emergencia','cli.signos','cli.medicacion','cli.historial','com.chat','com.galeria'] },
    { nombre: 'Cuidador', descripcion: 'Asistencia básica a residentes', icono: 'fa-solid fa-hand-holding-heart', nivel: 'basico', permisosActivos: ['res.ver','com.galeria'] },
  ];

  usuarios: Usuario[] = [
    { id: 1, nombre: 'Admin Sistema', username: 'admin', password: '1234', rol: 'Administrador', email: 'admin@lasdalias.pe', telefono: '+51 999 000 001', foto: '', activo: true, fechaCreacion: '01 Ene, 2024' },
    { id: 2, nombre: 'Dr. Roberto Salinas', username: 'director', password: '1234', rol: 'Director General', email: 'director@lasdalias.pe', telefono: '+51 999 000 002', foto: '', activo: true, fechaCreacion: '01 Ene, 2024' },
    { id: 3, nombre: 'Dra. Carmen Vásquez', username: 'cvazquez', password: '1234', rol: 'Médico Geriatra', email: 'cvazquez@lasdalias.pe', telefono: '+51 999 000 003', foto: '', activo: true, fechaCreacion: '05 Ene, 2024' },
    { id: 4, nombre: 'Lic. Patricia Morales', username: 'enfermeria', password: '1234', rol: 'Enfermero/a', email: 'pmorales@lasdalias.pe', telefono: '+51 999 000 004', foto: '', activo: true, fechaCreacion: '10 Ene, 2024' },
    { id: 5, nombre: 'Lic. Jorge Ramírez', username: 'jramirez', password: '1234', rol: 'Fisioterapeuta', email: 'jramirez@lasdalias.pe', telefono: '+51 999 000 005', foto: '', activo: true, fechaCreacion: '15 Ene, 2024' },
    { id: 6, nombre: 'María López', username: 'mlopez', password: '1234', rol: 'Cuidador', email: 'mlopez@lasdalias.pe', telefono: '+51 999 000 006', foto: '', activo: false, fechaCreacion: '20 Ene, 2024' },
  ];

  residentes: Residente[] = [
    {
      id: 1, nombre: 'María Elena Sánchez', edad: 78, habitacion: '204', piso: '2',
      medico: 'Dra. Carmen Vásquez', foto: '', estado: 'estable',
      diagnostico: 'Hipertensión controlada', fechaIngreso: '12 Mar, 2023', familiar: 'Carlos Sánchez (hijo)',
      dni: '09876789', fechaNacimiento: '18/07/1967', sexo: 'femenino',
      nacionalidad: 'Peruana', altura: 162, peso: 65, apodo: 'Malena',
      tipoResidente: 'Riesgo Bajo',
      contactoEmergencia: { nombre: 'Carlos Sánchez', parentesco: 'Hijo', telefono: '+51 987 654 321', telefonoAlt: '+51 987 654 000', direccion: 'Av. El Sol 456, Cusco' },
      fichaEmergencia: { grupoSanguineo: 'O', factorRH: '+', alergias: 'Penicilina', enfermedadesCronicas: 'Hipertensión arterial', medicamentosPermanentes: 'Enalapril 10mg - 1 tableta cada 12h\nAspirín 100mg - 1 tableta al día', instrucciones: 'No administrar AINEs. Preferir acceso venoso en brazo izquierdo.' },
      evacuacion: { lugar: 'clinica', nombreLugar: 'Clínica Anglo Americana', direccion: 'Sede San Isidro', telefono: '+51 1 616 8900' }
    },
    {
      id: 2, nombre: 'José Antonio Ríos', edad: 82, habitacion: '105', piso: '1',
      medico: 'Dr. Luis Paredes', foto: '', estado: 'atencion',
      diagnostico: 'Diabetes tipo 2', fechaIngreso: '05 Ene, 2023', familiar: 'Laura Ríos (hija)',
      dni: '07654321', fechaNacimiento: '22/04/1942', sexo: 'masculino',
      nacionalidad: 'Peruana', altura: 170, peso: 72, apodo: 'Pepe',
      tipoResidente: 'Riesgo Medio',
      contactoEmergencia: { nombre: 'Laura Ríos', parentesco: 'Hija', telefono: '+51 987 000 111', telefonoAlt: '', direccion: 'Jr. Ayacucho 123, Cusco' },
      fichaEmergencia: { grupoSanguineo: 'A', factorRH: '+', alergias: 'Ninguna conocida', enfermedadesCronicas: 'Diabetes tipo 2, Hipertensión', medicamentosPermanentes: 'Metformina 850mg - con desayuno y cena\nEnalapril 5mg - cada 24h', instrucciones: 'Control de glucosa antes de cada comida.' },
      evacuacion: { lugar: 'hospital', nombreLugar: 'Hospital Regional Cusco', direccion: 'Av. De la Cultura s/n, Cusco', telefono: '+51 84 223691' }
    },
    {
      id: 3, nombre: 'Carmen Rosa Delgado', edad: 75, habitacion: '301', piso: '3',
      medico: 'Dra. Carmen Vásquez', foto: '', estado: 'estable',
      diagnostico: '', fechaIngreso: '20 Jun, 2023', familiar: 'Pedro Delgado (hijo)',
      dni: '12345678', fechaNacimiento: '05/11/1949', sexo: 'femenino',
      nacionalidad: 'Peruana', altura: 155, peso: 58, apodo: '',
      tipoResidente: 'Riesgo Bajo',
      contactoEmergencia: { nombre: 'Pedro Delgado', parentesco: 'Hijo', telefono: '+51 987 222 333', telefonoAlt: '', direccion: 'Urb. Magisterio, Cusco' },
      fichaEmergencia: { grupoSanguineo: 'B', factorRH: '-', alergias: 'Ibuprofeno', enfermedadesCronicas: '', medicamentosPermanentes: '', instrucciones: '' },
      evacuacion: { lugar: 'clinica', nombreLugar: 'Clínica Pardo', direccion: 'Av. Pardo 978, Cusco', telefono: '+51 84 224041' }
    },
  ];

  documentos: Documento[] = [
    { id: 1, residenteId: 1, nombre: 'DNI - María Elena Sánchez.pdf', tipo: 'pdf', tamano: '245 KB', fecha: '12 Mar, 2023', url: '#' },
    { id: 2, residenteId: 1, nombre: 'Contrato de Ingreso.pdf', tipo: 'pdf', tamano: '890 KB', fecha: '12 Mar, 2023', url: '#' },
    { id: 3, residenteId: 1, nombre: 'Radiografía torax.jpg', tipo: 'imagen', tamano: '1.2 MB', fecha: '15 Mar, 2023', url: '#' },
    { id: 4, residenteId: 2, nombre: 'DNI - José Antonio Ríos.pdf', tipo: 'pdf', tamano: '210 KB', fecha: '05 Ene, 2023', url: '#' },
  ];

  gastos: Gasto[] = [
    { id: 1, residenteId: 1, tipo: 'ingreso', descripcion: 'Depósito familiar para gastos personales', categoria: 'Otros', monto: 500.00, fecha: '01 Jun, 2024', registradoPor: 'admin' },
    { id: 2, residenteId: 1, tipo: 'gasto', descripcion: 'Compra de pañales talla L (x10)', categoria: 'Higiene personal', monto: 45.00, fecha: '03 Jun, 2024', registradoPor: 'admin' },
    { id: 3, residenteId: 1, tipo: 'gasto', descripcion: 'Crema hidratante corporal', categoria: 'Higiene personal', monto: 28.50, fecha: '05 Jun, 2024', registradoPor: 'admin' },
    { id: 4, residenteId: 1, tipo: 'ingreso', descripcion: 'Depósito adicional - Carlos Sánchez', categoria: 'Otros', monto: 200.00, fecha: '10 Jun, 2024', registradoPor: 'admin' },
    { id: 5, residenteId: 2, tipo: 'ingreso', descripcion: 'Depósito de Laura Ríos', categoria: 'Otros', monto: 300.00, fecha: '01 Jun, 2024', registradoPor: 'admin' },
    { id: 6, residenteId: 2, tipo: 'gasto', descripcion: 'Ropa interior x3', categoria: 'Ropa y calzado', monto: 60.00, fecha: '08 Jun, 2024', registradoPor: 'admin' },
  ];

  productos: Producto[] = [
    { id: 1, nombre: 'Pañales Talla L', categoria: 'Higiene y cuidado', proveedor: 'Farmedic S.A.C.', unidad: 'paquetes', stockActual: 8, stockMinimo: 10, precioUnitario: 32.50, icono: 'fa-solid fa-box' },
    { id: 2, nombre: 'Guantes de látex (caja x100)', categoria: 'Equipamiento médico', proveedor: 'MedSupply Perú', unidad: 'cajas', stockActual: 15, stockMinimo: 5, precioUnitario: 28.00, icono: 'fa-solid fa-hand-dots' },
    { id: 3, nombre: 'Alcohol 70% (litro)', categoria: 'Higiene y cuidado', proveedor: 'Farmedic S.A.C.', unidad: 'litros', stockActual: 0, stockMinimo: 5, precioUnitario: 8.50, icono: 'fa-solid fa-flask' },
    { id: 4, nombre: 'Mascarillas KN95 (caja x20)', categoria: 'Equipamiento médico', proveedor: 'MedSupply Perú', unidad: 'cajas', stockActual: 25, stockMinimo: 8, precioUnitario: 45.00, icono: 'fa-solid fa-head-side-mask' },
    { id: 5, nombre: 'Sábanas hospitalarias', categoria: 'Ropa y textiles', proveedor: 'Textil Dalias', unidad: 'unidades', stockActual: 40, stockMinimo: 20, precioUnitario: 35.00, icono: 'fa-solid fa-bed' },
    { id: 6, nombre: 'Jabón líquido antibacterial (500ml)', categoria: 'Limpieza', proveedor: 'CleanPro', unidad: 'botellas', stockActual: 3, stockMinimo: 10, precioUnitario: 12.00, icono: 'fa-solid fa-soap' },
    { id: 7, nombre: 'Pañitos húmedos (paquete x80)', categoria: 'Higiene y cuidado', proveedor: 'Farmedic S.A.C.', unidad: 'paquetes', stockActual: 20, stockMinimo: 15, precioUnitario: 18.00, icono: 'fa-solid fa-droplet' },
    { id: 8, nombre: 'Suero fisiológico 1L', categoria: 'Medicamentos', proveedor: 'Farmedic S.A.C.', unidad: 'unidades', stockActual: 12, stockMinimo: 10, precioUnitario: 9.50, icono: 'fa-solid fa-syringe' },
  ];

  proveedores: Proveedor[] = [
    { id: 1, nombre: 'Farmedic S.A.C.', categoria: 'Medicamentos', contacto: 'Luis Torres', telefono: '+51 984 111 222', email: 'ventas@farmedic.pe', ruc: '20123456789', direccion: 'Av. Cultura 345, Cusco', notas: 'Pago a 30 días. Entrega los martes y viernes.', activo: true },
    { id: 2, nombre: 'MedSupply Perú', categoria: 'Equipamiento médico', contacto: 'Ana Quispe', telefono: '+51 984 333 444', email: 'info@medsupply.pe', ruc: '20987654321', direccion: 'Jr. Manco Inca 120, Cusco', notas: 'Entrega en 48h. Mínimo de pedido S/ 200.', activo: true },
    { id: 3, nombre: 'Textil Dalias', categoria: 'Ropa y textiles', contacto: 'Pedro Huanca', telefono: '+51 984 555 666', email: 'pedidos@textildalias.pe', ruc: '20111222333', direccion: 'Urb. Industrial, Cusco', notas: '', activo: true },
    { id: 4, nombre: 'CleanPro', categoria: 'Limpieza', contacto: 'Rosa Mamani', telefono: '+51 984 777 888', email: 'clean@cleanpro.pe', ruc: '20444555666', direccion: 'Av. Sol 789, Cusco', notas: 'Descuento 10% en pedidos mayores a S/ 500.', activo: false },
  ];

  actividadReciente: RegistroActividad[] = [
    { id: 1, accion: 'login', descripcion: 'Inicio de sesión exitoso', usuario: 'admin', fecha: 'Hoy', hora: '08:00 am' },
    { id: 2, accion: 'crear', descripcion: 'Usuario "jramirez" creado con rol Fisioterapeuta', usuario: 'admin', fecha: 'Hoy', hora: '08:15 am' },
    { id: 3, accion: 'editar', descripcion: 'Rol de "pmorales" actualizado a Enfermero/a', usuario: 'admin', fecha: 'Hoy', hora: '09:00 am' },
  ];

  // ---- Getters ----
  get totalActivos(): number { return this.usuarios.filter(u => u.activo).length; }

  get usuariosFiltrados(): Usuario[] {
    if (!this.busquedaUsuario.trim()) return this.usuarios;
    const q = this.busquedaUsuario.toLowerCase();
    return this.usuarios.filter(u => u.nombre.toLowerCase().includes(q) || u.username.toLowerCase().includes(q) || u.rol.toLowerCase().includes(q));
  }

  get residentesFiltrados(): Residente[] {
    if (!this.busquedaResidente.trim()) return this.residentes;
    const q = this.busquedaResidente.toLowerCase();
    return this.residentes.filter(r => r.nombre.toLowerCase().includes(q) || r.habitacion.includes(q));
  }

  get productosFiltrados(): Producto[] {
    return this.productos.filter(p => {
      const matchBusqueda = !this.busquedaProducto.trim() || p.nombre.toLowerCase().includes(this.busquedaProducto.toLowerCase()) || p.proveedor.toLowerCase().includes(this.busquedaProducto.toLowerCase());
      const matchCategoria = !this.filtroCategoria || p.categoria === this.filtroCategoria;
      return matchBusqueda && matchCategoria;
    });
  }

  get proveedoresActivos(): Proveedor[] { return this.proveedores.filter(p => p.activo); }
  get productosEnStockNormal(): number { return this.productos.filter(p => p.stockActual > p.stockMinimo).length; }
  get productosStockBajo(): number { return this.productos.filter(p => p.stockActual <= p.stockMinimo && p.stockActual > 0).length; }
  get productosSinStock(): number { return this.productos.filter(p => p.stockActual === 0).length; }

  usuariosPorRol(rolNombre: string): number { return this.usuarios.filter(u => u.rol === rolNombre).length; }
  documentosDe(residenteId: number): Documento[] { return this.documentos.filter(d => d.residenteId === residenteId); }
  gastosDe(residenteId: number): Gasto[] { return this.gastos.filter(g => g.residenteId === residenteId); }
  saldoDisponible(id: number): number { return this.gastosDe(id).filter(g => g.tipo === 'ingreso').reduce((s, g) => s + g.monto, 0); }
  totalGastado(id: number): number { return this.gastosDe(id).filter(g => g.tipo === 'gasto').reduce((s, g) => s + g.monto, 0); }
  balanceResidente(id: number): number { return this.saldoDisponible(id) - this.totalGastado(id); }

  calcularPorcentajeStock(p: Producto): number {
    if (p.stockActual === 0) return 0;
    const max = Math.max(p.stockMinimo * 3, p.stockActual);
    return Math.min((p.stockActual / max) * 100, 100);
  }

  private get ahora(): string { return new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }); }

  private registrarActividad(accion: RegistroActividad['accion'], descripcion: string): void {
    this.actividadReciente.unshift({ id: this.actividadReciente.length + 1, accion, descripcion, usuario: this.admin.nombre, fecha: 'Hoy', hora: this.ahora });
  }

  // ---- Navegación ----
  navegarA(seccion: SeccionActiva): void {
    this.seccionActiva = seccion;
    if (seccion !== 'detalle-residente') this.residenteDetalle = null;
  }
  toggleSidebar(): void { this.sidebarColapsado = !this.sidebarColapsado; }

  // ---- Usuarios ----
  abrirModalUsuario(): void {
    this.modoEdicionUsuario = false;
    this.formularioUsuario = { nombre: '', username: '', password: '', rol: '', email: '', telefono: '', foto: '' };
    this.mostrarModalUsuario = true;
  }
  editarUsuario(u: Usuario): void { this.modoEdicionUsuario = true; this.formularioUsuario = { ...u }; this.mostrarModalUsuario = true; }
  guardarUsuario(): void {
    if (!this.formularioUsuario.nombre || !this.formularioUsuario.username || !this.formularioUsuario.rol) return;
    if (this.modoEdicionUsuario) {
      const idx = this.usuarios.findIndex(u => u.username === this.formularioUsuario.username);
      if (idx > -1) this.usuarios[idx] = { ...this.usuarios[idx], ...this.formularioUsuario } as Usuario;
      this.registrarActividad('editar', `Usuario "${this.formularioUsuario.username}" actualizado`);
    } else {
      const nuevo: Usuario = { id: this.usuarios.length + 1, activo: true, fechaCreacion: new Date().toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }), ...(this.formularioUsuario as any) };
      this.usuarios.push(nuevo);
      this.registrarActividad('crear', `Usuario "${nuevo.username}" creado con rol ${nuevo.rol}`);
    }
    this.mostrarModalUsuario = false;
  }
  toggleEstadoUsuario(u: Usuario): void { u.activo = !u.activo; this.registrarActividad('editar', `Usuario "${u.username}" ${u.activo ? 'activado' : 'desactivado'}`); }
  eliminarUsuario(u: Usuario): void { this.usuarios = this.usuarios.filter(usr => usr.id !== u.id); this.registrarActividad('eliminar', `Usuario "${u.username}" eliminado`); }
  triggerFotoUsuario(): void { this.inputFotoUsuario?.nativeElement.click(); }
  onFotoUsuarioChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) { const reader = new FileReader(); reader.onload = (e) => { this.formularioUsuario.foto = e.target?.result as string; }; reader.readAsDataURL(input.files[0]); }
  }

  // ---- Residentes ----
  abrirModalResidente(): void {
    this.formularioResidente = { nombre: '', edad: 0, habitacion: '', piso: '1', medico: '', foto: '', estado: 'estable', diagnostico: '', fechaIngreso: '', familiar: '', dni: '', fechaNacimiento: '', sexo: 'masculino', nacionalidad: 'Peruana', altura: 0, peso: 0, apodo: '', tipoResidente: 'Riesgo Bajo' };
    this.mostrarModalResidente = true;
  }

  // Ícono OJO → panel lateral
  abrirFichaResidente(r: Residente): void { this.residenteActivo = { ...r }; this.fichaTab = 'info'; }
  cerrarFichaResidente(): void { this.residenteActivo = null; }

  // Ícono LÁPIZ → página detalle
  abrirDetalleResidente(r: Residente, event: Event): void {
    event.stopPropagation();
    this.residenteDetalle = { ...r };
    this.detalleTab = 'info';
    this.seccionActiva = 'detalle-residente';
  }
  volverAResidentes(): void { this.seccionActiva = 'residentes'; this.residenteDetalle = null; }

  guardarResidente(): void {
    if (!this.formularioResidente.nombre) return;
    const nuevo: Residente = {
      id: this.residentes.length + 1,
      ...this.formularioResidente,
      contactoEmergencia: { nombre: '', parentesco: '', telefono: '', telefonoAlt: '', direccion: '' },
      fichaEmergencia: { grupoSanguineo: 'O', factorRH: '+', alergias: '', enfermedadesCronicas: '', medicamentosPermanentes: '', instrucciones: '' },
      evacuacion: { lugar: 'hospital', nombreLugar: '', direccion: '', telefono: '' }
    };
    this.residentes.push(nuevo);
    this.registrarActividad('crear', `Residente "${nuevo.nombre}" creado`);
    this.mostrarModalResidente = false;
  }

  triggerFotoResidente(): void { this.inputFotoResidente?.nativeElement.click(); }
  onFotoResidenteChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0] && this.residenteActivo) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (this.residenteActivo) {
          this.residenteActivo.foto = e.target?.result as string;
          const orig = this.residentes.find(r => r.id === this.residenteActivo!.id);
          if (orig) orig.foto = this.residenteActivo.foto;
        }
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  triggerFotoNuevoResidente(): void { this.inputFotoNuevoResidente?.nativeElement.click(); }
  onFotoNuevoResidenteChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) { const reader = new FileReader(); reader.onload = (e) => { this.formularioResidente.foto = e.target?.result as string; }; reader.readAsDataURL(input.files[0]); }
  }

  // Guardar desde panel lateral
  guardarInfoResidente(): void {
    if (!this.residenteActivo) return;
    const idx = this.residentes.findIndex(r => r.id === this.residenteActivo!.id);
    if (idx > -1) this.residentes[idx] = { ...this.residenteActivo };
    this.registrarActividad('editar', `Datos de "${this.residenteActivo.nombre}" actualizados`);
  }
  guardarEmergencia(): void {
    if (!this.residenteActivo) return;
    const idx = this.residentes.findIndex(r => r.id === this.residenteActivo!.id);
    if (idx > -1) this.residentes[idx] = { ...this.residenteActivo };
    this.registrarActividad('editar', `Ficha de emergencia de "${this.residenteActivo.nombre}" actualizada`);
  }

  // Guardar desde página detalle
  guardarInfoDetalleResidente(): void {
    if (!this.residenteDetalle) return;
    const idx = this.residentes.findIndex(r => r.id === this.residenteDetalle!.id);
    if (idx > -1) this.residentes[idx] = { ...this.residenteDetalle };
    this.registrarActividad('editar', `Datos de "${this.residenteDetalle.nombre}" actualizados`);
  }
  guardarEmergenciaDetalle(): void {
    if (!this.residenteDetalle) return;
    const idx = this.residentes.findIndex(r => r.id === this.residenteDetalle!.id);
    if (idx > -1) this.residentes[idx] = { ...this.residenteDetalle };
    this.registrarActividad('editar', `Ficha de emergencia de "${this.residenteDetalle.nombre}" actualizada`);
  }

  // ---- Documentos ----
  onDocumentoChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.[0] || !this.residenteActivo) return;
    const file = input.files[0];
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const tipo: Documento['tipo'] = ext === 'pdf' ? 'pdf' : ['jpg','jpeg','png'].includes(ext) ? 'imagen' : 'doc';
    const tamano = file.size < 1024 * 1024 ? `${(file.size / 1024).toFixed(0)} KB` : `${(file.size / 1024 / 1024).toFixed(1)} MB`;
    this.documentos.push({ id: this.documentos.length + 1, residenteId: this.residenteActivo.id, nombre: file.name, tipo, tamano, fecha: 'Hoy', url: URL.createObjectURL(file) });
    this.registrarActividad('crear', `Documento "${file.name}" subido para ${this.residenteActivo.nombre}`);
  }
  onDocumentoDetalleChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.[0] || !this.residenteDetalle) return;
    const file = input.files[0];
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const tipo: Documento['tipo'] = ext === 'pdf' ? 'pdf' : ['jpg','jpeg','png'].includes(ext) ? 'imagen' : 'doc';
    const tamano = file.size < 1024 * 1024 ? `${(file.size / 1024).toFixed(0)} KB` : `${(file.size / 1024 / 1024).toFixed(1)} MB`;
    this.documentos.push({ id: this.documentos.length + 1, residenteId: this.residenteDetalle.id, nombre: file.name, tipo, tamano, fecha: 'Hoy', url: URL.createObjectURL(file) });
    this.registrarActividad('crear', `Documento "${file.name}" subido para ${this.residenteDetalle.nombre}`);
  }
  eliminarDocumento(doc: Documento): void { this.documentos = this.documentos.filter(d => d.id !== doc.id); }

  // ---- Gastos ----
  abrirModalGasto(tipo: TipoMovimiento): void {
    this.tipoMovimiento = tipo;
    this.formularioGasto = { descripcion: '', categoria: '', monto: 0, fecha: 'Hoy' };
    this.mostrarModalGasto = true;
  }
  abrirModalGastoDetalle(tipo: TipoMovimiento): void {
    if (this.residenteDetalle) this.residenteActivo = this.residenteDetalle;
    this.tipoMovimiento = tipo;
    this.formularioGasto = { descripcion: '', categoria: '', monto: 0, fecha: 'Hoy' };
    this.mostrarModalGasto = true;
  }
  guardarGasto(): void {
    if (!this.residenteActivo || !this.formularioGasto.descripcion || !this.formularioGasto.monto) return;
    const nuevo: Gasto = { id: this.gastos.length + 1, residenteId: this.residenteActivo.id, tipo: this.tipoMovimiento, descripcion: this.formularioGasto.descripcion, categoria: this.formularioGasto.categoria || 'Otros', monto: this.formularioGasto.monto, fecha: this.formularioGasto.fecha || 'Hoy', registradoPor: this.admin.nombre };
    this.gastos.push(nuevo);
    this.registrarActividad('crear', `${this.tipoMovimiento === 'ingreso' ? 'Ingreso' : 'Gasto'} de S/ ${nuevo.monto} registrado para ${this.residenteActivo.nombre}`);
    if (this.seccionActiva === 'detalle-residente') this.residenteActivo = null;
    this.mostrarModalGasto = false;
  }

  exportarGastosPDF(): void {
    if (!this.residenteActivo) return;
    this._generarPDF(this.residenteActivo);
  }
  exportarGastosDetalleResidente(): void {
    if (!this.residenteDetalle) return;
    this._generarPDF(this.residenteDetalle);
  }
  private _generarPDF(r: Residente): void {
    const gastos = this.gastosDe(r.id);
    const balance = this.balanceResidente(r.id);
    const contenido = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Reporte Gastos - ${r.nombre}</title>
    <style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;color:#333;padding:30px}.header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:30px;border-bottom:3px solid #1a1a2e;padding-bottom:20px}.titulo{font-size:22px;font-weight:bold;color:#1a1a2e}.subtitulo{font-size:13px;color:#888;margin-top:4px}.fecha{font-size:12px;color:#aaa;text-align:right}.resumen{display:flex;gap:20px;margin-bottom:30px}.ri{flex:1;padding:15px;border-radius:8px;text-align:center}.ri.ing{background:#e8fdf0;border:1px solid #a3e4be}.ri.gas{background:#fef0f0;border:1px solid #f5b8b8}.ri.bal{background:#f0f0fe;border:1px solid #b8b8f5}.lbl{font-size:11px;color:#888;text-transform:uppercase}.val{font-size:20px;font-weight:bold;margin-top:5px}.ing .val{color:#1a9e4c}.gas .val{color:#e74c3c}.bal .val{color:${balance>=0?'#1a9e4c':'#e74c3c'}}table{width:100%;border-collapse:collapse;font-size:13px}th{background:#1a1a2e;color:#fff;padding:10px 12px;text-align:left;font-size:11px;text-transform:uppercase}td{padding:9px 12px;border-bottom:1px solid #eee}.badge{padding:3px 8px;border-radius:12px;font-size:11px;font-weight:bold}.badge.i{background:#e8fdf0;color:#1a9e4c}.badge.g{background:#fef0f0;color:#e74c3c}.mi{color:#1a9e4c;font-weight:bold}.mg{color:#e74c3c;font-weight:bold}.footer{margin-top:30px;padding-top:15px;border-top:1px solid #eee;font-size:11px;color:#aaa;text-align:center}</style></head>
    <body><div class="header"><div><div class="titulo">Reporte de Gastos</div><div class="subtitulo">${r.nombre} — Hab. ${r.habitacion}</div></div><div class="fecha">Generado: ${new Date().toLocaleDateString('es-PE',{day:'2-digit',month:'long',year:'numeric'})}<br/>Residencia Las Dalias</div></div>
    <div class="resumen"><div class="ri ing"><div class="lbl">Total Ingresos</div><div class="val">S/ ${this.saldoDisponible(r.id).toFixed(2)}</div></div><div class="ri gas"><div class="lbl">Total Gastos</div><div class="val">S/ ${this.totalGastado(r.id).toFixed(2)}</div></div><div class="ri bal"><div class="lbl">Balance</div><div class="val">S/ ${balance.toFixed(2)}</div></div></div>
    <table><thead><tr><th>Tipo</th><th>Descripción</th><th>Categoría</th><th>Monto</th><th>Fecha</th><th>Registrado por</th></tr></thead><tbody>${gastos.map(g=>`<tr><td><span class="badge ${g.tipo==='ingreso'?'i':'g'}">${g.tipo==='ingreso'?'Ingreso':'Gasto'}</span></td><td>${g.descripcion}</td><td>${g.categoria}</td><td class="${g.tipo==='ingreso'?'mi':'mg'}">${g.tipo==='ingreso'?'+':'-'} S/ ${g.monto.toFixed(2)}</td><td>${g.fecha}</td><td>${g.registradoPor}</td></tr>`).join('')}</tbody></table>
    <div class="footer">Documento generado automáticamente por el sistema de Residencia Las Dalias</div></body></html>`;
    const ventana = window.open('', '_blank');
    if (ventana) { ventana.document.write(contenido); ventana.document.close(); ventana.focus(); setTimeout(() => { ventana.print(); }, 500); }
  }

  // ---- Productos ----
  abrirModalProducto(): void {
    this.modoEdicionProducto = false;
    this.formularioProducto = { nombre: '', categoria: '', proveedor: '', unidad: 'unidades', stockActual: 0, stockMinimo: 5, precioUnitario: 0, icono: 'fa-solid fa-box' };
    this.mostrarModalProducto = true;
  }
  editarProducto(p: Producto): void { this.modoEdicionProducto = true; this.formularioProducto = { ...p }; this.mostrarModalProducto = true; }
  guardarProducto(): void {
    if (!this.formularioProducto.nombre) return;
    if (this.modoEdicionProducto) {
      const idx = this.productos.findIndex(p => p.nombre === this.formularioProducto.nombre);
      if (idx > -1) this.productos[idx] = { ...this.productos[idx], ...this.formularioProducto };
      this.registrarActividad('editar', `Producto "${this.formularioProducto.nombre}" actualizado`);
    } else {
      const nuevo: Producto = { id: this.productos.length + 1, ...this.formularioProducto };
      this.productos.push(nuevo);
      this.registrarActividad('crear', `Producto "${nuevo.nombre}" añadido al inventario`);
    }
    this.mostrarModalProducto = false;
  }
  eliminarProducto(p: Producto): void { this.productos = this.productos.filter(prod => prod.id !== p.id); this.registrarActividad('eliminar', `Producto "${p.nombre}" eliminado del inventario`); }
  abrirModalAjusteStock(p: Producto): void { this.productoEnAjuste = p; this.ajusteStock = { tipo: 'entrada', cantidad: 0, motivo: '' }; this.mostrarModalStock = true; }
  guardarAjusteStock(): void {
    if (!this.productoEnAjuste || !this.ajusteStock.cantidad) return;
    const p = this.productos.find(prod => prod.id === this.productoEnAjuste!.id);
    if (!p) return;
    const anterior = p.stockActual;
    if (this.ajusteStock.tipo === 'entrada') p.stockActual += this.ajusteStock.cantidad;
    else if (this.ajusteStock.tipo === 'salida') p.stockActual = Math.max(0, p.stockActual - this.ajusteStock.cantidad);
    else p.stockActual = this.ajusteStock.cantidad;
    this.registrarActividad('editar', `Stock de "${p.nombre}" ajustado: ${anterior} → ${p.stockActual} ${p.unidad}`);
    this.mostrarModalStock = false;
  }

  // ---- Proveedores ----
  abrirModalProveedor(): void { this.modoEdicionProveedor = false; this.formularioProveedor = { nombre: '', categoria: '', contacto: '', telefono: '', email: '', ruc: '', direccion: '', notas: '' }; this.mostrarModalProveedor = true; }
  editarProveedor(pv: Proveedor): void { this.modoEdicionProveedor = true; this.formularioProveedor = { ...pv }; this.mostrarModalProveedor = true; }
  guardarProveedor(): void {
    if (!this.formularioProveedor.nombre) return;
    if (this.modoEdicionProveedor) {
      const idx = this.proveedores.findIndex(p => p.nombre === this.formularioProveedor.nombre);
      if (idx > -1) this.proveedores[idx] = { ...this.proveedores[idx], ...this.formularioProveedor };
      this.registrarActividad('editar', `Proveedor "${this.formularioProveedor.nombre}" actualizado`);
    } else {
      this.proveedores.push({ id: this.proveedores.length + 1, activo: true, ...this.formularioProveedor });
      this.registrarActividad('crear', `Proveedor "${this.formularioProveedor.nombre}" creado`);
    }
    this.mostrarModalProveedor = false;
  }
  toggleProveedor(pv: Proveedor): void { pv.activo = !pv.activo; }
  eliminarProveedor(pv: Proveedor): void { this.proveedores = this.proveedores.filter(p => p.id !== pv.id); }

  // ---- Roles ----
  seleccionarRol(r: Rol): void { this.rolSeleccionado = r; }
  tienePermiso(rol: Rol, clave: string): boolean { return rol.permisosActivos.includes(clave); }
  togglePermiso(rol: Rol, clave: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) { if (!rol.permisosActivos.includes(clave)) rol.permisosActivos.push(clave); }
    else { rol.permisosActivos = rol.permisosActivos.filter(p => p !== clave); }
  }
  todosMarcados(grupo: GrupoPermisos): boolean {
    if (!this.rolSeleccionado) return false;
    return grupo.permisos.every(p => this.rolSeleccionado!.permisosActivos.includes(p.clave));
  }
  toggleTodosGrupo(grupo: GrupoPermisos, event: Event): void {
    if (!this.rolSeleccionado) return;
    const checked = (event.target as HTMLInputElement).checked;
    grupo.permisos.forEach(p => {
      if (checked) { if (!this.rolSeleccionado!.permisosActivos.includes(p.clave)) this.rolSeleccionado!.permisosActivos.push(p.clave); }
      else { this.rolSeleccionado!.permisosActivos = this.rolSeleccionado!.permisosActivos.filter(x => x !== p.clave); }
    });
  }
  guardarPermisos(): void {
    if (!this.rolSeleccionado) return;
    const idx = this.roles.findIndex(r => r.nombre === this.rolSeleccionado!.nombre);
    if (idx > -1) this.roles[idx] = { ...this.rolSeleccionado };
    this.registrarActividad('editar', `Permisos del rol "${this.rolSeleccionado.nombre}" actualizados`);
  }

  cerrarSesion(): void { window.location.href = '/login'; }
}
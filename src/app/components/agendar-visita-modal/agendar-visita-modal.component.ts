import {
  Component,
  EventEmitter,
  Output,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';

interface FormularioVisita {
  nombreApellido: string;
  correoElectronico: string;
  telefono: string;
  edadAdultoMayor: string;
  nivelDependencia: string;
  observacionesSalud: string;
  fechaSeleccionada: string;
  horaSeleccionada: string;
}

interface ErroresFormulario {
  nombreApellido: string;
  correoElectronico: string;
  telefono: string;
  edadAdultoMayor: string;
  nivelDependencia: string;
  fechaSeleccionada: string;
  horaSeleccionada: string;
}

interface EvaluacionForm {
  movilidad: string;
  avd: string;
  cognitivo: string;
  emocional: string;
  condiciones: {
    hipertension: boolean;
    diabetes: boolean;
    dificultadesCaminar: boolean;
    incontinencia: boolean;
    problemasAudicionVision: boolean;
    postOperatoria: boolean;
    otra: boolean;
  };
  medicacion: string;
  motivo: string;
}

@Component({
  selector: 'app-agendar-visita-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './agendar-visita-modal.component.html',
  styleUrl: './agendar-visita-modal.component.css',
})
export class AgendarVisitaModalComponent {
  @Output() cerrar = new EventEmitter<void>();

  mostrarModalVisita = false;
  mostrarEvaluacion = false;
  mostrarModalEvaluacion = false;
  mostrarModalConfirmacion = false;
  enviandoFormulario = false;
  evaluacionIniciada = false;

  mesActual = new Date().getMonth();
  anioActual = new Date().getFullYear();
  diasDelMes: { dia: number; esHoy: boolean; disponible: boolean }[] = [];
  horasDisponibles: string[] = [
    '09:00 - 10:00',
    '10:00 - 11:00',
    '11:00 - 12:00',
    '14:00 - 15:00',
    '15:00 - 16:00',
    '16:00 - 17:00',
  ];

  formularioVisita: FormularioVisita = {
    nombreApellido: '',
    correoElectronico: '',
    telefono: '',
    edadAdultoMayor: '',
    nivelDependencia: '',
    observacionesSalud: '',
    fechaSeleccionada: '',
    horaSeleccionada: '',
  };

  erroresVisita: ErroresFormulario = {
    nombreApellido: '',
    correoElectronico: '',
    telefono: '',
    edadAdultoMayor: '',
    nivelDependencia: '',
    fechaSeleccionada: '',
    horaSeleccionada: '',
  };

  evaluacionForm: EvaluacionForm = {
    movilidad: '',
    avd: '',
    cognitivo: '',
    emocional: '',
    condiciones: {
      hipertension: false,
      diabetes: false,
      dificultadesCaminar: false,
      incontinencia: false,
      problemasAudicionVision: false,
      postOperatoria: false,
      otra: false,
    },
    medicacion: '',
    motivo: '',
  };

  erroresEvaluacion = {
    movilidad: false,
    avd: false,
    cognitivo: false,
    emocional: false,
    medicacion: false,
    motivo: false,
    condiciones: false,
  };

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
  ) {
    this.generarCalendario();
  }

  abrir(): void {
    this.mostrarModalVisita = true;
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'hidden';
    }
  }

  cerrarModalVisita(): void {
    this.mostrarModalVisita = false;
    this.mostrarEvaluacion = false;
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'auto';
    }
    this.cerrar.emit();
  }

  toggleEvaluacion(): void {
    if (this.mostrarEvaluacion) {
      this.cerrarModalVisita();
      setTimeout(() => {
        this.mostrarModalEvaluacion = true;
      }, 300);
    }
  }

  cerrarModalEvaluacion(): void {
    this.mostrarModalEvaluacion = false;
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'auto';
    }
  }

  volverAAgendarVisita(): void {
    this.mostrarModalEvaluacion = false;
    this.mostrarEvaluacion = false;
    setTimeout(() => {
      this.mostrarModalVisita = true;
    }, 300);
  }

  verificarEvaluacionIniciada(): void {
    const tieneRespuestas =
      this.evaluacionForm.movilidad !== '' ||
      this.evaluacionForm.avd !== '' ||
      this.evaluacionForm.cognitivo !== '' ||
      this.evaluacionForm.emocional !== '' ||
      this.evaluacionForm.medicacion !== '' ||
      this.evaluacionForm.motivo !== '' ||
      Object.values(this.evaluacionForm.condiciones).some((v) => v === true);

    this.evaluacionIniciada = tieneRespuestas;

    if (tieneRespuestas) {
      this.limpiarErroresEvaluacion();
    }
  }

  limpiarErroresEvaluacion(): void {
    if (this.evaluacionForm.movilidad !== '')
      this.erroresEvaluacion.movilidad = false;
    if (this.evaluacionForm.avd !== '') this.erroresEvaluacion.avd = false;
    if (this.evaluacionForm.cognitivo !== '')
      this.erroresEvaluacion.cognitivo = false;
    if (this.evaluacionForm.emocional !== '')
      this.erroresEvaluacion.emocional = false;
    if (this.evaluacionForm.medicacion !== '')
      this.erroresEvaluacion.medicacion = false;
    if (this.evaluacionForm.motivo !== '')
      this.erroresEvaluacion.motivo = false;

    const tieneCondiciones = Object.values(
      this.evaluacionForm.condiciones,
    ).some((v) => v === true);
    if (tieneCondiciones) this.erroresEvaluacion.condiciones = false;
  }

  validarEvaluacionCompleta(): boolean {
    if (!this.evaluacionIniciada) {
      return true;
    }

    this.erroresEvaluacion = {
      movilidad: false,
      avd: false,
      cognitivo: false,
      emocional: false,
      medicacion: false,
      motivo: false,
      condiciones: false,
    };

    let esValido = true;

    if (this.evaluacionForm.movilidad === '') {
      this.erroresEvaluacion.movilidad = true;
      esValido = false;
    }
    if (this.evaluacionForm.avd === '') {
      this.erroresEvaluacion.avd = true;
      esValido = false;
    }
    if (this.evaluacionForm.cognitivo === '') {
      this.erroresEvaluacion.cognitivo = true;
      esValido = false;
    }
    if (this.evaluacionForm.emocional === '') {
      this.erroresEvaluacion.emocional = true;
      esValido = false;
    }
    if (this.evaluacionForm.medicacion === '') {
      this.erroresEvaluacion.medicacion = true;
      esValido = false;
    }
    if (this.evaluacionForm.motivo === '') {
      this.erroresEvaluacion.motivo = true;
      esValido = false;
    }

    const tieneCondiciones = Object.values(
      this.evaluacionForm.condiciones,
    ).some((v) => v === true);
    if (!tieneCondiciones) {
      this.erroresEvaluacion.condiciones = true;
      esValido = false;
    }

    return esValido;
  }

  guardarEvaluacionYContinuar(): void {
    this.verificarEvaluacionIniciada();

    if (!this.evaluacionIniciada) {
      this.mostrarModalEvaluacion = false;
      setTimeout(() => {
        this.mostrarModalVisita = true;
      }, 300);
      return;
    }

    if (!this.validarEvaluacionCompleta()) {
      if (isPlatformBrowser(this.platformId)) {
        setTimeout(() => {
          const primerError = document.querySelector(
            '.evaluacion__pregunta--error',
          );
          if (primerError) {
            primerError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }
      return;
    }

    console.log('Evaluación guardada:', this.evaluacionForm);
    this.mostrarEvaluacion = true;
    this.mostrarModalEvaluacion = false;
    setTimeout(() => {
      this.mostrarModalVisita = true;
    }, 300);
  }

  generarCalendario(): void {
    const primerDia = new Date(this.anioActual, this.mesActual, 1).getDay();
    const ultimoDia = new Date(
      this.anioActual,
      this.mesActual + 1,
      0,
    ).getDate();
    const hoy = new Date();

    this.diasDelMes = [];

    for (let i = 0; i < primerDia; i++) {
      this.diasDelMes.push({ dia: 0, esHoy: false, disponible: false });
    }

    for (let dia = 1; dia <= ultimoDia; dia++) {
      const fecha = new Date(this.anioActual, this.mesActual, dia);
      const esHoy = fecha.toDateString() === hoy.toDateString();
      const disponible = fecha >= hoy;

      this.diasDelMes.push({ dia, esHoy, disponible });
    }
  }

  mesAnterior(): void {
    if (this.mesActual === 0) {
      this.mesActual = 11;
      this.anioActual--;
    } else {
      this.mesActual--;
    }
    this.generarCalendario();
  }

  mesSiguiente(): void {
    if (this.mesActual === 11) {
      this.mesActual = 0;
      this.anioActual++;
    } else {
      this.mesActual++;
    }
    this.generarCalendario();
  }

  get nombreMes(): string {
    const meses = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];
    return meses[this.mesActual];
  }

  seleccionarFecha(dia: number): void {
    if (dia > 0) {
      this.formularioVisita.fechaSeleccionada = `${dia}/${this.mesActual + 1}/${
        this.anioActual
      }`;
    }
  }

  seleccionarHora(hora: string): void {
    this.formularioVisita.horaSeleccionada = hora;
    if (this.formularioVisita.fechaSeleccionada) {
      this.verificarDisponibilidadAPI(
        this.formularioVisita.fechaSeleccionada,
        hora,
      );
    }
  }

  validarNombreApellido(): void {
    const valor = this.formularioVisita.nombreApellido.trim();
    if (!valor) {
      this.erroresVisita.nombreApellido = 'El nombre y apellido es obligatorio';
    } else if (valor.length < 3) {
      this.erroresVisita.nombreApellido = 'Debe tener al menos 3 caracteres';
    } else if (!/^[a-záéíóúñ\s]+$/i.test(valor)) {
      this.erroresVisita.nombreApellido = 'Solo se permiten letras y espacios';
    } else {
      this.erroresVisita.nombreApellido = '';
    }
  }

  validarCorreoElectronico(): void {
    const valor = this.formularioVisita.correoElectronico.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!valor) {
      this.erroresVisita.correoElectronico =
        'El correo electrónico es obligatorio';
    } else if (!emailRegex.test(valor)) {
      this.erroresVisita.correoElectronico =
        'Ingresa un correo electrónico válido';
    } else {
      this.erroresVisita.correoElectronico = '';
    }
  }

  validarTelefono(): void {
    const valor = this.formularioVisita.telefono.trim();
    const telRegex = /^[0-9]{9,15}$/;

    if (!valor) {
      this.erroresVisita.telefono = 'El móvil es obligatorio';
    } else if (!/^[0-9+\s-]+$/.test(valor)) {
      this.erroresVisita.telefono =
        'Solo se permiten números, +, espacios y guiones';
    } else {
      const soloNumeros = valor.replace(/[^0-9]/g, '');
      if (!telRegex.test(soloNumeros)) {
        this.erroresVisita.telefono = 'Ingresa un número válido (9-15 dígitos)';
      } else {
        this.erroresVisita.telefono = '';
      }
    }
  }

  validarEdadAdultoMayor(): void {
    const valor = this.formularioVisita.edadAdultoMayor;
    const edad = parseInt(valor);

    if (!valor) {
      this.erroresVisita.edadAdultoMayor = 'La edad es obligatoria';
    } else if (isNaN(edad)) {
      this.erroresVisita.edadAdultoMayor = 'Ingresa un número válido';
    } else if (edad < 60) {
      this.erroresVisita.edadAdultoMayor = 'La edad debe ser 60 años o mayor';
    } else if (edad > 120) {
      this.erroresVisita.edadAdultoMayor = 'Ingresa una edad válida';
    } else {
      this.erroresVisita.edadAdultoMayor = '';
    }
  }

  validarNivelDependencia(): void {
    if (!this.formularioVisita.nivelDependencia) {
      this.erroresVisita.nivelDependencia =
        'Selecciona un nivel de dependencia';
    } else {
      this.erroresVisita.nivelDependencia = '';
    }
  }

  validarFechaSeleccionada(): void {
    if (!this.formularioVisita.fechaSeleccionada) {
      this.erroresVisita.fechaSeleccionada =
        'Selecciona una fecha para la visita';
    } else {
      this.erroresVisita.fechaSeleccionada = '';
    }
  }

  validarHoraSeleccionada(): void {
    if (!this.formularioVisita.horaSeleccionada) {
      this.erroresVisita.horaSeleccionada =
        'Selecciona un horario para la visita';
    } else {
      this.erroresVisita.horaSeleccionada = '';
    }
  }

  enviarSolicitudVisita(): void {
    this.validarNombreApellido();
    this.validarCorreoElectronico();
    this.validarTelefono();
    this.validarEdadAdultoMayor();
    this.validarNivelDependencia();
    this.validarFechaSeleccionada();
    this.validarHoraSeleccionada();

    const hayErrores = Object.values(this.erroresVisita).some(
      (error) => error !== '',
    );

    if (hayErrores) {
      return;
    }

    this.enviandoFormulario = true;

    const payload: any = {
      nombreApellido: this.formularioVisita.nombreApellido,
      correoElectronico: this.formularioVisita.correoElectronico,
      telefono: this.formularioVisita.telefono,
      edadAdultoMayor: parseInt(this.formularioVisita.edadAdultoMayor),
      nivelDependencia: this.formularioVisita.nivelDependencia,
      observacionesSalud: this.formularioVisita.observacionesSalud || undefined,
      fechaSeleccionada: this.formularioVisita.fechaSeleccionada,
      horaSeleccionada: this.formularioVisita.horaSeleccionada,
    };

    if (this.mostrarEvaluacion && this.evaluacionIniciada) {
      payload.evaluacion = {
        movilidad: this.evaluacionForm.movilidad,
        avd: this.evaluacionForm.avd,
        cognitivo: this.evaluacionForm.cognitivo,
        emocional: this.evaluacionForm.emocional,
        condiciones: this.evaluacionForm.condiciones,
        medicacion: this.evaluacionForm.medicacion,
        motivo: this.evaluacionForm.motivo,
      };
    }

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .post('https://backend-dalias.onrender.com/visitas/agendar', payload, {
        headers,
      })
      .subscribe({
        next: (response: any) => {
          console.log('Respuesta exitosa:', response);
          this.enviandoFormulario = false;
          this.mostrarModalConfirmacion = true;
        },
        error: (error) => {
          console.error('Error al enviar solicitud:', error);
          this.enviandoFormulario = false;

          if (error.status === 409) {
            this.erroresVisita.horaSeleccionada =
              'Esta fecha y hora ya está reservada. Por favor, selecciona otro horario.';
          } else if (error.status === 400) {
            alert(
              'Error en los datos enviados. Por favor verifica el formulario.',
            );
          } else {
            alert(
              'Ocurrió un error al agendar la visita. Por favor intenta nuevamente.',
            );
          }
        },
      });
  }

  verificarDisponibilidadAPI(fecha: string, hora: string): void {
    this.http
      .get(
        `https://backend-dalias.onrender.com/visitas/verificar-disponibilidad`,
        {
          params: { fecha, hora },
        },
      )
      .subscribe({
        next: (response: any) => {
          if (!response.disponible) {
            this.erroresVisita.horaSeleccionada =
              'Este horario ya está ocupado';
          }
        },
        error: (error) => {
          console.error('Error al verificar disponibilidad:', error);
        },
      });
  }

  cerrarModalConfirmacion(): void {
    this.mostrarModalConfirmacion = false;

    this.formularioVisita = {
      nombreApellido: '',
      correoElectronico: '',
      telefono: '',
      edadAdultoMayor: '',
      nivelDependencia: '',
      observacionesSalud: '',
      fechaSeleccionada: '',
      horaSeleccionada: '',
    };

    this.erroresVisita = {
      nombreApellido: '',
      correoElectronico: '',
      telefono: '',
      edadAdultoMayor: '',
      nivelDependencia: '',
      fechaSeleccionada: '',
      horaSeleccionada: '',
    };

    this.evaluacionForm = {
      movilidad: '',
      avd: '',
      cognitivo: '',
      emocional: '',
      condiciones: {
        hipertension: false,
        diabetes: false,
        dificultadesCaminar: false,
        incontinencia: false,
        problemasAudicionVision: false,
        postOperatoria: false,
        otra: false,
      },
      medicacion: '',
      motivo: '',
    };

    this.cerrarModalVisita();
  }
}

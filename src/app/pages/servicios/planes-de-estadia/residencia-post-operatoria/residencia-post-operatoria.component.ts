import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface PreguntaFrecuente {
  id: number;
  pregunta: string;
  respuesta: string;
  activo: boolean;
}

interface FormularioContacto {
  mensaje: string;
  nombre: string;
  correo: string;
  numeroMovil: string;
}

interface ErroresContacto {
  nombre: string;
  correo: string;
  numeroMovil: string;
}

@Component({
  selector: 'app-residencia-post-operatoria',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterLink],
  templateUrl: './residencia-post-operatoria.component.html',
  styleUrl: './residencia-post-operatoria.component.css',
})
export class ResidenciaPostOperatoriaComponent {
  // Formulario de contacto
  formularioContacto: FormularioContacto = {
    mensaje: '',
    nombre: '',
    correo: '',
    numeroMovil: '',
  };

  erroresContacto: ErroresContacto = {
    nombre: '',
    correo: '',
    numeroMovil: '',
  };

  mostrarModalConfirmacionContacto = false;

  // Preguntas frecuentes
  preguntasFrecuentes: PreguntaFrecuente[] = [
    {
      id: 1,
      pregunta: '¿Qué sucede si mi familiar necesita un ajuste en su medicación durante la estancia?',
      respuesta: 'Nuestro equipo multidisciplinario realiza un control terapéutico riguroso. Cualquier ajuste se coordina directamente con el médico tratante, asegurando que la administración de fármacos y el alivio del dolor sigan estrictamente los protocolos de bioseguridad y la evolución del residente.',
      activo: false,
    },
    {
      id: 2,
      pregunta: '¿Cómo determinan qué nivel de cuidado (1, 2 o 3) requiere mi familiar?',
      respuesta: 'Realizamos una Evaluación Médica inicial del informe hospitalario. Analizamos el grado de autonomía, el tipo de intervención (como cadera o abdominal) y la necesidad de dispositivos de apoyo para asignar el nivel de asistencia y la infraestructura adecuada.',
      activo: false,
    },
    {
      id: 3,
      pregunta: '¿Puedo estar en contacto con mi familiar si no puedo visitarlo diariamente?',
      respuesta: '¡Por supuesto! La conexión emocional es vital para la recuperación. Ofrecemos Asistencia en Comunicación, brindando soporte técnico para videollamadas, permitiendo que la familia participe activamente en el ánimo del residente mientras este descansa en su habitación suite.',
      activo: false,
    },
    {
      id: 4,
      pregunta: '¿El plan incluye rehabilitación física o debo contratarla por separado?',
      respuesta: 'El plan es integral. Incluye sesiones de Fisioterapia Personalizada y rehabilitación física según el nivel de dependencia. Nos enfocamos en recuperar movilidad y fuerza diariamente para que la transición de vuelta al hogar sea segura, independiente y sin temores.',
      activo: false,
    },
  ];

  constructor(private http: HttpClient) {}

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

  scrollToServicios() {
    const seccionServicios = document.getElementById('section_post');

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

  // Métodos de validación del formulario
  validarNombreContacto(): void {
    const valor = this.formularioContacto.nombre.trim();
    if (!valor) {
      this.erroresContacto.nombre = 'El nombre es obligatorio';
    } else if (valor.length < 3) {
      this.erroresContacto.nombre = 'Debe tener al menos 3 caracteres';
    } else if (!/^[a-záéíóúñ\s]+$/i.test(valor)) {
      this.erroresContacto.nombre = 'Solo se permiten letras y espacios';
    } else {
      this.erroresContacto.nombre = '';
    }
  }

  validarCorreoContacto(): void {
    const valor = this.formularioContacto.correo.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!valor) {
      this.erroresContacto.correo = 'El correo electrónico es obligatorio';
    } else if (!emailRegex.test(valor)) {
      this.erroresContacto.correo = 'Ingresa un correo electrónico válido';
    } else {
      this.erroresContacto.correo = '';
    }
  }

  validarNumeroMovil(): void {
    const valor = this.formularioContacto.numeroMovil.trim();
    const telRegex = /^[0-9]{9,15}$/;

    if (!valor) {
      this.erroresContacto.numeroMovil = 'El número de móvil es obligatorio';
    } else if (!/^[0-9]+$/.test(valor)) {
      this.erroresContacto.numeroMovil = 'Solo se permiten números';
    } else if (!telRegex.test(valor)) {
      this.erroresContacto.numeroMovil =
        'Ingresa un número válido (9-15 dígitos)';
    } else {
      this.erroresContacto.numeroMovil = '';
    }
  }

  enviarFormularioContacto(): void {
    this.validarNombreContacto();
    this.validarCorreoContacto();
    this.validarNumeroMovil();

    const hayErrores = Object.values(this.erroresContacto).some(
      (error) => error !== '',
    );

    if (hayErrores) {
      return;
    }

    const payload = {
      nombre: this.formularioContacto.nombre,
      correo: this.formularioContacto.correo,
      numeroMovil: this.formularioContacto.numeroMovil,
      mensaje: this.formularioContacto.mensaje || '',
    };

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .post('https://backend-dalias.onrender.com/contacto', payload, {
        headers,
      })
      .subscribe({
        next: (response: any) => {
          console.log('Respuesta exitosa:', response);
          this.mostrarModalConfirmacionContacto = true;
          this.limpiarFormulario();
        },
        error: (error) => {
          console.error('Error al enviar formulario:', error);
          alert(
            'Ocurrió un error al enviar el mensaje. Por favor intenta nuevamente.',
          );
        },
      });
  }

  cerrarModalConfirmacionContacto(): void {
    this.mostrarModalConfirmacionContacto = false;
  }

  limpiarFormulario(): void {
    this.formularioContacto = {
      mensaje: '',
      nombre: '',
      correo: '',
      numeroMovil: '',
    };

    this.erroresContacto = {
      nombre: '',
      correo: '',
      numeroMovil: '',
    };
  }
}
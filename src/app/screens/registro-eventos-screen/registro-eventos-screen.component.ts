import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { EventosService } from 'src/app/services/eventos.service';
import { MaestrosService } from 'src/app/services/maestros.service';
import { AdministradoresService } from 'src/app/services/administradores.service';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-registro-eventos-screen',
  templateUrl: './registro-eventos-screen.component.html',
  styleUrls: ['./registro-eventos-screen.component.scss']
})
export class RegistroEventosScreenComponent implements OnInit {
  public formEvento: FormGroup;
  public mostrarProgramaEducativo = false;
  public publicoObjetivoInvalid = false;

  // Opciones para los selects
  tiposEvento = ['Conferencia', 'Taller', 'Seminario', 'Concurso'];
  publicosObjetivo = ['Estudiantes', 'Profesores', 'Público general'];
  programasEducativos = [
    'Ingeniería en Ciencias de la Computación',
    'Licenciatura en Ciencias de la Computación',
    'Ingeniería en Tecnologías de la Información'
  ];

  responsables: any[] = [];
  publicoSeleccionado: string[] = [];

  constructor(
    private fb: FormBuilder,
    private eventosService: EventosService,
    private maestrosService: MaestrosService,
    private adminService: AdministradoresService,
    private dateAdapter: DateAdapter<Date>,
    public router: Router
  ) {
    this.dateAdapter.setLocale('es-MX'); // Configura el locale para fechas
    this.initForm();
  }

  ngOnInit(): void {
    this.obtenerResponsables();
  }

  initForm(): void {
    this.formEvento = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      tipo_evento: ['', Validators.required],
      fecha_realizacion: ['', Validators.required],
      hora_inicio: ['', [Validators.required, Validators.pattern(/^(0?[1-9]|1[0-2]):[0-5][0-9] [AP]M$/)]],
      hora_fin: ['', [Validators.required, Validators.pattern(/^(0?[1-9]|1[0-2]):[0-5][0-9] [AP]M$/)]],
      lugar: ['', [Validators.required, Validators.maxLength(100)]],
      publico_json: this.fb.array([], Validators.required),
      programa_educativo: [''],
      responsable: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.maxLength(300)]],
      cupo_maximo: ['', [Validators.required, Validators.min(1)]]
    });
  }

  get publicoArray(): FormArray {
    return this.formEvento.get('publico_json') as FormArray;
  }

  onPublicoObjetivoChange(event: MatCheckboxChange, publico: string): void {
    if (event.checked) {
      this.publicoArray.push(this.fb.control(publico));
      this.publicoSeleccionado.push(publico);
    } else {
      const index = this.publicoSeleccionado.indexOf(publico);
      if (index >= 0) {
        this.publicoSeleccionado.splice(index, 1);
        this.publicoArray.removeAt(index);
      }
    }

    // Validar si se necesita mostrar programa educativo
    this.mostrarProgramaEducativo = this.publicoSeleccionado.includes('Estudiantes');
    if (this.mostrarProgramaEducativo) {
      this.formEvento.get('programa_educativo')?.setValidators([Validators.required]);
    } else {
      this.formEvento.get('programa_educativo')?.clearValidators();
      this.formEvento.get('programa_educativo')?.setValue('');
    }
    this.formEvento.get('programa_educativo')?.updateValueAndValidity();

    // Validar que haya al menos un público seleccionado
    this.publicoObjetivoInvalid = this.publicoSeleccionado.length === 0;
  }

  obtenerResponsables(): void {
    this.maestrosService.obtenerListaMaestros().subscribe(
      (res: any) => {
        this.responsables = [...res];
      },
      (err: any) => console.error('Error cargando maestros', err)
    );

    this.adminService.obtenerListaAdmins().subscribe(
      (res: any) => {
        this.responsables = [...this.responsables, ...res];
      },
      (err: any) => console.error('Error cargando administradores', err)
    );
  }

  registrarEvento(): void {
    if (this.formEvento.invalid || this.publicoObjetivoInvalid) {
      this.formEvento.markAllAsTouched();
      alert('Por favor complete todos los campos requeridos correctamente.');
      return;
    }

    const formData = this.formEvento.value;
    const fechaFormateada = new Date(formData.fecha_realizacion).toISOString().split('T')[0];

    const eventoData = {
      name: formData.name,
      tipo_evento: formData.tipo_evento,
      fecha_realizacion: fechaFormateada,
      hora_inicio: formData.hora_inicio,
      hora_fin: formData.hora_fin,
      lugar: formData.lugar,
      publico_json: formData.publico_json,
      programa_educativo: formData.programa_educativo || null,
      responsable: formData.responsable,
      descripcion: formData.descripcion,
      cupo_maximo: formData.cupo_maximo
    };

    this.eventosService.registrarEvento(eventoData).subscribe(
      (response: any) => {
        alert('Evento registrado correctamente');
        this.router.navigate(['/eventos']);
      },
      (error: any) => {
        console.error('Error al registrar evento:', error);
        let errorMessage = 'Ocurrió un error al registrar el evento:';
        
        if (error.error) {
          if (error.error.hora_inicio) errorMessage += `\n- Hora inicio: ${error.error.hora_inicio}`;
          if (error.error.hora_fin) errorMessage += `\n- Hora fin: ${error.error.hora_fin}`;
          if (error.error.responsable) errorMessage += `\n- Responsable: ${error.error.responsable}`;
          if (error.error.publico_json) errorMessage += `\n- Público objetivo: ${error.error.publico_json}`;
        }
        
        alert(errorMessage);
      }
    );
  }
}
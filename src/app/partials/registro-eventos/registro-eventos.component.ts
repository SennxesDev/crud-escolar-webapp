import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { EventosService } from 'src/app/services/eventos.service';
import { MaestrosService } from 'src/app/services/maestros.service';
import { AdministradoresService } from 'src/app/services/administradores.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-registro-eventos',
  templateUrl: './registro-eventos.component.html',
  styleUrls: ['./registro-eventos.component.scss']
})
export class RegistroEventosComponent implements OnInit {
  eventoForm: FormGroup;
  tiposEvento = ['Conferencia', 'Taller', 'Seminario', 'Concurso'];
  publicosObjetivo = [
    { value: 'Estudiantes', label: 'Estudiantes' },
    { value: 'Profesores', label: 'Profesores' },
    { value: 'Público general', label: 'Público general' },
  ];
  programasEducativos = [
    'Ingeniería en Ciencias de la Computación',
    'Licenciatura en Ciencias de la Computación',
    'Ingeniería en Tecnologías de la Información'
  ];
  responsables: any[] = []; // Administradores y maestros

  constructor(
    private fb: FormBuilder,
    private eventosService: EventosService,
    private maestrosService: MaestrosService,
    private adminService: AdministradoresService,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.eventoForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.pattern('^[\w\sáéíóúÁÉÍÓÚñÑ.,:;()\-]+$')]],
      tipo: ['', Validators.required],
      fecha: ['', Validators.required],
      hora_inicio: ['', Validators.required],
      hora_fin: ['', Validators.required],
      lugar: ['', [Validators.required, Validators.pattern('^[\w\sáéíóúÁÉÍÓÚñÑ.,:;()\-]+$')]],
      publico_objetivo: this.fb.array([], Validators.required),
      programa_educativo: [''],
      responsable: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.maxLength(300), Validators.pattern('^[\w\sáéíóúÁÉÍÓÚñÑ.,:;()\-]+$')]],
      cupo_maximo: ['', [Validators.required, Validators.pattern('^\d{1,3}$')]]
    });
  }

  ngOnInit(): void {
    this.obtenerResponsables();
  }

  get publico_objetivo() {
    return this.eventoForm.get('publico_objetivo') as FormArray;
  }

  onCheckboxChange(e: any) {
    const array: FormArray = this.publico_objetivo;
    if (e.target.checked) {
      array.push(this.fb.control(e.target.value));
    } else {
      const index = array.controls.findIndex(x => x.value === e.target.value);
      array.removeAt(index);
    }

    const estudiantesSeleccionado = array.value.includes('Estudiantes');
    if (estudiantesSeleccionado) {
      this.eventoForm.get('programa_educativo')?.setValidators([Validators.required]);
    } else {
      this.eventoForm.get('programa_educativo')?.clearValidators();
      this.eventoForm.get('programa_educativo')?.setValue('');
    }
    this.eventoForm.get('programa_educativo')?.updateValueAndValidity();
  }

  obtenerResponsables() {
    this.maestrosService.obtenerListaMaestros().subscribe(
      res => {
        this.responsables.push(...res);
      }
    );
    this.adminService.obtenerListaAdmins().subscribe(
      res => {
        this.responsables.push(...res);
      }
    );
  }

  registrarEvento() {
    if (this.eventoForm.invalid) {
      this.eventoForm.markAllAsTouched();
      return;
    }

    const eventoData = {
      titulo: this.eventoForm.value.titulo,
      tipo: this.eventoForm.value.tipo,
      fecha: this.eventoForm.value.fecha,
      descripcion: this.eventoForm.value.descripcion,
      lugar: this.eventoForm.value.lugar,
      hora_inicio: this.eventoForm.value.hora_inicio,
      hora_fin: this.eventoForm.value.hora_fin,
      cupo_maximo: this.eventoForm.value.cupo_maximo,
      publico_objetivo: this.eventoForm.value.publico_objetivo,
      programa_educativo: this.eventoForm.value.programa_educativo,
      ponente: this.responsables.find(r => r.id == this.eventoForm.value.responsable)?.user?.first_name || 'Responsable'
    };

    this.eventosService.registrarEvento(eventoData).subscribe(
      res => {
        alert("Evento registrado correctamente");
        this.router.navigate(['/lista-eventos']);
      },
      err => {
        alert("No se pudo registrar el evento");
      }
    );
  }
}

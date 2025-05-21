import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { EventosService } from 'src/app/services/eventos.service';
import { FacadeService } from 'src/app/services/facade.service';
import { ActivatedRoute } from '@angular/router';
declare var $:any;

@Component({
  selector: 'app-registro-eventos',
  templateUrl: './registro-eventos.component.html',
  styleUrls: ['./registro-eventos.component.scss'],
})
export class RegistroEventosComponent implements OnInit {
  public tipo:string = "registro-eventos";
  public evento:any = {};
  public lista_responsables: any[] = [];
  public editar: boolean=false;
  public errors:any = {};
  public token: string = "";



  //Para el select
  public tipos: any[] = [
    {value: '1', viewValue: 'Conferencia'},
    {value: '2', viewValue: 'Taller'},
    {value: '3', viewValue: 'Seminario'},
    {value: '4', viewValue: 'Concurso'},
  ];
  public programas: any[] = [
    {value: '1', viewValue: 'Ingeniería en Ciencias de la Computación'},
    {value: '2', viewValue: 'Licenciatura en Cincias de la Computación'},
    {value: '3', viewValue: 'Ingeniería en Tecnologías de la Información'},
  ];

  public publico: any[] = [
    {value: '1', personas: 'Estudiantes'},
    {value: '2', personas: 'Profesores'},
    {value: '3', personas: 'Público General'}
  ];

  constructor(
    private location: Location,
    private router:Router,
    private eventosService: EventosService,
    private route: ActivatedRoute,
    private facadeService: FacadeService,
  ){}

  ngOnInit(): void {
      this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.editar = true;

        this.eventosService.getEventoByID(id).subscribe(
          (response) => {
            this.evento = response;

            //Convertir publico_json si viene como string
            if (!Array.isArray(this.evento.publico_json)) {
              try {
                this.evento.publico_json = JSON.parse(this.evento.publico_json || "[]");
              } catch {
                this.evento.publico_json = [];
              }
            }

            console.log("Datos cargados:", this.evento);
          },
          (error) => {
            alert("No se pudo cargar el evento");
            this.router.navigate(["/eventos"]);
          }
        );
      } else {
        this.evento = this.eventosService.esquemaEvento();
      }
    });

    this.obtenerResponsables();
  }

  public regresar(){
    this.location.back();
  }


  public registrar(){
    this.errors = this.eventosService.validarEvento(this.evento, this.editar);

    if (!$.isEmptyObject(this.errors)) {
      return false;
    }

    // Asegúrate de convertir publico_json a string JSON
    if (typeof this.evento.publico_json === 'string') {
      try {
        this.evento.publico_json = JSON.parse(this.evento.publico_json);
      } catch {
        this.evento.publico_json = [];
      }
    }

    const eventoParaEnviar = {
      ...this.evento,
      publico_json: JSON.stringify(this.evento.publico_json),
      hora_inicio: this.evento.hora_inicio,
      hora_fin: this.evento.hora_fin,
      cupo_maximo: parseInt(this.evento.cupo_maximo, 10)
    };

    // Convertir programa_educativo a string si viene vacío
    if (!this.evento.programa_educativo) {
      this.evento.programa_educativo = "";
    }

    this.eventosService.registrarEvento(eventoParaEnviar).subscribe(
      (response) => {
        alert("Evento registrado correctamente");
        this.router.navigate(["home"]);
      },
      (error) => {
        console.error("Error detallado:", error);
        const mensaje = error.error?.detalle || error.error?.error || "Datos inválidos";
        alert(mensaje);
      }
    );
  }

  public actualizar(){
    this.errors = this.eventosService.validarEvento(this.evento, this.editar);

    if (!$.isEmptyObject(this.errors)) {
      return false;
    }

    // Convertir publico_json a string antes de enviar
    if (Array.isArray(this.evento.publico_json)) {
      this.evento.publico_json = JSON.stringify(this.evento.publico_json);
    }

    this.eventosService.editarEvento(this.evento).subscribe(
      (response) => {
        alert("Evento actualizado correctamente");
        this.router.navigate(["/eventos"]);
      },
      (error) => {
        alert("Error al actualizar el evento");
        console.error("Error:", error);
      }
    );
  }

  //checkbox

  public checkboxChange(event:any){
      console.log("Evento: ", event);
      if(event.checked){
        this.evento.publico_json.push(event.source.value)
      }else{
        console.log(event.source.value);
        this.evento.publico_json.forEach((publico, i) => {
          if(publico == event.source.value){
            this.evento.publico_json.splice(i,1)
          }
        });
      }
      if (!this.evento.publico_json.includes("Estudiantes")) {
        this.evento.programa_educativo = "";
      }
      console.log("Array publico: ", this.evento);
  }


  public revisarSeleccion(personas: string){
    return Array.isArray(this.evento.publico_json) && this.evento.publico_json.includes(personas);
  }

  //Función para detectar el cambio de fecha
  public changeFecha(event :any){
    console.log(event);
    console.log(event.value.toISOString());

    this.evento.fecha_realizacion = event.value.toISOString().split("T")[0];
    console.log("Fecha: ", this.evento.fecha_realizacion);
  }

  get estudiantesSeleccionados(): boolean {
    return Array.isArray(this.evento.publico_json) && this.evento.publico_json.includes('Estudiantes');
  }

  public letrasyNumeros(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    // Permitir solo letras (mayúsculas y minúsculas) y espacio
    if (
      !(charCode >= 65 && charCode <= 90) &&  // Letras mayúsculas
      !(charCode >= 97 && charCode <= 122) && // Letras minúsculas
      !(charCode >= 48 && charCode <= 57) && // Números
      charCode !== 32                         // Espacio
    ) {
      event.preventDefault();
    }
  }

  public parrafo(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    // Permitir solo letras (mayúsculas y minúsculas) y espacio
    if (
      !(charCode >= 65 && charCode <= 90) &&  // Letras mayúsculas
      !(charCode >= 97 && charCode <= 122) && // Letras minúsculas
      !(charCode >= 48 && charCode <= 57) && // Números
      !(charCode >= 44 && charCode <= 46) && // Signos de puntiación
      !(charCode >= 58 && charCode <= 59) && // Signos de puntiación
      charCode !== 33 &&                          // Signos de puntiación
      charCode !== 63 &&                          // Signos de puntiación
      charCode !== 168 &&                          // Signos de puntiación
      charCode !== 173 &&                          // Signos de puntiación
      charCode !== 32                           // Espacio
    ) {
      event.preventDefault();
    }
  }

public obtenerResponsables() {
  this.eventosService.obtenerListaResponsables().subscribe(
    (response) => {
      // Asume que el backend ya devuelve una lista unificada con nombre_completo e id
      this.lista_responsables = response;
    },
    (error) => {
      alert("No se pudo obtener la lista de los responsables");
      console.error(error);
    }
  );
}
    cargarEvento(id: number) {
      this.eventosService.getEventoByID(id).subscribe(
        (response) => {
          this.evento = response;
          console.log("Datos cargados:", this.evento);
        },
        (error) => {
          alert("No se pudo cargar el evento");
          this.router.navigate(["/eventos"]);
        }
      );
    }

}

export interface DatosUsuario {
  name:string,
  tipo_evento: string,
  fecha_realizacion: string,
  hora_inicio: string,
  hora_fin: string,
  lugar: string,
  publico_json: string,
  programa_educativo: string,
  responsable: string,
  descripcion: string,
  cupo_maximo: number;
}

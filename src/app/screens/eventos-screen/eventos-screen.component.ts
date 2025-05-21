import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { EliminarEventoComponent } from 'src/app/modals/eliminar-evento/eliminar-evento.component';
import { EventosService } from 'src/app/services/eventos.service';
import { FacadeService } from 'src/app/services/facade.service';

@Component({
  selector: 'app-eventos-screen',
  templateUrl: './eventos-screen.component.html',
  styleUrls: ['./eventos-screen.component.scss']
})
export class EventosScreenComponent implements OnInit{
  public name_user:string = "";
  public rol:string = "";
  public token : string = "";
  public lista_eventos:any[] = [];

  displayedColumns: string[] = ['nombre', 'tipo', 'fecha', 'horario', 'lugar', 'publico', 'programa', 'responsable', 'descripcion', 'cupo', 'editar', 'eliminar'];
  dataSource = new MatTableDataSource<DatosEvento>(this.lista_eventos as DatosEvento[]);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
      public facadeService: FacadeService,
      private eventosService: EventosService,
      private router: Router,
      public dialog: MatDialog
  ){}

  ngOnInit(): void {
    this.name_user = this.facadeService.getUserCompleteName();
    this.rol = this.facadeService.getUserGroup();

    this.token = this.facadeService.getSessionToken();
    console.log("Token: ", this.token);
    if(this.token == ""){
      this.router.navigate([""]);
    }

    this.obtenerEventos();

     this.initPaginator();
  }

  public initPaginator(){
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      //console.log("Paginator: ", this.dataSourceIngresos.paginator);
      //Modificar etiquetas del paginador a español
      this.paginator._intl.itemsPerPageLabel = 'Registros por página';
      this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
        if (length === 0 || pageSize === 0) {
          return `0 / ${length}`;
        }
        length = Math.max(length, 0);
        const startIndex = page * pageSize;
        const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
        return `${startIndex + 1} - ${endIndex} de ${length}`;
      };
      this.paginator._intl.firstPageLabel = 'Primera página';
      this.paginator._intl.lastPageLabel = 'Última página';
      this.paginator._intl.previousPageLabel = 'Página anterior';
      this.paginator._intl.nextPageLabel = 'Página siguiente';
    },500);
    //this.dataSourceIngresos.paginator = this.paginator;
  }

  public obtenerEventos(){
    this.eventosService.obtenerListaEventos().subscribe(
      (response)=>{
        this.lista_eventos = response;
        console.log("Lista eventos: ", this.lista_eventos);
        if(this.lista_eventos.length > 0){
          console.log("Eventos: ", this.lista_eventos);

          this.dataSource = new MatTableDataSource<DatosEvento>(this.lista_eventos as DatosEvento[]);
        }
      }, (error)=>{
        alert("No se pudo obtener la lista de eventos");
      }
    );
  }

  public goEditar(idUser: number){
    this.router.navigate(["registro-eventos/evento/"+idUser])
  }

  public delete(idUser: number){
    const dialogRef = this.dialog.open(EliminarEventoComponent,{
      data: {id: idUser},
      height: '288px',
      width: '328px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.isDelete){
        console.log("Evento eliminado");
        //Recargar página
        window.location.reload();
      }else{
        alert("Evento no eliminado ");
        console.log("No se eliminó el Evento");
        }
    });
  }

  convertirHoraFormato24a12(hora_str: string): string {
    if (!hora_str) return '';

    const [hh, mm] = hora_str.split(':');
    let hour = parseInt(hh, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;

    return `${hour}:${mm} ${period}`;
  }

}

export interface DatosEvento {
  id: number;
  name: string;
  tipo_evento: string;
  fecha_realizacion: string;
  hora_inicio: string;
  hora_fin: string;
  lugar: string;
  publico_json: string[];
  programa_educativo: string;
  responsable: string;
  descripcion: string;
  cupo_maximo: number;
}

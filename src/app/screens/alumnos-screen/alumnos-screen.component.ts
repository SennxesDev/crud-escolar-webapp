import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { EliminarUserModalComponent } from 'src/app/modals/eliminar-user-modal/eliminar-user-modal.component';


@Component({
  selector: 'app-alumnos-screen',
  templateUrl: './alumnos-screen.component.html',
  styleUrls: ['./alumnos-screen.component.scss']
})
export class AlumnosScreenComponent implements OnInit{

  public name_user: string = "";
  public rol: string = "";
  public token: string = "";
  public lista_alumnos: any[] = [];

  // Para la tabla
  displayedColumns: string[] = ['matricula', 'nombre', 'email', 'fecha_nacimiento', 'curp', 'rfc', 'edad', 'telefono', 'ocupacion', 'editar', 'eliminar'];
  dataSource = new MatTableDataSource<DatosAlumno>(this.lista_alumnos as DatosAlumno[]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    public facadeService: FacadeService,
    public alumnosService: AlumnosService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.name_user = this.facadeService.getUserCompleteName();
    this.rol = this.facadeService.getUserGroup();

    // Validar sesión
    this.token = this.facadeService.getSessionToken();
    console.log("Token: ", this.token);
    if (this.token === "") {
      this.router.navigate([""]);
    }

    // Obtener alumnos
    this.obtenerAlumnos();

    // Configurar paginador
    this.initPaginator();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  // Configuración del paginador en español
  public initPaginator() {
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
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
    }, 500);
  }

  // Obtener lista de alumnos
  public obtenerAlumnos() {
    this.alumnosService.obtenerListaAlumnos().subscribe(
      (response) => {
        this.lista_alumnos = response;
        console.log("Lista de alumnos: ", this.lista_alumnos);

        if (this.lista_alumnos.length > 0) {
          this.lista_alumnos.forEach(alumno => {
            alumno.first_name = alumno.user.first_name;
            alumno.last_name = alumno.user.last_name;
            alumno.email = alumno.user.email;
          });

          this.dataSource = new MatTableDataSource<DatosAlumno>(this.lista_alumnos as DatosAlumno[]);
          this.dataSource.paginator = this.paginator;
        }
      },
      (error) => {
        alert("No se pudo obtener la lista de alumnos");
      }
    );
  }

  // Editar alumno
  public goEditar(idUser: number) {
    this.router.navigate(["registro-usuarios/alumno/"+idUser]);
  }

  // Eliminar alumno
public delete(idUser: number){
    const dialogRef = this.dialog.open(EliminarUserModalComponent,{
      data: {id: idUser, rol: 'alumno'}, //Se pasan valores a través del componente
      height: '288px',
      width: '328px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.isDelete){
        console.log("Alumno eliminado");
        //Recargar página
        window.location.reload();
      }else{
        alert("Alumno no eliminado ");
        console.log("No se eliminó el alumno");
      }
    });
  }

}// Fin de la clase

// Interfaz de datos del alumno
export interface DatosAlumno {
  id: number;
  matricula: string;
  first_name: string;
  last_name: string;
  email: string;
  fecha_nacimiento: string;
  curp: string;
  rfc: string;
  edad: number;
  telefono: string;
  ocupacion: string;
}
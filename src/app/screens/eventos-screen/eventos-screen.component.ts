import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { EventosService } from 'src/app/services/eventos.service';
import { FacadeService } from 'src/app/services/facade.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { EliminarUserModalComponent } from 'src/app/modals/eliminar-user-modal/eliminar-user-modal.component';

@Component({
  selector: 'app-eventos-screen',
  templateUrl: './eventos-screen.component.html',
  styleUrls: ['./eventos-screen.component.scss']
})
export class EventosScreenComponent implements OnInit {

  public rol: string = '';
  public eventos: any[] = [];
  public dataSource = new MatTableDataSource<any>();
  public displayedColumns: string[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private eventosService: EventosService,
    private facadeService: FacadeService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.rol = this.facadeService.getUserGroup().toLowerCase();
    this.configurarColumnas();
    this.cargarEventos();
  }

  configurarColumnas(): void {
    this.displayedColumns = [
      'titulo',
      'tipo',
      'fecha',
      'hora_inicio',
      'hora_fin',
      'lugar',
      'publico_objetivo',
      'programa_educativo',
      'ponente',
      'descripcion',
      'cupo_maximo'
    ];

    if (this.rol === 'administrador') {
      this.displayedColumns.push('editar', 'eliminar');
    }
  }

  cargarEventos(): void {
    this.eventosService.obtenerListaEventos().subscribe(
      res => {
        this.eventos = res.filter(evento => {
          const publico = evento.publico_objetivo || [];

          if (this.rol === 'maestro') {
            return publico.includes('Profesores') || publico.includes('Público general');
          } else if (this.rol === 'alumno') {
            return publico.includes('Estudiantes') || publico.includes('Público general');
          }

          return true; // Administrador ve todos
        });

        this.dataSource = new MatTableDataSource(this.eventos);
        this.dataSource.paginator = this.paginator;
      },
      err => {
        alert('No se pudieron cargar los eventos');
      }
    );
  }

  goEditar(eventoId: number): void {
    this.router.navigate([`/registro-eventos/${eventoId}`]);
  }

  goRegistroEvento(): void {
    this.router.navigate(['/registro-eventos']);
  }

  eliminarEvento(eventoId: number): void {
    const dialogRef = this.dialog.open(EliminarUserModalComponent, {
      data: { id: eventoId, rol: 'evento' },
      height: '288px',
      width: '328px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.isDelete) {
        this.eventosService.eliminarEvento(eventoId).subscribe(
          res => {
            alert('Evento eliminado correctamente');
            this.cargarEventos(); // recargar tabla
          },
          err => {
            alert('Error al eliminar el evento');
          }
        );
      }
    });
  }

  puedeEditarEliminar(): boolean {
    return this.rol === 'administrador';
  }
}

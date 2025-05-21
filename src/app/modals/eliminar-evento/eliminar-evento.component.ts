import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EventosService } from 'src/app/services/eventos.service';
import { FacadeService } from 'src/app/services/facade.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-eliminar-evento',
  templateUrl: './eliminar-evento.component.html',
  styleUrls: ['./eliminar-evento.component.scss']
})
export class EliminarEventoComponent implements OnInit{
  public rol:string = ""

  constructor(
    private facadeService: FacadeService,
    private http: HttpClient,
    private eventosService: EventosService,
    private dialogRef: MatDialogRef<EliminarEventoComponent>,
    @Inject (MAT_DIALOG_DATA) public data: any
  ){}

  ngOnInit(): void {
    this.rol = this.data.rol;
  }

  public cerrar_modal(){
    this.dialogRef.close({isDelete:false});
  }

  public eliminarEvento(){
    this.eventosService.eliminarEvento(this.data.id).subscribe(
        (response)=>{
          console.log(response);
          this.dialogRef.close({isDelete:true});
        }, (error)=>{
          this.dialogRef.close({isDelete:false});
        }
      );
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ValidatorService } from './tools/validator.service';
import { ErrorsService } from './tools/errors.service';
import { environment } from 'src/environments/environment';
import { FacadeService } from './facade.service';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class EventosService {


  constructor(
    private http: HttpClient,
    private validatorService: ValidatorService,
    private errorService: ErrorsService,
    private facadeService: FacadeService
  ) { }

  public esquemaEvento(){
    return{
      'name': '',
      'tipo_evento': '',
      'fecha_realizacion': '',
      'hora_inicio': '',
      'hora_fin': '',
      'lugar': '',
      'publico_json': [],
      'programa_educativo': '',
      'responsable': '',
      'descripcion': '',
      'cupo_maximo': '',
    }
  }

  public validarEvento(data: any, editar: boolean){
    console.log("Validando evento... ", data);
    let error: any = [];
    const publicoJson = data["publico_json"];

    if(!this.validatorService.required(data["name"])){
      error["name"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["tipo_evento"])){
      error["tipo_evento"] = this.errorService.required;
    }
    if (!this.validatorService.required(data["fecha_realizacion"])) {
      error["fecha_realizacion"] = this.errorService.required;
    } else if (!this.validatorService.fechaActualoFutura(data["fecha_realizacion"])) {
      error["fecha_realizacion"] = "La fecha no puede ser anterior a hoy.";
    }
    if(!this.validatorService.required(data["hora_inicio"])){
      error["hora_inicio"] = this.errorService.required;
    }
    if(!this.validatorService.required(data["hora_fin"])){
      error["hora_fin"] = this.errorService.required;
    }
    if(!this.validatorService.required(data["lugar"])){
      error["lugar"] = this.errorService.required;
    }
    if (data["publico_json"] && Array.isArray(data["publico_json"]) && data["publico_json"].includes("Estudiantes")) {
      if (!this.validatorService.required(data["programa_educativo"])) {
        error["programa_educativo"] = "Debe seleccionar un programa educativo";
      }
    }
    if (Array.isArray(publicoJson) && publicoJson.includes("Estudiantes")) {
      if (!this.validatorService.required(data["programa_educativo"])) {
        error["programa_educativo"] = "Debe seleccionar un programa educativo";
      }
    }
    if(!this.validatorService.required(data["responsable"])){
      error["responsable"] = this.errorService.required;
    }
    if(!this.validatorService.required(data["descripcion"])){
      error["descripcion"] = this.errorService.required;
    }
    if(!this.validatorService.required(data["cupo_maximo"])){
      error["cupo_maximo"] = this.errorService.required;
    }

    // Validación de hora_inicio
    if (!this.validatorService.required(data["hora_inicio"])) {
      error["hora_inicio"] = "Debe seleccionar una hora de inicio";
    }

      // Validación de hora_fin
    if (!this.validatorService.required(data["hora_fin"])) {
      error["hora_fin"] = "Debe seleccionar una hora de fin";
    } else if (!this.validatorService.validarHoras(data["hora_inicio"], data["hora_fin"])) {
      error["hora_fin"] = "La hora de fin debe ser mayor a la de inicio";
    }

    if (Array.isArray(data.publico_json) && data.publico_json.includes("Estudiantes")) {
      if (!data.programa_educativo || data.programa_educativo.trim() === "") {
        error["programa_educativo"] = "Programa educativo es obligatorio si hay estudiantes";
      }
    }


    return error;

  }

  public registrarEvento(data: any): Observable <any>{
    return this.http.post<any>(`${environment.url_api}/eventos/`,data,httpOptions)
  }

  public obtenerListaEventos (): Observable <any>{
    var token = this.facadeService.getSessionToken();
    var headers = new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': 'Bearer '+token});
    return this.http.get<any>(`${environment.url_api}/lista-eventos/`, {headers:headers});
  }

  public getEventoByID(idUser: Number){
      return this.http.get<any>(`${environment.url_api}/eventos/?id=${idUser}`,httpOptions);
    }

  //Servicios HTTP
  public obtenerListaResponsables(): Observable<any> {
    const token = this.facadeService.getSessionToken();
    const headers = new HttpHeaders({ 
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token 
    });

    return this.http.get<any>(`${environment.url_api}/lista-responsables/`, { headers });
    }

  public editarEvento (data: any): Observable <any>{
    var token = this.facadeService.getSessionToken();
    var headers = new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': 'Bearer '+token});
    return this.http.put<any>(`${environment.url_api}/eventos-edit/`, data, {headers:headers});
  }

  //Eliminar Evento
  public eliminarEvento(idUser: number): Observable <any>{
    var token = this.facadeService.getSessionToken();
    var headers = new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': 'Bearer '+token});
    return this.http.delete<any>(`${environment.url_api}/eventos-edit/?id=${idUser}`,{headers:headers});
  }


}

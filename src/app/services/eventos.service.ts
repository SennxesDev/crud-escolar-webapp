import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FacadeService } from './facade.service';

@Injectable({
  providedIn: 'root'
})
export class EventosService {

  constructor(
    private http: HttpClient,
    private facadeService: FacadeService
  ) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.facadeService.getSessionToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
  }

  // Obtener todos los eventos
  public obtenerEventos(): Observable<any> {
    return this.http.get(`${environment.url_api}/eventos/`, {
      headers: this.getAuthHeaders()
    });
  }

  // Registrar un nuevo evento
  public registrarEvento(data: any): Observable<any> {
    return this.http.post(`${environment.url_api}/eventos/`, data, {
      headers: this.getAuthHeaders()
    });
  }

  // Obtener un solo evento por ID
  public obtenerEventoPorID(id: number): Observable<any> {
    return this.http.get(`${environment.url_api}/eventos/${id}/`, {
      headers: this.getAuthHeaders()
    });
  }

  // Editar evento
  public editarEvento(id: number, data: any): Observable<any> {
    return this.http.put(`${environment.url_api}/eventos/${id}/`, data, {
      headers: this.getAuthHeaders()
    });
  }

  // Eliminar evento
  public eliminarEvento(id: number): Observable<any> {
    return this.http.delete(`${environment.url_api}/eventos/${id}/`, {
      headers: this.getAuthHeaders()
    });
  }
}

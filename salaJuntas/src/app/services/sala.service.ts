import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

//Servicio donde se hacen las peticiones HTTP a la API de Node.js
export class SalaService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getSalas(): Observable<any> {
    return this.http.get(`${this.baseUrl}/salas`);
  }

  crearSala(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/salas`, data);
  }

  getReservas(): Observable<any> {
    return this.http.get(`${this.baseUrl}/reservas`);
  }

  crearReserva(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/reservas`, data);
  }

  eliminarReserva(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/reservas/${id}`);
  }
}

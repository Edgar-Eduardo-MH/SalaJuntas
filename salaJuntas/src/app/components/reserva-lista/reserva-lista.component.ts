import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reserva-lista',
  imports: [CommonModule, FormsModule],
  templateUrl: './reserva-lista.component.html',
  styleUrl: './reserva-lista.component.css'
})
export class ReservaListaComponent implements OnInit {
  reservas: any[] = [];
  salas: any[] = [];

  constructor(private http: HttpClient) {}

  //Cargar las reservas y salas al iniciar el componente
  ngOnInit(): void {
    this.obtenerReservas();
    this.obtenerSalas();
  }

  //Obtiene las reservas de la API
  // y las almacena en la variable reservas
  obtenerReservas(): void {
    this.http.get<any[]>('http://localhost:3000/reservas')
      .subscribe({
        next: (data) => {
          this.reservas = data;
        },
        error: (err) => {
          console.error('Error al obtener reservas:', err);
        }
      });
  }

  //Obtiene las salas de la API
  // y las almacena en la variable salas
  obtenerSalas() {
    this.http.get<any[]>('http://localhost:3000/salas').subscribe({
      next: (data) => this.salas = data,
      error: (err) => console.error('Error al obtener salas', err)
    });
  }

  //Elimina una reserva de la API al dar click en el boton de eliminar
  eliminarReserva(id: number): void {
    if (confirm('¿Estás seguro de eliminar esta reserva?')) {
      this.http.delete(`http://localhost:3000/reservas/${id}`)
        .subscribe({
          next: () => {
            this.obtenerReservas();
          },
          error: (err) => {
            console.error('Error al eliminar reserva:', err);
          }
        });
    }
  }

}

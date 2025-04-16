import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reserva-lista',
  imports: [CommonModule],
  templateUrl: './reserva-lista.component.html',
  styleUrl: './reserva-lista.component.css'
})
export class ReservaListaComponent implements OnInit {
  reservas: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.obtenerReservas();
  }

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

import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reserva-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './reserva-form.component.html',
  styleUrl: './reserva-form.component.css'
})

export class ReservaFormComponent {
  reserva = {
    sala_id: 1,
    hora_inicio: '',
    hora_fin: ''
  };

  constructor(private http: HttpClient) {}

  crearReserva() {
    const inicio = new Date(this.reserva.hora_inicio);
    const fin = new Date(this.reserva.hora_fin);

    const payload = {
      sala_id: this.reserva.sala_id,
      fecha: inicio.toISOString().split('T')[0], // "2025-04-15"
      hora_inicio: inicio.toTimeString().split(' ')[0].slice(0, 5), // "10:00"
      hora_fin: fin.toTimeString().split(' ')[0].slice(0, 5) // "12:00"
    };

    this.http.post('http://localhost:3000/reservas', payload).subscribe({
      next: (res) => {
        alert('Reserva creada correctamente');
        console.log(res);
      },
      error: (err) => {
        console.error(err);
        if (err.status === 400 || err.status === 409) {
          alert(err.error);
        } else {
          alert('Error desconocido al crear reserva');
        }
      }
    });
  }
}
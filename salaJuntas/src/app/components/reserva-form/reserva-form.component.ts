import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reserva-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './reserva-form.component.html',
  styleUrl: './reserva-form.component.css'
})

export class ReservaFormComponent {
  reserva = {
    sala_id: null,
    hora_inicio: '',
    hora_fin: ''
  };

  salas: any[] = [];

  constructor(private http: HttpClient) {}

  //Cargar las salas al iniciar el componente
  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:3000/salas').subscribe({
      next: (data) => {
        this.salas = data;
        if (this.salas.length > 0) {
          this.reserva.sala_id = this.salas[0].id;
        }
      },
      error: (err) => {
        console.error('Error al cargar salas:', err);
        alert('Error al cargar salas');
      }
    });
  } 

  //Funcion para validar la fecha y hora de inicio y fin de la reserva
  crearReserva() {
    const inicio = new Date(this.reserva.hora_inicio);
    const fin = new Date(this.reserva.hora_fin);

    //Dividir la fecha y hora para que la API lo entienda
    const payload = {
      sala_id: this.reserva.sala_id,
      fecha: inicio.toISOString().split('T')[0],
      hora_inicio: inicio.toTimeString().split(' ')[0].slice(0, 5),
      hora_fin: fin.toTimeString().split(' ')[0].slice(0, 5)
    };

    //Envia la solicitud a la API para crear la reserva
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
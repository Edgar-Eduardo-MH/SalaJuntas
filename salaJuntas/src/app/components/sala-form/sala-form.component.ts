import { Component } from '@angular/core';
import { SalaService } from '../../services/sala.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sala-form',
  imports: [FormsModule, CommonModule],
  templateUrl: './sala-form.component.html',
  styleUrl: './sala-form.component.css'
})

// Componente para crear una nueva sala de reuniones
export class SalaFormComponent {
  sala = {
    nombre: '',
    capacidad: 0,
    ubicacion: ''
  };

  mensaje: string = '';

  constructor(private salaService: SalaService) {}

  //Funcion que se encarga de validar los datos y enviar la solicitud a la API
  crearSala(): void {
    this.salaService.crearSala(this.sala).subscribe({
      next: (res) => {
        this.mensaje = 'Sala creada correctamente';
        this.sala = { nombre: '', capacidad: 0, ubicacion: '' };
      },
      error: (err) => {
        console.error(err);
        this.mensaje = 'Error al crear la sala';
      }
    });
  }
}

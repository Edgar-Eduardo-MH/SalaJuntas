import { Component } from '@angular/core';
import { SalaService } from '../../services/sala.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sala-form',
  imports: [FormsModule],
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

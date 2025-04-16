import { Component } from '@angular/core';
import { SalaService } from '../../services/sala.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sala-lista',
  imports: [CommonModule],
  templateUrl: './sala-lista.component.html',
  styleUrl: './sala-lista.component.css'
})

// Componente para mostrar las salas de reuniones
export class SalaListaComponent {
  salas: any[] = [];
  cargando = true;

  constructor(private salaService: SalaService) {}

  ngOnInit(): void {
    this.obtenerSalas();
  }

  obtenerSalas(): void {
    this.salaService.getSalas().subscribe({
      next: (data) => {
        this.salas = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al obtener salas:', err);
        this.cargando = false;
      }
    });
  }
}

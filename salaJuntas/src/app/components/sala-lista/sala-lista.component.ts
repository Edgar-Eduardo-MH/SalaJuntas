import { Component } from '@angular/core';
import { SalaService } from '../../services/sala.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sala-lista',
  imports: [CommonModule, FormsModule],
  templateUrl: './sala-lista.component.html',
  styleUrl: './sala-lista.component.css'
})

// Componente para mostrar las salas de reuniones
export class SalaListaComponent {
  salas: any[] = [];
  cargando = true;
  salaEditando: any = null;

  constructor(private salaService: SalaService) {}

  ngOnInit(): void {
    this.obtenerSalas();
  }

  // Obtiene la lista de salas de la API
  // y las almacena en la variable salas
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

  editarSala(sala: any): void {
    // Clonamos el objeto para no modificar el original directamente
    this.salaEditando = { ...sala };
  }

  cancelarEdicion(): void {
    this.salaEditando = null;
  }

  guardarEdicion(): void {
    this.salaService.actualizarSala(this.salaEditando).subscribe({
      next: () => {
        // Actualizar la lista de salas
        this.obtenerSalas();
        this.salaEditando = null;
      },
      error: (err) => {
        console.error('Error al actualizar sala:', err);
        alert('No se pudo actualizar la sala.');
      }
    });
  }
  
  eliminarSala(id: number) {
    if (confirm('¿Estás seguro de eliminar esta sala?')) {
      this.salaService.eliminarSala(id).subscribe({
        next: (response) => {
          this.salas = this.salas.filter(s => s.id !== id);
          alert('Sala eliminada correctamente');
        },
        error: (err) => {
          console.error('Error al eliminar sala:', err);
          alert('Error al eliminar sala');
        },
        complete: () => {
          console.log('Eliminación completada');
        }
      });
    }
  }
  
}

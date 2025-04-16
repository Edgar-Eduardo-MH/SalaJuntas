import { Routes } from '@angular/router';
import { SalaListaComponent } from './components/sala-lista/sala-lista.component';
import { SalaFormComponent } from './components/sala-form/sala-form.component';
import { ReservaFormComponent } from './components/reserva-form/reserva-form.component';
import { ReservaListaComponent } from './components/reserva-lista/reserva-lista.component';

export const routes: Routes = [
  { path: '', component: SalaFormComponent }, 
  { path: 'salas', component: SalaListaComponent },
  { path: 'reservas', component: ReservaFormComponent },
  { path: 'reservas2', component: ReservaListaComponent },
  { path: '**', redirectTo: '' }
];
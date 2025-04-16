import { Routes } from '@angular/router';
import { SalaListaComponent } from './components/sala-lista/sala-lista.component';
import { SalaFormComponent } from './components/sala-form/sala-form.component';
import { ReservaFormComponent } from './components/reserva-form/reserva-form.component';
import { ReservaListaComponent } from './components/reserva-lista/reserva-lista.component';

//Rutas que se usaron para la navegacion del navbar
export const routes: Routes = [
  { path: '', component: ReservaFormComponent }, 
  { path: 'salas', component: SalaListaComponent },
  { path: 'reservas2', component: ReservaListaComponent },
  { path: 'salas2', component: SalaFormComponent },
  { path: '**', redirectTo: '' }
];
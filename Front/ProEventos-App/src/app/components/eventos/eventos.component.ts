import { Component } from '@angular/core';
import { TituloComponent } from '../../shared/titulo/titulo.component';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { EventoListaComponent } from './evento-lista/evento-lista.component';

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [TituloComponent, CommonModule, RouterOutlet, EventoListaComponent],
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent {

}

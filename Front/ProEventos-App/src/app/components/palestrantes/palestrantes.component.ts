import { Component } from '@angular/core';
import { TituloComponent } from "../../shared/titulo/titulo.component";

@Component({
  selector: 'app-palestrantes',
  standalone: true,
  imports: [TituloComponent],
  templateUrl: './palestrantes.component.html',
  styleUrl: './palestrantes.component.css'
})
export class PalestrantesComponent {

}

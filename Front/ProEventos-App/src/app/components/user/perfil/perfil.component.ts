import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { TituloComponent } from "../../../shared/titulo/titulo.component";
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-perfil',
  standalone: true,
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
  imports: [TituloComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PerfilComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

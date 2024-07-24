import { CommonModule } from '@angular/common';
import { Component, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { DateTimeFormatPipe } from '../../helpers/DateTimeFormat.pipe';

import { EventoService } from '../../services/evento.service';

import { Evento } from '../../models/Evento';

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { TituloComponent } from "../../shared/titulo/titulo.component";


@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [CommonModule, FormsModule, DateTimeFormatPipe, CollapseModule, ModalModule, TooltipModule, ToastrModule, NgxSpinnerModule, TituloComponent],
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css'],
  providers: [BsModalService]
})
export class EventosComponent {
  public eventos: Evento[] = [];
  public eventosFiltrados: Evento[] = [];

  public mostrarImagem: boolean = true;
  private _filtroLista: string = '';

  private modalRef?: BsModalRef;

  public get filtroLista(): string {
    return this._filtroLista;
  }

  public set filtroLista(value: string) {
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista
      ? this.filtrarEventos(this.filtroLista)
      : this.eventos;
  }

  constructor(private eventoService: EventoService, private modalService: BsModalService, private toastr: ToastrService, private spinner: NgxSpinnerService) {}

  public ngOnInit(): void {
    this.getEventos();
    this.spinner.show();

    setTimeout(() => {
      this.spinner.hide();
    }, 1000);
  }

  public getEventos(): void {
    this.eventoService.getEventos().subscribe({
      next: (eventos: Evento[]) => {
        this.eventos = eventos;
        this.eventosFiltrados = this.eventos;
      },
      error: (erro: any) => {
        this.spinner.hide();
        this.toastr.error('Erro ao carregar os eventos.', 'Error!')
      },
      complete: () => this.spinner.hide()
    });
  }

  public alterarImagem(): void {
    this.mostrarImagem = !this.mostrarImagem;
  }

  public filtrarEventos(filtrarPor: string): Evento[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      (evento: Evento) =>
        evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1 ||
        evento.local.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  public openModal(template: TemplateRef<void>): void {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  public confirm(): void {
    this.modalRef?.hide();
    this.toastr.success('O Evento foi deletado com sucesso.', 'Deletado!');
  }

  public decline(): void {
    this.modalRef?.hide();
  }
}

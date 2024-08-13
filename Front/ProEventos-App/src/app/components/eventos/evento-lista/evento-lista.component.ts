import { Component, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Evento } from '../../../models/Evento';
import { EventoService } from '../../../services/evento.service';
import { DateTimeFormatPipe } from '../../../helpers/DateTimeFormat.pipe';

import { TituloComponent } from '../../../shared/titulo/titulo.component';

import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-evento-lista',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DateTimeFormatPipe,
    CollapseModule,
    ModalModule,
    TooltipModule,
    ToastrModule,
    NgxSpinnerModule,
    TituloComponent,
    RouterLink,
  ],
  templateUrl: './evento-lista.component.html',
  styleUrl: './evento-lista.component.css',
  providers: [BsModalService],
})
export class EventoListaComponent {
  public eventos: Evento[] = [];
  public eventosFiltrados: Evento[] = [];
  public eventoId!: number;

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

  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}

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
        this.toastr.error('Erro ao carregar os eventos.', 'Error!');
      },
      complete: () => this.spinner.hide(),
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

  public openModal(
    event: any,
    template: TemplateRef<void>,
    eventoId: number
  ): void {
    event.stopPropagation();
    this.eventoId = eventoId;
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  public confirm(): void {
    this.modalRef?.hide();
    this.spinner.show();

    this.eventoService.deleteEvento(this.eventoId).subscribe({
      next: (result: string) => {
        this.toastr.success('O Evento foi deletado com sucesso.', 'Deletado!');
        this.spinner.hide();
        this.getEventos();
      },
      error: (error: any) => {
        this.toastr.error(
          `Erro ao tentar deletar o evento ${this.eventoId}.`,
          'Erro'
        );
        this.spinner.hide();
      },
      complete: () => {
        this.spinner.hide();
      },
    }).add(() => this.spinner.hide());
  }

  public decline(): void {
    this.modalRef?.hide();
  }

  public detalheEvento(eventoId: number): void {
    this.router.navigate([`eventos/detalhe/${eventoId}`]);
  }
}

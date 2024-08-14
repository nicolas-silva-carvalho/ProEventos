import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BsDatepickerModule, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';
import { ActivatedRoute } from '@angular/router';
import { EventoService } from '../../../services/evento.service';
import { Evento } from '../../../models/Evento';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ToastrModule, ToastrService } from 'ngx-toastr';
defineLocale('pt-br', ptBrLocale);

@Component({
  selector: 'app-evento-detalhe',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BsDatepickerModule,
    ToastrModule,
    NgxSpinnerModule,
    BsDatepickerModule
  ],
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.css'], // Corrigido de styleUrl para styleUrls
})
export class EventoDetalheComponent implements OnInit {
  evento!: Evento;
  form!: FormGroup;
  estadoSalvar = 'post';

  get f(): any {
    return this.form.controls;
  }

  get bsConfig(): any {
    return {
      isAnimated: true,
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY hh:mm a',
      containerClass: 'theme-default',
      showWeekNumbers: false,
    };
  }

  constructor(
    private formBuilder: FormBuilder,
    private localeService: BsLocaleService,
    private router: ActivatedRoute,
    private eventoService: EventoService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {
    this.localeService.use('pt-br');
  }

  ngOnInit(): void {
    this.validation();
    this.carregarEvento();
  }

  public validation(): void {
    this.form = this.formBuilder.group({
      tema: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(50),
        ],
      ],
      local: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(50),
        ],
      ],
      dataEvento: ['', [Validators.required]],
      qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      imagemURL: ['', Validators.required],
    });
  }

  public resetForm(): void {
    this.form.reset();
  }

  public carregarEvento(): void {
    const eventoIdParam = this.router.snapshot.paramMap.get('id');

    if (eventoIdParam != null) {
      this.spinner.show();
      this.estadoSalvar = 'put';
      this.eventoService.getEventoById(+eventoIdParam).subscribe({
        next: (evento: Evento) => {
          this.evento = { ...evento };
          this.form.patchValue(this.evento);
        },
        error: (erro: any) => {
          this.spinner.hide();
          console.error('Erro ao tentar carregar evento:', erro);
          this.toastr.error('Erro ao tentar carregar evento.', 'Erro!');
        },
        complete: () => this.spinner.hide(),
      });
    }
  }

  public salvarAlteracao(): void {
    this.spinner.show();
    if (this.form.valid) {
      if (this.estadoSalvar === 'post') {
        this.evento = { ...this.form.value };
        this.eventoService['post'](this.evento).subscribe({
          next: () => {
            this.toastr.success('Evento salvo com sucesso!', 'Sucesso!');
          },
          error: (erro: any) => {
            this.spinner.hide();
            this.toastr.error('Erro ao salvar evento.', 'Erro!');
          },
          complete: () => this.spinner.hide(),
        });
      } else {
        this.evento = {id: this.evento.id, ...this.form.value };
        this.eventoService['put'](this.evento).subscribe({
          next: () => {
            this.toastr.success('Evento salvo com sucesso!', 'Sucesso!');
          },
          error: (erro: any) => {
            this.spinner.hide();
            this.toastr.error('Erro ao salvar evento.', 'Erro!');
          },
          complete: () => this.spinner.hide(),
        });
      }
    }
  }
}

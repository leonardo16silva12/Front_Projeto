import { SharedModule } from './../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PessoasPesquisaComponent } from './pessoas-pesquisa/pessoas-pesquisa.component';
import { RouterModule } from '@angular/router';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {TableModule} from 'primeng/table';
import {TooltipModule} from 'primeng/tooltip';
import { PessoasCadastroComponent } from './pessoas-cadastro/pessoas-cadastro.component';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {CalendarModule} from 'primeng/calendar';
import {PanelModule} from 'primeng/panel';
import {DialogModule} from 'primeng/dialog';





@NgModule({
  declarations: [PessoasPesquisaComponent, PessoasCadastroComponent],
  exports: [PessoasPesquisaComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule,
    InputTextModule,
    ButtonModule,
    TableModule,
    TooltipModule,
    AutoCompleteModule,
    CalendarModule,
    PanelModule,
	DialogModule
  ]
})
export class PessoasModule { }

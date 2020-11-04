import { ErrorHandlerService } from './../../core/error-handler.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PessoaFiltro, PessoasService } from '../pessoas.service';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-pessoas-pesquisa',
  templateUrl: './pessoas-pesquisa.component.html',
  styleUrls: ['./pessoas-pesquisa.component.css']
})
export class PessoasPesquisaComponent implements OnInit {

  totalRegistros = 0;
  filtro = new PessoaFiltro();
  pessoas = [];

  @ViewChild('tabela', {static: true}) grid;

  constructor(private pessoasService: PessoasService,
    private confirmation: ConfirmationService,
    private errorHandler: ErrorHandlerService,
    private messageService: MessageService) { }

  ngOnInit() {
    this.pesquisar();
  }

  pesquisar(pagina = 0) {
    this.filtro.pagina = pagina;

    this.pessoasService.pesquisar(this.filtro)
      .then(resultado => {
        this.totalRegistros = resultado.total;
        this.pessoas = resultado.pessoas;
      });
      
    }

  aoMudarPagina(event: LazyLoadEvent) {
      const pagina = event.first / event.rows;
      this.pesquisar(pagina);
  }

  confirmarExclusao(pessoa: any){
    this.confirmation.confirm({
      message: 'Tem certeza que deseja excluir esse registro?',
      accept: () => {
        this.excluir(pessoa);
      }
    });
  }

  excluir(pessoa: any){
    this.pessoasService.excluir(pessoa.codigo)
    .then(() => 
    {
      if (this.grid.first === 0){
        this.pesquisar();
      }
      else {
        this.grid.first = 0;
      }
      this.messageService.add({severity: 'success', summary:'Atenção', detail: 'Pessoa Excluída com Sucesso'});
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

}



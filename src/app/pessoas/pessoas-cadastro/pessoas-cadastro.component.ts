import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { LazyLoadEvent, ConfirmationService, MessageService } from 'primeng/api';
import { PessoaFiltro, PessoasService } from './../pessoas.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ContatosService } from '../contato.service';

@Component({
  selector: 'app-pessoas-cadastro',
  templateUrl: './pessoas-cadastro.component.html',
  styleUrls: ['./pessoas-cadastro.component.css']
})
export class PessoasCadastroComponent implements OnInit {

  formulario: FormGroup;
  results = [];
  contatos = [];
  pessoas = [];
  totalRegistros = 0;
  filtro = new PessoaFiltro();
  exibirFormularioContato = false;

  @ViewChild('tabela', {static: true}) grid;
  constructor(
    private formBuilder: FormBuilder,
    private pessoasService: PessoasService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private errorHandler: ErrorHandlerService,
    private router: Router,
    private confirmation: ConfirmationService,
    // private contatosService: ContatosService,
  ) {


  }

  ngOnInit() {
    this.configurarFormulario();

    const idPessoa = this.route.snapshot.params['codigo'];

    if (idPessoa) {
      this.carregarPessoa(idPessoa);
    }

    // const idContato = this.route.snapshot.params['codigo'];

    // if (idContato){
    //   this.carregarContato(idContato);
    // }

    this.pesquisar();
    this.carregarPessoas();
    // this.carregarContatos();
    // console.log(this.contatos);
    // console.log(this.pessoas);

  }

  

  carregarPessoas(){
    return this.pessoasService.listarTodasPessoas()
    .then(pessoas => {
      this.pessoas = pessoas
      .map(c => ({label: c.nome, value: c.codigo}));
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  // carregarContatos(){
  //   return this.contatosService.listarTodosContatos()
  //   .then(contatos => {
  //     this.contatos = contatos
  //     .map(c => ({label: c.nome, value: c.codigo}));
  //   })
  //   .catch(erro => this.errorHandler.handle(erro));
  // }

  confirmarExclusao(pessoa: any){
    this.confirmation.confirm({
      message: 'Tem certeza que deseja excluir esse registro?',
      accept: () => {
        this.excluir(pessoa);
      }
    });
  }

  pesquisar(pagina = 0) {
    this.filtro.pagina = pagina;

    this.pessoasService.pesquisar(this.filtro)
      .then(resultado => {
        this.totalRegistros = resultado.total;
        this.pessoas = resultado.pessoas;
      });

      // this.contatosService.pesquisar(this.filtro)
      // .then(resultado => {
      //   // this.totalRegistros = resultado.total;
      //   this.contatos = resultado.contatos;
      // });
      
    }

  aoMudarPagina(event: LazyLoadEvent) {
      const pagina = event.first / event.rows;
      this.pesquisar(pagina);
  }

  carregarPessoa(codigo: number) {
    this.pessoasService.buscarPorId(codigo)
      .then(pessoa => {
        this.formulario.patchValue(pessoa);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  configurarFormulario() {
    this.formulario = this.formBuilder.group({

      codigo: [],
      nome: [null, [Validators.required, Validators.minLength(5)]],
      logradouro: [null, [Validators.required, Validators.minLength(5)]],
      numero: [null, [Validators.required]],
      complemento: [null, [Validators.required, Validators.minLength(5)]],
      bairro: [null, [Validators.required, Validators.minLength(5)]],
      cep: [null, [Validators.required, Validators.minLength(5)]],
      cidade: [null, [Validators.required, Validators.minLength(5)]],
      estado: [null, [Validators.required, Validators.minLength(5)]],
      ativo: true
    });
  }

  get editando() {
    return Boolean(this.formulario.get('codigo').value);
  }

  salvar() {
    if (this.editando) {
      this.atualizarPessoa();
    }
    else {
      this.adicionarPessoa();
    }
  }

  adicionarPessoa() {
    this.pessoasService.adicionar(this.formulario.value)
      .then(pessoaAdicionada => {
        this.messageService.add({ severity: 'success', detail: 'Pessoa Adicionada com Sucesso!!!' });

        this.router.navigate(['/pessoas']);
      }).catch(erro => this.errorHandler.handle(erro));
  }

  atualizarPessoa() {
    this.pessoasService.atualizar(this.formulario.value)
      .then(pessoa => {
        this.formulario.patchValue(pessoa);
        this.messageService.add({ severity: 'success', detail: 'Pessoa Alterada com Sucesso!!!' });
      })
      .catch(erro => this.errorHandler.handle(erro));
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

  // carregarContato(id: number) {
  //   this.contatosService.buscarPorId(id)
  //   .then(contato => {
  //     this.formulario.patchValue(contato);
  //   })
  //   .catch(erro => this.errorHandler.handle(erro));
  // }

  // adicionarContato() {
  //   this.contatosService.adicionar(this.formulario.value)
  //   .then(contatoAdicionado => {
  //     this.messageService.add({severity: 'success', detail: 'Contato Adicionado com Sucesso!!!'});
   
  //     this.router.navigate(['/contatos']);
  //   }) .catch(erro => this.errorHandler.handle(erro));
  // }

  // atualizarContato() {
  //   this.contatosService.atualizar(this.formulario.value)
  //   .then(contato => {
  //     this.formulario.patchValue(contato);
  //     this.messageService.add({severity: 'success', detail: 'Contato Alterado com Sucesso!!!'});
  //   })
  //   .catch(erro => this.errorHandler.handle(erro));
  // }
  
  
  prepararNovoContato() {
    this.exibirFormularioContato = true;
  }
    closeForm() {
    this.exibirFormularioContato = false;
  }
  

}

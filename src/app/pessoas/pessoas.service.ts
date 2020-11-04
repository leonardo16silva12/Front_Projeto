import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Pessoa } from '../core/model';

export class PessoaFiltro {
  nome: string;
  cidade: string;
  estado: string;
  pagina = 0;
  itensPorPagina = 10;
}

@Injectable({
  providedIn: 'root'
})
export class PessoasService {

  constructor(private http: HttpClient) { }

  pessoasUrl = 'http://localhost:8080/pessoas';

  pesquisar(filtro: PessoaFiltro): Promise<any> {
    let params = new HttpParams({
      fromObject: {
        page: filtro.pagina.toString(),
        size: filtro.itensPorPagina.toString()
      }
    });

    if (filtro.nome) {
      params = params.append('nome', filtro.nome);
    }

    if (filtro.cidade) {
      params = params.append('cidade', filtro.cidade);
    }

    if (filtro.estado) {
      params = params.append('estado', filtro.estado);
    }

    return this.http.get<any>(`${this.pessoasUrl}`, { params })
      .toPromise()
      .then(response => {
        const pessoas = response.content;

        const resultado = {
          pessoas,
          total: response.totalElements
        }
        return resultado;
      });
  }

  adicionar(pessoa: Pessoa): Promise<Pessoa> {
    return this.http.post<Pessoa>(this.pessoasUrl, pessoa).toPromise();
  }

  atualizar(pessoa: Pessoa): Promise<Pessoa> {
    return this.http.put<Pessoa>(`${this.pessoasUrl}/${pessoa.codigo}`, pessoa)
    .toPromise()
    .then(response => {
      const pessoaAlterada = response;
      return pessoaAlterada;
    });
  }

  excluir(codigo: number): Promise<void> {
    return this.http.delete(`${this.pessoasUrl}/${codigo}`)
      .toPromise()
      .then(() => null);
  }

  buscarPorId(codigo: number): Promise<Pessoa> {
    return this.http.get<Pessoa>(`${this.pessoasUrl}/${codigo}`)
    .toPromise()
    .then(response => {
      const pessoa = response;
      return pessoa;
    })
}

listarTodasPessoas(): Promise<Pessoa[]> {
  return this.http.get<Pessoa[]>(`${this.pessoasUrl}/todas`).toPromise();
}



}
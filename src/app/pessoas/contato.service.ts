import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Contato } from '../core/model';

export class ContatoFiltro {
  nome: string;
  pagina = 0;
  itensPorPagina = 10;
}

@Injectable({
  providedIn: 'root'
})
export class ContatosService {

  constructor(private http: HttpClient) { }

  contatosUrl = 'http://localhost:8080/contatos';

  pesquisar(filtro: ContatoFiltro): Promise<any> {
    let params = new HttpParams({
      fromObject: {
        page: filtro.pagina.toString(),
        size: filtro.itensPorPagina.toString()
      }
    });

    if (filtro.nome) {
      params = params.append('nome', filtro.nome);
    }

    return this.http.get<any>(`${this.contatosUrl}`, { params })
      .toPromise()
      .then(response => {
        const contatos = response.content;

        const resultado = {
          contatos,
          total: response.totalElements
        }
        return resultado;
      });
  }

  adicionar(contato: Contato): Promise<Contato> {
    return this.http.post<Contato>(this.contatosUrl, contato).toPromise();
  }

  atualizar(contato: Contato): Promise<Contato> {
    return this.http.put<Contato>(`${this.contatosUrl}/${contato.codigo}`, contato)
    .toPromise()
    .then(response => {
      const contatoAlterado = response;
      return contatoAlterado;
    });
  }

  excluir(codigo: number): Promise<void> {
    return this.http.delete(`${this.contatosUrl}/${codigo}`)
      .toPromise()
      .then(() => null);
  }

  buscarPorId(codigo: number): Promise<Contato> {
    return this.http.get<Contato>(`${this.contatosUrl}/${codigo} `)
    .toPromise()
    .then(response => {
      const contato = response;
      return contato;
    })
}

listarTodosContatos(): Promise<Contato[]> {
    return this.http.get<Contato[]>(`${this.contatosUrl}/todos`).toPromise();
  }

}
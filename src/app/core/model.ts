export class Pessoa {
    codigo: number;
    nome: string;
	logradouro: string;
	numero: string;
	complemento: string;
	bairro: string;
	cep: string;
	cidade: string;
	estado: string;
	ativo = true;
	contatos = new Array<Contato>();
}

export class ContatoPessoa {
    codigo: number;
    nome: string;
	email: string;
	telefone: string;
	
	constructor(
        codigo?: number,
        nome?: string,
        email?: string,
        telefone?: string,) {
            this.codigo = codigo,
            this.nome = nome,
			this.email = email,
            this.telefone = telefone,

        }
}
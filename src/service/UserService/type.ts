// types.ts

export interface ILogin {
    cpf: string;
    password: string;
  }
  export interface IEsqueciSenha {
    email: string;
  }
  
  export interface ILoginResponse {
    data: {
      access_token: string;
      acesso: string;
      email: string;
      id: string;
      nome: string;
      telefone: string;
    };
    status: number;
  }
  export interface ICultoData {
    tipo: 'culto' | 'evento';
    titulo: string;
    descricao: string;
    data: Date;
    hora: Date;
    corTexto: string;
    imagem?: string | null;
  }
  export interface IEventoData {
    tipo: 'culto' | 'evento';
    titulo: string;
    descricao: string;
    data: Date;
    hora: Date;
    corTexto: string;
    imagem?: string | null;
  }
  
  export interface IEscalaData {
    data: string;
    horario: string;
    tipoCulto: string;
    recepcao: string;
    portaria: string;
    direcao: string;
    pregador: string;
  }
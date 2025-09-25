
export const LoginSchema = {
  email: '',
  senha: ''
};

export const EsqueciSenhaSchema = {
  email: ''
};

export const LoginResponseSchema = {
  data: {
    access_token: '',
    acesso: '',
    email: '',
    id: '',
    nome: '',
    telefone: ''
  },
  status: 0
};

export const CultoDataSchema = {
  tipo: 'culto', 
  titulo: '',
  descricao: '',
  data: new Date(),
  hora: new Date(),
  corTexto: '',
  imagem: null 
};

export const EventoDataSchema = {
  tipo: 'evento', 
  titulo: '',
  descricao: '',
  data: new Date(),
  hora: new Date(),
  corTexto: '',
  imagem: null 
};

export const EscalaDataSchema = {
  data: '',
  horario: '',
  tipoCulto: '',
  recepcao: '',
  portaria: '',
  direcao: '',
  pregador: ''
};
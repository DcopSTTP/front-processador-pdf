// type.js
// JavaScript equivalents of TypeScript interfaces for documentation and validation

// ILogin - Login interface
export const LoginSchema = {
  email: '',
  senha: ''
};

// IEsqueciSenha - Forgot password interface  
export const EsqueciSenhaSchema = {
  email: ''
};

// ILoginResponse - Login response interface
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

// ICultoData - Culto data interface
export const CultoDataSchema = {
  tipo: 'culto', // 'culto' | 'evento'
  titulo: '',
  descricao: '',
  data: new Date(),
  hora: new Date(),
  corTexto: '',
  imagem: null // string | null
};

// IEventoData - Evento data interface
export const EventoDataSchema = {
  tipo: 'evento', // 'culto' | 'evento'
  titulo: '',
  descricao: '',
  data: new Date(),
  hora: new Date(),
  corTexto: '',
  imagem: null // string | null
};

// IEscalaData - Escala data interface
export const EscalaDataSchema = {
  data: '',
  horario: '',
  tipoCulto: '',
  recepcao: '',
  portaria: '',
  direcao: '',
  pregador: ''
};
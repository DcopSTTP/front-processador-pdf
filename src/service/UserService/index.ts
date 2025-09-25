import * as HttpService from '../HttpService';
import { ILogin } from "./type";


// auth 
export const login = async (body: ILogin) => {
    try {
      const { data, status } = await HttpService.post('/auth/signin', body);
  
      if (status === 200 || status === 201) {
        localStorage.setItem("nome", data.nome);
        localStorage.setItem("email", data.email || "");
        localStorage.setItem("cpf", data.cpf);
  
        if (data.access_token) {
          localStorage.setItem("access_token", data.access_token);
          console.log('Token salvo:', data.access_token);
        }
  
        if (data.tipoUser) {
          localStorage.setItem("acesso", data.tipoUser);
          console.log('Acesso salvo:', data.tipoUser);
        }
      } else {
        throw new Error('Falha na autenticação');
      }
  
      return { data, status };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao fazer login');
    }
  }

import { ILogin, ICultoData, IEventoData, IEsqueciSenha, IEscalaData } from "./type";
import * as HttpService from '../HttpService';


// auth 
export const login = async (body: ILogin) => {
    try {
      const { data, status } = await HttpService.post('/auth/signin', body);
  
      if (status === 200 || status === 201) {
        // Salvar dados do usuário no localStorage
        localStorage.setItem("nome", data.nome);
        localStorage.setItem("email", data.email || "");
        localStorage.setItem("cpf", data.cpf);
  
        // Salvar token de acesso
        if (data.access_token) {
          localStorage.setItem("access_token", data.access_token);
          console.log('Token salvo:', data.access_token);
        }
  
        // Salvar tipo de usuário (nível de acesso)
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
// export const esqueciSenha = async (email: string) => {
//     console.log(email)
//     const { data, status } = await HttpService.post(`/auth/forgot/${email}`, {});
//     console.lÍog('>>> Login response:', data, status);

//     return { data, status };
// }
// export const verifyResetCode = async (codigo: string) => {
//     console.log("Iniciando verifyResetCode com:", codigo);

//     try {
//         const retorno = await HttpService.get(`/auth/verify-reset-code/${codigo}`);
//         console.log('>>> Login response:', retorno);
//         return retorno;
//     } catch (error) {
//         console.log("Erro na verificação do código:", error);
//         throw error;
//     }
// }

// export const resetPassword = async (payload: { code: string; newPassword: string }) => {
//     const { data } = await HttpService.post("/auth/reset-password", payload);
//     return data;
//   };
  


// // Função para verificar se o usuário está logado
// export const isAuthenticated = async () => {
//     try {
//         const token = await AsyncStorage.getItem('access_token');
//         return !!token;
//     } catch (error) {
//         return false;
//     }
// };

// Função para fazer logout
// export const logout = async () => {
//     try {
//         await AsyncStorage.multiRemove([
//             'nome', 
//             'email', 
//             'access_token', 
//             'acesso'
//         ]);
//         console.log('Logout realizado com sucesso');
//     } catch (error) {
//         console.log('Erro ao fazer logout:', error);
//     }
// };
// export const cadastro = async (userData: {
//     nome: string;
//     email: string;
//     telefone: string;
//     senha: string;
//     dataNascimento: string;
//     genero: string;
//     acesso: string
// }) => {
//     try {
//         const response = await HttpService.post('/user/signup', userData);
//         return response;
//     } catch (error) {
//         throw error;
//     }
// };

// culto

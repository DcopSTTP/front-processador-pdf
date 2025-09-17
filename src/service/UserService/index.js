import * as HttpService from '../HttpService';


// auth 
export const login = async (body) => {
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
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao fazer login');
    }
  }
export const esqueciSenha = async (cpf) => {
    try {
        const body = { cpf };
        const { data, status } = await HttpService.postWithoutAuth('/auth/esqueci-a-senha', body);
        console.log('>>> Esqueci senha response:', data, status);
        
        if (status === 200 || status === 201) {
            return { data, status };
        } else {
            throw new Error('Falha na solicitação de recuperação');
        }
    } catch (error) {
        console.error('Erro ao solicitar recuperação de senha:', error);
        throw new Error(error.response?.data?.message || 'Erro ao solicitar recuperação de senha');
    }
}

export const redefinirSenha = async (resetCode, newPassword) => {
    try {
        const body = { resetCode, newPassword };
        const { data, status } = await HttpService.postWithoutAuth('/auth/redefinir-senha', body);
        console.log('>>> Redefinir senha response:', data, status);
        
        if (status === 200 || status === 201) {
            return { data, status };
        } else {
            throw new Error('Falha na redefinição de senha');
        }
    } catch (error) {
        console.error('Erro ao redefinir senha:', error);
        throw new Error(error.response?.data?.message || 'Erro ao redefinir senha');
    }
}
// export const verifyResetCode = async (codigo) => {
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

// export const resetPassword = async (payload) => {
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
export const cadastro = async (userData) => {
    try {
        const { data, status } = await HttpService.post('/auth/cadastro', userData);
        
        if (status === 200 || status === 201) {
            console.log('Usuário cadastrado com sucesso:', data);
            return { data, status };
        } else {
            throw new Error('Falha no cadastro');
        }
    } catch (error) {
        console.error('Erro no cadastro:', error);
        throw new Error(error.response?.data?.message || 'Erro ao cadastrar usuário');
    }
};

export const buscarUsuarios = async () => {
    try {
        const data = await HttpService.get('/user');
        console.log('Usuários carregados:', data);
        return data;
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        throw new Error(error.message || 'Erro ao carregar usuários');
    }
};

export const alterarTipoUsuario = async (userId, isAdmin) => {
    try {
        const { data, status } = await HttpService.put(`/user/admin/${userId}`, { isAdmin });
        
        if (status === 200 || status === 201) {
            console.log('Tipo de usuário alterado com sucesso:', data);
            return { data, status };
        } else {
            throw new Error('Falha ao alterar tipo de usuário');
        }
    } catch (error) {
        console.error('Erro ao alterar tipo de usuário:', error);
        throw new Error(error.response?.data?.message || 'Erro ao alterar tipo de usuário');
    }
};

export const alterarStatusUsuario = async (userId, ativo) => {
    try {
        const { data, status } = await HttpService.put(`/user/status/${userId}`, { ativo });
        
        if (status === 200 || status === 201) {
            console.log('Status do usuário alterado com sucesso:', data);
            return { data, status };
        } else {
            throw new Error('Falha ao alterar status do usuário');
        }
    } catch (error) {
        console.error('Erro ao alterar status do usuário:', error);
        throw new Error(error.response?.data?.message || 'Erro ao alterar status do usuário');
    }
};

// culto
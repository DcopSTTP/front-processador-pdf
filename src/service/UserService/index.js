import * as HttpService from '../HttpService';


// auth 
export const login = async (body) => {
    try {
      const { data, status } = await HttpService.post('/auth/signin', body);
  
      if (status === 200 || status === 201) {
        localStorage.setItem("nome", data.nome);
        localStorage.setItem("email", data.email || "");
        localStorage.setItem("cpf", data.cpf);
        if (data.id) {
          localStorage.setItem("userId", data.id);
        }
        if (data.access_token) {
          localStorage.setItem("access_token", data.access_token);
          localStorage.setItem("loginTime", new Date().getTime().toString());
        }
        if (data.tipoUser) {
          localStorage.setItem("acesso", data.tipoUser);
        }
      } else {
        throw new Error('Falha na autenticação');
      }
  
      return { data, status };
    } catch (error) {
      const customError = new Error(error.response?.data?.message || 'Erro ao fazer login');
      customError.status = error.response?.status;
      throw customError;
    }
  }
export const esqueciSenha = async (cpf) => {
    try {
        const body = { cpf };
        const { data, status } = await HttpService.postWithoutAuth('/auth/esqueci-a-senha', body);
        
        if (status === 200 || status === 201) {
            return { data, status };
        } else {
            throw new Error('Falha na solicitação de recuperação');
        }
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message || 'Erro ao solicitar recuperação de senha');
    }
}
export const redefinirSenha = async (resetCode, newPassword) => {
    try {
        const body = { resetCode, newPassword };
        const { data, status } = await HttpService.postWithoutAuth('/auth/redefinir-senha', body);
        
        if (status === 200 || status === 201) {
            return { data, status };
        } else {
            throw new Error('Falha na redefinição de senha');
        }
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erro ao redefinir senha');
    }
}
export const cadastro = async (userData) => {
    try {
        const { data, status } = await HttpService.post('/auth/cadastro', userData);
        
        if (status === 200 || status === 201) {
            return { data, status };
        } else {
            throw new Error('Falha no cadastro');
        }
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erro ao cadastrar usuário');
    }
};
export const buscarUsuarios = async () => {
    try {
        const data = await HttpService.get('/user');
        return data;
    } catch (error) {
        throw new Error(error.message || 'Erro ao carregar usuários');
    }
};
export const alterarTipoUsuario = async (userId, isAdmin) => {
    try {
        const { data, status } = await HttpService.put(`/user/admin/${userId}`, { isAdmin });
        
        if (status === 200 || status === 201) {
            return { data, status };
        } else {
            throw new Error('Falha ao alterar tipo de usuário');
        }
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erro ao alterar tipo de usuário');
    }
};
export const alterarStatusUsuario = async (userId, ativo) => {
    try {
        const { data, status } = await HttpService.put(`/user/status/${userId}`, { ativo });
        
        if (status === 200 || status === 201) {
            return { data, status };
        } else {
            throw new Error('Falha ao alterar status do usuário');
        }
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erro ao alterar status do usuário');
    }
};

// Ocorrências
export const salvarOcorrencia = async (ocorrenciaData) => {
    try {
        const { data, status } = await HttpService.post('/ocorrencias', ocorrenciaData);
        
        if (status === 200 || status === 201) {
            return { data, status };
        } else {
            throw new Error('Falha ao salvar ocorrência');
        }
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erro ao salvar ocorrência');
    }
};

export const buscarEstatisticas = async () => {
    try {
        const data = await HttpService.get('/ocorrencias/statistics');
        return data;
    } catch (error) {
        throw new Error(error.message || 'Erro ao carregar estatísticas');
    }
};

export const buscarEstatisticasMensais = async (ano, mes) => {
    try {
        const body = { ano, mes };
        const { data } = await HttpService.post('/ocorrencias/statistics/monthly', body);
        return data;
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message || 'Erro ao carregar estatísticas mensais');
    }
};

// usuário
export const buscarPerfilUsuario = async (userId) => {
    try {
        const data = await HttpService.get(`/auth/user/${userId}`);
        return data;
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message || 'Erro ao carregar perfil do usuário');
    }
};

export const atualizarPerfilUsuario = async (camposAlterados) => {
    try {
        const { data, status } = await HttpService.put('/auth/me', camposAlterados);
        
        if (status === 200 || status === 201) {
            if (camposAlterados.nome) {
                localStorage.setItem("nome", camposAlterados.nome);
            }
            if (camposAlterados.email) {
                localStorage.setItem("email", camposAlterados.email);
            }
            
            return { data, status };
        } else {
            throw new Error('Falha ao atualizar perfil');
        }
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message || 'Erro ao atualizar perfil do usuário');
    }
};

export const buscarOcorrenciasFiltradas = async (filtros = {}) => {
    try {
        const body = {};
        
        if (filtros.dataInicial) {
            const [ano, mes, dia] = filtros.dataInicial.split('-');
            body.dataInicial = `${dia}/${mes}/${ano}`;
        }
        if (filtros.dataFinal) {
            const [ano, mes, dia] = filtros.dataFinal.split('-');
            body.dataFinal = `${dia}/${mes}/${ano}`;
        }
        if (filtros.natureza) {
            body.natureza = filtros.natureza;
        }
        if (filtros.logradouro) {
            body.logradouro = filtros.logradouro;
        }
        if (filtros.bairro) {
            body.bairro = filtros.bairro;
        }
        
        
        const { data } = await HttpService.post('/ocorrencias/filtro', body);
        
        const dadosProcessados = data.map(ocorrencia => ({
            id: ocorrencia.id,
            numeroOcorrencia: ocorrencia.numeroOcorrencia,
            natureza: ocorrencia.natureza?.replace(/\s+/g, ' ').trim() || 'Não informado',
            createdAt: ocorrencia.createdAt,
            dataDespacho: ocorrencia.empenhos?.[0]?.despachado || null,
            localizacao: {
                bairro: ocorrencia.localizacao?.bairro?.replace(/^:\s*/, '').replace(/\s+/g, ' ').trim() || 'Não informado'
            },
            empenhos: ocorrencia.empenhos
        }));
        
        return dadosProcessados;
    } catch (error) {
        
        if (error.response?.status === 404) {
            const errorMessage = error.response?.data?.message || '';
            if (errorMessage.includes('index.html') || errorMessage.includes('uploads')) {
                throw new Error('Erro no backend: O servidor está tentando servir arquivos estáticos em vez da API. Verifique a configuração das rotas no backend.');
            }
            throw new Error('Endpoint /ocorrencias/filtro não encontrado. Verifique se o backend está rodando corretamente.');
        }
        
        throw new Error(error.response?.data?.message || error.message || 'Erro ao carregar ocorrências');
    }
};

export const buscarOcorrenciaPorId = async (id) => {
    try {
        const data = await HttpService.get(`/ocorrencias/${id}`);
        
        return data;
    } catch (error) {
        
        if (error.response?.status === 404) {
            throw new Error('Ocorrência não encontrada. Verifique se o ID está correto.');
        }
        
        throw new Error(error.response?.data?.message || error.message || 'Erro ao carregar detalhes da ocorrência');
    }
};
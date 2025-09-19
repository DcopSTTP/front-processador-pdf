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
          // Salvar timestamp do login para controle de expiração
          localStorage.setItem("loginTime", new Date().getTime().toString());
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
        console.log('Enviando requisição para esqueci senha:', body);
        const { data, status } = await HttpService.postWithoutAuth('/auth/esqueci-a-senha', body);
        console.log('>>> Esqueci senha response:', data, status);
        
        if (status === 200 || status === 201) {
            return { data, status };
        } else {
            throw new Error('Falha na solicitação de recuperação');
        }
    } catch (error) {
        console.error('Erro completo ao solicitar recuperação de senha:', error);
        console.error('Response data:', error.response?.data);
        console.error('Response status:', error.response?.status);
        throw new Error(error.response?.data?.message || error.message || 'Erro ao solicitar recuperação de senha');
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

// Ocorrências
export const salvarOcorrencia = async (ocorrenciaData) => {
    try {
        const { data, status } = await HttpService.post('/ocorrencias', ocorrenciaData);
        
        if (status === 200 || status === 201) {
            console.log('Ocorrência salva com sucesso:', data);
            return { data, status };
        } else {
            throw new Error('Falha ao salvar ocorrência');
        }
    } catch (error) {
        console.error('Erro ao salvar ocorrência:', error);
        throw new Error(error.response?.data?.message || 'Erro ao salvar ocorrência');
    }
};

export const buscarEstatisticas = async () => {
    try {
        const data = await HttpService.get('/ocorrencias/statistics');
        console.log('Estatísticas carregadas:', data);
        return data;
    } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        throw new Error(error.message || 'Erro ao carregar estatísticas');
    }
};

export const buscarOcorrenciasFiltradas = async (filtros = {}) => {
    try {
        // Preparar body da requisição POST
        const body = {};
        
        if (filtros.dataInicial) {
            body.dataInicial = filtros.dataInicial;
        }
        if (filtros.dataFinal) {
            body.dataFinal = filtros.dataFinal;
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
        
        console.log('Buscando ocorrências com filtros:', filtros);
        console.log('Body da requisição POST:', body);
        
        const { data } = await HttpService.post('/ocorrencias/filtro', body);
        console.log('Ocorrências carregadas:', data);
        
        // Processar dados para manter apenas os campos necessários para a tabela
        const dadosProcessados = data.map(ocorrencia => ({
            id: ocorrencia.id,
            numeroOcorrencia: ocorrencia.numeroOcorrencia,
            natureza: ocorrencia.natureza?.replace(/\s+/g, ' ').trim() || 'Não informado',
            createdAt: ocorrencia.createdAt,
            localizacao: {
                bairro: ocorrencia.localizacao?.bairro?.replace(/^:\s*/, '').replace(/\s+/g, ' ').trim() || 'Não informado'
            }
        }));
        
        return dadosProcessados;
    } catch (error) {
        console.error('Erro ao buscar ocorrências filtradas:', error);
        console.error('Detalhes do erro:', error.response?.data || error.response || error);
        
        // Se for erro 404, pode ser problema de rota
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
        console.error('Erro ao buscar detalhes da ocorrência:', error);
        console.error('Detalhes do erro:', error.response?.data || error.response || error);
        
        // Se for erro 404, ocorrência não encontrada
        if (error.response?.status === 404) {
            throw new Error('Ocorrência não encontrada. Verifique se o ID está correto.');
        }
        
        throw new Error(error.response?.data?.message || error.message || 'Erro ao carregar detalhes da ocorrência');
    }
};
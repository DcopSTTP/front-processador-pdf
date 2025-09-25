import { AlertCircleIcon, CheckCircleIcon, SaveIcon, UserIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { perfilStyles } from './styles';
import { buscarPerfilUsuario, atualizarPerfilUsuario } from '../../service/UserService';

function EditarPerfil({ onBack }) {
  const [formData, setFormData] = useState({
    id: '',
    nome: '',
    email: '',
    genero: '',
    cpf: '' 
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [originalData, setOriginalData] = useState({});
  useEffect(() => {
    carregarDadosUsuario();
  }, []);

  const carregarDadosUsuario = async () => {
    try {
      setLoading(true);
      setError('');
      
      const userId = localStorage.getItem('userId') || localStorage.getItem('id');
      
      if (!userId) {
        throw new Error('ID do usuário não encontrado. Faça login novamente.');
      }
      
      let dadosUsuario;
      try {
        dadosUsuario = await buscarPerfilUsuario(userId);
        console.log('Dados do perfil carregados da API:', dadosUsuario);
      } catch (apiError) {
        console.warn('API não disponível, usando dados do localStorage:', apiError.message);
        
        const nome = localStorage.getItem('nome') || '';
        const email = localStorage.getItem('email') || '';
        const cpf = localStorage.getItem('cpf') || '';
        
        if (!nome && !email) {
          throw new Error('Nenhum dado de perfil encontrado. Faça login novamente.');
        }
        
        dadosUsuario = {
          id: userId,
          nome,
          email,
          cpf,
          genero: '' 
        };
      }
      
      const dadosLimpos = {
        id: String(dadosUsuario.id || userId),
        nome: String(dadosUsuario.nome || ''),
        email: String(dadosUsuario.email || ''),
        cpf: String(dadosUsuario.cpf || ''),
        genero: String(dadosUsuario.genero || '')
      };
      
      setFormData(dadosLimpos);
      setOriginalData(dadosLimpos);
      
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      setError('Erro ao carregar dados do perfil: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (campo, valor) => {
    // Garantir que o valor seja sempre uma string
    const valorSeguro = String(valor || '');
    
    setFormData(prev => ({
      ...prev,
      [campo]: valorSeguro
    }));
    
    if (error) setError('');
    if (success) setSuccess('');
  };

  const validarFormulario = () => {
    if (!formData) {
      setError('Dados do formulário não encontrados');
      return false;
    }
    if (!formData.nome || !formData.nome.trim()) {
      setError('Nome é obrigatório');
      return false;
    }
    if (!formData.email || !formData.email.trim()) {
      setError('Email é obrigatório');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setError('Email deve ter um formato válido');
      return false;
    }

    if (!formData.genero || !formData.genero.trim()) {
      setError('Selecione o gênero');
      return false;
    }

    return true;
  };

  const salvarPerfil = async () => {
    if (!validarFormulario()) return;

    setSaving(true);
    setError('');
    
    try {
      const camposAlterados = obterCamposAlterados();
      
      if (Object.keys(camposAlterados).length === 0) {
        setError('Nenhuma alteração foi detectada.');
        setSaving(false);
        return;
      }
      
      console.log('Enviando apenas os campos alterados:', camposAlterados);
      
      try {
        await atualizarPerfilUsuario(camposAlterados);
        setOriginalData(formData); 
        setSuccess('Perfil atualizado com sucesso!');
        
        setTimeout(() => setSuccess(''), 3000);
        
      } catch (apiError) {
        console.warn('API não disponível, atualizando localStorage:', apiError.message);
        
        Object.keys(camposAlterados).forEach(campo => {
          localStorage.setItem(campo, camposAlterados[campo]);
        });
        
        setOriginalData(formData);
        setSuccess('Perfil atualizado localmente! (API indisponível)');
        setTimeout(() => setSuccess(''), 5000);
      }
      
    } catch (error) {
      setError('Erro ao salvar perfil: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const cancelarEdicao = () => {
    setFormData(originalData);
    setError('');
    setSuccess('');
    if (onBack) {
      onBack();
    }
  };

  const temAlteracoes = () => {
    try {
      if (!formData || !originalData) {
        return false;
      }
      return JSON.stringify(formData) !== JSON.stringify(originalData);
    } catch (error) {
      console.warn('Erro ao comparar dados:', error);
      return false;
    }
  };

  const obterCamposAlterados = () => {
    const camposAlterados = {};
    
    const camposEditaveis = ['nome', 'email', 'genero'];
    
    camposEditaveis.forEach(campo => {
      if (formData[campo] !== originalData[campo]) {
        if (formData[campo] && formData[campo].trim() !== '') {
          camposAlterados[campo] = formData[campo].trim();
        }
      }
    });
    
    return camposAlterados;
  };


  if (loading) {
    return (
      <div style={perfilStyles.container}>
        <div style={perfilStyles.loadingContainer}>
          <div style={perfilStyles.spinner}></div>
          <p>Carregando dados do perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={perfilStyles.container}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      
      <div style={perfilStyles.mainContainer}>
        <div style={perfilStyles.header}>
          <h1 style={perfilStyles.title}>Meu Perfil</h1>
          <p style={perfilStyles.subtitle}>Gerencie suas informações pessoais</p>
        </div>

        <div style={perfilStyles.formCard}>
          {error && (
            <div style={perfilStyles.errorMessage}>
              <AlertCircleIcon style={{ width: '18px', height: '18px', flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div style={perfilStyles.successMessage}>
              <CheckCircleIcon style={{ width: '18px', height: '18px', flexShrink: 0 }} />
              <span>{success}</span>
            </div>
          )}

          <div style={perfilStyles.formContent}>
            
            {formData && formData.cpf && (
              <div style={perfilStyles.formField}>
                <label style={perfilStyles.formLabel}>
                  CPF
                </label>
                <input
                  type="text"
                  value={formData.cpf || ''}
                  readOnly
                  style={{
                    ...perfilStyles.formInput,
                    backgroundColor: '#f9fafb',
                    color: '#6b7280',
                    cursor: 'not-allowed'
                  }}
                />
              </div>
            )}

            {/* Campo Nome */}
            <div style={perfilStyles.formField}>
              <label style={perfilStyles.formLabel}>
                Nome Completo *
              </label>
              <input
                type="text"
                value={formData.nome || ''}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                placeholder="Digite seu nome completo"
                style={perfilStyles.formInput}
              />
            </div>

            <div style={perfilStyles.formField}>
              <label style={perfilStyles.formLabel}>
                Email *
              </label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Digite seu email"
                style={perfilStyles.formInput}
              />
            </div>

            <div style={perfilStyles.formField}>
              <label style={perfilStyles.formLabel}>
                Gênero *
              </label>
              <select
                value={formData.genero || ''}
                onChange={(e) => handleInputChange('genero', e.target.value)}
                style={perfilStyles.formSelect}
              >
                <option value="">Selecione seu gênero</option>
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
              </select>
            </div>

          </div>

          <div style={perfilStyles.formActions}>
            {temAlteracoes() && (
              <div style={perfilStyles.changesIndicator}>
                <span>• Você tem alterações não salvas</span>
              </div>
            )}

            <div style={perfilStyles.actionButtons}>
              <button
                onClick={cancelarEdicao}
                disabled={saving}
                style={perfilStyles.cancelButton}
              >
                {onBack ? 'Voltar' : 'Cancelar'}
              </button>

              <button
                onClick={salvarPerfil}
                disabled={saving || !temAlteracoes()}
                style={perfilStyles.saveButton}
              >
                {saving ? (
                  <div style={perfilStyles.buttonLoading}>
                    <div style={perfilStyles.buttonSpinner}></div>
                    <span>Salvando...</span>
                  </div>
                ) : (
                  <div style={perfilStyles.buttonContent}>
                    <SaveIcon style={{ width: '18px', height: '18px' }} />
                    <span>Salvar Alterações</span>
                  </div>
                )}
              </button>
            </div>
          </div>

        </div>

        <div style={perfilStyles.infoCard}>
          <h3 style={perfilStyles.infoTitle}>Informações Importantes</h3>
          <ul style={perfilStyles.infoList}>
            <li>Os campos marcados com (*) são obrigatórios</li>
            <li>Seu email será usado para login e notificações</li>
            <li>As alterações entram em vigor imediatamente após salvar</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default EditarPerfil;
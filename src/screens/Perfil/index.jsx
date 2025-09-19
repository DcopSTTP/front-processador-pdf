import React, { useState, useEffect } from 'react';
import { UserIcon, SaveIcon, AlertCircleIcon, CheckCircleIcon } from 'lucide-react';
import { perfilStyles } from './styles';

function EditarPerfil({ onBack, usuarioId }) {
  // Estados
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    genero: ''
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [originalData, setOriginalData] = useState({});

  // Carregar dados do usuário ao montar o componente
  useEffect(() => {
    carregarDadosUsuario();
  }, [usuarioId]);

  const carregarDadosUsuario = async () => {
    try {
      // Dados simulados - substituir pela API real
      const dadosUsuario = {
        nome: 'João Silva Santos',
        email: 'joao.silva@email.com',
        genero: 'masculino'
      };
      
      setFormData(dadosUsuario);
      setOriginalData(dadosUsuario);
      setLoading(false);
    } catch (error) {
      setError('Erro ao carregar dados do perfil');
      console.error('Erro:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (campo, valor) => {
    setFormData(prev => ({
      ...prev,
      [campo]: valor
    }));
    
    // Limpar mensagens ao modificar dados
    if (error) setError('');
    if (success) setSuccess('');
  };

  const validarFormulario = () => {
    if (!formData.nome.trim()) {
      setError('Nome é obrigatório');
      return false;
    }

    if (!formData.email.trim()) {
      setError('Email é obrigatório');
      return false;
    }

    if (!formData.email.includes('@')) {
      setError('Email deve ter um formato válido');
      return false;
    }

    if (!formData.genero) {
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
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Dados atualizados:', formData);
      
      // Aqui você faria a chamada real para a API
      // const response = await api.put(`/usuarios/${usuarioId}`, formData);
      
      setOriginalData(formData);
      setSuccess('Perfil atualizado com sucesso!');
      
      // Limpar mensagem de sucesso após alguns segundos
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (error) {
      setError('Erro ao salvar perfil. Tente novamente.');
      console.error('Erro ao salvar:', error);
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
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  };


  return (
    <div style={perfilStyles.container}>
      <div style={perfilStyles.mainContainer}>
        {/* Header */}
        <div style={perfilStyles.header}>
          <div style={perfilStyles.headerIcon}>
            <UserIcon style={{ width: '32px', height: '32px', color: 'white' }} />
          </div>
          <h1 style={perfilStyles.title}>Editar Perfil</h1>
          <p style={perfilStyles.subtitle}>Atualize suas informações pessoais</p>
        </div>

        {/* Formulário */}
        <div style={perfilStyles.formCard}>
          
          {/* Mensagens de Feedback */}
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

          {/* Campos do Formulário */}
          <div style={perfilStyles.formContent}>
            
            {/* Campo Nome */}
            <div style={perfilStyles.formField}>
              <label style={perfilStyles.formLabel}>
                Nome Completo *
              </label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                placeholder="Digite seu nome completo"
                style={perfilStyles.formInput}
              />
            </div>

            {/* Campo Email */}
            <div style={perfilStyles.formField}>
              <label style={perfilStyles.formLabel}>
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Digite seu email"
                style={perfilStyles.formInput}
              />
            </div>

            {/* Campo Gênero */}
            <div style={perfilStyles.formField}>
              <label style={perfilStyles.formLabel}>
                Gênero *
              </label>
              <select
                value={formData.genero}
                onChange={(e) => handleInputChange('genero', e.target.value)}
                style={perfilStyles.formSelect}
              >
                <option value="">Selecione seu gênero</option>
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
                <option value="nao-binario">Não-binário</option>
                <option value="prefiro-nao-informar">Prefiro não informar</option>
              </select>
            </div>

          </div>

          {/* Botões de Ação */}
          <div style={perfilStyles.formActions}>
            
            {/* Indicador de Alterações */}
            {temAlteracoes() && (
              <div style={perfilStyles.changesIndicator}>
                <span>• Você tem alterações não salvas</span>
              </div>
            )}

            <div style={perfilStyles.actionButtons}>
              {/* Botão Cancelar */}
              <button
                onClick={cancelarEdicao}
                disabled={saving}
                style={perfilStyles.cancelButton}
              >
                {onBack ? 'Voltar' : 'Cancelar'}
              </button>

              {/* Botão Salvar */}
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

        {/* Informações Adicionais */}
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
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/Logo.svg";
import * as UserService from "../../service/UserService";
import Swal from 'sweetalert2';
import "./styles.css"; 

export default function EsqueciSenha({ onVoltar }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: CPF, 2: Código, 3: Nova senha
  const [formData, setFormData] = useState({
    cpf: "",
    codigo: "",
    novaSenha: "",
    confirmarSenha: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  function formatCpf(value) {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    return digits
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3}\.\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3}\.\d{3}\.\d{3})(\d)/, "$1-$2");
  }

  function handleInputChange(field, value) {
    if (field === "cpf") {
      value = formatCpf(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    setError(""); // Limpar erro ao digitar
  }

  async function handleStep1() {
    setError("");
    setSuccessMessage("");

    if (!formData.cpf.trim()) {
      setError("Digite seu CPF");
      return;
    }

    // Validar formato do CPF
    const isCpf = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(formData.cpf);

    if (!isCpf) {
      setError("Digite um CPF válido no formato 000.000.000-00");
      return;
    }

    setLoading(true);
    console.log('Iniciando processo de recuperação de senha para CPF:', formData.cpf);

    try {
      const cpfSemFormatacao = formData.cpf.replace(/\D/g, "");
      console.log('CPF sem formatação:', cpfSemFormatacao);
      
      const { data, status } = await UserService.esqueciSenha(cpfSemFormatacao);
      console.log('Resposta do servidor:', { data, status });
      
      await Swal.fire({
        title: 'Código Enviado!',
        text: `${data.mensagem || 'Código enviado com sucesso!'}\n\nEmail: ${data.email || ''}`,
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3b82f6'
      });
      
      setStep(2);
    } catch (error) {
      console.error('Erro ao solicitar recuperação:', error);
      await Swal.fire({
        title: 'Erro!',
        text: error.message || 'Erro ao solicitar recuperação de senha.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#dc2626'
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleStep2() {
    setError("");
    
    if (!formData.codigo.trim() || formData.codigo.length !== 6) {
      setError("Digite o código de 6 dígitos");
      return;
    }

    // Apenas validação local - avança para o próximo step
    // A validação do código será feita no backend quando redefinir a senha
    setStep(3);
  }

  async function handleStep3() {
    setError("");

    if (!formData.novaSenha || formData.novaSenha.length < 6) {
      setError("A nova senha deve ter pelo menos 6 caracteres");
      return;
    }

    if (formData.novaSenha !== formData.confirmarSenha) {
      setError("As senhas não coincidem");
      return;
    }

    setLoading(true);

    try {
      const { data, status } = await UserService.redefinirSenha(formData.codigo, formData.novaSenha);
      
      await Swal.fire({
        title: 'Sucesso!',
        text: data.mensagem || 'Senha redefinida com sucesso!',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#22c55e'
      });
      
      // Redirecionar para login
      navigate('/login');
    } catch (error) {
      await Swal.fire({
        title: 'Erro!',
        text: error.message || 'Erro ao redefinir senha.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#dc2626'
      });
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    if (e) e.preventDefault();
    
    switch (step) {
      case 1:
        handleStep1();
        break;
      case 2:
        handleStep2();
        break;
      case 3:
        handleStep3();
        break;
    }
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  }

  function getStepTitle() {
    switch (step) {
      case 1: return "Recuperar Senha";
      case 2: return "Verificar Código";
      case 3: return "Nova Senha";
      default: return "Recuperar Senha";
    }
  }

  function getStepSubtitle() {
    switch (step) {
      case 1: return "Digite seu CPF para receber o código de verificação";
      case 2: return "Digite o código de 6 dígitos enviado para seu email";
      case 3: return "Crie uma nova senha para sua conta";
      default: return "";
    }
  }

  return (
    <>
      

      <div className="esqueci-background">
        <div className="floating-element-1"></div>
        <div className="floating-element-2"></div>
        
        <div className="esqueci-container">
          <div className="header">
            <div className="logo-container">
              <div className="logo">
              <img 
                  src={Logo} 
                  alt="Logo do Sistema" 
                  className="logo-image"
                />
              </div>
            </div>
            <h1 className="esqueci-title">{getStepTitle()}</h1>
            <p className="esqueci-subtitle">{getStepSubtitle()}</p>
          </div>

          {/* Step Indicator */}
          <div className="step-indicator">
            <div className={`step-dot ${step >= 1 ? (step > 1 ? 'completed' : 'active') : ''}`}></div>
            <div className={`step-dot ${step >= 2 ? (step > 2 ? 'completed' : 'active') : ''}`}></div>
            <div className={`step-dot ${step === 3 ? 'active' : ''}`}></div>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(e); }}>
            {/* Step 1: CPF */}
            {step === 1 && (
              <div className="form-group">
                <label className="form-label">CPF</label>
                <div className="input-container">
                  <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <input
                    type="text"
                    value={formData.cpf}
                    onChange={(e) => handleInputChange("cpf", e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="000.000.000-00"
                    className="form-input"
                    autoComplete="username"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Código */}
            {step === 2 && (
              <div className="form-group">
                <label className="form-label">Código de Verificação</label>
                <input
                  type="text"
                  value={formData.codigo}
                  onChange={(e) => handleInputChange("codigo", e.target.value.replace(/\D/g, "").slice(0, 6))}
                  onKeyPress={handleKeyPress}
                  placeholder="000000"
                  className="form-input center"
                  maxLength="6"
                />
                <div className="help-text">
                  Não recebeu o código? 
                  <button 
                    type="button" 
                    onClick={() => handleStep1()}
                    style={{ color: '#3b82f6', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', marginLeft: '0.25rem' }}
                  >
                    Reenviar
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Nova Senha */}
            {step === 3 && (
              <>
                <div className="form-group">
                  <label className="form-label">Nova Senha</label>
                  <div className="input-container">
                    <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.novaSenha}
                      onChange={(e) => handleInputChange("novaSenha", e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Digite sua nova senha"
                      className="form-input password-input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="password-toggle"
                    >
                      {showPassword ? (
                        <svg className="password-toggle-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="password-toggle-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Confirmar Nova Senha</label>
                  <div className="input-container">
                    <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmarSenha}
                      onChange={(e) => handleInputChange("confirmarSenha", e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Confirme sua nova senha"
                      className="form-input password-input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="password-toggle"
                    >
                      {showConfirmPassword ? (
                        <svg className="password-toggle-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="password-toggle-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Messages */}
            {error && (
              <div className="error-message">
                <svg className="message-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {successMessage && (
              <div className="success-message">
                <svg className="message-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{successMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="submit-button"
            >
              {loading ? (
                <div className="loading-content">
                  <div className="loading-spinner"></div>
                  <span>
                    {step === 1 ? "Enviando código..." : 
                     step === 2 ? "Verificando..." : 
                     "Alterando senha..."}
                  </span>
                </div>
              ) : (
                <>
                  {step === 1 ? "Enviar Código" : 
                   step === 2 ? "Verificar Código" : 
                   "Alterar Senha"}
                </>
              )}
            </button>

            {/* Back to Step 1 */}
            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="secondary-button"
              >
                Alterar CPF
              </button>
            )}

            {/* Back to Login */}
            <div className="back-link">
              {/* BOTÃO PARA VOLTAR AO LOGIN - CHAMA A FUNÇÃO RECEBIDA DO APP.JS */}
              <button 
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/login');
                }}
              >
                ← Voltar ao Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import * as UserService from "../../service/UserService";
import Swal from "sweetalert2";
import "./styles.css";

export default function Cadastro({ onCadastro, onSwitchToSignin, isAdminView }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    cpf: "",
    dataNascimento: "",
    genero: "",
    password: "",
    confirmPassword: "",
    isAdmin: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: [],
    color: "#dc2626"
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  function formatCpf(value) {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    return digits
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3}\.\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3}\.\d{3}\.\d{3})(\d)/, "$1-$2");
  }

  function validateCpf(raw) {
    const digits = raw.replace(/\D/g, "");
    return digits.length === 11;
  }

  function analyzePasswordStrength(password) {
    let score = 0;
    const feedback = [];
    let color = "#dc2626"; // vermelho

    if (password.length === 0) {
      return { score: 0, feedback: [], color: "#94a3b8" };
    }

    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push("Use pelo menos 8 caracteres");
    }

    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push("Use letras maiúsculas e minúsculas");
    }

    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push("Inclua pelo menos um número");
    }

    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      score += 1;
    } else {
      feedback.push("Inclua símbolos especiais (!@#$...)");
    }

    // Determinar cor e texto baseado no score
    if (score === 4) {
      color = "#16a34a"; // verde
    } else if (score === 3) {
      color = "#f59e0b"; // amarelo
    } else if (score >= 2) {
      color = "#f59e0b"; // amarelo
    }

    return { score, feedback, color };
  }

  function handleInputChange(field, value) {
    if (field === "cpf") {
      value = formatCpf(value);
    }

    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (field === "password") {
      setPasswordStrength(analyzePasswordStrength(value));
    }
  }

  function getPasswordStrengthText(score) {
    switch (score) {
      case 0: return "";
      case 1: return "Fraca";
      case 2: return "Fraca";
      case 3: return "Boa";
      case 4: return "Forte";
      default: return "";
    }
  }

  async function handleSubmit(e) {
    if (e) e.preventDefault();
    setError("");

    // Validações básicas
    if (!formData.nome.trim()) {
      setError("Nome é obrigatório");
      return;
    }

    if (!formData.email.trim() || !formData.email.includes("@")) {
      setError("Email válido é obrigatório");
      return;
    }

    if (!validateCpf(formData.cpf)) {
      setError("CPF inválido. Digite 11 números.");
      return;
    }

    if (!formData.dataNascimento) {
      setError("Data de nascimento é obrigatória");
      return;
    }

    if (!formData.genero) {
      setError("Selecione o gênero");
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      setError("Senha deve ter pelo menos 6 caracteres");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Senhas não coincidem");
      return;
    }

    setLoading(true);

    try {
      // Formatar dados para o backend
      const dadosCadastro = {
        nome: formData.nome,
        email: formData.email,
        cpf: formData.cpf.replace(/\D/g, ""), // Remove formatação do CPF
        senha: formData.password,
        genero: formData.genero,
        tipo: formData.isAdmin ? "admin" : "user"
      };
      
      console.log("Enviando dados para cadastro:", dadosCadastro);
      
      // Chamar o serviço de cadastro
      const { data, status } = await UserService.cadastro(dadosCadastro);
      
      console.log("Cadastro realizado com sucesso:", data);
      
      // Se for admin criando usuário, volta para lista
      if (isAdminView) {
        // Mostrar notificação de sucesso com SweetAlert2
        await Swal.fire({
          icon: 'success',
          title: 'Sucesso!',
          text: 'Usuário cadastrado com sucesso!',
          confirmButtonText: 'OK',
          confirmButtonColor: '#1e40af',
          timer: 3000,
          timerProgressBar: true,
          showClass: {
            popup: 'animate__animated animate__fadeInDown'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
          }
        });
        navigate('/usuarios');
      } else {
        onCadastro && onCadastro(data);
      }
    } catch (error) {
      console.error("Erro no cadastro:", error);
      
      // Mostrar erro com SweetAlert2
      await Swal.fire({
        icon: 'error',
        title: 'Erro no Cadastro',
        text: error.message || "Falha ao realizar cadastro. Tente novamente.",
        confirmButtonText: 'OK',
        confirmButtonColor: '#dc2626',
        showClass: {
          popup: 'animate__animated animate__shakeX'
        }
      });
      
      setError(error.message || "Falha ao realizar cadastro. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
      padding: '2rem',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '800px',
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        marginTop: '2rem'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: '700', 
            color: '#1e3a8a',
            marginBottom: '0.5rem'
          }}>
            {isAdminView ? 'Cadastrar Novo Usuário' : 'Criar Conta'}
          </h1>
          <p style={{ color: '#64748b' }}>
            {isAdminView ? 'Preencha os dados do novo usuário' : 'Preencha os dados para solicitar acesso ao sistema'}
          </p>
        </div>

        <div>
          <div className="form-grid">
            {/* Nome */}
            <div className="form-group">
              <label className="form-label">Nome Completo</label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => handleInputChange("nome", e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite o nome completo"
                className="form-input"
                autoComplete="name"
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="email@exemplo.com"
                className="form-input"
                autoComplete="email"
              />
            </div>

            {/* CPF */}
            <div className="form-group">
              <label className="form-label">CPF</label>
              <input
                type="text"
                value={formData.cpf}
                onChange={(e) => handleInputChange("cpf", e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="000.000.000-00"
                className="form-input"
                autoComplete="off"
              />
            </div>

            {/* Data de Nascimento */}
            <div className="form-group">
              <label className="form-label">Data de Nascimento</label>
              <input
                type="date"
                value={formData.dataNascimento}
                onChange={(e) => handleInputChange("dataNascimento", e.target.value)}
                className="form-input"
                autoComplete="bday"
              />
            </div>

            {/* Gênero */}
            <div className="form-group full-width">
              <label className="form-label">Gênero</label>
              <select
                value={formData.genero}
                onChange={(e) => handleInputChange("genero", e.target.value)}
                className="form-input"
              >
                <option value="">Selecione o gênero</option>
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
                <option value="O">Outro</option>
                <option value="N">Prefiro não informar</option>
              </select>
            </div>

            {/* Senha */}
            <div className="form-group">
              <label className="form-label">Senha</label>
              <div className="input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite sua senha"
                  className="form-input password-input"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                >
                  {showPassword ? <FaEyeSlash className="password-toggle-icon" /> : <FaEye className="password-toggle-icon" />}
                </button>
              </div>
              {formData.password && (
                <div className="password-strength">
                  <div className="strength-bar-container">
                    <div
                      className="strength-bar"
                      style={{
                        width: `${(passwordStrength.score / 4) * 100}%`,
                        backgroundColor: passwordStrength.color,
                      }}
                    />
                  </div>
                  {passwordStrength.score > 0 && (
                    <span className="strength-text" style={{ color: passwordStrength.color }}>
                      {getPasswordStrengthText(passwordStrength.score)}
                    </span>
                  )}
                </div>
              )}
              {passwordStrength.feedback.length > 0 && (
                <ul className="password-feedback">
                  {passwordStrength.feedback.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* Confirmar Senha */}
            <div className="form-group">
              <label className="form-label">Confirmar Senha</label>
              <div className="input-container">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite a senha novamente"
                  className="form-input password-input"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="password-toggle"
                >
                  {showConfirmPassword ? <FaEyeSlash className="password-toggle-icon" /> : <FaEye className="password-toggle-icon" />}
                </button>
              </div>
            </div>

            {/* Checkbox Admin - apenas se for admin criando usuário */}
            {isAdminView && (
              <div className="form-group full-width" style={{ marginTop: '1rem' }}>
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={formData.isAdmin}
                    onChange={(e) => handleInputChange("isAdmin", e.target.checked)}
                    style={{
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer'
                    }}
                  />
                  <span style={{ 
                    fontSize: '1rem',
                    color: '#1e3a8a',
                    fontWeight: '500'
                  }}>
                    Cadastrar como Administrador
                  </span>
                </label>
                <p style={{ 
                  marginTop: '0.5rem', 
                  fontSize: '0.875rem', 
                  color: '#64748b' 
                }}>
                  Administradores podem gerenciar outros usuários do sistema
                </p>
              </div>
            )}
          </div>

          {/* Mensagem de erro */}
          {error && (
            <div className="error-message" style={{ marginTop: '1rem' }}>
              <svg className="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Botões */}
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            marginTop: '2rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            {isAdminView && (
              <button
                type="button"
                onClick={() => navigate('/usuarios')}
                style={{
                  padding: '0.875rem 2rem',
                  backgroundColor: 'white',
                  color: '#6b7280',
                  border: '2px solid #d1d5db',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  minWidth: '140px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f9fafb';
                  e.target.style.borderColor = '#9ca3af';
                  e.target.style.color = '#374151';
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.color = '#6b7280';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                }}
              >
                Cancelar
              </button>
            )}
            
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                padding: '0.875rem 2rem',
                backgroundColor: loading ? '#93c5fd' : '#1e40af',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                minWidth: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: loading ? '0 1px 3px rgba(0, 0, 0, 0.1)' : '0 2px 8px rgba(30, 64, 175, 0.3)',
                opacity: loading ? 0.8 : 1
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = '#1d4ed8';
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 4px 15px rgba(30, 64, 175, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = '#1e40af';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 8px rgba(30, 64, 175, 0.3)';
                }
              }}
            >
              {loading ? (
                <>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid transparent',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  <span>Cadastrando...</span>
                </>
              ) : (
                <>
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Cadastrar Usuário
                </>
              )}
            </button>
          </div>

          {/* CSS para animação de loading */}
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>

          {/* Link para login (apenas se não for admin) */}
          {!isAdminView && (
            <div className="signin-link">
              <span>Já tem uma conta?</span>
              <button
                type="button"
                onClick={onSwitchToSignin}
                style={{ background: 'none', border: 'none', padding: 0 }}
              >
                Faça login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
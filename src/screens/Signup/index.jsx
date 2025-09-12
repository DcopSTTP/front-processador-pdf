import React, { useState } from "react";
import Logo from "../../assets/Logo.svg";
import "./styles.css";

export default function Cadastro({ onCadastro, onSwitchToSignin }) {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    cpf: "",
    dataNascimento: "",
    genero: "",
    password: "",
    confirmPassword: ""
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
      await new Promise((r) => setTimeout(r, 1500));
      console.log("Cadastro realizado:", formData);
      onCadastro && onCadastro(formData);
    } catch {
      setError("Falha ao realizar cadastro. Tente novamente.");
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
    <>
      

      <div className="cadastro-background">
        <div className="floating-element-1"></div>
        <div className="floating-element-2"></div>
        
        <div className="cadastro-container">
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
            <h1 className="cadastro-title">Criar Conta</h1>
            <p className="cadastro-subtitle">Preencha os dados para solicitar acesso ao sistema</p>
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
                  placeholder="Seu nome completo"
                  className="form-input"
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
                  placeholder="seu@email.com"
                  className="form-input"
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
                />
              </div>
            </div>

            {/* Gênero - Full Width */}
            <div className="form-group full-width">
              <label className="form-label">Gênero</label>
              <select
                value={formData.genero}
                onChange={(e) => handleInputChange("genero", e.target.value)}
                className="form-select"
              >
                <option value="">Selecione seu gênero</option>
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
                <option value="nao-binario">Não-binário</option>
                <option value="prefiro-nao-informar">Prefiro não informar</option>
              </select>
            </div>

            <div className="form-grid">
              {/* Senha */}
              <div className="form-group">
                <label className="form-label">Senha</label>
                <div className="password-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Crie uma senha segura"
                    className="form-input password-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="show-password"
                  >
                    {showPassword ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
                
                {formData.password && (
                  <div 
                    className="password-strength" 
                    style={{ borderLeftColor: passwordStrength.color }}
                  >
                    <div className="strength-indicator">
                      <span className="strength-text" style={{ color: passwordStrength.color }}>
                        Força da senha: {getPasswordStrengthText(passwordStrength.score)}
                      </span>
                      <div className="strength-bars">
                        {[1, 2, 3, 4].map((bar) => (
                          <div
                            key={bar}
                            className="strength-bar"
                            style={{
                              backgroundColor: bar <= passwordStrength.score ? passwordStrength.color : '#e5e7eb'
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    
                    {passwordStrength.feedback.length > 0 && (
                      <div className="strength-feedback">
                        <ul>
                          {passwordStrength.feedback.map((feedback, index) => (
                            <li key={index}>{feedback}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Confirmar Senha */}
              <div className="form-group">
                <label className="form-label">Confirmar Senha</label>
                <div className="password-container">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Confirme sua senha"
                    className="form-input password-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="show-password"
                  >
                    {showConfirmPassword ? "Ocultar" : "Mostrar"}
                  </button>
                </div>

                {formData.confirmPassword && (
                  <div className={`password-match ${
                    formData.password === formData.confirmPassword ? "match" : "no-match"
                  }`}>
                    {formData.password === formData.confirmPassword 
                      ? "✓ Senhas coincidem" 
                      : "✗ Senhas não coincidem"
                    }
                  </div>
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="error">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="submit-button"
            >
              {loading ? (
                <div className="loading-content">
                  <div className="loading-spinner"></div>
                  <span>Criando conta...</span>
                </div>
              ) : (
                "Criar Conta"
              )}
            </button>

            {/* Login Link */}
            <div className="login-link">
              Já tem uma conta?{" "}
              <button 
                type="button"
                onClick={onSwitchToSignin}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  padding: 0, 
                  color: '#facc15', 
                  textDecoration: 'none', 
                  fontWeight: '600', 
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.textDecoration = 'underline';
                  e.target.style.color = '#f59e0b';
                }}
                onMouseOut={(e) => {
                  e.target.style.textDecoration = 'none';
                  e.target.style.color = '#facc15';
                }}
              >
                Faça login
              </button>
            </div>
          </div>

          <div className="footer">
            © {new Date().getFullYear()} STTP — Sistema Processador de PDF
          </div>
        </div>
      </div>
    </>
  );
}
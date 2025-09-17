import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/Logo.svg";
import * as UserService from "../../service/UserService"; 
import "./styles.css";

export default function Login({ onLogin, onSwitchToForgotPassword }) {
  const navigate = useNavigate();
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  function formatCpf(value) {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    return digits
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3}\.\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3}\.\d{3}\.\d{3})(\d)/, "$1-$2");
  }

  function handleCpfChange(e) {
    setCpf(formatCpf(e.target.value));
  }

  function validateCpf(raw) {
    const digits = raw.replace(/\D/g, "");
    return digits.length === 11;
  }

  async function handleSubmit(e) {
    if (e) e.preventDefault();
    setError("");

    // Validações
    if (!validateCpf(cpf)) {
      setError("CPF inválido. Digite 11 números.");
      return;
    }

    if (!password || password.length < 6) {
      setError("Senha inválida. Use pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);

    try {
      // Preparar dados para envio (remover formatação do CPF)
      const loginData = {
        cpf: cpf.replace(/\D/g, ""), // Remove pontos e traços
        senha: password
      };

      // Chamar função de login do UserService
      const { data, status } = await UserService.login(loginData);

      console.log("Login bem-sucedido", { 
        status, 
        user: data.nome, 
        tipoUser: data.tipoUser 
      });

      // Salvar dados da sessão no localStorage
      localStorage.setItem("userData", JSON.stringify(data));
      localStorage.setItem("isLoggedIn", "true");

      // Salvar preferência "Lembrar-me" se necessário
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
        localStorage.setItem("savedCpf", cpf);
        localStorage.setItem("savedPassword", password);
      } else {
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("savedCpf");
        localStorage.removeItem("savedPassword");
      }

      // Chamar callback de sucesso passando os dados do usuário
      onLogin(data);
      
      // Navegar para o dashboard
      navigate('/dashboard');

    } catch (error) {
      console.error("Erro no login:", error);
      setError(error.message || "Falha ao conectar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  // Verificar se existe CPF e senha salvos ao carregar o componente
  React.useEffect(() => {
    const savedRememberMe = localStorage.getItem("rememberMe");
    const savedCpf = localStorage.getItem("savedCpf");
    const savedPassword = localStorage.getItem("savedPassword");
    
    if (savedRememberMe === "true" && savedCpf) {
      setCpf(savedCpf);
      setRememberMe(true);
      if (savedPassword) {
        setPassword(savedPassword);
      }
    }
  }, []);

  return (
    <>
      <div className="login-background">
        <div className="floating-element-1"></div>
        <div className="floating-element-2"></div>
        
        <div className="login-container">
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
            <h1 className="login-title">Bem-vindo</h1>
            <p className="login-subtitle">Acesse sua conta corporativa com segurança</p>
          </div>

          <div>
            {/* CPF Field */}
            <div className="form-group">
              <label className="form-label">CPF</label>
              <div className="input-container">
                <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <input
                  type="text"
                  value={cpf}
                  onChange={handleCpfChange}
                  onKeyPress={handleKeyPress}
                  placeholder="000.000.000-00"
                  className="form-input"
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label className="form-label">Senha</label>
              <div className="input-container">
                <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite sua senha"
                  className="form-input password-input"
                  autoComplete="current-password"
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

            {/* Error Message */}
            {error && (
              <div className="error-message">
                <svg className="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Actions */}
            <div className="form-actions">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="checkbox"
                />
                <span className="checkbox-label">Lembrar-me</span>
              </label>
              <button 
                type="button"
                className="forgot-password"
                onClick={() => navigate('/forgot-password')}
                style={{ background: 'none', border: 'none', padding: 0 }}
              >
                Esqueci a senha
              </button>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="submit-button"
            >
              {loading ? (
                <div className="loading-content">
                  <div className="loading-spinner"></div>
                  <span>Entrando...</span>
                </div>
              ) : (
                "Entrar"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
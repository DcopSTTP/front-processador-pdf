import React, { useEffect, useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Swal from 'sweetalert2';
import EsqueciSenha from './screens/EsqueciASenha';
import Login from './screens/Login';
import Menu from './screens/Menu';

// Função para verificar se o token expirou (24h)
const isTokenExpired = () => {
  const loginTime = localStorage.getItem('loginTime');
  if (!loginTime) return true;
  
  const now = new Date().getTime();
  const twentyFourHours = 24 * 60 * 60 * 1000; // 24h em milliseconds
  
  return (now - parseInt(loginTime)) > twentyFourHours;
};

// Componente para proteger rotas privadas
function PrivateRoute({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const savedUserData = localStorage.getItem('userData');
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      const accessToken = localStorage.getItem('access_token');
      
      // Verificar se tem todos os dados necessários e se o token não expirou
      if (savedUserData && isLoggedIn === 'true' && accessToken && !isTokenExpired()) {
        setIsAuthenticated(true);
      } else {
        // Se token expirou ou dados estão incompletos, limpar tudo
        if (isTokenExpired()) {
          localStorage.removeItem('userData');
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('access_token');
          localStorage.removeItem('loginTime');
          localStorage.removeItem('nome');
          localStorage.removeItem('email');
          localStorage.removeItem('cpf');
          localStorage.removeItem('acesso');
        }
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  const [userData, setUserData] = useState(null);

  const handleLogout = () => {
    setUserData(null);
    // Limpar dados da sessão
    localStorage.removeItem('userData');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('access_token');
    localStorage.removeItem('loginTime');
    localStorage.removeItem('nome');
    localStorage.removeItem('email');
    localStorage.removeItem('cpf');
    localStorage.removeItem('acesso');
  };

  // Verificar se já existe uma sessão salva ao carregar o app
  useEffect(() => {
    const savedUserData = localStorage.getItem('userData');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const accessToken = localStorage.getItem('access_token');
    
    if (savedUserData && isLoggedIn === 'true' && accessToken && !isTokenExpired()) {
      try {
        const parsedUserData = JSON.parse(savedUserData);
        setUserData(parsedUserData);
      } catch (error) {
        handleLogout(); // Usar a função de logout para limpar tudo
      }
    } else {
      // Token expirou ou dados incompletos
      if (isTokenExpired()) {
        // Mostrar alerta de sessão expirada
        Swal.fire({
          icon: 'warning',
          title: 'Sessão Expirada',
          text: 'Sua sessão expirou. Faça login novamente para continuar.',
          confirmButtonText: 'Fazer Login',
          confirmButtonColor: '#3b82f6',
          allowOutsideClick: false,
          allowEscapeKey: false
        }).then(() => {
          handleLogout(); // Só fazer logout após o usuário confirmar
        });
      } else {
        handleLogout(); // Limpar sessão para outros casos
      }
    }
  }, []);

  const handleLogin = (data) => {
    setUserData(data);
    // Salvar dados da sessão no localStorage
    localStorage.setItem('userData', JSON.stringify(data));
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleSignup = () => {
    // Após cadastro bem-sucedido, redirecionar para login
    // A navegação será feita pelo componente Signup
  };

  return (
    <Router>
      <Routes>
        {/* Rotas públicas */}
        <Route 
          path="/login" 
          element={
            userData ? 
              <Navigate to="/dashboard" /> : 
              <Login onLogin={handleLogin} />
          } 
        />
        
        <Route 
          path="/forgot-password" 
          element={<EsqueciSenha />} 
        />

        {/* Rotas protegidas */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Menu onLogout={handleLogout} userData={userData} currentView="dashboard" />
            </PrivateRoute>
          }
        />

        <Route
          path="/pdf"
          element={
            <PrivateRoute>
              <Menu onLogout={handleLogout} userData={userData} currentView="pdf" />
            </PrivateRoute>
          }
        />

        <Route
          path="/relatorio"
          element={
            <PrivateRoute>
              <Menu onLogout={handleLogout} userData={userData} currentView="relatorio" />
            </PrivateRoute>
          }
        />

        <Route
          path="/perfil"
          element={
            <PrivateRoute>
              <Menu onLogout={handleLogout} userData={userData} currentView="perfil" />
            </PrivateRoute>
          }
        />

        <Route
          path="/detalhes-ocorrencia"
          element={
            <PrivateRoute>
              <Menu onLogout={handleLogout} userData={userData} currentView="detalhes-ocorrencia" />
            </PrivateRoute>
          }
        />

        <Route
          path="/usuarios"
          element={
            <PrivateRoute>
              {userData?.tipoUser === 'admin' ? (
                <Menu onLogout={handleLogout} userData={userData} currentView="usuarios" />
              ) : (
                <Navigate to="/dashboard" />
              )}
            </PrivateRoute>
          }
        />

        <Route
          path="/cadastrar-usuario"
          element={
            <PrivateRoute>
              {userData?.tipoUser === 'admin' ? (
                <Menu onLogout={handleLogout} userData={userData} currentView="cadastrar-usuario" />
              ) : (
                <Navigate to="/dashboard" />
              )}
            </PrivateRoute>
          }
        />

        {/* Rota padrão - redireciona para dashboard ou login */}
        <Route 
          path="/" 
          element={<Navigate to={userData ? "/dashboard" : "/login"} />} 
        />

        {/* Rota 404 */}
        <Route 
          path="*" 
          element={<Navigate to={userData ? "/dashboard" : "/login"} />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
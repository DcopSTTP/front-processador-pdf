import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './screens/Login';
import Signup from './screens/Signup';
import EsqueciSenha from './screens/EsqueciASenha';
import Menu from './screens/Menu';

// Componente para proteger rotas privadas
function PrivateRoute({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const savedUserData = localStorage.getItem('userData');
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      
      if (savedUserData && isLoggedIn === 'true') {
        setIsAuthenticated(true);
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

  // Verificar se já existe uma sessão salva ao carregar o app
  useEffect(() => {
    const savedUserData = localStorage.getItem('userData');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (savedUserData && isLoggedIn === 'true') {
      try {
        const parsedUserData = JSON.parse(savedUserData);
        setUserData(parsedUserData);
      } catch (error) {
        console.error('Erro ao recuperar dados do usuário:', error);
        localStorage.removeItem('userData');
        localStorage.removeItem('isLoggedIn');
      }
    }
  }, []);

  const handleLogin = (data) => {
    setUserData(data);
    // Salvar dados da sessão no localStorage
    localStorage.setItem('userData', JSON.stringify(data));
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setUserData(null);
    // Limpar dados da sessão
    localStorage.removeItem('userData');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('access_token');
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
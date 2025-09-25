import React, { useEffect, useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Swal from 'sweetalert2';
import EsqueciSenha from './screens/EsqueciASenha';
import Login from './screens/Login';
import Menu from './screens/Menu';

const isTokenExpired = () => {
  const loginTime = localStorage.getItem('loginTime');
  if (!loginTime) return true;
  
  const now = new Date().getTime();
  const twentyFourHours = 24 * 60 * 60 * 1000; 
  
  return (now - parseInt(loginTime)) > twentyFourHours;
};

function PrivateRoute({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const savedUserData = localStorage.getItem('userData');
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      const accessToken = localStorage.getItem('access_token');
      
      if (savedUserData && isLoggedIn === 'true' && accessToken && !isTokenExpired()) {
        setIsAuthenticated(true);
      } else {
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
    localStorage.removeItem('userData');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('access_token');
    localStorage.removeItem('loginTime');
    localStorage.removeItem('nome');
    localStorage.removeItem('email');
    localStorage.removeItem('cpf');
    localStorage.removeItem('acesso');
  };

  useEffect(() => {
    const savedUserData = localStorage.getItem('userData');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const accessToken = localStorage.getItem('access_token');
    
    if (savedUserData && isLoggedIn === 'true' && accessToken && !isTokenExpired()) {
      try {
        const parsedUserData = JSON.parse(savedUserData);
        setUserData(parsedUserData);
      } catch (error) {
        handleLogout(); 
      }
    } else {
      if (isTokenExpired()) {
        Swal.fire({
          icon: 'warning',
          title: 'Sessão Expirada',
          text: 'Sua sessão expirou. Faça login novamente para continuar.',
          confirmButtonText: 'Fazer Login',
          confirmButtonColor: '#3b82f6',
          allowOutsideClick: false,
          allowEscapeKey: false
        }).then(() => {
          handleLogout(); 
        });
      } else {
        handleLogout(); 
      }
    }
  }, []);

  const handleLogin = (data) => {
    setUserData(data);
    localStorage.setItem('userData', JSON.stringify(data));
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleSignup = () => {
  };

  return (
    <Router>
      <Routes>
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

        <Route 
          path="/" 
          element={<Navigate to={userData ? "/dashboard" : "/login"} />} 
        />

        <Route 
          path="*" 
          element={<Navigate to={userData ? "/dashboard" : "/login"} />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
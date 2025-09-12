import React, { useState } from 'react';
import Login from './screens/Login';
import Signup from './screens/Signup';
import EsqueciSenha from './screens/EsqueciASenha';
import Menu from './screens/Home';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // ESTADO QUE CONTROLA QUAL TELA DE AUTENTICAÇÃO MOSTRAR: 'signin', 'signup' OU 'forgot'
  const [currentAuthScreen, setCurrentAuthScreen] = useState('signin'); 

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    // QUANDO FAZ LOGOUT, SEMPRE VOLTA PARA A TELA DE LOGIN (SIGNIN)
    setCurrentAuthScreen('signin'); 
  };

  const handleSignup = () => {
    // APÓS CRIAR CONTA COM SUCESSO, REDIRECIONA PARA LOGIN
    setCurrentAuthScreen('signin');
  };

  // FUNÇÃO PARA IR DA TELA DE LOGIN PARA CADASTRO
  const switchToSignup = () => {
    setCurrentAuthScreen('signup');
  };

  // FUNÇÃO PARA IR DA TELA DE CADASTRO PARA LOGIN
  const switchToSignin = () => {
    setCurrentAuthScreen('signin');
  };

  // FUNÇÃO PARA IR DA TELA DE LOGIN PARA ESQUECI A SENHA
  const switchToForgotPassword = () => {
    setCurrentAuthScreen('forgot');
  };

  // FUNÇÃO PARA VOLTAR DA TELA ESQUECI A SENHA PARA LOGIN
  const switchBackToLogin = () => {
    setCurrentAuthScreen('signin');
  };

  return (
    <>
      {!isLoggedIn ? (
        // SE NÃO ESTIVER LOGADO, MOSTRA UMA DAS TELAS DE AUTENTICAÇÃO
        currentAuthScreen === 'signin' ? (
          // TELA DE LOGIN - RECEBE FUNÇÕES PARA NAVEGAR PARA CADASTRO E ESQUECI SENHA
          <Login 
            onLogin={handleLogin} 
            onSwitchToSignup={switchToSignup}
            onSwitchToForgotPassword={switchToForgotPassword}
          />
        ) : currentAuthScreen === 'signup' ? (
          // TELA DE CADASTRO - RECEBE FUNÇÃO PARA VOLTAR AO LOGIN
          <Signup 
            onCadastro={handleSignup}
            onSwitchToSignin={switchToSignin}
          />
        ) : currentAuthScreen === 'forgot' ? (
          // TELA ESQUECI A SENHA - RECEBE FUNÇÃO PARA VOLTAR AO LOGIN
          <EsqueciSenha 
            onVoltar={switchBackToLogin}
          />
        ) : null
      ) : (
        // SE ESTIVER LOGADO, MOSTRA O MENU PRINCIPAL
        <Menu onLogout={handleLogout} />
      )}
    </>
  );
}

export default App;
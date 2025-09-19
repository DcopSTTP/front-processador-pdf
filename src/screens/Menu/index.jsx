import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProcessadorPDF from '../ProcessadorPDF';
import Dashboard from '../Dashboard';
import Signup from '../Signup';
import Logo from "../../assets/logo-sttp.webp";
import GerenciarUsuarios from '../Users';
import Relatorio from '../Relatorio';
import Perfil from '../Perfil';
import DetalhesOcorrencia from '../DetalhesOcorrencia';
import Swal from 'sweetalert2';

export default function Menu({ activeMenu, setActiveMenu, onLogout, userData, currentView }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedOcorrenciaId, setSelectedOcorrenciaId] = useState(null);

  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: (
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    { 
      id: 'pdf', 
      label: 'Processador de PDF', 
      icon: (
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    { 
      id: 'relatorio', 
      label: 'Relatório', 
      icon: (
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    ...(userData?.tipoUser === 'admin' ? [{
      id: 'usuarios',
      label: 'Usuários',
      icon: (
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      path: '/usuarios'
    }] : [])
  ];

  // Mapear as rotas
  const routes = {
    dashboard: '/dashboard',
    pdf: '/pdf',
    relatorio: '/relatorio',
    usuarios: '/usuarios'
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Sair do sistema?',
      text: 'Tem certeza que deseja fazer logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sim, sair',
      cancelButtonText: 'Cancelar',
      background: '#ffffff',
      customClass: {
        popup: 'swal-popup',
        title: 'swal-title',
        content: 'swal-content'
      }
    });

    if (result.isConfirmed) {
      // Mostrar mensagem de sucesso
      await Swal.fire({
        title: 'Logout realizado!',
        text: 'Você foi desconectado com sucesso.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        background: '#ffffff'
      });
      
      onLogout();
      navigate('/login');
    }
  };

  return (
    <>
      <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 80px;
          background: linear-gradient(90deg, #1e3a8a 0%, #1e40af 50%, #1d4ed8 100%);
          color: white;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          display: flex;
          align-items: center;
          padding: 0 2rem;
        }

        .nav-container {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .nav-left {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .logo-container {
          background: rgba(255, 255, 255, 0.15);
          padding: 0.75rem 1rem;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .logo-image {
          max-width: 60px;
          max-height: 60px;
          width: auto;
          height: auto;
          object-fit: contain;
          display: block;
        }

        .nav-menu {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .menu-item {
          position: relative;
        }

        .menu-button {
          padding: 0.5rem 1rem;
          background: transparent;
          border: none;
          color: white;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          font-weight: 500;
          position: relative;
        }

        .menu-button:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .menu-button.active {
          background: rgba(255, 255, 255, 0.2);
          border-bottom: 3px solid #60a5fa;
        }


        .menu-icon {
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .menu-label {
          white-space: nowrap;
        }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .user-details {
          cursor: pointer;
          transition: opacity 0.2s ease;
        }

        .user-details:hover {
          opacity: 0.8;
        }

        .user-details h4 {
          font-size: 0.875rem;
          font-weight: 600;
          margin: 0;
        }

        .user-details p {
          font-size: 0.75rem;
          opacity: 0.8;
          margin: 0;
        }

        .logout-button {
          padding: 0.5rem 1rem;
          background: rgba(220, 38, 38, 0.9);
          border: none;
          color: white;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .logout-button:hover {
          background: rgba(220, 38, 38, 1);
          box-shadow: 0 2px 8px rgba(220, 38, 38, 0.3);
        }

        .logout-icon {
          width: 16px;
          height: 16px;
        }

        .main-content {
          margin-top: 80px;
          min-height: calc(100vh - 80px);
        }

        .mobile-menu-dropdown {
          position: fixed;
          top: 80px;
          left: 0;
          right: 0;
          background: linear-gradient(180deg, #1e3a8a 0%, #1e40af 50%, #1d4ed8 100%);
          color: white;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          z-index: 999;
          transform: translateY(-100%);
          transition: transform 0.3s ease;
          display: none;
        }

        .mobile-menu-dropdown.open {
          transform: translateY(0);
          display: block;
        }

        .mobile-menu-item {
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .mobile-menu-item:last-child {
          border-bottom: none;
        }

        .mobile-menu-link {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.5rem;
          color: white;
          text-decoration: none;
          transition: background 0.2s ease;
          width: 100%;
          border: none;
          background: transparent;
          font-size: 1rem;
          cursor: pointer;
        }

        .mobile-menu-link:hover,
        .mobile-menu-link.active {
          background: rgba(255, 255, 255, 0.1);
        }

        .mobile-menu-link.active {
          border-left: 4px solid #60a5fa;
          background: rgba(255, 255, 255, 0.15);
        }

        .mobile-user-section {
          padding: 1rem 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(0, 0, 0, 0.1);
        }

        .mobile-user-info {
          margin-bottom: 1rem;
          text-align: center;
        }

        .mobile-user-info h4 {
          margin: 0 0 0.25rem 0;
          font-size: 1rem;
          font-weight: 600;
        }

        .mobile-user-info p {
          margin: 0;
          font-size: 0.875rem;
          opacity: 0.8;
        }

        .mobile-logout-button {
          width: 100%;
          padding: 0.75rem;
          background: rgba(220, 38, 38, 0.9);
          border: none;
          color: white;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .mobile-logout-button:hover {
          background: rgba(220, 38, 38, 1);
        }

        .mobile-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 998;
          display: none;
        }

        .mobile-overlay.open {
          display: block;
        }

        @media (max-width: 768px) {
          .navbar {
            padding: 0 1rem;
          }

          .nav-menu {
            display: none;
          }

          .user-info {
            display: none;
          }

          .mobile-menu-button {
            display: block;
            background: transparent;
            border: none;
            color: white;
            padding: 0.5rem;
            cursor: pointer;
          }
        }

        @media (min-width: 769px) {
          .mobile-menu-button {
            display: none;
          }

          .mobile-menu-dropdown {
            display: none !important;
          }
        }

        // @media (max-width: 768px) {
        //   .sidebar {
        //     transform: translateX(-100%);
        //     width: 280px;
        //   }

        //   .sidebar.mobile-open {
        //     transform: translateX(0);
        //   }

        //   .mobile-toggle {
        //     display: flex;
        //     align-items: center;
        //     justify-content: center;
        //   }

        //   .overlay.mobile-open {
        //     display: block;
        //   }

        //   .collapse-button {
        //     display: none;
        //   }
        // }

        // @media (max-width: 480px) {
        //   .sidebar {
        //     width: 100vw;
        //   }
        // }
      `}</style>

      {/* Mobile Toggle Button */}
      {/* <button 
        className="mobile-toggle"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? (
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button> */}

      {/* Mobile Overlay */}
      {/* <div 
        className={`overlay ${mobileMenuOpen ? 'mobile-open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      ></div> */}

      <nav className="navbar">
        <div className="nav-container">
          {/* Left side - Logo and Menu Items */}
          <div className="nav-left">
            <div className="logo-container">
              <img 
                src={Logo} 
                alt="Logo do Sistema" 
                className="logo-image"
              />
            </div>
            
            <div className="nav-menu">
              {menuItems.map((item) => (
                <div key={item.id} className="menu-item">
                  <button
                    className={`menu-button ${currentView === item.id ? 'active' : ''}`}
                    onClick={() => {
                      navigate(routes[item.id] || `/${item.id}`);
                      setMobileMenuOpen(false); 
                    }}
                  >
                    <div className="menu-icon">{item.icon}</div>
                    <span className="menu-label">{item.label}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - User info and Logout */}
          <div className="nav-right">
            <div className="user-info">
              <div 
                className="user-details"
                onClick={() => navigate('/perfil')}
                title="Clique para editar perfil"
              >
                <h4>{userData?.nome || 'Usuário'}</h4>
                <p>{userData?.tipoUser === 'admin' ? 'Administrador' : 'Usuário'}</p>
              </div>
            </div>
            
            <button className="logout-button" onClick={handleLogout}>
              <svg className="logout-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Sair</span>
            </button>

            {/* Mobile menu button */}
            <button 
              className="mobile-menu-button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Overlay */}
      <div 
        className={`mobile-overlay ${mobileMenuOpen ? 'open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      ></div>

      {/* Mobile Menu Dropdown */}
      <div className={`mobile-menu-dropdown ${mobileMenuOpen ? 'open' : ''}`}>
        {/* Menu Items */}
        {menuItems.map((item) => (
          <div key={item.id} className="mobile-menu-item">
            <button
              className={`mobile-menu-link ${currentView === item.id ? 'active' : ''}`}
              onClick={() => {
                navigate(routes[item.id] || `/${item.id}`);
                setMobileMenuOpen(false);
              }}
            >
              <div className="menu-icon">{item.icon}</div>
              <span>{item.label}</span>
            </button>
          </div>
        ))}

        {/* User Section */}
        <div className="mobile-user-section">
          <div 
            className="mobile-user-info"
            onClick={() => {
              navigate('/perfil');
              setMobileMenuOpen(false);
            }}
            style={{ cursor: 'pointer' }}
            title="Clique para editar perfil"
          >
            <h4>{userData?.nome || 'Usuário'}</h4>
            <p>{userData?.tipoUser === 'admin' ? 'Administrador' : 'Usuário'}</p>
          </div>
          
          <button className="mobile-logout-button" onClick={handleLogout}>
            <svg className="logout-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Sair</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {currentView === 'pdf' && <ProcessadorPDF />}
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'relatorio' && <Relatorio onVerDetalhes={(id) => {
          setSelectedOcorrenciaId(id);
          navigate('/detalhes-ocorrencia');
        }} />}
        {currentView === 'detalhes-ocorrencia' && <DetalhesOcorrencia ocorrenciaId={selectedOcorrenciaId} onBack={() => navigate('/relatorio')} />}
        {currentView === 'perfil' && <Perfil />}
        {currentView === 'usuarios' && <GerenciarUsuarios />}
        {currentView === 'cadastrar-usuario' && <Signup isAdminView={true} />}
      </div>
    </>
  );
}
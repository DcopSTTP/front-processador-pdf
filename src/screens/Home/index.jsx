import React, { useState } from 'react';
import ProcessadorPDF from '../ProcessadorPDF';
import Dashboard from '../Dashboard';
import Logo from "../../assets/Logo.svg";

export default function Menu({ activeMenu, setActiveMenu, onLogout }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');

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
    }
  ];

  const handleLogout = () => {
    if (window.confirm("Tem certeza que deseja sair do sistema?")) {
      onLogout();
    }
  };

  return (
    <>
      <style>{`
        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: ${sidebarCollapsed ? '80px' : '280px'};
          background: linear-gradient(180deg, #1e3a8a 0%, #1e40af 50%, #1d4ed8 100%);
          color: white;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 4px 0 15px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .sidebar.mobile-open {
          transform: translateX(0);
        }

        .sidebar-header {
          padding: 2rem 1.5rem 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .logo-container {
          background: rgba(255, 255, 255, 0.15);
          padding: 0.75rem;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 48px;
          backdrop-filter: blur(10px);
        }

        .logo-icon {
          width: 24px;
          height: 24px;
          color: white;
        }

        .brand-text {
          font-size: 1.5rem;
          font-weight: 700;
          opacity: ${sidebarCollapsed ? '0' : '1'};
          transition: opacity 0.3s ease;
          white-space: nowrap;
        }

        .collapse-button {
          position: absolute;
          top: 1rem;
          right: 4px;
          background: #1e40af;
          border: none;
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          transition: all 0.2s ease;
          z-index: 1001;
        }

        .collapse-button:hover {
          background: #1d4ed8;
          transform: scale(1.1);
        }

        .menu-list {
          flex: 1;
          padding: 1.5rem 0;
          overflow-y: auto;
        }

        .menu-item {
          margin: 0.5rem 1rem;
          position: relative;
        }

        .menu-button {
          width: 100%;
          padding: 1rem 1.25rem;
          background: ${sidebarCollapsed ? 'transparent' : 'rgba(255, 255, 255, 0.1)'};
          border: none;
          color: white;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 0.95rem;
          font-weight: 500;
          text-align: left;
          position: relative;
          overflow: hidden;
        }

        .menu-button:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateX(4px);
        }

        .menu-button.active {
          background: rgba(255, 255, 255, 0.2);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          border-left: 4px solid #60a5fa;
        }

        .menu-button.active::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, rgba(96, 165, 250, 0.2), transparent);
          pointer-events: none;
        }

        .menu-icon {
          min-width: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .menu-label {
          opacity: ${sidebarCollapsed ? '0' : '1'};
          transition: opacity 0.3s ease;
          white-space: nowrap;
        }

        .tooltip {
          position: absolute;
          left: calc(100% + 12px);
          top: 50%;
          transform: translateY(-50%);
          background: #1f2937;
          color: white;
          padding: 0.5rem 0.75rem;
          border-radius: 6px;
          font-size: 0.875rem;
          white-space: nowrap;
          opacity: 0;
          visibility: hidden;
          transition: all 0.2s ease;
          z-index: 1000;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .tooltip::before {
          content: '';
          position: absolute;
          left: -4px;
          top: 50%;
          transform: translateY(-50%);
          border: 4px solid transparent;
          border-right-color: #1f2937;
        }

        .menu-item:hover .tooltip {
          opacity: ${sidebarCollapsed ? '1' : '0'};
          visibility: ${sidebarCollapsed ? 'visible' : 'hidden'};
        }

        .sidebar-footer {
          padding: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .user-info {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1rem;
          opacity: ${sidebarCollapsed ? '0' : '1'};
          transition: opacity 0.3s ease;
          text-align: center;
        }

        .user-details {
          text-align: center;
        }

        .user-details h4 {
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
          text-align: center;
        }

        .user-details p {
          font-size: 0.75rem;
          opacity: 0.8;
          text-align: center;
        }

        .logout-button {
          width: 100%;
          padding: 0.875rem 1.25rem;
          background: rgba(220, 38, 38, 0.8);
          border: none;
          color: white;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          font-size: 0.9rem;
          font-weight: 600;
          backdrop-filter: blur(10px);
        }

        .logout-button:hover {
          background: rgba(220, 38, 38, 1);
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(220, 38, 38, 0.3);
        }

        .logout-icon {
          width: 18px;
          height: 18px;
        }

        .logout-text {
          opacity: ${sidebarCollapsed ? '0' : '1'};
          transition: opacity 0.3s ease;
        }

        .mobile-toggle {
          display: none;
          position: fixed;
          top: 1rem;
          left: 1rem;
          z-index: 1001;
          background: #1e40af;
          border: none;
          color: white;
          width: 48px;
          height: 48px;
          border-radius: 12px;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          transition: all 0.2s ease;
        }

        .mobile-toggle:hover {
          background: #1d4ed8;
          transform: scale(1.05);
        }

        .overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
        }
        .logo-image {
          max-width: 80px;
          max-height: 80px;
          width: auto;
          height: auto;
          object-fit: contain;
        }
      
        .logo-container {
          display: flex;
          justify-content: center;
          margin-bottom: 1.5rem;
          padding: 1rem;
        }
      
        .logo {
          background: transparent; 
          padding: 0; 
          border-radius: 0; 
          box-shadow: none; 
          transition: all 0.3s ease;
        }
      
        .logo:hover {
          transform: scale(1.05);
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

      {/* Sidebar */}
      <nav className={`sidebar ${mobileMenuOpen}`}>
        {/* Collapse Button (Desktop) */}
        <button 
          className="collapse-button"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          {sidebarCollapsed ? (
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          ) : (
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          )}
        </button>

        {/* Header */}
        <div className="sidebar-header">
          <div className="logo-container">
          <img 
                  src={Logo} 
                  alt="Logo do Sistema" 
                  className="logo-image"
                />
          </div>
          {!sidebarCollapsed && (
            <div className="brand-text"></div>
          )}
        </div>

        {/* Menu Items */}
        <div className="menu-list">
          {menuItems.map((item) => (
            <div key={item.id} className="menu-item">
              <button
                className={`menu-button ${currentView === item.id ? 'active' : ''}`}
                onClick={() => {
                  setCurrentView(item.id);
                  setMobileMenuOpen(false); // Close mobile menu on selection
                }}
              >
                <div className="menu-icon">{item.icon}</div>
                <span className="menu-label">{item.label}</span>
                {sidebarCollapsed && (
                  <div className="tooltip">{item.label}</div>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="sidebar-footer">
          {!sidebarCollapsed && (
            <div className="user-info">
              <div className="user-details">
                <h4>João Silva</h4>
                <p>Administrator</p>
              </div>
            </div>
          )}
          
          <button className="logout-button" onClick={handleLogout}>
            <svg className="logout-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="logout-text">Sair</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ marginLeft: sidebarCollapsed ? '80px' : '280px', minHeight: '100vh' }}>
        {currentView === 'pdf' && <ProcessadorPDF />}
        {currentView === 'dashboard' && <Dashboard />}
      </div>
    </>
  );
}
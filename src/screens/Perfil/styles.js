export const perfilStyles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
      padding: '20px',
      fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
  
    mainContainer: {
      maxWidth: '600px',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    },
  
    header: {
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      padding: '32px',
      textAlign: 'center',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb'
    },
  
    headerIcon: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '64px',
      height: '64px',
      backgroundColor: '#1e3a8a',
      borderRadius: '16px',
      marginBottom: '16px',
      boxShadow: '0 4px 12px rgba(30, 58, 138, 0.3)'
    },
  
    title: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#1e3a8a',
      margin: '0 0 8px 0',
      lineHeight: '1.2'
    },
  
    subtitle: {
      fontSize: '16px',
      color: '#6b7280',
      margin: '0',
      fontWeight: '500'
    },
  
    formCard: {
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      padding: '32px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb'
    },
  
    formContent: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
  
    formField: {
      display: 'flex',
      flexDirection: 'column'
    },
  
    formLabel: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center'
    },
  
    formInput: {
      padding: '14px 16px',
      border: '1px solid #d1d5db',
      borderRadius: '12px',
      fontSize: '16px',
      backgroundColor: '#ffffff',
      transition: 'all 0.2s ease',
      outline: 'none',
      fontFamily: 'inherit'
    },
  
    formSelect: {
      padding: '14px 16px',
      border: '1px solid #d1d5db',
      borderRadius: '12px',
      fontSize: '16px',
      backgroundColor: '#ffffff',
      transition: 'all 0.2s ease',
      outline: 'none',
      cursor: 'pointer',
      fontFamily: 'inherit'
    },
  
    errorMessage: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '12px 16px',
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: '8px',
      color: '#dc2626',
      fontSize: '14px',
      fontWeight: '500',
      marginBottom: '20px'
    },
  
    successMessage: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '12px 16px',
      backgroundColor: '#f0fdf4',
      border: '1px solid #bbf7d0',
      borderRadius: '8px',
      color: '#16a34a',
      fontSize: '14px',
      fontWeight: '500',
      marginBottom: '20px'
    },
  
    formActions: {
      marginTop: '32px',
      paddingTop: '24px',
      borderTop: '1px solid #e5e7eb'
    },
  
    changesIndicator: {
      padding: '12px 16px',
      backgroundColor: '#fef3c7',
      border: '1px solid #fde047',
      borderRadius: '8px',
      marginBottom: '16px',
      textAlign: 'center'
    },
  
    actionButtons: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'center'
    },
  
    cancelButton: {
      padding: '12px 24px',
      backgroundColor: '#f9fafb',
      color: '#6b7280',
      border: '1px solid #d1d5db',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontFamily: 'inherit'
    },
  
    saveButton: {
      padding: '12px 24px',
      backgroundColor: '#1e3a8a',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontFamily: 'inherit'
    },
  
    buttonContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
  
    buttonLoading: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
  
    buttonSpinner: {
      width: '16px',
      height: '16px',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      borderTop: '2px solid white',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    },
  
    infoCard: {
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb'
    },
  
    infoTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1f2937',
      margin: '0 0 12px 0'
    },
  
    infoList: {
      margin: '0',
      paddingLeft: '20px',
      color: '#6b7280',
      fontSize: '14px',
      lineHeight: '1.6'
    },
  
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px',
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb',
      color: '#6b7280'
    },
  
    spinner: {
      width: '40px',
      height: '40px',
      border: '3px solid #e5e7eb',
      borderTop: '3px solid #1e3a8a',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginBottom: '16px'
    }
  };
  
  export const perfilCSS = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  
    /* Hover effects para inputs */
    input:focus {
      border-color: #1e3a8a !important;
      box-shadow: 0 0 0 3px rgba(30, 58, 138, 0.1) !important;
    }
  
    select:focus {
      border-color: #1e3a8a !important;
      box-shadow: 0 0 0 3px rgba(30, 58, 138, 0.1) !important;
    }
  
    /* Hover effects para botões */
    button:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  
    /* Botão cancelar hover */
    button[style*="background: #f9fafb"]:hover:not(:disabled) {
      background-color: #f3f4f6 !important;
      border-color: #9ca3af !important;
    }
  
    /* Botão salvar hover */
    button[style*="background: #1e3a8a"]:hover:not(:disabled) {
      background-color: #1e40af !important;
    }
  
    /* Botão salvar desabilitado */
    button[style*="background: #1e3a8a"]:disabled {
      background-color: #9ca3af !important;
      cursor: not-allowed !important;
      transform: none !important;
      box-shadow: none !important;
    }
  
    /* Indicador de mudanças */
    div[style*="background: #fef3c7"] span {
      color: #92400e;
      font-size: 14px;
      font-weight: 500;
    }
  
    /* Placeholder styles */
    input::placeholder {
      color: #9ca3af;
    }
  
    /* Responsividade */
    @media (max-width: 640px) {
      .container {
        padding: 16px !important;
      }
      
      .main-container {
        gap: 16px !important;
      }
      
      .form-card {
        padding: 20px !important;
      }
      
      .header {
        padding: 24px !important;
      }
      
      .title {
        font-size: 24px !important;
      }
      
      .action-buttons {
        flex-direction: column !important;
      }
      
      .cancel-button,
      .save-button {
        width: 100% !important;
        justify-content: center !important;
      }
    }
  
    /* Estados especiais */
    .changes-indicator {
      animation: slideIn 0.3s ease-out;
    }
  
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  
    /* Lista de informações */
    .info-list li {
      margin-bottom: 6px;
    }
  
    .info-list li:last-child {
      margin-bottom: 0;
    }
  `;
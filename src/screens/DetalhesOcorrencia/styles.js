export const detalhesStyles = {
    // Container principal
    container: {
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
      padding: '20px',
      fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif"
    },
  
    mainContainer: {
      maxWidth: '800px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    },
  
    // Header
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
  
    // Card de preview dos dados (baseado no DataPreview)
    dataPreview: {
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      padding: '32px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
  
    // Número da ocorrência em destaque (igual ao DataPreview)
    highlightField: {
      backgroundColor: '#dbeafe',
      border: '2px solid #3b82f6',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '8px'
    },
  
    highlightLabel: {
      fontSize: '16px',
      color: '#1d4ed8',
      fontWeight: '600',
      marginBottom: '8px'
    },
  
    highlightValue: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#1e40af',
      fontFamily: 'monospace',
      letterSpacing: '0.5px'
    },
  
    // Títulos de seção
    sectionTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1f2937',
      marginTop: '24px',
      marginBottom: '16px',
      paddingBottom: '8px',
      borderBottom: '2px solid #e5e7eb',
      display: 'flex',
      alignItems: 'center'
    },
  
    // Campos de dados
    dataField: {
      backgroundColor: '#f9fafb',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '16px'
    },
  
    dataRow: {
      fontSize: '14px',
      color: '#374151',
      lineHeight: '1.5'
    },
  
    dataLabel: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '8px'
    },
  
    dataValue: {
      fontSize: '14px',
      color: '#1f2937',
      lineHeight: '1.6',
      whiteSpace: 'pre-wrap'
    },
  
    dataGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '12px',
      fontSize: '14px',
      color: '#374151',
      lineHeight: '1.5'
    },
  
    // Cards de empenhos
    empenhoCard: {
      backgroundColor: '#ffffff',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '16px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    },
  
    empenhoHeader: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1e3a8a',
      marginBottom: '12px',
      paddingBottom: '8px',
      borderBottom: '1px solid #e5e7eb'
    },
  
    // Estados especiais
    emptyState: {
      textAlign: 'center',
      padding: '40px 20px',
      color: '#6b7280',
      fontStyle: 'italic'
    },
  
    // Botões de ação
    actionButtons: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: '32px',
      paddingTop: '24px',
      borderTop: '1px solid #e5e7eb'
    },
  
    backButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 24px',
      backgroundColor: '#f8fafc',
      color: '#1e3a8a',
      border: '1px solid #d1d5db',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontFamily: 'inherit'
    },
  
    // Estados de loading e erro
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
      color: '#6b7280',
      margin: '0 auto',
      maxWidth: '600px'
    },
  
    errorContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px',
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb',
      color: '#6b7280',
      margin: '0 auto',
      maxWidth: '600px',
      textAlign: 'center',
      padding: '40px'
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
  
  // CSS Animations e hover effects
  export const detalhesCSS = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  
    /* Hover effects */
    button:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  
    /* Botão voltar hover */
    button[style*="background: #f8fafc"]:hover {
      background-color: #f1f5f9 !important;
      border-color: #1e3a8a !important;
    }
  
    /* Efeitos nos cards */
    .empenho-card:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      transform: translateY(-1px);
      transition: all 0.2s ease;
    }
  
    /* Grid responsivo */
    @media (max-width: 640px) {
      .data-grid {
        grid-template-columns: 1fr !important;
      }
      
      .main-container {
        padding: 16px !important;
      }
      
      .data-preview {
        padding: 20px !important;
      }
      
      .header {
        padding: 24px !important;
      }
      
      .title {
        font-size: 24px !important;
      }
      
      .highlight-field {
        padding: 16px !important;
      }
      
      .highlight-value {
        font-size: 16px !important;
      }
      
      .section-title {
        font-size: 16px !important;
      }
      
      .empenho-card {
        padding: 16px !important;
      }
    }
  
    /* Estados especiais dos cards */
    .data-field {
      transition: all 0.2s ease;
    }
  
    .data-field:hover {
      background-color: #f3f4f6;
      border-color: #d1d5db;
    }
  
    /* Melhorias visuais para texto longo */
    .data-value {
      word-wrap: break-word;
      overflow-wrap: break-word;
    }
  
    /* Destaque para coordenadas */
    div[style*="Coordenadas"] {
      font-family: monospace;
    }
  
    /* Estado de erro específico */
    .error-container h2 {
      color: #dc2626;
      margin: 16px 0 8px 0;
      font-size: 20px;
    }
  
    .error-container p {
      color: #6b7280;
      margin-bottom: 24px;
    }
  
    /* Loading state */
    .loading-container p {
      margin-top: 0;
      font-size: 16px;
    }
  `;
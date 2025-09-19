export const relatoriosStyles = {
    // Container principal
    container: {
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
      padding: '20px',
      fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif"
    },
  
    mainContainer: {
      maxWidth: '1200px',
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
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
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
      fontSize: '32px',
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
  
    // Card de Filtros
    filterCard: {
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb',
      overflow: 'hidden'
    },
  
    filterHeader: {
      padding: '20px 24px',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#f9fafb'
    },
  
    filterTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1f2937',
      margin: '0',
      display: 'flex',
      alignItems: 'center'
    },
  
    toggleButton: {
      padding: '8px 16px',
      backgroundColor: '#1e3a8a',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
  
    filterContent: {
      padding: '24px',
      animation: 'slideDown 0.2s ease-out'
    },
  
    filterGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      marginBottom: '24px'
    },
  
    filterField: {
      display: 'flex',
      flexDirection: 'column'
    },
  
    filterLabel: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '6px',
      display: 'flex',
      alignItems: 'center'
    },
  
    filterInput: {
      padding: '12px 16px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '14px',
      backgroundColor: '#ffffff',
      transition: 'all 0.2s ease',
      outline: 'none'
    },
  
    filterActions: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'center',
      paddingTop: '20px',
      borderTop: '1px solid #e5e7eb'
    },
  
    applyButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 24px',
      backgroundColor: '#1e3a8a',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
  
    clearButton: {
      padding: '12px 24px',
      backgroundColor: '#f9fafb',
      color: '#6b7280',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
  
    // Card da Tabela
    tableCard: {
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb',
      overflow: 'hidden'
    },
  
    tableHeader: {
      padding: '20px 24px',
      borderBottom: '1px solid #e5e7eb',
      backgroundColor: '#f9fafb'
    },
  
    tableTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1f2937',
      margin: '0'
    },
  
    tableContainer: {
      overflowX: 'auto'
    },
  
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '14px'
    },
  
    tableHeaderRow: {
      backgroundColor: '#f9fafb'
    },
  
    tableHeaderCell: {
      padding: '16px 20px',
      textAlign: 'left',
      fontWeight: '600',
      color: '#374151',
      borderBottom: '1px solid #e5e7eb',
      fontSize: '13px',
      textTransform: 'uppercase',
      letterSpacing: '0.025em'
    },
  
    tableRow: {
      backgroundColor: '#ffffff',
      transition: 'background-color 0.2s ease'
    },
  
    tableCell: {
      padding: '16px 20px',
      borderBottom: '1px solid #f3f4f6',
      verticalAlign: 'middle'
    },
  
    numeroOcorrencia: {
      fontFamily: 'monospace',
      fontSize: '13px',
      fontWeight: '600',
      color: '#1e3a8a',
      backgroundColor: '#dbeafe',
      padding: '4px 8px',
      borderRadius: '6px',
      display: 'inline-block'
    },
  
    naturezaBadge: {
      backgroundColor: '#fef3c7',
      color: '#92400e',
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.025em'
    },
  
    viewButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '8px 12px',
      backgroundColor: '#1e3a8a',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
  
    // Estados de loading e vazio
    loadingContainer: {
      padding: '60px 20px',
      textAlign: 'center',
      color: '#6b7280'
    },
  
    spinner: {
      width: '32px',
      height: '32px',
      border: '3px solid #e5e7eb',
      borderTop: '3px solid #1e3a8a',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      margin: '0 auto 16px'
    },
  
    emptyState: {
      padding: '60px 20px',
      textAlign: 'center',
      color: '#6b7280',
      fontSize: '16px'
    }
  };
  
  // CSS Animations (adicionar no head do documento ou arquivo CSS separado)
  export const relatoriosCSS = `
    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  
    /* Hover effects */
    button:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  
    .${relatoriosStyles.applyButton}:hover:not(:disabled) {
      background-color: #1e40af;
    }
  
    .${relatoriosStyles.clearButton}:hover {
      background-color: #f3f4f6;
      border-color: #9ca3af;
    }
  
    .${relatoriosStyles.toggleButton}:hover {
      background-color: #1e40af;
    }
  
    .${relatoriosStyles.viewButton}:hover {
      background-color: #1e40af;
    }
  
    .${relatoriosStyles.filterInput}:focus {
      border-color: #1e3a8a;
      box-shadow: 0 0 0 2px rgba(30, 58, 138, 0.1);
    }
  
    .${relatoriosStyles.tableRow}:hover {
      background-color: #f9fafb;
    }
  
    /* Responsividade */
    @media (max-width: 768px) {
      .filter-grid {
        grid-template-columns: 1fr;
      }
      
      .filter-actions {
        flex-direction: column;
      }
      
      .table-container {
        font-size: 12px;
      }
      
      .table-header-cell,
      .table-cell {
        padding: 12px 16px;
      }
    }
    `;
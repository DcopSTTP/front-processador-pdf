import React, { useState, useEffect } from 'react';
import { SearchIcon, FilterIcon, EyeIcon, CalendarIcon, MapPinIcon, AlertTriangleIcon } from 'lucide-react';
import { relatoriosStyles } from './styles';
import { buscarOcorrenciasFiltradas } from '../../service/UserService';
import Swal from 'sweetalert2';

function RelatoriosOcorrencias({ onVerDetalhes }) {
  // Estados
  const [loading, setLoading] = useState(false);
  const [ocorrencias, setOcorrencias] = useState([]);
  const [filtros, setFiltros] = useState({
    dataInicial: '',
    dataFinal: '',
    natureza: '',
    logradouro: '',
    bairro: ''
  });
  const [showFilters, setShowFilters] = useState(true);

  const [error, setError] = useState(null);
  // Não carregar dados automaticamente - apenas quando aplicar filtros

  const carregarOcorrencias = async (filtrosAplicados = {}) => {
    setLoading(true);
    setError(null);
    try {
      const dados = await buscarOcorrenciasFiltradas(filtrosAplicados);
      setOcorrencias(dados);
    } catch (err) {
      console.error('Erro ao carregar ocorrências:', err);
      setError(err.message);
      Swal.fire({
        icon: 'error',
        title: 'Erro ao carregar ocorrências',
        text: err.message || 'Não foi possível carregar as ocorrências.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#dc2626'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const aplicarFiltros = () => {
    carregarOcorrencias(filtros);
  };

  const limparFiltros = () => {
    const filtrosLimpos = {
      dataInicial: '',
      dataFinal: '',
      natureza: '',
      logradouro: '',
      bairro: ''
    };
    setFiltros(filtrosLimpos);
    setOcorrencias([]); // Limpar resultados em vez de buscar dados vazios
  };

  const formatarData = (dataString) => {
    return new Date(dataString).toLocaleDateString('pt-BR');
  };

  const visualizarOcorrencia = (id) => {
    if (onVerDetalhes) {
      onVerDetalhes(id);
    }
  };

  return (
    <div style={relatoriosStyles.container}>
      <div style={relatoriosStyles.mainContainer}>

        {/* Filtros */}
        <div style={relatoriosStyles.filterCard}>
          <div style={relatoriosStyles.filterHeader}>
            <h3 style={relatoriosStyles.filterTitle}>
              <FilterIcon style={{ width: '18px', height: '18px', marginRight: '8px' }} />
              Filtros de Busca
            </h3>
            <button
              onClick={() => setShowFilters(!showFilters)}
              style={relatoriosStyles.toggleButton}
            >
              {showFilters ? 'Ocultar' : 'Mostrar'} Filtros
            </button>
          </div>

          {showFilters && (
            <div style={relatoriosStyles.filterContent}>
              <div style={relatoriosStyles.filterGrid}>
                
                {/* Data Inicial */}
                <div style={relatoriosStyles.filterField}>
                  <label style={relatoriosStyles.filterLabel}>
                    <CalendarIcon style={{ width: '16px', height: '16px', marginRight: '6px' }} />
                    Data Inicial
                  </label>
                  <input
                    type="date"
                    value={filtros.dataInicial}
                    onChange={(e) => handleFiltroChange('dataInicial', e.target.value)}
                    style={relatoriosStyles.filterInput}
                  />
                </div>

                {/* Data Final */}
                <div style={relatoriosStyles.filterField}>
                  <label style={relatoriosStyles.filterLabel}>
                    <CalendarIcon style={{ width: '16px', height: '16px', marginRight: '6px' }} />
                    Data Final
                  </label>
                  <input
                    type="date"
                    value={filtros.dataFinal}
                    onChange={(e) => handleFiltroChange('dataFinal', e.target.value)}
                    style={relatoriosStyles.filterInput}
                  />
                </div>

                {/* Natureza */}
                <div style={relatoriosStyles.filterField}>
                  <label style={relatoriosStyles.filterLabel}>
                    <AlertTriangleIcon style={{ width: '16px', height: '16px', marginRight: '6px' }} />
                    Natureza
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Acidente de Trânsito"
                    value={filtros.natureza}
                    onChange={(e) => handleFiltroChange('natureza', e.target.value)}
                    style={relatoriosStyles.filterInput}
                  />
                </div>

                {/* Logradouro */}
                <div style={relatoriosStyles.filterField}>
                  <label style={relatoriosStyles.filterLabel}>
                    <MapPinIcon style={{ width: '16px', height: '16px', marginRight: '6px' }} />
                    Logradouro
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Av. Principal"
                    value={filtros.logradouro}
                    onChange={(e) => handleFiltroChange('logradouro', e.target.value)}
                    style={relatoriosStyles.filterInput}
                  />
                </div>

                {/* Bairro */}
                <div style={relatoriosStyles.filterField}>
                  <label style={relatoriosStyles.filterLabel}>
                    <MapPinIcon style={{ width: '16px', height: '16px', marginRight: '6px' }} />
                    Bairro
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Centro"
                    value={filtros.bairro}
                    onChange={(e) => handleFiltroChange('bairro', e.target.value)}
                    style={relatoriosStyles.filterInput}
                  />
                </div>

              </div>

              <div style={relatoriosStyles.filterActions}>
                <button
                  onClick={aplicarFiltros}
                  disabled={loading}
                  style={relatoriosStyles.applyButton}
                >
                  <SearchIcon style={{ width: '16px', height: '16px' }} />
                  {loading ? 'Buscando...' : 'Aplicar Filtros'}
                </button>
                <button
                  onClick={limparFiltros}
                  style={relatoriosStyles.clearButton}
                >
                  Limpar Filtros
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tabela de Resultados */}
        <div style={relatoriosStyles.tableCard}>
          <div style={relatoriosStyles.tableHeader}>
            <h3 style={relatoriosStyles.tableTitle}>
              Resultados ({ocorrencias.length} ocorrências)
            </h3>
          </div>

          {loading ? (
            <div style={relatoriosStyles.loadingContainer}>
              <div style={relatoriosStyles.spinner}></div>
              <p>Carregando ocorrências...</p>
            </div>
          ) : (
            <div style={relatoriosStyles.tableContainer}>
              {ocorrencias.length === 0 ? (
                <div style={relatoriosStyles.emptyState}>
                  <p>
                    {error ? 
                      'Erro ao carregar dados. Tente novamente.' : 
                      'Use os filtros acima para buscar ocorrências específicas ou clique em "Aplicar Filtros" sem preencher nada para ver todas as ocorrências.'
                    }
                  </p>
                </div>
              ) : (
                <table style={relatoriosStyles.table}>
                  <thead>
                    <tr style={relatoriosStyles.tableHeaderRow}>
                      <th style={relatoriosStyles.tableHeaderCell}>Número da Ocorrência</th>
                      <th style={relatoriosStyles.tableHeaderCell}>Data</th>
                      <th style={relatoriosStyles.tableHeaderCell}>Natureza</th>
                      <th style={relatoriosStyles.tableHeaderCell}>Bairro</th>
                      <th style={relatoriosStyles.tableHeaderCell}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ocorrencias.map((ocorrencia) => (
                      <tr key={ocorrencia.id} style={relatoriosStyles.tableRow}>
                        <td style={relatoriosStyles.tableCell}>
                          <span style={relatoriosStyles.numeroOcorrencia}>
                            {ocorrencia.numeroOcorrencia}
                          </span>
                        </td>
                        <td style={relatoriosStyles.tableCell}>
                          {formatarData(ocorrencia.createdAt)}
                        </td>
                        <td style={relatoriosStyles.tableCell}>
                          <span style={relatoriosStyles.naturezaBadge}>
                            {ocorrencia.natureza}
                          </span>
                        </td>
                        <td style={relatoriosStyles.tableCell}>
                          {ocorrencia.localizacao.bairro}
                        </td>
                        <td style={relatoriosStyles.tableCell}>
                          <button
                            onClick={() => visualizarOcorrencia(ocorrencia.id)}
                            style={relatoriosStyles.viewButton}
                            title="Visualizar detalhes"
                          >
                            <EyeIcon style={{ width: '16px', height: '16px' }} />
                            Ver Detalhes
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default RelatoriosOcorrencias;

import React, { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import Swal from 'sweetalert2';
import { buscarEstatisticas, buscarEstatisticasMensais } from '../../service/UserService';

const COLORS = ["#1e40af", "#dc2626", "#16a34a", "#f59e0b", "#7c3aed", "#0891b2"];

function Dashboard() {
  const [estatisticas, setEstatisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({
    ano: new Date().getFullYear(),
    mes: new Date().getMonth() + 1,
    tipoVisualizacao: 'mensal' 
  });

  useEffect(() => {
    const carregarEstatisticas = async () => {
      try {
        setLoading(true);
        let dados;
        
        if (filtros.tipoVisualizacao === 'mensal') {
          dados = await buscarEstatisticasMensais(filtros.ano, filtros.mes);
        } else {
          dados = await buscarEstatisticas();
        }
        
        setEstatisticas(dados);
        setError(null);
      } catch (err) {
        setError(err.message);
        Swal.fire({
          icon: 'error',
          title: 'Erro ao carregar dados',
          text: 'Não foi possível carregar as estatísticas do dashboard.',
          confirmButtonText: 'OK',
          confirmButtonColor: '#ef4444'
        });
      } finally {
        setLoading(false);
      }
    };

    carregarEstatisticas();
  }, [filtros]);

  const formatarTempo = (minutos) => {
    if (!minutos || minutos === 0) return '0min';
    
    const horas = Math.floor(minutos / 60);
    const mins = Math.round(minutos % 60);
    
    if (horas === 0) return `${mins}min`;
    if (mins === 0) return `${horas}h`;
    return `${horas}h ${mins}min`;
  };

  const dadosProcessados = estatisticas ? {
    isMensal: filtros.tipoVisualizacao === 'mensal',
    totalOcorrencias: estatisticas.totalOcorrencias || 0,
    tempoMedioDeslocamento: filtros.tipoVisualizacao === 'mensal' 
      ? formatarTempo(estatisticas.tempoMedioDeslocamentoChegada)
      : (estatisticas.tempoMedioDeslocamento?.formatted || '0h 0min'),
      
    tempoMedioAtendimento: filtros.tipoVisualizacao === 'mensal'
      ? formatarTempo(estatisticas.tempoMedioDespachoChegada)
      : (estatisticas.tempoMedioAtendimento?.formatted || '0h 0min'),
      
    tempoMedioDespachoLiberacao: filtros.tipoVisualizacao === 'mensal'
      ? formatarTempo(estatisticas.tempoMedioDespachoLiberacao)
      : (estatisticas.tempoMedioDespachoLiberacao?.formatted || '0h 0min'),
      
    totalEmpenhosAnalisados: estatisticas.totalEmpenhosAnalisados || 0,

    tiposSinistro: estatisticas.tiposSinistro?.map(item => ({
      natureza: item.natureza?.replace(/\s+/g, ' ').trim() || 'Não informado',
      quantidade: item.quantidade,
      percentual: item.percentual
    })) || [],

    dadosDeslocamento: [
      { 
        categoria: 'Tempo Médio de Deslocamento', 
        tempo: filtros.tipoVisualizacao === 'mensal' 
          ? Math.round(estatisticas.tempoMedioDeslocamentoChegada || 0)
          : (estatisticas.tempoMedioDeslocamento?.horas || 0) * 60 + (estatisticas.tempoMedioDeslocamento?.minutos || 0),
        formatted: filtros.tipoVisualizacao === 'mensal'
          ? formatarTempo(estatisticas.tempoMedioDeslocamentoChegada)
          : (estatisticas.tempoMedioDeslocamento?.formatted || '0h 0min')
      }
    ],
    
    dadosAtendimento: [
      { 
        categoria: 'Tempo Médio de Atendimento', 
        tempo: filtros.tipoVisualizacao === 'mensal'
          ? Math.round(estatisticas.tempoMedioDespachoChegada || 0)
          : (estatisticas.tempoMedioAtendimento?.horas || 0) * 60 + (estatisticas.tempoMedioAtendimento?.minutos || 0),
        formatted: filtros.tipoVisualizacao === 'mensal'
          ? formatarTempo(estatisticas.tempoMedioDespachoChegada)
          : (estatisticas.tempoMedioAtendimento?.formatted || '0h 0min')
      }
    ]
  } : null;

  return (
    <>
      <style>{`
        .dashboard {
          padding: 2rem;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          min-height: 100vh;
          font-family: 'Inter', system-ui, sans-serif;
        }

        .dashboard-header {
          margin-bottom: 2rem;
        }

        .dashboard-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, #1e40af, #3b82f6);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .dashboard-subtitle {
          font-size: 1.1rem;
          color: #64748b;
          font-weight: 500;
        }

        .filters-section {
          background: white;
          padding: 1.5rem;
          border-radius: 16px;
          margin-bottom: 2rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(226, 232, 240, 0.8);
        }

        .filters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .filter-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
        }

        .filter-select {
          padding: 0.75rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 0.875rem;
          transition: all 0.2s ease;
          background: white;
        }

        .filter-select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .card {
          background: white;
          padding: 1.5rem;
          border-radius: 16px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(226, 232, 240, 0.8);
          transition: all 0.3s ease;
        }

        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1);
        }

        .card-full {
          grid-column: 1 / -1;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          align-items: center;
        }

        .card h2 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .card h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .summary-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1.5rem;
        }

        .stat-item {
          text-align: center;
          padding: 1rem;
          background: linear-gradient(135deg, #f8fafc, #e2e8f0);
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }

        .stat-number {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1e40af;
          margin-bottom: 0.25rem;
          line-height: 1;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #64748b;
          font-weight: 500;
        }

        .highlight {
          color: #1e40af;
          font-weight: 700;
          font-size: 1.5rem;
        }

        .chart-container {
          height: 300px;
          margin-top: 1rem;
        }

        .chart-container-pie {
          height: 400px;
          margin-top: 1rem;
        }

        .recent-list {
          max-height: 300px;
          overflow-y: auto;
        }

        .recent-item {
          padding: 1rem;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
        }

        .recent-item:last-child {
          border-bottom: none;
        }

        .recent-info {
          flex: 1;
        }

        .recent-numero {
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.25rem;
        }

        .recent-natureza {
          font-size: 0.875rem;
          color: #3b82f6;
          margin-bottom: 0.25rem;
        }

        .recent-local {
          font-size: 0.75rem;
          color: #64748b;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          color: white;
        }

        .status-em-andamento {
          background: #f59e0b;
        }

        .status-concluido {
          background: #10b981;
        }

        .prioridade-alta {
          background: #dc2626;
        }

        .prioridade-media {
          background: #f59e0b;
        }

        .prioridade-baixa {
          background: #10b981;
        }

        @media (max-width: 768px) {
          .dashboard {
            padding: 1rem;
          }

          .dashboard-grid {
            grid-template-columns: 1fr;
          }

          .card-full {
            grid-template-columns: 1fr;
          }

          .summary-stats {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>

      <div className="dashboard">
        {/* Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">Dashboard de Ocorrências</h1>
          <p className="dashboard-subtitle">
            {filtros.tipoVisualizacao === 'mensal' 
              ? `Análise mensal - ${['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'][filtros.mes - 1]} de ${filtros.ano}`
              : 'Análise dos dados extraídos dos PDFs processados'
            }
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '200px',
            fontSize: '1.2rem',
            color: '#64748b'
          }}>
            Carregando estatísticas...
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div style={{ 
            textAlign: 'center', 
            padding: '2rem',
            color: '#dc2626',
            fontSize: '1.1rem'
          }}>
            Erro ao carregar dados: {error}
          </div>
        )}

        {!loading && !error && dadosProcessados && (
          <>
            <div className="filters-section">
              <div className="filters-grid">
                <div className="filter-group">
                  <label className="filter-label">Tipo de Visualização</label>
                  <select 
                    className="filter-select"
                    value={filtros.tipoVisualizacao}
                    onChange={(e) => setFiltros(prev => ({...prev, tipoVisualizacao: e.target.value}))}
                  >
                    <option value="geral">Dados Gerais</option>
                    <option value="mensal">Por Mês</option>
                  </select>
                </div>
                
                {filtros.tipoVisualizacao === 'mensal' && (
                  <>
                    <div className="filter-group">
                      <label className="filter-label">Ano</label>
                      <select 
                        className="filter-select"
                        value={filtros.ano}
                        onChange={(e) => setFiltros(prev => ({...prev, ano: parseInt(e.target.value)}))}
                      >
                        {[2024, 2025, 2026].map(ano => (
                          <option key={ano} value={ano}>{ano}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="filter-group">
                      <label className="filter-label">Mês</label>
                      <select 
                        className="filter-select"
                        value={filtros.mes}
                        onChange={(e) => setFiltros(prev => ({...prev, mes: parseInt(e.target.value)}))}
                      >
                        {[
                          {valor: 1, nome: 'Janeiro'}, {valor: 2, nome: 'Fevereiro'}, {valor: 3, nome: 'Março'},
                          {valor: 4, nome: 'Abril'}, {valor: 5, nome: 'Maio'}, {valor: 6, nome: 'Junho'},
                          {valor: 7, nome: 'Julho'}, {valor: 8, nome: 'Agosto'}, {valor: 9, nome: 'Setembro'},
                          {valor: 10, nome: 'Outubro'}, {valor: 11, nome: 'Novembro'}, {valor: 12, nome: 'Dezembro'}
                        ].map(mes => (
                          <option key={mes.valor} value={mes.valor}>{mes.nome}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="card-full summary-stats">
              <div className="stat-item">
                <div className="stat-number">{dadosProcessados.totalOcorrencias}</div>
                <div className="stat-label">Total de Ocorrências</div>
              </div>
              
              <div className="stat-item">
                <div className="stat-number">{dadosProcessados.tempoMedioDeslocamento}</div>
                <div className="stat-label">Tempo Médio Deslocamento</div>
              </div>
              
              <div className="stat-item">
                <div className="stat-number">{dadosProcessados.tempoMedioAtendimento}</div>
                <div className="stat-label">Tempo Médio Atendimento</div>
              </div>

              <div className="stat-item">
                <div className="stat-number">{dadosProcessados.tempoMedioDespachoLiberacao}</div>
                <div className="stat-label">Tempo Despacho à Liberação</div>
              </div>
            </div>

            <div className="dashboard-grid">
              {dadosProcessados.tiposSinistro && dadosProcessados.tiposSinistro.length > 0 && (
                <div className="card">
                  <h2>
                    📋 Tipo de Sinistro
                    {filtros.tipoVisualizacao === 'mensal' && (
                      <span style={{ fontSize: '0.8em', color: '#6b7280', fontWeight: 'normal' }}>
                        {' '}({['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'][filtros.mes - 1]} {filtros.ano})
                      </span>
                    )}
                  </h2>
                  <div className="chart-container-pie">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={dadosProcessados.tiposSinistro}
                          dataKey="quantidade"
                          nameKey="natureza"
                          cx="50%"
                          cy="40%"
                          outerRadius={80}
                          label={({ percentual }) => `${percentual}%`}
                        >
                          {dadosProcessados.tiposSinistro.map((entry, index) => (
                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value, name) => [value, name]} />
                        <Legend 
                          verticalAlign="bottom" 
                          height={80}
                          wrapperStyle={{
                            paddingTop: '0px',
                            fontSize: '12px',
                            lineHeight: '0.5',
                            marginTop: '-20px'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              <div className="card">
                <h2>🚗 Tempo Médio de Deslocamento</h2>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dadosProcessados.dadosDeslocamento}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="categoria" 
                        tick={{ fontSize: 10 }}
                        interval={0}
                        textAnchor="middle"
                        height={60}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }} 
                        label={{ value: 'Minutos', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip 
                        formatter={(value, name, props) => [
                          props.payload.formatted, 
                          'Tempo'
                        ]} 
                      />
                      <Bar dataKey="tempo" fill="#1e40af" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="card">
                <h2>⏰ Tempo Médio de Atendimento</h2>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dadosProcessados.dadosAtendimento}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="categoria" 
                        tick={{ fontSize: 10 }}
                        interval={0}
                        textAnchor="middle"
                        height={60}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }} 
                        label={{ value: 'Minutos', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip 
                        formatter={(value, name, props) => [
                          props.payload.formatted, 
                          'Tempo'
                        ]} 
                      />
                      <Bar dataKey="tempo" fill="#16a34a" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
              {dadosProcessados.tiposSinistro && dadosProcessados.tiposSinistro.length > 0 && (
                <div className="card">
                  <h2>
                    📊 Detalhamento por Natureza
                    {filtros.tipoVisualizacao === 'mensal' && (
                      <span style={{ fontSize: '0.8em', color: '#6b7280', fontWeight: 'normal' }}>
                        {' '}({['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'][filtros.mes - 1]} {filtros.ano})
                      </span>
                    )}
                  </h2>
                  <div style={{ 
                    padding: '1rem 0',
                    maxHeight: '400px',
                    overflowY: 'auto',
                    paddingRight: '0.5rem'
                  }}>
                    {dadosProcessados.tiposSinistro.map((item, index) => (
                      <div key={index} style={{ 
                        padding: '0.75rem', 
                        marginBottom: '0.5rem',
                        backgroundColor: '#f8fafc',
                        borderRadius: '8px',
                        borderLeft: `4px solid ${COLORS[index % COLORS.length]}`
                      }}>
                        <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                          {item.natureza}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                          Quantidade: {item.quantidade} ocorrências • Representa: {item.percentual}% do total
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </>
        )}

      </div>
    </>
  );
}

export default Dashboard;
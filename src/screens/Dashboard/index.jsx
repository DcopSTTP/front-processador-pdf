import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  AreaChart,
  Area
} from "recharts";
import { buscarEstatisticas } from '../../service/UserService';
import Swal from 'sweetalert2';
// Removido mock data - agora usa dados reais da API
const mockDataOcorrencias = [
  {
    id: 1,
    numero: "2024-001234",
    natureza: "Furto",
    dataHora: "2024-01-15T14:30:00",
    localizacao: {
      logradouro: "Rua das Flores, 123",
      bairro: "Centro",
      cidade: "São Paulo",
      cep: "01234-567"
    },
    narrativa: "Vítima relata que teve sua carteira furtada enquanto caminhava pela rua.",
    empenhos: [
      { viatura: "VTR-001", horario: "14:45" },
      { viatura: "VTR-015", horario: "15:00" }
    ],
    relatos: [
      { tipo: "Vítima", nome: "João Silva", cpf: "123.456.789-10" },
      { tipo: "Testemunha", nome: "Maria Santos", cpf: "987.654.321-00" }
    ],
    status: "Em andamento",
    prioridade: "Média"
  },
  {
    id: 2,
    numero: "2024-001235",
    natureza: "Roubo",
    dataHora: "2024-01-14T20:15:00",
    localizacao: {
      logradouro: "Av. Paulista, 1000",
      bairro: "Bela Vista",
      cidade: "São Paulo",
      cep: "01310-100"
    },
    narrativa: "Vítima foi abordada por dois indivíduos que anunciaram o assalto.",
    empenhos: [
      { viatura: "VTR-003", horario: "20:30" },
      { viatura: "VTR-007", horario: "20:35" },
      { viatura: "VTR-012", horario: "21:00" }
    ],
    relatos: [
      { tipo: "Vítima", nome: "Ana Costa", cpf: "456.789.123-45" },
      { tipo: "Testemunha", nome: "Carlos Lima", cpf: "789.123.456-78" }
    ],
    status: "Concluído",
    prioridade: "Alta"
  },
  {
    id: 3,
    numero: "2024-001236",
    natureza: "Acidente de Trânsito",
    dataHora: "2024-01-13T08:45:00",
    localizacao: {
      logradouro: "Rua Augusta, 500",
      bairro: "Consolação",
      cidade: "São Paulo",
      cep: "01305-000"
    },
    narrativa: "Colisão entre dois veículos no cruzamento.",
    empenhos: [
      { viatura: "VTR-005", horario: "09:00" },
      { viatura: "AMB-001", horario: "09:10" }
    ],
    relatos: [
      { tipo: "Condutor 1", nome: "Pedro Oliveira", cpf: "321.654.987-12" },
      { tipo: "Condutor 2", nome: "Lucia Fernandes", cpf: "654.321.789-34" }
    ],
    status: "Concluído",
    prioridade: "Baixa"
  },
  {
    id: 4,
    numero: "2024-001237",
    natureza: "Violência Doméstica",
    dataHora: "2024-01-12T22:30:00",
    localizacao: {
      logradouro: "Rua do Socorro, 45",
      bairro: "Vila Madalena",
      cidade: "São Paulo",
      cep: "05435-010"
    },
    narrativa: "Vítima relata agressões físicas e verbais por parte do companheiro.",
    empenhos: [
      { viatura: "VTR-009", horario: "22:45" },
      { viatura: "VTR-011", horario: "23:00" }
    ],
    relatos: [
      { tipo: "Vítima", nome: "Rosa Silva", cpf: "159.753.486-20" }
    ],
    status: "Em andamento",
    prioridade: "Alta"
  },
  {
    id: 5,
    numero: "2024-001238",
    natureza: "Perturbação do Sossego",
    dataHora: "2024-01-11T01:15:00",
    localizacao: {
      logradouro: "Rua da Música, 78",
      bairro: "Pinheiros",
      cidade: "São Paulo",
      cep: "05422-030"
    },
    narrativa: "Denúncia de música alta em estabelecimento comercial.",
    empenhos: [
      { viatura: "VTR-013", horario: "01:30" }
    ],
    relatos: [
      { tipo: "Denunciante", nome: "Roberto Cruz", cpf: "753.159.864-97" }
    ],
    status: "Concluído",
    prioridade: "Baixa"
  },
  {
    id: 6,
    numero: "2024-001239",
    natureza: "Furto",
    dataHora: "2024-01-10T16:20:00",
    localizacao: {
      logradouro: "Shopping Center Norte",
      bairro: "Vila Guilherme",
      cidade: "São Paulo",
      cep: "02050-000"
    },
    narrativa: "Furto de veículo no estacionamento do shopping center.",
    empenhos: [
      { viatura: "VTR-002", horario: "16:35" }
    ],
    relatos: [
      { tipo: "Vítima", nome: "Carlos Santos", cpf: "147.258.369-85" }
    ],
    status: "Em andamento",
    prioridade: "Média"
  },
  {
    id: 7,
    numero: "2024-001240",
    natureza: "Roubo",
    dataHora: "2024-01-09T19:45:00",
    localizacao: {
      logradouro: "Estação da Luz",
      bairro: "Luz",
      cidade: "São Paulo",
      cep: "01103-000"
    },
    narrativa: "Roubo de celular próximo à estação de trem.",
    empenhos: [
      { viatura: "VTR-008", horario: "20:00" }
    ],
    relatos: [
      { tipo: "Vítima", nome: "Fernanda Lima", cpf: "258.369.147-96" }
    ],
    status: "Concluído",
    prioridade: "Alta"
  }
];

// Cores para os gráficos
const COLORS = ["#1e40af", "#dc2626", "#16a34a", "#f59e0b", "#7c3aed", "#0891b2"];

function Dashboard() {
  const [estatisticas, setEstatisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carregar estatísticas da API
  useEffect(() => {
    const carregarEstatisticas = async () => {
      try {
        setLoading(true);
        const dados = await buscarEstatisticas();
        setEstatisticas(dados);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar estatísticas:', err);
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
  }, []);

  // Processar dados para os gráficos baseado na API
  const dadosProcessados = estatisticas ? {
    // Estatísticas principais
    totalOcorrencias: estatisticas.totalOcorrencias || 0,
    tempoMedioDeslocamento: estatisticas.tempoMedioDeslocamento || 0,
    tempoMedioAtendimento: estatisticas.tempoMedioAtendimento || 0,
    totalEmpenhosAnalisados: estatisticas.totalEmpenhosAnalisados || 0,

    // Tipos de sinistro/natureza - limpar espaços excessivos
    tiposSinistro: estatisticas.tiposSinistro?.map(item => ({
      natureza: item.natureza?.replace(/\s+/g, ' ').trim() || 'Não informado',
      quantidade: item.quantidade,
      percentual: item.percentual
    })) || [],

    // Dados separados para gráficos de tempo
    dadosDeslocamento: [
      { categoria: 'Tempo Médio de Deslocamento', tempo: estatisticas.tempoMedioDeslocamento || 0 }
    ],
    
    dadosAtendimento: [
      { categoria: 'Tempo Médio de Atendimento', tempo: estatisticas.tempoMedioAtendimento || 0 }
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
            Análise dos dados extraídos dos PDFs processados
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

        {/* Dashboard Content */}
        {!loading && !error && dadosProcessados && (
          <>
            {/* Cards de Estatísticas Principais */}
            <div className="card-full summary-stats">
              <div className="stat-item">
                <div className="stat-number">{dadosProcessados.totalOcorrencias}</div>
                <div className="stat-label">Total de Ocorrências</div>
              </div>
              
              <div className="stat-item">
                <div className="stat-number">{dadosProcessados.tempoMedioDeslocamento}</div>
                <div className="stat-label">Tempo Médio Deslocamento (min)</div>
              </div>
              
              <div className="stat-item">
                <div className="stat-number">{dadosProcessados.tempoMedioAtendimento}</div>
                <div className="stat-label">Tempo Médio Atendimento (min)</div>
              </div>
              
              <div className="stat-item">
                <div className="stat-number">{dadosProcessados.totalEmpenhosAnalisados}</div>
                <div className="stat-label">Total de Empenhos</div>
              </div>
            </div>

            {/* Gráficos */}
            <div className="dashboard-grid">
              {/* Tipos de Sinistro/Natureza */}
              <div className="card">
                <h2>📋 Distribuição por Tipo de Natureza</h2>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dadosProcessados.tiposSinistro}
                        dataKey="quantidade"
                        nameKey="natureza"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ percentual }) => `${percentual}%`}
                      >
                        {dadosProcessados.tiposSinistro.map((entry, index) => (
                          <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [value, name]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Tempo Médio de Deslocamento */}
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
                      <Tooltip formatter={(value) => [`${value} minutos`, 'Tempo']} />
                      <Bar dataKey="tempo" fill="#1e40af" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Tempo Médio de Atendimento */}
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
                      <Tooltip formatter={(value) => [`${value} minutos`, 'Tempo']} />
                      <Bar dataKey="tempo" fill="#16a34a" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Resumo Detalhado por Natureza */}
              <div className="card">
                <h2>📊 Detalhamento por Natureza</h2>
                <div style={{ padding: '1rem 0' }}>
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
            </div>
          </>
        )}

      </div>
    </>
  );
}

export default Dashboard;
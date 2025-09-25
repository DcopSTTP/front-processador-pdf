import React, { useState, useEffect } from 'react';
import { FileTextIcon, ArrowLeftIcon, MapPinIcon, ClockIcon, AlertCircleIcon } from 'lucide-react';
import { detalhesStyles } from './styles';
import { buscarOcorrenciaPorId } from '../../service/UserService';
import Swal from 'sweetalert2';

function DetalhesOcorrencia({ ocorrenciaId, onBack }) {
  const [loading, setLoading] = useState(true);
  const [ocorrencia, setOcorrencia] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (ocorrenciaId) {
      carregarOcorrencia();
    }
  }, [ocorrenciaId]);

  const carregarOcorrencia = async () => {
    setLoading(true);
    setError('');
    try {
      const dadosOcorrencia = await buscarOcorrenciaPorId(ocorrenciaId);
      setOcorrencia(dadosOcorrencia);
    } catch (err) {
      setError(err.message);
      Swal.fire({
        icon: 'error',
        title: 'Erro ao carregar detalhes',
        text: err.message || 'Não foi possível carregar os detalhes da ocorrência.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#dc2626'
      });
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (dataString) => {
    return new Date(dataString).toLocaleString('pt-BR');
  };

  const formatarCoordernadas = (lat, long) => {
    if (!lat || !long) return 'Não informado';
    return `${lat}, ${long}`;
  };

  if (loading) {
    return (
      <div style={detalhesStyles.container}>
        <div style={detalhesStyles.loadingContainer}>
          <div style={detalhesStyles.spinner}></div>
          <p>Carregando detalhes da ocorrência...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={detalhesStyles.container}>
        <div style={detalhesStyles.errorContainer}>
          <AlertCircleIcon style={{ width: '48px', height: '48px', color: '#dc2626' }} />
          <h2>Erro ao carregar detalhes</h2>
          <p>{error}</p>
          {onBack && (
            <button onClick={onBack} style={detalhesStyles.backButton}>
              <ArrowLeftIcon style={{ width: '16px', height: '16px' }} />
              Voltar
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!ocorrencia) {
    return (
      <div style={detalhesStyles.container}>
        <div style={detalhesStyles.errorContainer}>
          <FileTextIcon style={{ width: '48px', height: '48px', color: '#6b7280' }} />
          <h2>Ocorrência não encontrada</h2>
          <p>Não foi possível encontrar os detalhes desta ocorrência.</p>
          {onBack && (
            <button onClick={onBack} style={detalhesStyles.backButton}>
              <ArrowLeftIcon style={{ width: '16px', height: '16px' }} />
              Voltar
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={detalhesStyles.container}>
      <div style={detalhesStyles.mainContainer}>
        
        <div style={detalhesStyles.header}>
          <h1 style={detalhesStyles.title}>Detalhes da Ocorrência</h1>
          <p style={detalhesStyles.subtitle}>Informações completas do registro</p>
        </div>

        <div style={detalhesStyles.dataPreview}>
          <div style={detalhesStyles.highlightField}>
            <div style={detalhesStyles.highlightLabel}>
              Número da Ocorrência:
            </div>
            <div style={detalhesStyles.highlightValue}>
              {ocorrencia.numeroOcorrencia}
            </div>
          </div>

          <div style={detalhesStyles.sectionTitle}>Informações</div>
          
          <div style={detalhesStyles.dataField}>
            <div style={detalhesStyles.dataRow}>
              <strong>Natureza:</strong> {ocorrencia.natureza}
            </div>
          </div>

          <div style={detalhesStyles.dataField}>
            <div style={detalhesStyles.dataRow}>
              <strong>Data do Despacho:</strong> {ocorrencia.empenhos?.[0]?.despachado || 'Não informada'}
            </div>
          </div>

          {ocorrencia.createdAt && (
            <div style={detalhesStyles.dataField}>
              <div style={detalhesStyles.dataRow}>
                <strong>Data de Registro no Sistema:</strong> {formatarData(ocorrencia.createdAt)}
              </div>
            </div>
          )}

          <div style={detalhesStyles.dataField}>
            <div style={detalhesStyles.dataLabel}>Narrativas:</div>
            <div style={detalhesStyles.dataValue}>
              {ocorrencia.narrativas || 'Não informado'}
            </div>
          </div>

          {ocorrencia.relatos && (
            <div style={detalhesStyles.dataField}>
              <div style={detalhesStyles.dataLabel}>Relatos:</div>
              <div style={detalhesStyles.dataValue}>
                {ocorrencia.relatos}
              </div>
            </div>
          )}

          <div style={detalhesStyles.sectionTitle}>
            <MapPinIcon style={{ width: '18px', height: '18px', marginRight: '8px' }} />
            Dados da Localização
          </div>
          
          <div style={detalhesStyles.dataField}>
            <div style={detalhesStyles.dataGrid}>
              <div><strong>Logradouro:</strong> {ocorrencia.localizacao?.logradouro || 'Não informado'}</div>
              <div><strong>Bairro:</strong> {ocorrencia.localizacao?.bairro || 'Não informado'}</div>
              <div><strong>Ponto de Referência:</strong> {ocorrencia.localizacao?.pontoReferencia || 'Não informado'}</div>
              <div><strong>Coordenadas:</strong> {formatarCoordernadas(ocorrencia.localizacao?.lat, ocorrencia.localizacao?.long)}</div>
            </div>
          </div>

          <div style={detalhesStyles.sectionTitle}>
            <ClockIcon style={{ width: '18px', height: '18px', marginRight: '8px' }} />
            Empenhos ({ocorrencia.empenhos?.length || 0})
          </div>
          
          {ocorrencia.empenhos && ocorrencia.empenhos.length > 0 ? (
            ocorrencia.empenhos.map((empenho, index) => (
              <div key={empenho.id || index} style={detalhesStyles.empenhoCard}>
                <div style={detalhesStyles.empenhoHeader}>
                  <strong>Empenho {index + 1}</strong>
                </div>
                <div style={detalhesStyles.dataGrid}>
                  <div><strong>VTR:</strong> {empenho.vtr || 'Não informado'}</div>
                  <div><strong>Equipamentos:</strong> {empenho.equipamentos || 'Não informado'}</div>
                  <div><strong>Despachado:</strong> {empenho.despachado || 'Não informado'}</div>
                  <div><strong>Em Deslocamento:</strong> {empenho.deslocamento || 'Não informado'}</div>
                  <div><strong>Chegada no Local:</strong> {empenho.chegadaLocal || 'Não informado'}</div>
                  <div><strong>Liberado:</strong> {empenho.liberado || 'Não informado'}</div>
                </div>
              </div>
            ))
          ) : (
            <div style={detalhesStyles.emptyState}>
              <p>Nenhum empenho registrado para esta ocorrência.</p>
            </div>
          )}

          {onBack && (
            <div style={detalhesStyles.actionButtons}>
              <button onClick={onBack} style={detalhesStyles.backButton}>
                <ArrowLeftIcon style={{ width: '16px', height: '16px' }} />
                Voltar à Lista
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default DetalhesOcorrencia;
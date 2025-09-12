import React from 'react';
import { DownloadIcon } from 'lucide-react';
import {
  dataPreviewStyle,
  previewHeaderStyle,
  dataFieldStyle,
  dataLabelStyle,
  dataValueStyle,
  actionButtonsStyle,
  successButtonStyle
} from '../styles/appStyles';

export const DataPreview = ({ extractedData, downloadReport }) => {
  return (
    <div style={dataPreviewStyle}>
      <h2 style={previewHeaderStyle}>Dados Extraídos do PDF</h2>

      {/* Número da Ocorrência em destaque */}
      <div style={{
        ...dataFieldStyle,
        backgroundColor: '#dbeafe',
        border: '2px solid #3b82f6',
        marginBottom: '20px'
      }}>
        <div style={{ ...dataLabelStyle, fontSize: '16px', color: '#1d4ed8' }}>
          Número da Ocorrência:
        </div>
        <div style={{ ...dataValueStyle, fontSize: '16px', fontWeight: 'bold', color: '#1e40af' }}>
          {extractedData.numeroOcorrencia}
        </div>
      </div>

      <div style={dataFieldStyle}>
        <div style={dataLabelStyle}>Dados Gerais:</div>
        <div
          style={dataValueStyle}
          dangerouslySetInnerHTML={{ __html: extractedData.dadosGerais }}
        />
      </div>

      <div style={dataFieldStyle}>
        <div style={dataLabelStyle}>Narrativas:</div>
        <div
          style={dataValueStyle}
          dangerouslySetInnerHTML={{ __html: extractedData.narrativas }}
        />
      </div>

      <div style={dataFieldStyle}>
        <div style={dataLabelStyle}>Dados de Localização:</div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ flex: 1 }}>
            <div
              style={dataValueStyle}
              dangerouslySetInnerHTML={{ __html: extractedData.dadosLocalizacao?.parte1 }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={dataValueStyle}
              dangerouslySetInnerHTML={{ __html: extractedData.dadosLocalizacao?.parte2 }}
            />
          </div>
        </div>
      </div>

      <div style={dataFieldStyle}>
        <div style={dataLabelStyle}>Empenhos:</div>
        <div
          style={dataValueStyle}
          dangerouslySetInnerHTML={{ __html: extractedData.empenhos }}
        >
        </div>
      </div>

      <div style={dataFieldStyle}>
        <div style={dataLabelStyle}>Relatos:</div>
        <div
          style={dataValueStyle}
          dangerouslySetInnerHTML={{ __html: extractedData.relatos }}
        />
      </div>

      <div style={{ ...actionButtonsStyle, marginTop: '20px', justifyContent: 'center' }}>
        <button
          onClick={downloadReport}
          style={successButtonStyle}
        >
          <DownloadIcon style={{ width: '16px', height: '16px' }} />
          Baixar Relatório Reorganizado
        </button>
      </div>
    </div>
  );
};
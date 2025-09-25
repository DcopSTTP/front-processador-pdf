import React from 'react';
import { SaveIcon } from 'lucide-react';
import {
  dataPreviewStyle,
  previewHeaderStyle,
  dataFieldStyle,
  dataLabelStyle,
  dataValueStyle,
  actionButtonsStyle,
  successButtonStyle
} from '../styles/appStyles';

export const DataPreview = ({ extractedData, saveToBackend }) => {
  return (
    <div style={dataPreviewStyle}>
      <h2 style={previewHeaderStyle}>Dados Extraídos do PDF</h2>

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
        <div>
          <strong>Natureza Inicial:</strong>  {extractedData.naturezaInicial}
        </div>
      </div>

      <div style={dataFieldStyle}>
        <div>
          <strong>Narrativas:</strong>  {extractedData.narrativas}
        </div>
      </div>


      <div style={dataFieldStyle}>
        <div style={dataLabelStyle}>Dados da Localização:</div><br/>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '8px' }}>

          <div><strong>Logradouro:</strong> {extractedData.dadosLocalizacao1?.logradouro}</div>
          <div><strong>Ponto de Referência:</strong> {extractedData.dadosLocalizacao2?.pontoReferencia}</div>
        </div>
      </div>

      <div style={dataFieldStyle}>
        <div style={dataLabelStyle}>Empenhos:</div>
        <div>
          <br/>
          <div><strong>{extractedData.empenhos?.vtr}</strong></div>
          <div><strong>Equipamentos:</strong> {extractedData.empenhos?.equipamentos}</div>
          <div><strong>Despachado:</strong> {extractedData.empenhos?.despachado}</div>
          <div><strong>Em Deslocamento:</strong> {extractedData.empenhos?.deslocamento}</div>
          <div><strong>Chegada no Local:</strong> {extractedData.empenhos?.chegadaLocal}</div>
          <div><strong>Liberado:</strong> {extractedData.empenhos?.liberado}</div>
        </div>
      </div>

      <div style={dataFieldStyle}>
        <div style={dataLabelStyle}>Relatos:</div>
        <div style={dataValueStyle}>
          {extractedData.relatos}
        </div>
      </div>

      <div style={{ ...actionButtonsStyle, marginTop: '20px', justifyContent: 'center' }}>
        <button
          onClick={saveToBackend}
          style={successButtonStyle}
        >
          <SaveIcon style={{ width: '16px', height: '16px' }} />
          Salvar Dados no Sistema
        </button>
      </div>
    </div>
  );
};
import { AlertCircleIcon } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { DataPreview } from '../../componentes/DataPreview';
import { FilePreview } from '../../componentes/FilePreview';
import { ProcessIcon } from '../../componentes/ProcessIcon';
import { FileUpload } from '../../componentes/FileUpload';
import {
  containerStyle,
  errorStyle,
  headerIconStyle,
  headerStyle,
  instructionItemStyle,
  instructionsStyle,
  mainContainerStyle,
  subtitleStyle,
  titleStyle,
  uploadCardStyle
} from '../../styles/appStyles';
import { formatFileSize } from '../../utils/fileUtils';
import { createHandlers } from '../../utils/handlers';

function ProcessadorPDF() {
  // Estados
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Criar handlers
  const {
    handleDrag,
    handleDrop,
    handleFileSelect,
    processPDF,
    downloadReport,
    saveToBackend,
    removeFile,
    openFileDialog
  } = createHandlers(
    setError,
    setExtractedData,
    setUploading,
    setUploadedFile,
    setProcessing,
    fileInputRef,
    setDragActive,
    uploadedFile,
    extractedData
  );

  return (
    <div style={containerStyle}>
      <div style={mainContainerStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <div style={headerIconStyle}>
            <ProcessIcon style={{ color: 'white' }} />
          </div>
          <h1 style={titleStyle}>Processador de PDF de Ocorrências</h1>
          <p style={subtitleStyle}>Extraia e reorganize informações de relatórios de ocorrência</p>
        </div>

        {/* Upload Area */}
        <div style={uploadCardStyle}>
          {!uploadedFile ? (
            <FileUpload
              dragActive={dragActive}
              uploading={uploading}
              handleDrag={handleDrag}
              handleDrop={handleDrop}
              openFileDialog={openFileDialog}
              fileInputRef={fileInputRef}
              handleFileSelect={handleFileSelect}
            />
          ) : (
            <FilePreview
              uploadedFile={uploadedFile}
              processing={processing}
              formatFileSize={formatFileSize}
              removeFile={removeFile}
              openFileDialog={openFileDialog}
              processPDF={processPDF}
            />
          )}

          {error && (
            <div style={errorStyle}>
              <AlertCircleIcon style={{ color: '#dc2626', flexShrink: 0 }} />
              <p style={{ fontSize: '14px', color: '#dc2626', margin: 0 }}>{error}</p>
            </div>
          )}
        </div>

        {/* Data Preview */}
        {extractedData && (
          <DataPreview 
            extractedData={extractedData} 
            saveToBackend={saveToBackend} 
          />
        )}

        {/* Instructions */}
        <div style={instructionsStyle}>
          <h3 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '12px' }}>Como usar:</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={instructionItemStyle}>
              <span style={{ color: '#2563eb', fontWeight: '500' }}>1.</span>
              <span>Faça upload do PDF da ocorrência</span>
            </li>
            <li style={instructionItemStyle}>
              <span style={{ color: '#2563eb', fontWeight: '500' }}>2.</span>
              <span>Clique em "Processar PDF" para extrair as informações</span>
            </li>
            <li style={instructionItemStyle}>
              <span style={{ color: '#2563eb', fontWeight: '500' }}>3.</span>
              <span>Visualize os dados extraídos e clique em "Salvar Dados no Sistema"</span>
            </li>
            <li style={instructionItemStyle}>
              <span style={{ color: '#2563eb', fontWeight: '500' }}>4.</span>
              <span>Os dados extraídos incluem: Natureza → Narrativas → Localização → Empenhos → Relatos</span>
            </li>
          </ul>
        </div>
      </div>
      
      {/* CSS Animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
        
        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </div>
  );
}

export default ProcessadorPDF;
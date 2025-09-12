import React from 'react';
import { UploadIcon, FileIcon } from 'lucide-react';
import { 
  uploadAreaStyle, 
  iconContainerStyle, 
  uploadTextStyle, 
  uploadSubtextStyle, 
  buttonStyle 
} from '../styles/appStyles';

export const FileUpload = ({ 
  dragActive, 
  uploading, 
  handleDrag, 
  handleDrop, 
  openFileDialog, 
  fileInputRef, 
  handleFileSelect 
}) => {
  const currentUploadAreaStyle = {
    ...uploadAreaStyle,
    border: `2px dashed ${dragActive ? '#3b82f6' : '#d1d5db'}`,
    backgroundColor: dragActive ? '#eff6ff' : 'transparent'
  };

  return (
    <div
      style={currentUploadAreaStyle}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
      
      {uploading ? (
        <div>
          <div style={{...iconContainerStyle, backgroundColor: '#dbeafe'}}>
            <UploadIcon style={{ color: '#2563eb' }} />
          </div>
          <div>
            <p style={uploadTextStyle}>Carregando arquivo...</p>
          </div>
        </div>
      ) : (
        <div>
          <div style={iconContainerStyle}>
            <FileIcon style={{ color: '#9ca3af' }} />
          </div>
          <div>
            <p style={uploadTextStyle}>Arraste seu PDF aqui</p>
            <p style={uploadSubtextStyle}>ou clique para selecionar do seu computador</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                openFileDialog();
              }}
              style={buttonStyle}
            >
              <UploadIcon style={{ width: '16px', height: '16px' }} />
              Selecionar Arquivo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
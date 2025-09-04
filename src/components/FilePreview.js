import React from 'react';
import { CheckCircleIcon, XIcon } from 'lucide-react';
import { ProcessIcon } from '../componentes/ProcessIcon';
import { 
  filePreviewStyle, 
  fileInfoStyle, 
  fileDetailsStyle, 
  fileNameStyle, 
  fileSizeStyle, 
  actionButtonsStyle, 
  secondaryButtonStyle, 
  buttonStyle 
} from '../styles/appStyles';

export const FilePreview = ({ 
  uploadedFile, 
  processing, 
  formatFileSize, 
  removeFile, 
  openFileDialog, 
  processPDF 
}) => {
  return (
    <div>
      <div style={filePreviewStyle}>
        <div style={fileInfoStyle}>
          <CheckCircleIcon style={{ color: '#16a34a' }} />
          <div style={fileDetailsStyle}>
            <p style={fileNameStyle}>{uploadedFile.name}</p>
            <p style={fileSizeStyle}>{formatFileSize(uploadedFile.size)} • PDF</p>
          </div>
        </div>
        <button
          onClick={removeFile}
          style={{ 
            color: '#16a34a', 
            backgroundColor: 'transparent', 
            border: 'none', 
            cursor: 'pointer', 
            padding: '4px' 
          }}
        >
          <XIcon />
        </button>
      </div>
      
      <div style={actionButtonsStyle}>
        <button
          onClick={openFileDialog}
          style={secondaryButtonStyle}
        >
          Trocar Arquivo
        </button>
        <button
          onClick={processPDF}
          style={buttonStyle}
          disabled={processing}
        >
          <ProcessIcon style={{ width: '16px', height: '16px' }} />
          {processing ? 'Processando...' : 'Processar PDF'}
        </button>
      </div>
    </div>
  );
};
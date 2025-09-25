import { CheckCircleIcon, XIcon } from 'lucide-react';
import React from 'react';
import {
  actionButtonsStyle,
  buttonStyle,
  fileDetailsStyle,
  fileInfoStyle,
  fileNameStyle,
  filePreviewStyle,
  fileSizeStyle,
} from '../styles/appStyles';
import { ProcessIcon } from './ProcessIcon';

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
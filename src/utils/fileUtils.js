// Funções utilitárias para manipulação de arquivos

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const validateFile = (file) => {
  const errors = [];
  
  if (file.type !== 'application/pdf') {
    errors.push('Por favor, selecione apenas arquivos PDF.');
  }
  
  if (file.size > 10 * 1024 * 1024) {
    errors.push('O arquivo deve ter no máximo 10MB.');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const downloadFile = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
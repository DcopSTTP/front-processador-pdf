// Handlers para o App component
import { validateFile } from './fileUtils';
import { extractDataFromPDF, generateNewPDF } from './pdfUtils';

export const createHandlers = (
  setError,
  setExtractedData,
  setUploading,
  setUploadedFile,
  setProcessing,
  fileInputRef,
  setDragActive,
  uploadedFile,
  extractedData
) => {
  // Event Handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  // File Operations
  const handleFile = async (file) => {
    setError('');
    setExtractedData(null);
    
    const validation = validateFile(file);
    if (!validation.isValid) {
      setError(validation.errors[0]);
      return;
    }

    setUploading(true);
    
    setTimeout(() => {
      setUploadedFile({
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        file: file
      });
      setUploading(false);
    }, 1000);
  };

  const processPDF = async () => {
    if (!uploadedFile?.file) return;
    
    setProcessing(true);
    setError('');
    
    try {
      const data = await extractDataFromPDF(uploadedFile.file);
      setExtractedData(data);
    } catch (err) {
      setError('Erro ao processar PDF: ' + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const downloadReport = async () => {
    if (!extractedData) return;
    
    try {
      await generateNewPDF(extractedData);
    } catch (err) {
      setError('Erro ao gerar relatório: ' + err.message);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setExtractedData(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  return {
    handleDrag,
    handleDrop,
    handleFileSelect,
    handleFile,
    processPDF,
    downloadReport,
    removeFile,
    openFileDialog
  };
};
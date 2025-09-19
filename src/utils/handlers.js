// Handlers para o App component
import { validateFile } from './fileUtils';
import { extractDataFromPDF, generateNewPDF, saveDataToBackend } from './pdfUtils';
import Swal from 'sweetalert2';

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

  const saveToBackend = async () => {
    if (!extractedData) return;
    
    try {
      // Mostrar loading
      Swal.fire({
        title: 'Salvando dados...',
        text: 'Por favor, aguarde enquanto os dados são enviados para o sistema.',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const result = await saveDataToBackend(extractedData);
      console.log('Dados salvos com sucesso:', result);
      
      // Extrair informações do resultado para exibir
      const ocorrencia = result.data || result;
      const numeroOcorrencia = ocorrencia.numeroOcorrencia || 'N/A';
      const dataHora = ocorrencia.createdAt ? new Date(ocorrencia.createdAt).toLocaleString('pt-BR') : 'N/A';
      
      // Mostrar sucesso com detalhes
      Swal.fire({
        icon: 'success',
        title: 'Ocorrência Salva!',
        html: `
          <div style="text-align: left; margin: 10px 0;">
            <p><strong>Número:</strong> ${numeroOcorrencia}</p>
            <p><strong>Salva em:</strong> ${dataHora}</p>
            <p><strong>Status:</strong> Processada e armazenada no sistema</p>
          </div>
        `,
        confirmButtonText: 'OK',
        confirmButtonColor: '#10b981',
        width: '500px'
      });
      
    } catch (err) {
      console.error('Erro ao salvar:', err);
      
      // Mostrar erro
      Swal.fire({
        icon: 'error',
        title: 'Erro ao salvar',
        text: err.message || 'Ocorreu um erro ao tentar salvar os dados no sistema.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ef4444'
      });
      
      setError('Erro ao salvar dados: ' + err.message);
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
    saveToBackend,
    removeFile,
    openFileDialog
  };
};
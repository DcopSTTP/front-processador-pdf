import React, { useState } from 'react';
import { SaveIcon, XIcon, AlertCircleIcon, EditIcon } from 'lucide-react';
import Swal from 'sweetalert2';
import {
  dataPreviewStyle,
  previewHeaderStyle,
  dataFieldStyle,
  dataLabelStyle,
  actionButtonsStyle,
  successButtonStyle,
  dangerButtonStyle,
  buttonStyle
} from '../styles/appStyles';

export const DataEditor = ({ extractedData, saveToBackend, onCancel }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    ...extractedData,
    dadosLocalizacao1: { ...extractedData.dadosLocalizacao1 },
    dadosLocalizacao2: { ...extractedData.dadosLocalizacao2 },
    empenhos: { ...extractedData.empenhos }
  });

  const [errors, setErrors] = useState({});

  const handleFieldChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleNestedFieldChange = (parent, field, value) => {
    setEditedData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
    const errorKey = `${parent}.${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  const validateData = () => {
    const newErrors = {};
    
    if (!editedData.naturezaInicial?.trim()) {
      newErrors.naturezaInicial = 'Natureza inicial é obrigatória';
    }
    
    if (!editedData.dadosLocalizacao1?.logradouro?.trim()) {
      newErrors['dadosLocalizacao1.logradouro'] = 'Logradouro é obrigatório';
    }

    if (!editedData.empenhos?.vtr?.trim()) {
      newErrors['empenhos.vtr'] = 'VTR é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    // Sempre perguntar antes de salvar
    const result = await Swal.fire({
      title: isEditing ? 'Confirmar Alterações' : 'Verificar Informações',
      text: isEditing 
        ? 'Tem certeza que deseja salvar as alterações realizadas?' 
        : 'Você verificou todas as informações e tem certeza que deseja salvar no sistema?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#16a34a',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sim, salvar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      if (isEditing && !validateData()) {
        return;
      }
      saveToBackend(editedData);
    }
  };

  const handleEnableEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    // Resetar dados para o original
    setEditedData({
      ...extractedData,
      dadosLocalizacao1: { ...extractedData.dadosLocalizacao1 },
      dadosLocalizacao2: { ...extractedData.dadosLocalizacao2 },
      empenhos: { ...extractedData.empenhos }
    });
    setErrors({});
    setIsEditing(false);
  };

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '14px',
    transition: 'border-color 0.2s',
    outline: 'none'
  };

  const inputFocusStyle = {
    borderColor: '#3b82f6',
    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
  };

  const errorInputStyle = {
    ...inputStyle,
    borderColor: '#dc2626'
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: '100px',
    resize: 'vertical'
  };

  const errorMessageStyle = {
    color: '#dc2626',
    fontSize: '12px',
    marginTop: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  };

  const sectionStyle = {
    marginBottom: '24px',
    padding: '16px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px'
  };

  const sectionTitleStyle = {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '12px',
    color: '#1f2937'
  };

  const fieldContainerStyle = {
    marginBottom: '16px'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '4px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151'
  };

  const readOnlyFieldStyle = {
    ...inputStyle,
    backgroundColor: '#f3f4f6',
    cursor: 'not-allowed'
  };

  return (
    <div style={dataPreviewStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
        <EditIcon style={{ width: '24px', height: '24px', color: '#2563eb' }} />
        <h2 style={{ ...previewHeaderStyle, margin: 0 }}>
          {isEditing ? 'Editando Dados Extraídos' : 'Dados Extraídos do PDF'}
        </h2>
      </div>

      {!isEditing && (
        <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#dbeafe', borderRadius: '6px', border: '1px solid #60a5fa' }}>
          <p style={{ fontSize: '14px', color: '#1e40af', margin: 0 }}>
            <strong>Modo visualização:</strong> Clique em "Habilitar Edição" para corrigir qualquer informação extraída incorretamente.
          </p>
        </div>
      )}

      {isEditing && (
        <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#fef3c7', borderRadius: '6px', border: '1px solid #fbbf24' }}>
          <p style={{ fontSize: '14px', color: '#92400e', margin: 0 }}>
            <strong>Modo edição:</strong> Você pode editar os campos abaixo. Clique em "Salvar" quando terminar.
          </p>
        </div>
      )}

      <div style={{
        ...dataFieldStyle,
        backgroundColor: '#dbeafe',
        border: '2px solid #3b82f6',
        marginBottom: '20px'
      }}>
        <div style={{ ...dataLabelStyle, fontSize: '16px', color: '#1d4ed8' }}>
          Número da Ocorrência (não editável):
        </div>
        <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e40af' }}>
          {editedData.numeroOcorrencia}
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={fieldContainerStyle}>
          <label style={labelStyle}>Natureza Inicial:</label>
          <input
            type="text"
            value={editedData.naturezaInicial || ''}
            onChange={(e) => handleFieldChange('naturezaInicial', e.target.value)}
            style={!isEditing ? readOnlyFieldStyle : (errors.naturezaInicial ? errorInputStyle : inputStyle)}
            onFocus={(e) => isEditing && (e.target.style.borderColor = '#3b82f6')}
            onBlur={(e) => isEditing && (e.target.style.borderColor = errors.naturezaInicial ? '#dc2626' : '#d1d5db')}
            readOnly={!isEditing}
          />
          {errors.naturezaInicial && (
            <div style={errorMessageStyle}>
              <AlertCircleIcon size={12} />
              {errors.naturezaInicial}
            </div>
          )}
        </div>

        <div style={fieldContainerStyle}>
          <label style={labelStyle}>Narrativas:</label>
          <textarea
            value={editedData.narrativas || ''}
            onChange={(e) => handleFieldChange('narrativas', e.target.value)}
            style={!isEditing ? { ...textareaStyle, ...readOnlyFieldStyle } : textareaStyle}
            onFocus={(e) => isEditing && (e.target.style.borderColor = '#3b82f6')}
            onBlur={(e) => isEditing && (e.target.style.borderColor = '#d1d5db')}
            readOnly={!isEditing}
          />
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Dados da Localização</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={fieldContainerStyle}>
            <label style={labelStyle}>Logradouro:</label>
            <input
              type="text"
              value={editedData.dadosLocalizacao1?.logradouro || ''}
              onChange={(e) => handleNestedFieldChange('dadosLocalizacao1', 'logradouro', e.target.value)}
              style={!isEditing ? readOnlyFieldStyle : (errors['dadosLocalizacao1.logradouro'] ? errorInputStyle : inputStyle)}
              onFocus={(e) => isEditing && (e.target.style.borderColor = '#3b82f6')}
              onBlur={(e) => isEditing && (e.target.style.borderColor = errors['dadosLocalizacao1.logradouro'] ? '#dc2626' : '#d1d5db')}
              readOnly={!isEditing}
            />
            {errors['dadosLocalizacao1.logradouro'] && (
              <div style={errorMessageStyle}>
                <AlertCircleIcon size={12} />
                {errors['dadosLocalizacao1.logradouro']}
              </div>
            )}
          </div>
          <div style={fieldContainerStyle}>
            <label style={labelStyle}>Ponto de Referência:</label>
            <input
              type="text"
              value={editedData.dadosLocalizacao2?.pontoReferencia || ''}
              onChange={(e) => handleNestedFieldChange('dadosLocalizacao2', 'pontoReferencia', e.target.value)}
              style={!isEditing ? readOnlyFieldStyle : inputStyle}
              onFocus={(e) => isEditing && (e.target.style.borderColor = '#3b82f6')}
              onBlur={(e) => isEditing && (e.target.style.borderColor = '#d1d5db')}
              readOnly={!isEditing}
            />
          </div>
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Empenhos</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={fieldContainerStyle}>
            <label style={labelStyle}>VTR:</label>
            <input
              type="text"
              value={editedData.empenhos?.vtr || ''}
              onChange={(e) => handleNestedFieldChange('empenhos', 'vtr', e.target.value)}
              style={!isEditing ? readOnlyFieldStyle : (errors['empenhos.vtr'] ? errorInputStyle : inputStyle)}
              onFocus={(e) => isEditing && (e.target.style.borderColor = '#3b82f6')}
              onBlur={(e) => isEditing && (e.target.style.borderColor = errors['empenhos.vtr'] ? '#dc2626' : '#d1d5db')}
              readOnly={!isEditing}
            />
            {errors['empenhos.vtr'] && (
              <div style={errorMessageStyle}>
                <AlertCircleIcon size={12} />
                {errors['empenhos.vtr']}
              </div>
            )}
          </div>
          <div style={fieldContainerStyle}>
            <label style={labelStyle}>Equipamentos:</label>
            <input
              type="text"
              value={editedData.empenhos?.equipamentos || ''}
              onChange={(e) => handleNestedFieldChange('empenhos', 'equipamentos', e.target.value)}
              style={!isEditing ? readOnlyFieldStyle : inputStyle}
              onFocus={(e) => isEditing && (e.target.style.borderColor = '#3b82f6')}
              onBlur={(e) => isEditing && (e.target.style.borderColor = '#d1d5db')}
              readOnly={!isEditing}
            />
          </div>
          <div style={fieldContainerStyle}>
            <label style={labelStyle}>Despachado:</label>
            <input
              type="text"
              value={editedData.empenhos?.despachado || ''}
              onChange={(e) => handleNestedFieldChange('empenhos', 'despachado', e.target.value)}
              style={!isEditing ? readOnlyFieldStyle : inputStyle}
              onFocus={(e) => isEditing && (e.target.style.borderColor = '#3b82f6')}
              onBlur={(e) => isEditing && (e.target.style.borderColor = '#d1d5db')}
              readOnly={!isEditing}
            />
          </div>
          <div style={fieldContainerStyle}>
            <label style={labelStyle}>Em Deslocamento:</label>
            <input
              type="text"
              value={editedData.empenhos?.deslocamento || ''}
              onChange={(e) => handleNestedFieldChange('empenhos', 'deslocamento', e.target.value)}
              style={!isEditing ? readOnlyFieldStyle : inputStyle}
              onFocus={(e) => isEditing && (e.target.style.borderColor = '#3b82f6')}
              onBlur={(e) => isEditing && (e.target.style.borderColor = '#d1d5db')}
              readOnly={!isEditing}
            />
          </div>
          <div style={fieldContainerStyle}>
            <label style={labelStyle}>Chegada no Local:</label>
            <input
              type="text"
              value={editedData.empenhos?.chegadaLocal || ''}
              onChange={(e) => handleNestedFieldChange('empenhos', 'chegadaLocal', e.target.value)}
              style={!isEditing ? readOnlyFieldStyle : inputStyle}
              onFocus={(e) => isEditing && (e.target.style.borderColor = '#3b82f6')}
              onBlur={(e) => isEditing && (e.target.style.borderColor = '#d1d5db')}
              readOnly={!isEditing}
            />
          </div>
          <div style={fieldContainerStyle}>
            <label style={labelStyle}>Liberado:</label>
            <input
              type="text"
              value={editedData.empenhos?.liberado || ''}
              onChange={(e) => handleNestedFieldChange('empenhos', 'liberado', e.target.value)}
              style={!isEditing ? readOnlyFieldStyle : inputStyle}
              onFocus={(e) => isEditing && (e.target.style.borderColor = '#3b82f6')}
              onBlur={(e) => isEditing && (e.target.style.borderColor = '#d1d5db')}
              readOnly={!isEditing}
            />
          </div>
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={fieldContainerStyle}>
          <label style={labelStyle}>Relatos:</label>
          <textarea
            value={editedData.relatos || ''}
            onChange={(e) => handleFieldChange('relatos', e.target.value)}
            style={!isEditing ? { ...textareaStyle, minHeight: '150px', ...readOnlyFieldStyle } : { ...textareaStyle, minHeight: '150px' }}
            onFocus={(e) => isEditing && (e.target.style.borderColor = '#3b82f6')}
            onBlur={(e) => isEditing && (e.target.style.borderColor = '#d1d5db')}
            readOnly={!isEditing}
          />
        </div>
      </div>

      <div style={{ ...actionButtonsStyle, marginTop: '24px', justifyContent: 'center', gap: '12px' }}>
        {!isEditing ? (
          <>
            <button
              onClick={handleSave}
              style={successButtonStyle}
            >
              <SaveIcon style={{ width: '16px', height: '16px' }} />
              Salvar Dados no Sistema
            </button>
            <button
              onClick={handleEnableEdit}
              style={{ ...buttonStyle, backgroundColor: '#f59e0b' }}
            >
              <EditIcon style={{ width: '16px', height: '16px' }} />
              Habilitar Edição
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleSave}
              style={successButtonStyle}
            >
              <SaveIcon style={{ width: '16px', height: '16px' }} />
              Salvar Alterações
            </button>
            <button
              onClick={handleCancelEdit}
              style={dangerButtonStyle}
            >
              <XIcon style={{ width: '16px', height: '16px' }} />
              Cancelar Edição
            </button>
          </>
        )}
      </div>
    </div>
  );
};
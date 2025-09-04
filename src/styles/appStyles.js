// Estilos organizados para o App

export const containerStyle = {
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)',
  padding: '16px',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
};

export const mainContainerStyle = {
  maxWidth: '800px',
  margin: '0 auto'
};

export const headerStyle = {
  textAlign: 'center',
  marginBottom: '32px',
  paddingTop: '32px'
};

export const headerIconStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '64px',
  height: '64px',
  backgroundColor: '#2563eb',
  borderRadius: '50%',
  marginBottom: '16px'
};

export const titleStyle = {
  fontSize: '32px',
  fontWeight: 'bold',
  color: '#1f2937',
  marginBottom: '8px',
  margin: '0 0 8px 0'
};

export const subtitleStyle = {
  color: '#6b7280',
  margin: 0
};

export const uploadCardStyle = {
  backgroundColor: 'white',
  borderRadius: '16px',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  padding: '32px',
  marginBottom: '24px'
};

export const uploadAreaStyle = {
  borderRadius: '12px',
  padding: '32px',
  textAlign: 'center',
  transition: 'all 0.2s ease',
  cursor: 'pointer'
};

export const iconContainerStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '64px',
  height: '64px',
  backgroundColor: '#f3f4f6',
  borderRadius: '50%',
  marginBottom: '16px'
};

export const uploadTextStyle = {
  fontSize: '18px',
  fontWeight: '500',
  color: '#374151',
  marginBottom: '8px'
};

export const uploadSubtextStyle = {
  fontSize: '14px',
  color: '#6b7280',
  marginBottom: '16px'
};

export const buttonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '12px 24px',
  backgroundColor: '#2563eb',
  color: 'white',
  borderRadius: '8px',
  border: 'none',
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
  fontSize: '16px',
  gap: '8px'
};

export const secondaryButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#f3f4f6',
  color: '#374151'
};

export const successButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#16a34a'
};

export const filePreviewStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px',
  backgroundColor: '#f0fdf4',
  border: '1px solid #bbf7d0',
  borderRadius: '8px',
  marginBottom: '16px'
};

export const fileInfoStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  flex: 1
};

export const fileDetailsStyle = {
  flex: 1,
  minWidth: 0
};

export const fileNameStyle = {
  fontSize: '14px',
  fontWeight: '500',
  color: '#166534',
  margin: '0 0 4px 0',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
};

export const fileSizeStyle = {
  fontSize: '14px',
  color: '#16a34a',
  margin: 0
};

export const actionButtonsStyle = {
  display: 'flex',
  gap: '12px',
  flexWrap: 'wrap'
};

export const errorStyle = {
  marginTop: '16px',
  padding: '16px',
  backgroundColor: '#fef2f2',
  border: '1px solid #fecaca',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px'
};

export const dataPreviewStyle = {
  backgroundColor: 'white',
  borderRadius: '16px',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  padding: '32px',
  marginBottom: '24px'
};

export const previewHeaderStyle = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#1f2937',
  marginBottom: '20px',
  textAlign: 'center'
};

export const dataFieldStyle = {
  marginBottom: '12px',
  padding: '8px',
  backgroundColor: '#f9fafb',
  borderRadius: '6px'
};

export const dataLabelStyle = {
  fontWeight: '600',
  color: '#374151',
  fontSize: '14px'
};

export const dataValueStyle = {
  color: '#6b7280',
  fontSize: '14px',
  marginTop: '4px'
};

export const instructionsStyle = {
  marginTop: '32px',
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(10px)',
  borderRadius: '12px',
  padding: '24px'
};

export const instructionItemStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '8px',
  marginBottom: '8px',
  fontSize: '14px',
  color: '#6b7280'
};
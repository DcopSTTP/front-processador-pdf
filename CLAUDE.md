# Ocorrências de Trânsito - React App

Este é um projeto React para upload e processamento de PDFs relacionados a ocorrências de trânsito.

## Estrutura do Projeto

Este é um projeto Create React App padrão com as seguintes características:

- **Framework**: React 19.1.1
- **UI Library**: Lucide React para ícones
- **Styling**: CSS-in-JS (inline styles) + Tailwind CSS 4.1.12
- **Testing**: Jest + React Testing Library

## Funcionalidades Principais

### Upload de PDF
- Interface de drag-and-drop para upload de arquivos PDF
- Validação de tipo de arquivo (apenas PDF)
- Validação de tamanho (máximo 10MB)
- Feedback visual durante upload
- Preview do arquivo carregado com opção de remover

### Componentes

#### App.js (`src/App.js`)
Componente principal que contém:
- **Estado**: `dragActive`, `uploadedFile`, `uploading`, `error`
- **Handlers**: `handleDrag`, `handleDrop`, `handleFileSelect`, `handleFile`, `removeFile`
- **UI**: Área de upload, preview de arquivo, mensagens de erro, instruções

#### Ícones SVG Inline
- `UploadIcon`: Ícone de upload
- `FileIcon`: Ícone de arquivo
- `XIcon`: Ícone de fechar/remover
- `CheckCircleIcon`: Ícone de sucesso
- `AlertCircleIcon`: Ícone de erro

## Scripts Disponíveis

```bash
npm start          # Inicia o servidor de desenvolvimento (localhost:3000)
npm test           # Executa os testes
npm run build      # Gera build de produção
npm run eject      # Ejeta as configurações do CRA (irreversível)
```

## Desenvolvimento

### Estrutura de Arquivos
```
src/
├── App.js          # Componente principal
├── App.css         # Estilos do componente principal
├── App.test.js     # Testes do componente principal
├── index.js        # Ponto de entrada da aplicação
├── index.css       # Estilos globais
└── ...outros arquivos padrão do CRA
```

### Dependências Principais
- `react` e `react-dom`: Framework React
- `lucide-react`: Biblioteca de ícones
- `tailwindcss`: Framework CSS (configurado como devDependency)

### Processo de Upload
1. Usuário arrasta PDF ou clica para selecionar
2. Validação de tipo e tamanho
3. Simulação de upload (1.5s delay)
4. Exibição de preview com opções de remover ou processar

## TODO / Melhorias Futuras

- Implementar processamento real de PDF (atualmente apenas simula)
- Adicionar backend para armazenamento
- Implementar extração de dados dos PDFs
- Adicionar mais validações
- Implementar sistema de notificações
- Adicionar testes mais abrangentes

## Tecnologias

- **Frontend**: React 19.1.1
- **Build Tool**: Create React App
- **CSS**: Tailwind CSS + CSS-in-JS
- **Icons**: Lucide React
- **Testing**: Jest, React Testing Library
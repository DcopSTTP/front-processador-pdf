# Comportamento da Tela de Relatório - CORRIGIDO ✅

## Como funciona agora:

### 1. 🎯 **Ao abrir a tela**
- ✅ Mostra apenas os filtros
- ✅ Tabela vazia com mensagem orientativa
- ✅ **NÃO** faz requisição automática

### 2. 🔍 **Ao aplicar filtros**
- ✅ Faz **POST** para `/ocorrencias/filtro`
- ✅ Envia filtros no **body** da requisição
- ✅ Funciona com filtros completos, parciais ou vazios

### 3. 📡 **Requisição**
- **Método**: POST (não GET)
- **Endpoint**: `/ocorrencias/filtro`
- **Content-Type**: `application/json`

### 4. 📝 **Exemplos de body enviado**:

**Filtros completos:**
```json
{
  "dataInicial": "10/09/2025",
  "dataFinal": "12/09/2025",
  "natureza": "Acidente de Trânsito",
  "logradouro": "Av. Principal",
  "bairro": "Centro"
}
```

**Filtros parciais:**
```json
{
  "natureza": "Acidente de Trânsito",
  "bairro": "Centro"
}
```

**Sem filtros (buscar todas):**
```json
{}
```

### 5. ✨ **Funcionalidades**
- **Aplicar Filtros**: Faz POST com filtros preenchidos
- **Limpar Filtros**: Limpa campos e resultados (sem fazer requisição)
- **Resultados**: Mostra dados processados na tabela
- **Erro**: Tratamento específico para erros de backend

### 6. 🎨 **UX Melhorada**
- Mensagem orientativa quando não há dados
- Loading durante busca
- Feedback claro de erros
- Filtros funcionais sem carregamento desnecessário

Agora o comportamento está exatamente como solicitado! 🚀
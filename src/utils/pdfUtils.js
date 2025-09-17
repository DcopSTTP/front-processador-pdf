// Funções para manipulação e processamento de PDF

export const loadPDFJS = () => {
    return new Promise((resolve, reject) => {
        if (window.pdfjsLib) {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
        script.onload = () => {
            if (window.pdfjsLib) {
                resolve();
            } else {
                reject(new Error('Falha ao carregar PDF.js'));
            }
        };
        script.onerror = () => reject(new Error('Erro ao carregar PDF.js'));
        document.head.appendChild(script);
    });
};

export const extractDataFromPDF = async (file) => {
    try {
        // Carregar PDF.js via script tag
        if (!window.pdfjsLib) {
            await loadPDFJS();
        }

        // Configurar worker
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

        // Converter arquivo para ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();

        // Carregar PDF
        const pdf = await window.pdfjsLib.getDocument(arrayBuffer).promise;

        let fullText = '';

        // Extrair texto de todas as páginas
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += pageText + '\n';
        }

        // Processar texto extraído usando regex e parsing manual
        const extractedData = parseOccurrenceData(fullText);

        return extractedData;
    } catch (error) {
        console.error('Erro ao extrair dados:', error);
        throw new Error('Falha ao processar o PDF: ' + error.message);
    }
};

export const generateNewPDF = async (data) => {
    try {
        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Relatório de Ocorrência</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            font-size: 12px;
            line-height: 1.4;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 15px;
        }
        .header h1 {
            margin: 0;
            font-size: 18px;
            color: #333;
        }
        .header p {
            margin: 5px 0;
            color: #666;
        }
        .section {
            margin-bottom: 20px;
            page-break-inside: avoid;
        }
        .section-title {
            background-color: #f0f0f0;
            padding: 8px 12px;
            font-weight: bold;
            border-left: 4px solid #2563eb;
            margin-bottom: 10px;
        }
        .field-group {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            margin-bottom: 10px;
        }
        .field {
            flex: 1;
            min-width: 200px;
        }
        .field-label {
            font-weight: bold;
            color: #333;
        }
        .field-value {
            color: #555;
            margin-top: 2px;
        }
        .full-width {
            width: 100%;
        }
        .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 10px;
            color: #888;
            border-top: 1px solid #ddd;
            padding-top: 10px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Central de Atendimento e Despacho</h1>
        <p>Superintendência de Trânsito e Transportes Públicos</p>
        <p>Relatório de Ocorrência Reorganizado</p>
        <p><strong>Ocorrência N°:</strong> ${data.numeroOcorrencia || 'Não informado'}</p>
        <p><strong>Data/Hora:</strong> ${data.dataHora || 'Não informado'}</p>
    </div>

    <div class="section">
        <div class="section-title">1. NATUREZA INICIAL</div>
        <div class="field">
            <div class="field-label">Natureza:</div>
            <div class="field-value">${data.naturezaInicial || 'Não informado'}</div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">2. NARRATIVAS</div>
        <div class="field full-width">
            <div class="field-label">Descrição:</div>
            <div class="field-value">${data.narrativas || 'Não informado'}</div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">3. DADOS DA LOCALIZAÇÃO (PRINCIPAL)</div>
        <div class="field-group">
            <div class="field">
                <div class="field-label">Município:</div>
                <div class="field-value">${data.dadosLocalizacao1?.municipio || 'Não informado'}</div>
            </div>
            <div class="field">
                <div class="field-label">Logradouro:</div>
                <div class="field-value">${data.dadosLocalizacao1?.logradouro || 'Não informado'}</div>
            </div>
        </div>
        <div class="field-group">
            <div class="field">
                <div class="field-label">Bairro:</div>
                <div class="field-value">${data.dadosLocalizacao1?.bairro || 'Não informado'}</div>
            </div>
            <div class="field">
                <div class="field-label">Complemento:</div>
                <div class="field-value">${data.dadosLocalizacao1?.complemento || 'Não informado'}</div>
            </div>
        </div>
        <div class="field">
            <div class="field-label">Tipo de Local:</div>
            <div class="field-value">${data.dadosLocalizacao1?.tipoLocal || 'Não informado'}</div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">4. DADOS DA LOCALIZAÇÃO (DETALHES)</div>
        <div class="field-group">
            <div class="field">
                <div class="field-label">Tipo de Via:</div>
                <div class="field-value">${data.dadosLocalizacao2?.tipoVia || 'Não informado'}</div>
            </div>
            <div class="field">
                <div class="field-label">Número:</div>
                <div class="field-value">${data.dadosLocalizacao2?.numero || 'Não informado'}</div>
            </div>
        </div>
        <div class="field-group">
            <div class="field">
                <div class="field-label">CEP:</div>
                <div class="field-value">${data.dadosLocalizacao2?.cep || 'Não informado'}</div>
            </div>
            <div class="field">
                <div class="field-label">Ponto de Referência:</div>
                <div class="field-value">${data.dadosLocalizacao2?.pontoReferencia || 'Não informado'}</div>
            </div>
        </div>
        <div class="field-group">
            <div class="field">
                <div class="field-label">Latitude:</div>
                <div class="field-value">${data.dadosLocalizacao2?.latitude || 'Não informado'}</div>
            </div>
            <div class="field">
                <div class="field-label">Longitude:</div>
                <div class="field-value">${data.dadosLocalizacao2?.longitude || 'Não informado'}</div>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">5. EMPENHOS - VTR E EQUIPAMENTOS</div>
        <div class="field-group">
            <div class="field">
                <div class="field-label">VTR:</div>
                <div class="field-value">${data.empenhos?.vtr || 'Não informado'}</div>
            </div>
            <div class="field">
                <div class="field-label">Equipamentos:</div>
                <div class="field-value">${data.empenhos?.equipamentos || 'Não informado'}</div>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">6. EMPENHO - DESPACHADO</div>
        <div class="field">
            <div class="field-label">Data/Hora Despacho:</div>
            <div class="field-value">${data.empenhos?.despachado || 'Não informado'}</div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">7. EMPENHOS - EM DESLOCAMENTO</div>
        <div class="field">
            <div class="field-label">Status:</div>
            <div class="field-value">${data.empenhos?.deslocamento || 'Não informado'}</div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">8. EMPENHOS - CHEGADA NO LOCAL</div>
        <div class="field">
            <div class="field-label">Data/Hora Chegada:</div>
            <div class="field-value">${data.empenhos?.chegadaLocal || 'Não informado'}</div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">9. EMPENHOS - LIBERADO</div>
        <div class="field">
            <div class="field-label">Data/Hora Liberação:</div>
            <div class="field-value">${data.empenhos?.liberado || 'Não informado'}</div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">10. RELATOS</div>
        <div class="field full-width">
            <div class="field-label">Relatos Adicionais:</div>
            <div class="field-value">${data.relatos || 'Não informado'}</div>
        </div>
    </div>

    <div class="footer">
        <p>Relatório gerado automaticamente em ${new Date().toLocaleString('pt-BR')}</p>
        <p>STTP - Sistema de Processamento de Ocorrências</p>
    </div>
</body>
</html>`;

        // Criar blob do HTML
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);

        // Criar link para download
        const link = document.createElement('a');
        link.href = url;
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        link.download = `relatorio_ocorrencia_${timestamp}.html`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        return true;
    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        throw new Error('Falha ao gerar relatório');
    }
};

export const parseOccurrenceData = (text) => {
    console.log('=== INÍCIO DA EXTRAÇÃO ===');
    
    const result = {
        numeroOcorrencia: extrairNumeroOcorrencia(text),
        dadosGerais: extrairDadosGerais(text),
        narrativas: extrairNarrativas(text),
        dadosLocalizacao: extrairDadosLocalizacao(text),
        empenhos: extrairEmpenhos(text),
        relatos: extrairRelatos(text)
    };

    console.log('Dados extraídos:', result);
    return result;
};

// Função auxiliar para extração
const extractField = (pattern, text, defaultValue = 'Não informado') => {
    const match = text.match(pattern);
    return match ? match[1].trim() : defaultValue;
};

// Funções específicas para cada seção
const extrairNumeroOcorrencia = (text) => {
    // *** EXTRAIR NÚMERO DA OCORRÊNCIA *** \\
    let numeroOcorrencia = 'Não informado';
    const regexCompleto = /Ocorrência\s*N°:\s*([A-Z0-9-]+(?:\s*[A-Z-]+)*)/;
    const matchCompleto = text.match(regexCompleto);

    if (matchCompleto) {
        numeroOcorrencia = matchCompleto[1].replace(/\s+/g, '');
    } else {
        const regexAlternativo = /N°:\s*([A-Z0-9-]+(?:\s+[A-Z-]+)*?)(?=\s*[A-Z][a-z]|\s*Data|$)/;
        const matchAlternativo = text.match(regexAlternativo);

        if (matchAlternativo) {
            numeroOcorrencia = matchAlternativo[1].replace(/\s+/g, '');
        }
    }
    
    if (numeroOcorrencia.endsWith('-')) {
        const posicao = text.indexOf(numeroOcorrencia);
        if (posicao !== -1) {
            const textoApos = text.substring(posicao + numeroOcorrencia.length, posicao + numeroOcorrencia.length + 20);
            const matchResto = textoApos.match(/^([A-Z-]+)/);
            if (matchResto) {
                numeroOcorrencia += matchResto[1];
            }
        }
    }

    const padraoEspecifico = numeroOcorrencia.match(/^(CIMOB\d+-\d+-[A-Z]+-[A-Z]{3})/);
    if (padraoEspecifico) {
        numeroOcorrencia = padraoEspecifico[1];
    } else {
        const padraoGenerico = numeroOcorrencia.match(/^([A-Z]+\d+-\d+-[A-Z]+-[A-Z]{3})/);
        if (padraoGenerico) {
            numeroOcorrencia = padraoGenerico[1];
        }
    }
    
    return numeroOcorrencia; // ← ADICIONE ESTE RETURN
};

const extrairDadosGerais = (text) => {
    // Usar lookahead mais específico ao invés de [^P]
    const naturezaInicial = extractField(/Natureza\s*Inicial:\s*(.*?)(?=\s*Prioridade\s*:)/, text);

    return `<strong>Natureza Inicial:</strong> ${naturezaInicial.trim()}<br/>`;
};

const extrairNarrativas = (text) => {
    const descricaoNarrativa = extractField(/"([^"]+)"/, text);
    
    return `"${descricaoNarrativa.trim()}"`; 
};

const extrairDadosLocalizacao = (text) => {
    // Primeira coluna
    let municipio = extractField(/Município\/UF:\s*([^L]+?)(?=\s*Logradouro:)/, text);
    
    if (municipio === 'Não informado') {
        municipio = extractField(/Município[^:]*:\s*([^L]+)(?=Logradouro)/i, text);
    }
    const logradouro = extractField(/Logradouro:\s*([^B]+?)(?=\s*Bairro:)/, text);
    let bairro = extractField(/Bairro\s*([^C]+?)(?=\s*Complemento)/, text);
    if (bairro === 'Não informado') {
        bairro = extractField(/Bairro[^:]*:\s*([^L]+)(?=Complemento)/i, text);
        
    }
    let complemento = extractField(/Complemento:\s*([^T]+?)(?=\s*Tipo\s*de\s*Local:)/, text);
    if (complemento === 'Não informado') {
        complemento = extractField(/Complemento[^:]*:\s*([^L]+)(?=Local)/i, text);
    }
    const tipoLocal = extractField(/Tipo\s*de\s*Local:\s*([^T]+?)(?=\s*Tipo\s*de\s*Via:)/, text);

    // Segunda coluna
    const tipoVia = extractField(/Tipo\s*de\s*Via:\s*([^N]+?)(?=\s*Número:)/, text);
    const numero = extractField(/Número:\s*([^C]+?)(?=\s*CEP:)/, text);
    const cep = extractField(/CEP:\s*([^P]+?)(?=\s*Ponto\s*de\s*Referência:)/, text);
    const pontoReferencia = extractField(/Ponto\s*de\s*Referência:\s*([^L]+?)(?=\s*Lat)/, text);
    const latLong = extractField(/Lat\s*\/\s*Long:\s*([^N]+?)(?=\s*Narrativas)/, text);

    const localizacaoParte1 = `
<strong>Logradouro:</strong> ${logradouro.trim()}<br/>
<strong>Ponto de Referência:</strong> ${pontoReferencia.trim()}<br/>`;

    

    return {
        parte1: localizacaoParte1,
    };
};

const extrairEmpenhos = (text) => {
    // Verificar se não há empenho
    if (text.includes('Ocorrência Não Empenhada')) {
        return '<strong>Status:</strong> Ocorrência Não Empenhada';
    }

    const secaoEmpenhos = extractField(/Empenhos:?\s+(.*?)(?=\s*Dados)/s, text);
    
    if (secaoEmpenhos === 'Não informado') {
        return '<strong>Status:</strong> Nenhum empenho encontrado';
    }

    // Pegar apenas a primeira parte até "Equipamento" como unidade
    const unidade = secaoEmpenhos.split('Despachado')[0].trim();
    
    // Aplicar formatação no texto completo - ordem importa!
    let textoFormatado = secaoEmpenhos;
    
    // Formatar todos os campos na ordem correta
    textoFormatado = textoFormatado.replace(/Despachado:/g, '<br/><strong>Despachado:</strong>');
    textoFormatado = textoFormatado.replace(/Em/g, '<br/><strong>Em Deslocamento:</strong>');  // ← Corrigir aqui
    textoFormatado = textoFormatado.replace(/Chegada/g, '<br/><strong>Chegada no Local:</strong>'); // ← Corrigir aqui
    textoFormatado = textoFormatado.replace(/Liberado:/g, '<br/><strong>Liberado:</strong>');

    // Montar resultado final com a unidade em negrito
    const resultado = `<strong>${unidade}</strong><br/>${textoFormatado.substring(unidade.length)}`;
    
    console.log('Resultado final formatado:', resultado); // Debug temporário
    
    return resultado.trim();
};

const extrairRelatos = (text) => {
    // Verificar se existe a seção Relatos
    if (!text.includes('Relatos')) {
        return 'Nenhum relato adicional';
    }
    
    const textoRelato = extractField(/"([^"]+)"/, text.substring(text.indexOf('Relatos')));
    
    let resultado = '';
    
  
    
    resultado += `"${textoRelato.trim()}"`;
    
    return resultado;
};
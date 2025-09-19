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

// Função para transformar dados extraídos no formato esperado pelo backend
export const formatDataForBackend = (extractedData) => {
    const backendData = {
        numeroOcorrencia: extractedData.numeroOcorrencia || '',
        natureza: extractedData.naturezaInicial || '',
        narrativas: extractedData.narrativas || '',
        localizacao: {
            logradouro: extractedData.dadosLocalizacao1?.logradouro || '',
            bairro: extractedData.dadosLocalizacao1?.bairro || '',
            pontoReferencia: extractedData.dadosLocalizacao2?.pontoReferencia || '',
            lat: extractedData.dadosLocalizacao2?.latitude || '',
            long: extractedData.dadosLocalizacao2?.longitude || ''
        },
        empenhos: [],
        relatos: ''
    };

    // Processar empenhos se existirem dados
    if (extractedData.empenhos && extractedData.empenhos.vtr !== 'Ocorrência Não Empenhada') {
        const empenhoData = {
            vtr: extractedData.empenhos.vtr || '',
            equipamentos: extractedData.empenhos.equipamentos || '',
            despachado: extractedData.empenhos.despachado || '',
            deslocamento: extractedData.empenhos.deslocamento || '',
            chegadaLocal: extractedData.empenhos.chegadaLocal || '',
            liberado: extractedData.empenhos.liberado || ''
        };
        backendData.empenhos.push(empenhoData);
    }

    // Processar relatos - agora como string simples
    if (extractedData.relatos && extractedData.relatos !== 'Nenhum relato adicional') {
        backendData.relatos = extractedData.relatos;
    }

    return backendData;
};

export const saveDataToBackend = async (extractedData) => {
    try {
        // Importar o service dinamicamente para evitar problemas de dependência circular
        const { salvarOcorrencia } = await import('../service/UserService');
        
        // Transformar dados para o formato esperado pelo backend
        const formattedData = formatDataForBackend(extractedData);
        
        // Log para debug - mostrar como ficou o JSON
        console.log('=== DADOS FORMATADOS PARA O BACKEND ===');
        console.log(JSON.stringify(formattedData, null, 2));
        console.log('==========================================');

        // Usar o service para manter a padronização e incluir o token automaticamente
        const result = await salvarOcorrencia(formattedData);
        
        // Log da resposta do backend
        console.log('=== RESPOSTA DO BACKEND ===');
        console.log(JSON.stringify(result, null, 2));
        console.log('============================');
        
        return result;
    } catch (error) {
        console.error('Erro ao salvar dados:', error);
        throw new Error('Falha ao salvar dados no sistema: ' + error.message);
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
    
    const dadosLocalizacaoExtraidos = extrairDadosLocalizacao(text);
    
    const result = {
        numeroOcorrencia: extrairNumeroOcorrencia(text),
        naturezaInicial: extrairDadosGerais(text),
        narrativas: extrairNarrativas(text),
        dadosLocalizacao1: dadosLocalizacaoExtraidos.dadosLocalizacao1,
        dadosLocalizacao2: dadosLocalizacaoExtraidos.dadosLocalizacao2,
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

    return naturezaInicial.trim();
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
    const pontoReferencia = extractField(/Ponto\s*de\s*Referência:\s*([^\r\n]+?)(?=\s*Lat\s*\/\s*Long:)/, text);
    
    // Extrair Lat/Long com formato específico: -7.220458900000001 , -7.220458900000001
    const latLongCompleto = extractField(/Lat\s*\/\s*Long:\s*([^N]+?)(?=\s*Narrativas)/, text);
    
    // Separar latitude e longitude
    let latitude = 'Não informado';
    let longitude = 'Não informado';
    
    if (latLongCompleto !== 'Não informado') {
        // Buscar padrão: número , espaço , número
        const coordenadasMatch = latLongCompleto.match(/([-]?\d+\.?\d*)\s*,\s*([-]?\d+\.?\d*)/);
        if (coordenadasMatch) {
            latitude = coordenadasMatch[1].trim();
            longitude = coordenadasMatch[2].trim();
        }
    }

    console.log('Dados de localização extraídos:', {
        municipio: municipio.trim(),
        logradouro: logradouro.trim(),
        bairro: bairro.trim(),
        complemento: complemento.trim(),
        tipoLocal: tipoLocal.trim(),
        tipoVia: tipoVia.trim(),
        numero: numero.trim(),
        cep: cep.trim(),
        pontoReferencia: pontoReferencia.trim(),
        latitude,
        longitude,
        latLongCompleto
    });

    return {
        // Dados principais (primeira seção)
        dadosLocalizacao1: {
            municipio: municipio.trim(),
            logradouro: logradouro.trim(),
            bairro: bairro.trim(),
            complemento: complemento.trim(),
            tipoLocal: tipoLocal.trim()
        },
        // Dados detalhados (segunda seção)
        dadosLocalizacao2: {
            tipoVia: tipoVia.trim(),
            numero: numero.trim(),
            cep: cep.trim(),
            pontoReferencia: pontoReferencia.trim(),
            latitude,
            longitude
        }
    };
};

const extrairEmpenhos = (text) => {
    // Verificar se não há empenho
    if (text.includes('Ocorrência Não Empenhada')) {
        return {
            vtr: 'Ocorrência Não Empenhada',
            equipamentos: 'N/A',
            despachado: 'N/A',
            deslocamento: 'N/A',
            chegadaLocal: 'N/A',
            liberado: 'N/A'
        };
    }

    const secaoEmpenhos = extractField(/Empenhos:?\s+(.*?)(?=\s*Dados)/s, text);
    
    console.log('=== DEBUG EMPENHOS ===');
    console.log('Seção empenhos extraída:', secaoEmpenhos);
    console.log('======================');
    
    if (secaoEmpenhos === 'Não informado') {
        return {
            vtr: 'Nenhum empenho encontrado',
            equipamentos: 'N/A',
            despachado: 'N/A',
            deslocamento: 'N/A',
            chegadaLocal: 'N/A',
            liberado: 'N/A'
        };
    }

    // Extrair VTR e equipamentos da primeira parte
    const unidade = secaoEmpenhos.split('Despachado')[0].trim();
    const vtrMatch = unidade.match(/VTR\s*([^\s]+)/);
    const equipMatch = unidade.match(/Equipamento[^:]*:\s*([^D]+)/);
    
    // Extrair tempos dos empenhos - regex mais específica para despachado
    let despachado = extractField(/Despachado:\s*([^\r\n]+?)(?=\s*Liberado)/, secaoEmpenhos);
    if (despachado === 'Não informado') {
        despachado = extractField(/Despachado:\s*([^\r\n]+?)(?=\s*Em\s*Deslocamento)/, secaoEmpenhos);
    }
    if (despachado === 'Não informado') {
        despachado = extractField(/Despachado:\s*([^\r\n]+)/, secaoEmpenhos);
    }
    
    let deslocamento = extractField(/Em\s*Deslocamento:\s*([^\r\n]+?)(?=\s*Chegada)/, secaoEmpenhos);
    if (deslocamento === 'Não informado') {
        deslocamento = extractField(/Em\s*Deslocamento:\s*([^\r\n]+)/, secaoEmpenhos);
    }
    
    let chegadaLocal = extractField(/Chegada\s*no\s*Local:\s*([^\r\n]+?)(?=\s*Liberado)/, secaoEmpenhos);
    if (chegadaLocal === 'Não informado') {
        chegadaLocal = extractField(/Chegada\s*no\s*Local:\s*([^\r\n]+)/, secaoEmpenhos);
    }
    
    let liberado = extractField(/Liberado:\s*([^\r\n]+)/, secaoEmpenhos);

    console.log('Empenhos extraídos:', {
        vtr: vtrMatch ? vtrMatch[1].trim() : unidade,
        equipamentos: equipMatch ? equipMatch[1].trim() : 'N/A',
        despachado: despachado.trim(),
        deslocamento: deslocamento.trim(),
        chegadaLocal: chegadaLocal.trim(),
        liberado: liberado.trim()
    });
    
    return {
        vtr: vtrMatch ? vtrMatch[1].trim() : unidade,
        equipamentos: equipMatch ? equipMatch[1].trim() : 'N/A',
        despachado: despachado.trim(),
        deslocamento: deslocamento.trim(),
        chegadaLocal: chegadaLocal.trim(),
        liberado: liberado.trim()
    };
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
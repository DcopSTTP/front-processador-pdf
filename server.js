const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

// Configurar CORS
app.use(cors());
app.use(express.json());

// Criar pasta para armazenar os PDFs se não existir
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configurar multer para salvar arquivos na pasta uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Gerar nome único com timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `ocorrencia_${timestamp}_${file.originalname}`;
    cb(null, fileName);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Apenas arquivos PDF são permitidos!'), false);
    }
  }
});

// Endpoint para upload de PDF
app.post('/upload-pdf', upload.single('pdf'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'Nenhum arquivo foi enviado' 
      });
    }

    const filePath = path.join(uploadsDir, req.file.filename);
    
    res.json({
      success: true,
      message: 'PDF salvo com sucesso!',
      fileName: req.file.filename,
      filePath: filePath,
      size: req.file.size
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// Endpoint para listar arquivos salvos
app.get('/files', (req, res) => {
  try {
    const files = fs.readdirSync(uploadsDir).map(filename => {
      const filePath = path.join(uploadsDir, filename);
      const stats = fs.statSync(filePath);
      return {
        name: filename,
        size: stats.size,
        created: stats.birthtime
      };
    });
    
    res.json({ success: true, files });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao listar arquivos'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Arquivos serão salvos em: ${uploadsDir}`);
});
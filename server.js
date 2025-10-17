const express = require('express');
const cors = require('cors');
const YTDlpWrap = require('yt-dlp-wrap').default;
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

const ytDlpWrap = new YTDlpWrap();

const allowedOrigins = [
  'http://localhost:3000',
  'https://devteix.github.io'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));

// Rota de teste para verificar se o servidor está no ar
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Servidor está no ar e funcionando!' });
});

app.get('/api/download', async (req, res) => {
    const videoUrl = req.query.url;

    if (!videoUrl) {
        return res.status(400).json({ error: 'URL do vídeo é obrigatória.' });
    }

    try {
        console.log(`[INFO] Buscando metadados para: ${videoUrl}`);
        const metadata = await ytDlpWrap.getVideoInfo(videoUrl);
        
        const videoInfo = {
            title: metadata.title,
            thumbnail: metadata.thumbnail,
            videoUrl: metadata.url,
        };
        
        console.log('[SUCCESS] Metadados encontrados:', videoInfo);
        res.status(200).json(videoInfo);

    } catch (error) {
        // --- LOG DE ERRO MELHORADO ---
        console.error('[ERROR] Ocorreu um erro detalhado ao buscar o vídeo.');
        // Imprime o objeto de erro completo para máxima depuração
        console.error(error); 
        // --- FIM DA MELHORIA ---
        
        // Envia uma resposta de erro mais informativa para o frontend
        const errorMessage = error.message || 'Erro desconhecido no servidor.';
        res.status(500).json({ 
            error: 'Falha ao obter informações do vídeo. Verifique a URL e tente novamente.',
            details: errorMessage
        });
    }
});

app.listen(port, () => {
    console.log(`[INFO] Servidor rodando em http://localhost:${port}`);
});

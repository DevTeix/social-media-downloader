const express = require('express');
const cors = require('cors');
const YTDlpWrap = require('yt-dlp-wrap').default;
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Configuração do yt-dlp
// Certifique-se de que o binário do yt-dlp está acessível.
// Se estiver no mesmo diretório, pode ser apenas 'yt-dlp'.
// Em ambientes como o Render, ele busca no PATH.
const ytDlpWrap = new YTDlpWrap();

// --- CORREÇÃO IMPORTANTE AQUI ---
// Lista de sites (origens) que podem fazer requisições para este servidor.
const allowedOrigins = [
  'http://localhost:3000', // Para testes locais
  'https://devteix.github.io' // O endereço do seu site no ar
];

const corsOptions = {
  origin: function (origin, callback) {
    // Permite requisições sem 'origin' (ex: Postman ou apps mobile)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

// Usa as opções de CORS
app.use(cors(corsOptions));
// --- FIM DA CORREÇÃO ---

app.get('/api/download', async (req, res) => {
    const videoUrl = req.query.url;

    if (!videoUrl) {
        return res.status(400).json({ error: 'URL do vídeo é obrigatória.' });
    }

    try {
        console.log(`Buscando metadados para: ${videoUrl}`);
        const metadata = await ytDlpWrap.getVideoInfo(videoUrl);
        
        const videoInfo = {
            title: metadata.title,
            thumbnail: metadata.thumbnail,
            videoUrl: metadata.url,
        };
        
        console.log('Metadados encontrados:', videoInfo);
        res.json(videoInfo);

    } catch (error) {
        console.error('Erro detalhado ao buscar vídeo:', error);
        res.status(500).json({ error: 'Falha ao obter informações do vídeo. A URL pode ser inválida ou o vídeo privado.' });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});


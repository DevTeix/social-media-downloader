const express = require('express');
const cors = require('cors');
const youtubedl = require('youtube-dl-exec');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

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

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Servidor está no ar e funcionando!' });
});

app.get('/api/download', async (req, res) => {
    const videoUrl = req.query.url;

    if (!videoUrl) {
        return res.status(200).json({ success: false, error: 'URL do vídeo é obrigatória.' });
    }

    try {
        console.log(`[INFO] Buscando metadados para: ${videoUrl}`);
        const metadata = await youtubedl(videoUrl, {
            dumpSingleJson: true,
            noWarnings: true,
            noCallHome: true,
            noCheckCertificate: true,
            preferFreeFormats: true,
            youtubeSkipDashManifest: true
        });

        const videoInfo = {
            title: metadata.title,
            thumbnail: metadata.thumbnail,
            videoUrl: metadata.url || (metadata.formats && metadata.formats[0] ? metadata.formats[0].url : null),
        };

        if (!videoInfo.videoUrl) {
            console.error('[ERROR] Não foi possível encontrar a URL do vídeo nos metadados.');
            return res.status(200).json({ success: false, error: 'Não foi possível extrair a URL do vídeo.' });
        }
        
        console.log('[SUCCESS] Metadados encontrados:', videoInfo);
        res.status(200).json({ success: true, ...videoInfo });

    } catch (error) {
        console.error('[ERROR] Ocorreu um erro detalhado ao buscar o vídeo.');
        console.error(error.stderr || error); 
        
        const userFriendlyError = 'Falha ao obter informações. O vídeo pode ser privado, ter sido removido ou a URL é inválida.';
        
        // MUDANÇA IMPORTANTE: Sempre retorna 200, com o erro no corpo do JSON
        res.status(200).json({ 
            success: false,
            error: userFriendlyError,
        });
    }
});

app.listen(port, () => {
    console.log(`[INFO] Servidor rodando em http://localhost:${port}`);
});


// 1. Importa o framework Express, que facilita a criação de servidores.
const express = require('express');

// 2. Cria uma instância do nosso aplicativo chamando a função express().
const app = express();

// 3. Define a porta. É uma boa prática usar uma variável de ambiente (process.env.PORT)
// para ambientes de produção (nuvem) ou usar a 3000 para desenvolvimento local.
const port = process.env.PORT || 3000;

// 4. Cria a nossa primeira "rota".
// Quando alguém fizer uma requisição GET para a página inicial ('/'),
// a função que vem em seguida será executada.
app.get('/', (req, res) => {
  // req (request): contém as informações da requisição que chegou.
  // res (response): é o objeto que usamos para enviar uma resposta de volta.
  res.send('<h1>Olá, Elton!</h1><p>Seu servidor com Express está no ar!</p>');
});

// Adicione outras rotas aqui se precisar! Exemplo:
app.get('/sobre', (req, res) => {
  res.send('<h2>Esta é a página Sobre</h2>');
});

// 5. "Liga" o servidor e o faz escutar por requisições na porta que definimos.
app.listen(port, () => {
  console.log(`🚀 Servidor rodando com sucesso em http://localhost:${port}`);
  console.log('Pressione Ctrl + C para derrubar o servidor.');
});
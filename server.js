const express = require('express');
const next = require('next');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Carrega variáveis de ambiente
dotenv.config();

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3000;

app.prepare().then(() => {
  const server = express();

  // Middleware básico
  server.use(cors());
  server.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
  }));
  server.use(compression());
  server.use(morgan('dev'));
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  // Rotas da API
  server.use('/api/auth', require('./src/backend/api/auth'));
  server.use('/api/products', require('./src/backend/api/products'));
  
  // Adicione mais rotas da API aqui conforme necessário

  // Manipulador para todas as outras rotas (Next.js)
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Servidor pronto na porta ${PORT}`);
  });
}).catch(err => {
  console.error('Erro ao iniciar servidor:', err);
  process.exit(1);
});
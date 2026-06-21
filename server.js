require('dotenv').config();

const http = require('http');
const https = require('https');
const mongoose = require('mongoose');
const selfsigned = require('selfsigned');
const app = require('./app');
const config = require('./config/config');

const port = normalizePort(process.env.PORT || '3000');
const httpsPort = normalizePort(process.env.HTTPS_PORT || '3443');
app.set('port', port);

mongoose.connect(config.mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
})
  .then(() => {
    console.log('Connected correctly to MongoDB server');
    const server = http.createServer(app);
    server.listen(port);
    server.on('error', onError);
    server.on('listening', () => {
      const addr = server.address();
      console.log(`Server listening on http://localhost:${addr.port}`);
    });

    const attrs = [{ name: 'commonName', value: 'localhost' }];
    const pems = selfsigned.generate(attrs, { days: 365 });
    const secureServer = https.createServer({ key: pems.private, cert: pems.cert }, app);
    secureServer.listen(httpsPort);
    secureServer.on('error', onError);
    secureServer.on('listening', () => {
      const addr = secureServer.address();
      console.log(`Secure server listening on https://localhost:${addr.port}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

function normalizePort(val) {
  const parsedPort = parseInt(val, 10);
  if (Number.isNaN(parsedPort)) return val;
  if (parsedPort >= 0) return parsedPort;
  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') throw error;
  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

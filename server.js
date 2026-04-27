// server.js
// Carga las variables de entorno desde el archivo .env
require('dotenv').config();

const http = require('http');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Rutas a las llaves RSA, configurables mediante variables de entorno
const publicKeyPath = process.env.PUBLIC_KEY_PATH || path.resolve(__dirname, 'public.pem');
const privateKeyPath = process.env.PRIVATE_KEY_PATH || path.resolve(__dirname, 'private.pem');

// Carga de llaves desde el sistema de archivos
const publicKey = fs.readFileSync(publicKeyPath, 'utf8');
const privateKey = fs.readFileSync(privateKeyPath, 'utf8');

/**
 * Creación del servidor HTTP que maneja las solicitudes de encriptación y desencriptación RSA.
 */
const server = http.createServer((req, res) => {
  // Configuración de cabeceras CORS para permitir peticiones desde cualquier origen
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Manejo de la petición preflight de CORS
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  /**
   * Endpoint POST /encrypt
   * Recibe un texto plano y devuelve su representación encriptada en base64.
   */
  if (req.method === 'POST' && req.url === '/encrypt') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const { text } = JSON.parse(body);

        if (!text) {
            res.writeHead(400);
            return res.end('Missing "text" field');
        }

        const buffer = Buffer.from(text, 'utf-8');

        // Proceso de encriptación pública usando RSA con padding OAEP
        const encrypted = crypto.publicEncrypt(
          {
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: 'sha256'
          },
          buffer
        );

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          original: text,
          encrypted: encrypted.toString('base64')
        }));

      } catch (error) {
        res.writeHead(400);
        res.end('Error en request');
      }
    });
  } 
  /**
   * Endpoint POST /decrypt
   * Recibe un texto encriptado en base64 y devuelve el texto original desencriptado.
   */
  else if (req.method === 'POST' && req.url === '/decrypt') {
  let body = '';

  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', () => {
    try {
      const { encrypted } = JSON.parse(body);

      if (!encrypted) {
            res.writeHead(400);
            return res.end('Missing "encrypted" field');
        }

      const buffer = Buffer.from(encrypted, 'base64');

      // Proceso de desencriptación privada usando RSA con padding OAEP
      const decrypted = crypto.privateDecrypt(
        {
          key: privateKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: 'sha256'
        },
        buffer
      );

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        decrypted: decrypted.toString('utf-8')
      }));

    } catch (error) {
  console.error(error);
  res.writeHead(400);
  res.end(error.message);
}
  });
}
  else {
    res.writeHead(404);
    res.end('Not found');
  }
});

const PORT = process.env.PORT || 3000;

// Inicio del servidor en el puerto configurado
server.listen(3000, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
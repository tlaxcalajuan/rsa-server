// server.js
const http = require('http');
const crypto = require('crypto');
const fs = require('fs');

const publicKey = fs.readFileSync('public.pem', 'utf8');
const privateKey = fs.readFileSync('private.pem', 'utf8');

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/encrypt') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const { text } = JSON.parse(body);

        const buffer = Buffer.from(text, 'utf-8');

        const encrypted = crypto.publicEncrypt(
          {
            key: publicKey,
            //padding: crypto.constants.RSA_PKCS1_PADDING,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
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
  } else if (req.method === 'POST' && req.url === '/decrypt') {
  let body = '';

  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', () => {
    try {
      const { encrypted } = JSON.parse(body);

      const buffer = Buffer.from(encrypted, 'base64');

      const decrypted = crypto.privateDecrypt(
        {
          key: privateKey,
          //padding: crypto.constants.RSA_PKCS1_PADDING,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
        },
        buffer
      );

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        decrypted: decrypted.toString('utf-8')
      }));

    } catch (error) {
  console.error(error); // 👈 CLAVE
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

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
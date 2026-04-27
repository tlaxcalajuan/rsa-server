# RSA Encryption Server

Servidor backend minimalista desarrollado en **Node.js** que proporciona servicios de encriptación y desencriptación utilizando el estándar **RSA (OAEP con SHA-256)**.

## Características

- **Seguridad**: Implementa encriptación asimétrica RSA robusta.
- **CORS**: Configurado para permitir peticiones desde clientes web.
- **Endpoints**:
  - `POST /encrypt`: Encripta un texto plano usando una llave pública.
  - `POST /decrypt`: Desencripta un texto (base64) usando una llave privada.

## Requisitos Previos

- [Node.js](https://nodejs.org/) instalado.

## Instalación

1. Navega al directorio del servidor:
   ```bash
   cd rsa-server
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```

## Generación de Llaves RSA (Local)

Si necesitas generar un nuevo par de llaves para pruebas locales, puedes utilizar el script incluido:

```bash
node secrets/generate-keys.js
```

Esto generará los archivos `public.pem` y `private.pem` necesarios para el funcionamiento del servidor.

## Ejecución

Para iniciar el servidor localmente:

```bash
node server.js
```

El servidor se ejecutará por defecto en `http://localhost:3000/`.

## Despliegue en Producción

El servidor está desplegado en **Render** como un **Web Service**:
[https://rsa-server-r452.onrender.com](https://rsa-server-r452.onrender.com)

**Nota**: El despliegue se realiza de forma automática utilizando el archivo `Dockerfile` incluido en el proyecto. Las llaves y variables sensibles están configuradas mediante **Secrets** en el panel de control de Render.

## Variables de Entorno

Puedes crear un archivo `.env` con las siguientes variables:

```env
PORT=3000
PUBLIC_KEY_PATH=./public.pem
PRIVATE_KEY_PATH=./private.pem
```

## Estructura de Datos (Endpoints)

### Encriptar
- **URL**: `/encrypt`
- **Body**: `{ "text": "mi nombre" }`
- **Response**: `{ "original": "mi nombre", "encrypted": "..." }`

### Desencriptar
- **URL**: `/decrypt`
- **Body**: `{ "encrypted": "..." }`
- **Response**: `{ "decrypted": "mi nombre" }`

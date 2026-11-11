import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.join(__dirname, 'public');
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '127.0.0.1';

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.mjs': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp'
};

const server = http.createServer(async (req, res) => {
    try {
        const reqUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
        let relPath = decodeURIComponent(reqUrl.pathname);
        if (relPath === '/') relPath = '/index.html';

        const filePath = path.resolve(PUBLIC_DIR, `.${relPath}`);
        if (!filePath.startsWith(PUBLIC_DIR)) {
            res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('Acesso negado');
            return;
        }

        let stat = await fs.stat(filePath).catch(() => null);
        const finalPath = stat && stat.isDirectory() ? path.join(filePath, 'index.html') : filePath;
        stat = await fs.stat(finalPath).catch(() => null);

        if (!stat || !stat.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('Arquivo não encontrado');
            return;
        }

        const ext = path.extname(finalPath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        const data = await fs.readFile(finalPath);
        res.writeHead(200, {
            'Content-Type': contentType,
            'Cache-Control': 'no-store, must-revalidate',
        });
        res.end(data);
    } catch (error) {
        console.error('Erro no servidor local:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Erro interno do servidor');
    }
});

server.listen(PORT, HOST, () => {
    console.log(`Foco Hero rodando localmente em http://${HOST}:${PORT}`);
});

const fs = require('fs');
const path = require('path');
const http = require('http');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const LOG_FILE = path.join(ROOT, 'users.json');

// Assure que le fichier users.json existe
if (!fs.existsSync(LOG_FILE)) fs.writeFileSync(LOG_FILE, '[]', 'utf8');

function serveFile(filePath, res, contentType) {
  const stream = fs.createReadStream(filePath);
  stream.on('error', () => {
    res.statusCode = 404;
    res.end('Not found');
  });
  res.setHeader('Content-Type', contentType || 'text/html; charset=utf-8');
  stream.pipe(res);
}

function appendLog(data) {
  fs.readFile(LOG_FILE, 'utf8', (err, content) => {
    let logs = [];
    if (!err) {
      try { logs = JSON.parse(content); } catch {}
    }
    logs.push(data);
    fs.writeFile(LOG_FILE, JSON.stringify(logs, null, 2), (err) => {
      if (err) console.error('Erreur écriture users.json:', err);
    });
  });
}

const server = http.createServer((req, res) => {
  const url = req.url.split('?')[0];
  const filePath = path.join(ROOT, url === '/' ? 'index.html' : url);

  // POST /api/log
  if (req.method === 'POST' && url === '/api/log') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        data.receivedAt = new Date().toISOString();
        appendLog(data);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ ok: true }));
      } catch (e) {
        res.writeHead(400, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }

  // GET /logs — page HTML pour afficher les logs
  if (req.method === 'GET' && url === '/logs') {
    fs.readFile(LOG_FILE, 'utf8', (err, content) => {
      if (err) {
        res.writeHead(500);
        return res.end('Erreur lecture users.json');
      }
      let logs = [];
      try { logs = JSON.parse(content); } catch {}
      let html = `
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Logs Utilisateurs</title>
          <style>
            body { font-family: sans-serif; padding: 20px; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ccc; padding: 8px; }
            th { background: #eee; }
            tr:nth-child(even) { background: #f9f9f9; }
            pre { margin: 0; font-family: monospace; }
          </style>
        </head>
        <body>
          <h1>Journal des utilisateurs</h1>
          <table>
            <tr>
              <th>#</th>
              <th>Timestamp</th>
              <th>URL</th>
              <th>UserAgent</th>
              <th>Platform</th>
              <th>Viewport</th>
              <th>Détails</th>
            </tr>
            ${logs.map((log, i) => `
              <tr>
                <td>${i+1}</td>
                <td>${log.timestamp || log.receivedAt}</td>
                <td>${log.url || ''}</td>
                <td>${log.userAgent || ''}</td>
                <td>${log.platform || ''}</td>
                <td>${log.viewport || ''}</td>
                <td><pre>${JSON.stringify(log, null, 2)}</pre></td>
              </tr>
            `).join('')}
          </table>
        </body>
        </html>
      `;
      res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
      res.end(html);
    });
    return;
  }

  // Tout le reste — fichiers statiques
  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      res.statusCode = 404;
      return res.end('Not found');
    }
    const ext = path.extname(filePath);
    const types = {
      '.html': 'text/html; charset=utf-8',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.ico': 'image/x-icon'
    };
    serveFile(filePath, res, types[ext] || 'application/octet-stream');
  });
});

server.listen(PORT, () => {
  console.log('Serveur ARG actif sur http://localhost:' + PORT);
  console.log('Journal des accès :', LOG_FILE);
});

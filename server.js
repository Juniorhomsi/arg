/**
 * Serveur minimal pour l’ARG : sert les pages et enregistre les accès dans users.txt
 * Lancer : npm install && node server.js
 * Puis ouvrir : http://localhost:3000/
 */

var fs = require('fs');
var path = require('path');
var http = require('http');

var PORT = process.env.PORT || 3000;
var ROOT = __dirname;
var LOG_FILE = path.join(ROOT, 'users.txt');

function serveFile(filePath, res, contentType) {
  var stream = fs.createReadStream(filePath);
  stream.on('error', function () {
    res.statusCode = 404;
    res.end('Not found');
  });
  res.setHeader('Content-Type', contentType || 'text/html; charset=utf-8');
  stream.pipe(res);
}

function appendLog(data) {
  var line = JSON.stringify(data) + '\n';
  fs.appendFile(LOG_FILE, line, function (err) {
    if (err) console.error('Erreur écriture users.txt:', err);
  });
}

var server = http.createServer(function (req, res) {
  var url = req.url.split('?')[0];
  var filePath = path.join(ROOT, url === '/' ? 'index.html' : url);

  if (req.method === 'POST' && url === '/api/log') {
    var body = '';
    req.on('data', function (chunk) { body += chunk; });
    req.on('end', function () {
      try {
        var data = JSON.parse(body);
        data.receivedAt = new Date().toISOString();
        appendLog(data);
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 200;
        res.end(JSON.stringify({ ok: true }));
      } catch (e) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }
  if (req.method === 'GET' && url === '/api/users') {
    fs.readFile(LOG_FILE, 'utf8', function (err, data) {
      if (err) {
        res.statusCode = 500;
        return res.end('Erreur lecture fichier');
      }
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.end(data);
    });
    return;
  }
  

  fs.stat(filePath, function (err, stat) {
    if (err || !stat.isFile()) {
      res.statusCode = 404;
      res.end('Not found');
      return;
    }
    var ext = path.extname(filePath);
    var types = {
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

server.listen(PORT, function () {
  console.log('ARG disponible sur http://localhost:' + PORT + '/');
  console.log('Journal des accès :', LOG_FILE);
});

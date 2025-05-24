const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 8000;

http.createServer((req, res) => {
	console.log('Request: ' + req.url);

	let filePath = '.' + req.url;
	if (filePath == './') filePath = './index.html';

	const extname = String(path.extname(filePath)).toLowerCase();
	const mimeTypes = {
		'.html': 'text/html',
		'.js': 'text/javascript',
		'.patt': 'application/octet-stream',
		'.css': 'text/css',
		'.json': 'application/json',
		'.png': 'image/png',
		'.jpg': 'image/jpeg',
		'.gif': 'image/gif',
	};

	const contentType = mimeTypes[extname] || 'application/octet-stream';

	fs.readFile(filePath, function (error, content) {
		if (error) {
			if (error.code == 'ENOENT') {
				res.writeHead(404);
				res.end('File not found');
			}
			else {
				res.writeHead(500);
				res.end('Server error: ' + error.code);
			}
		}
		else {
			res.writeHead(200, { 'Content-Type': contentType });
			res.end(content, 'utf-8');
		}
	});
}).listen(port);

console.log(`Server running at http://localhost:${port}/`);

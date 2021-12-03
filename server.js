const express = require('express');
const https = require('https');
const request = require('request');
const fs = require('fs');

const app = express();

const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};
// const server = https.createServer(RouteSetting);

const hostname = 'localhost';
const port = 443;

// const indexPage = fs.readFileSync('./index.html','utf-8');
// const styleCss = fs.readFileSync('./css/style.css','utf-8');
// const gridCss = fs.readFileSync('./css/grid.css','utf-8');
// const ressCss = fs.readFileSync('./css/ress.min.css','utf-8');

app.use('/css', express.static('css'));
app.use('/js', express.static('js'));
app.use('/img', express.static('img'));
app.use('/database', express.static('database'));

app.get('/', (req,res) => {
    fs.readFile('./index.html', (err, data) =>{
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.write(data);
	res.end();
    });
});

https.createServer(options, app).listen(port, () => console.log('HTTPS on 443'));

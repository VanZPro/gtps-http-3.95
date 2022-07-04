const fs = require('fs');
const key = fs.readFileSync('./key.pem');
const cert = fs.readFileSync('./cert.pem');

const { RateLimiterMemory } = require('rate-limiter-flexible');
const readline = require("readline");
const express = require('express');
const app = express();

const slowDown = require("express-slow-down");
const speedLimiter = slowDown({
    windowMs: 15 * 60 * 1000,
    delayAfter: 100,
    delayMs: 500
});

const rateLimiter = new RateLimiterMemory({
	points: 10, // 10 points
	duration: 1 // per second
});

const https = require('https');
const server = https.createServer({ key, cert }, app);
const port = 443;

const pack = `
server|20.198.0.205
port|17091
type|1
#maint|HTTP SERVER
beta_server|127.0.0.1
beta_port|17091

beta_type|1
meta|defined
RTENDMARKERBS1001|unknown
`;


app.post("/growtopia/server_data.php", (req, res) => {
  res.status(200).send(pack).end();
});

// don't accept all method
app.use((req, res) => {
  res.status(200).send(pack).end();
});
server.listen(port, () => {
  console.log(`Server on https://20.198.0.205:${port}`);
});

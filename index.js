require('dotenv').config();

const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const https = require('https');
const router = require('./config/router');
const sequelize = require('./config/sequelize');

const app = express();

app.use(bodyParser.json());
app.use('/', router);

sequelize.sync({ force: true });

const sslCredentials = {
  key: fs.readFileSync(process.env.SSL_KEY),
  cert: fs.readFileSync(process.env.SSL_CRT),
};

https.createServer(sslCredentials, app).listen(process.env.APP_PORT);

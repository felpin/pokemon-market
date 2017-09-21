require('dotenv').config();

const bodyParser = require('body-parser');
const express = require('express');
const router = require('./config/router');
const sequelize = require('./config/sequelize');


const app = express();

app.use(bodyParser.json());
app.use('/', router);

sequelize.sync({ force: true });
app.listen(3000);

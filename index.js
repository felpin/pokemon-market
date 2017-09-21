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

// ALWAYS
// TODO: Rodar o eslint e o depcheck

// OBRIGATÓRIO
// TODO: Colocar HTTPS
// TODO: Fazer documentação com JSDOC
// TODO: Implementar testes exceto de rotas
// TODO: Criar uma pasta de aplicação para que rota chame a aplicação
// TODO: Implementar testes de aplicação (validação)

// DESEJÁVEL
// TODO: Implementar logs
// TODO: Fazer documentação com Swagger
// TODO: Não utilizar o Joi para fazer validação

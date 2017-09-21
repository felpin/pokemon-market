const Sequelize = require('sequelize');

const sequelize = new Sequelize('pokemons', null, null, {
  dialect: 'sqlite',
});

module.exports = sequelize;

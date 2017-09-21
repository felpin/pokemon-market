const Sequelize = require('sequelize');
const sequelize = require('../config/sequelize');

const constants = require('../constants/pokemon');

const Pokemon = sequelize.define('pokemon', {
  name: {
    allowNull: false,
    unique: true,
    type: Sequelize.STRING(constants.NAME_LENGTH),
  },
  price: {
    allowNull: false,
    type: Sequelize.DECIMAL(constants.PRICE_PRECISION, constants.PRICE_SCALE),
  },
  stock: {
    allowNull: true,
    defaultValue: 1,
    type: Sequelize.INTEGER,
  },
});

module.exports = Pokemon;

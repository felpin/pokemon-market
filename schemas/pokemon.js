const Joi = require('joi');
const pokemonConstants = require('../constants/pokemon');

const schemaForName = Joi.string().max(pokemonConstants.NAME_LENGTH).lowercase().trim()
  .required();

const schema = Joi.object().keys({
  name: schemaForName,
  price: Joi.number().positive().max(pokemonConstants.PRICE_MAX_VALUE)
    .precision(pokemonConstants.PRICE_SCALE)
    .required(),
  stock: Joi.number().positive().integer(pokemonConstants.STOCK_MAX_VALUE),
});

module.exports = {
  schema,
  schemaForName,
};

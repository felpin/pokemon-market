const Joi = require('joi');
const { schemaForName: pokemonSchemaForName } = require('./pokemon');

const regexForNumber = /^[0-9]+$/;

const schemaForBuy = Joi.object().keys({
  name: pokemonSchemaForName,
  quantity: Joi.number().positive().integer()
    .required(),
  creditCard: Joi.object().keys({
    holderName: Joi.string().required(),
    number: Joi.string().regex(regexForNumber, 'credit card').required(),
    expirationDate: Joi.string().regex(/^[0-9]{4}$/, 'expiration date').required(),
    cvv: Joi.string().regex(regexForNumber, 'cvv').required(),
  }),
});

module.exports = {
  schemaForBuy,
};

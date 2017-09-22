const Joi = require('joi');
const ValidationError = require('../errors/ValidationError');
const { schemaForBuy } = require('../schemas/market');
const marketService = require('../services/market');

const buy = buyRequest => new Promise((resolve, reject) => {
  const { error, value } = Joi.validate(buyRequest, schemaForBuy);

  if (error) {
    reject(new ValidationError(error));
  } else {
    resolve(marketService.buy(value.name, value.quantity, value.creditCard));
  }
});

module.exports = {
  buy,
};

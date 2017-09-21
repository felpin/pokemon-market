const Joi = require('joi');

const { schemaForBuy } = require('../schemas/market');
const marketService = require('../services/market');

const buy = (buyRequest) => {
  const { error, value } = Joi.validate(buyRequest, schemaForBuy);

  if (error) throw error;

  return marketService.buy(value.name, value.quantity, value.creditCard);
};

module.exports = {
  buy,
};

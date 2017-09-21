const Joi = require('joi');
const router = require('express').Router();

const { schemaForBuy } = require('../schemas/market');
const marketService = require('../services/market');
const errorHandler = require('../utils/errorhandler');

router.post('/buy', (req, res) => {
  const { error, value } = Joi.validate(req.body, schemaForBuy);

  if (error) {
    res.status(422).send(error);
  } else {
    marketService.buy(value.name, value.quantity, value.creditCard)
      .then((pokemon) => {
        res.send(pokemon);
      })
      .catch(errorHandler(res));
  }
});

module.exports = router;

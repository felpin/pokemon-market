const NotEnoughStockOfPokemonError = require('../errors/NotEnoughStockOfPokemonError');
const PagarmeTransactionError = require('../errors/PagarmeTransactionError');
const UnexistentPokemonError = require('../errors/UnexistentPokemonError');
const UnpaidTransactionError = require('../errors/UnpaidTransactionError');

const handle = res => (error) => {
  switch (error.name) {
    case PagarmeTransactionError.name:
    case UnpaidTransactionError.name:
      res.status(400).send(error);
      break;
    case NotEnoughStockOfPokemonError.name:
    case UnexistentPokemonError.name:
      res.status(422).send(error);
      break;
    default:
      res.sendStatus(500);
  }
};

module.exports = handle;

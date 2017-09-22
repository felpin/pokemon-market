const NotEnoughStockOfPokemonError = require('../errors/NotEnoughStockOfPokemonError');
const PagarmeTransactionError = require('../errors/PagarmeTransactionError');
const UnexistentPokemonError = require('../errors/UnexistentPokemonError');
const UnpaidTransactionError = require('../errors/UnpaidTransactionError');
const ValidationError = require('../errors/ValidationError');

/**
 * Creates a function to handle errors
 * @param {Object} res The express' response object
 * @returns {function} A function to handle errors
 */
const handle = res =>
  /**
   * Handle errors
   * @param {Error} error The error
   */
  (error) => {
    switch (error.type) {
      case PagarmeTransactionError.name:
      case UnpaidTransactionError.name:
        res.status(400).send(error);
        break;
      case NotEnoughStockOfPokemonError.name:
      case UnexistentPokemonError.name:
      case ValidationError.name:
        res.status(422).send(error);
        break;
      default:
        res.sendStatus(500);
    }
  };

module.exports = handle;

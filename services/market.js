const pokemonService = require('./pokemon');
const NotEnoughStockOfPokemonError = require('../errors/NotEnoughStockOfPokemonError');
const PagarmeTransactionError = require('../errors/PagarmeTransactionError');
const UnexistentPokemonError = require('../errors/UnexistentPokemonError');
const UnpaidTransactionError = require('../errors/UnpaidTransactionError');
const pagarme = require('../external/pagarme');

/**
 * Do a buy transaction
 * @param {string} name The pokemon's name that is being bought
 * @param {number} quantity The quantity that is being ordered
 * @param {Object} creditCard The credit card informations
 * @param {number} creditCard.number The credit card's number
 * @param {string} creditCard.expirationDate The expiration date of credit card in MMYY format
 * @param {string} creditCard.holderName The person's name in credit card
 * @param {string} creditCard.cvv The cvv of credit card
 */
// TODO: Lock this method by pokemon's name
// TODO: Break into functions
const buy = (name, quantity, creditCard) => pokemonService.findByName(name)
  .then((pokemon) => {
    if (!pokemon) {
      throw new UnexistentPokemonError(name);
    }

    const pokemonName = pokemon.name;
    const pokemonStock = pokemon.stock;
    if (pokemonStock < quantity) {
      throw new NotEnoughStockOfPokemonError(pokemonName, quantity, pokemonStock);
    }

    const transactionAmount = quantity * pokemon.price * 100;
    const transactionMetadata = {
      product: 'pokemon',
      name: pokemonName,
      quantity,
    };

    return pagarme.transaction(creditCard, transactionAmount, transactionMetadata)
      .then((transactionResponse) => {
        const transactionStatus = transactionResponse.status;
        if (transactionStatus === 'paid') {
          return pokemonService.removeFromStock(pokemonName, quantity);
        }

        throw new UnpaidTransactionError(transactionStatus);
      })
      .catch((err) => {
        if (err.name === 'StatusCodeError') {
          throw new PagarmeTransactionError(err);
        }

        throw err;
      });
  });

module.exports = {
  buy,
};

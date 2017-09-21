const request = require('request-promise');

/**
 * Do a transaction using pagarme API (https://docs.pagar.me/)
 * @param {Object} creditCard The credit card informations
 * @param {number} creditCard.number The credit card's number
 * @param {string} creditCard.expirationDate The expiration date of credit card in MMYY format
 * @param {string} creditCard.holderName The person's name in credit card
 * @param {string} creditCard.cvv The cvv of credit card
 * @param {number} amount The value to be charged
 * @param {Object?} metadata Additional data
 */
const transaction = (creditCard, amount, metadata) => request({
  uri: 'https://api.pagar.me/1/transactions',
  method: 'POST',
  json: {
    api_key: process.env.PAGARME_API_KEY,
    amount,
    card_number: creditCard.number,
    card_expiration_date: creditCard.expirationDate,
    card_holder_name: creditCard.holderName,
    card_cvv: creditCard.cvv,
    metadata,
  },
});

module.exports = {
  transaction,
};

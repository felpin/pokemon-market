/**
 * Represents an error that pagarme response was not 2xx when doing a transaction
 * @class PagarmeTransactionError
 * @extends {Error}
 */
class PagarmeTransactionError extends Error {
  /**
   * Creates an instance of PagarmeTransactionError.
   * @param {Object} error The pagarme error
   * @param {string} error.name The name of the pagarme error
   * @param {number} error.statusCode The status code of the response
   * @param {string} error.message The message of the error
   * @memberof PagarmeTransactionError
   */
  constructor({ name, statusCode, message }) {
    super();

    this.message = 'There was an error with the transaction request';
    this.type = PagarmeTransactionError.name;

    this.details = { name, statusCode, message };
  }
}

module.exports = PagarmeTransactionError;

class PagarmeTransactionError extends Error {
  constructor({ name, statusCode, message }) {
    super();

    this.message = 'There was an error with the transaction request';
    this.type = PagarmeTransactionError.name;

    this.details = { name, statusCode, message };
  }
}

module.exports = PagarmeTransactionError;

/**
 * Represents an error of a successfully transaction that was not paid
 * @class UnpaidTransactionError
 * @extends {Error}
 */
class UnpaidTransactionError extends Error {
  /**
   * Creates an instance of UnpaidTransactionError.
   * @param {any} status The status of the transaction
   * @memberof UnpaidTransactionError
   */
  constructor(status) {
    super();

    this.message = 'The transaction was not paid';
    this.type = UnpaidTransactionError.name;

    this.details = {
      status,
    };
  }
}

module.exports = UnpaidTransactionError;

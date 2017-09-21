class UnpaidTransactionError extends Error {
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

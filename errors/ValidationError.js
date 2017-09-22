/**
 * Represents an error of validation
 * @class ValidationError
 * @extends {Error}
 */
class ValidationError extends Error {
  /**
   * Creates an instance of ValidationError.
   * @param {object} details Details of the validation error
   * @memberof ValidationError
   */
  constructor(details) {
    super();

    this.message = 'There was an error while validating the entity';
    this.type = ValidationError.name;

    this.details = details;
  }
}

module.exports = ValidationError;

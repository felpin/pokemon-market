/**
 * Represents an error of not having enough pokemons in stock when ordered.
 * @class NotEnoughStockOfPokemonError
 * @extends {Error}
 */
class NotEnoughStockOfPokemonError extends Error {
  /**
   * Creates an instance of NotEnoughStockOfPokemonError.
   * @param {string} pokemon The name of the pokemon
   * @param {number} ordered The quantity that was ordered
   * @param {number} available The quantity available
   * @memberof NotEnoughStockOfPokemonError
   */
  constructor(pokemon, ordered, available) {
    super();

    this.message = 'There is not enough pokemon in stock';
    this.type = NotEnoughStockOfPokemonError.name;

    this.details = { pokemon, ordered, available };
  }
}

module.exports = NotEnoughStockOfPokemonError;

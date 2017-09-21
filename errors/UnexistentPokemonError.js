/**
 * Represents an error of not existing a certain pokemon.
 * @class UnexistentPokemonError
 * @extends {Error}
 */
class UnexistentPokemonError extends Error {
  /**
   * Creates an instance of UnexistentPokemonError.
   * @param {string} pokemonName The name of the inexistent pokemon
   * @memberof UnexistentPokemonError
   */
  constructor(pokemonName) {
    super();

    this.message = 'There is no such pokemon';
    this.type = UnexistentPokemonError.name;

    this.details = {
      pokemon: pokemonName,
    };
  }
}

module.exports = UnexistentPokemonError;

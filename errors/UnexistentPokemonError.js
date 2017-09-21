class UnexistentPokemonError extends Error {
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

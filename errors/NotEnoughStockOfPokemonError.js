class NotEnoughStockOfPokemonError extends Error {
  constructor(pokemon, ordered, available) {
    super();

    this.message = 'There is not enough pokemon in stock';
    this.type = NotEnoughStockOfPokemonError.name;

    this.details = { pokemon, ordered, available };
  }
}

module.exports = NotEnoughStockOfPokemonError;

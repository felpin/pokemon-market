/**
 * Creates a pokemon object using the model
 * @param {Pokemon} pokemon The pokemon to parse
 * @param {string} pokemon.name The name of the pokemon
 * @param {price} pokemon.price The price of the pokemon
 * @param {stock} pokemon.stock The stock of the pokemon
 */
const parse = ({ name, price, stock }) => {
  const pokemonParsed = {};

  if (name) {
    pokemonParsed.name = name;
  }

  if (price) {
    pokemonParsed.price = price;
  }

  if (stock) {
    pokemonParsed.stock = stock;
  }

  return pokemonParsed;
};

module.exports = parse;

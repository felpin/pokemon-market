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

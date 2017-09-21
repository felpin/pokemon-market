const parse = require('../parsers/pokemon');
const Pokemon = require('../models/Pokemon');

const findAll = () => Pokemon.findAll()
  .then(pokemons => pokemons.map(pokemon => parse(pokemon)));

const findByName = (name) => {
  const nameLowercased = name.toLowerCase();

  return Pokemon.findOne({ where: { name: nameLowercased } });
};

const findByNameAndParse = name => findByName(name)
  .then(pokemon => (pokemon ? parse(pokemon) : null));

const removeFromStock = (name, quantity) => findByName(name)
  .then(pokemon => pokemon.update({
    stock: Math.max(pokemon.stock - quantity, 0),
  }))
  .then(() => findByName(name));

const upsert = (pokemon) => {
  /*
  This is necessary because SQLite in sequelize
  does not return if the model was created or updated
  */
  const isPokemonNewPromise = findByName(pokemon.name)
    .then(pokemonFound => pokemonFound === null);

  return isPokemonNewPromise
    .then(isNew => Promise.all([isNew, Pokemon.upsert(pokemon)]))
    .then(([isNew]) => isNew);
};

module.exports = {
  findAll,
  findByName: findByNameAndParse,
  removeFromStock,
  upsert,
};

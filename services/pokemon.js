const parse = require('../parsers/pokemon');
const NotEnoughStockOfPokemonError = require('../errors/NotEnoughStockOfPokemonError');
const Pokemon = require('../models/Pokemon');

/**
 * Represents a pokemon
 * @typedef {Object} Pokemon
 * @property {string} name The name of the pokemon
 * @property {number} price The price of the pokemon
 * @property {number} stock The quantity available of the pokemon
 */

/**
 * Find all pokemons
 * @returns {Promise<Array<Pokemon>>}
 */
const findAll = () => Pokemon.findAll()
  .then(pokemons => pokemons.map(pokemon => parse(pokemon)));

/**
 * Find an specific pokemon by its name
 * @param {string} name The name of the pokemon
 * @returns {Promise<PokemonModel>} A promise to be resolved with the pokemon model in sequelize
 */
const findByName = (name) => {
  const nameLowercased = name.toLowerCase();

  return Pokemon.findOne({ where: { name: nameLowercased } });
};

/**
 * Find an specific pokemon by its name
 * @param {string} name The name of the pokemon
 * @returns {Promise<Pokemon>} A promise to be resolved with the pokemon
 */
const findByNameAndParse = name => findByName(name)
  .then(pokemon => (pokemon ? parse(pokemon) : null));

/**
 * Removes a quantity of a pokemon of its stock
 * @param {string} name The name of the pokemon
 * @param {number} quantity The quantity to remove
 * @returns {Pokemon} The pokemon information after the operation
 */
const removeFromStock = (name, quantity) => findByName(name)
  .then((pokemon) => {
    const pokemonStock = pokemon.stock;
    if (pokemonStock < quantity) {
      throw new NotEnoughStockOfPokemonError(pokemon.name, pokemonStock, quantity);
    }

    return pokemon.update({
      stock: Math.max(pokemon.stock - quantity, 0),
    });
  })
  .then(() => findByName(name));

/**
 * Creates or updates the pokemon
 * @param {Pokemon} pokemon The pokemon to upsert
 * @returns {boolean} Indicates if the pokemon was created
 */
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

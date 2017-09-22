const Joi = require('joi');
const ValidationError = require('../errors/ValidationError');
const pokemonService = require('../services/pokemon');
const { schema, schemaForName } = require('../schemas/pokemon');

const getAll = () => pokemonService.findAll();

const getByName = name => new Promise((resolve, reject) => {
  const { error, value: validName } = Joi.validate(name, schemaForName);

  if (error) {
    reject(new ValidationError(error));
  } else {
    resolve(pokemonService.findByName(validName));
  }
});

const upsert = pokemon => new Promise((resolve, reject) => {
  const { error, value: validPokemon } = Joi.validate(pokemon, schema);

  if (error) {
    reject(new ValidationError(error));
  } else {
    resolve(pokemonService.upsert(validPokemon));
  }
});

module.exports = {
  getAll,
  getByName,
  upsert,
};

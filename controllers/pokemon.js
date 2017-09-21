const Joi = require('joi');
const pokemonService = require('../services/pokemon');
const { schema, schemaForName } = require('../schemas/pokemon');

const getAll = () => pokemonService.findAll();

const getByName = (name) => {
  const { error, value: validName } = Joi.validate(name, schemaForName);

  if (error) throw error;

  return pokemonService.findByName(validName);
};

const upsert = (pokemon) => {
  const { error, value: validPokemon } = Joi.validate(pokemon, schema);

  if (error) throw error;

  return pokemonService.upsert(validPokemon);
};

module.exports = {
  getAll,
  getByName,
  upsert,
};

const Joi = require('joi');
const router = require('express').Router();

const pokemonService = require('../services/pokemon');
const { schema, schemaForName } = require('../schemas/pokemon');
const errorHandler = require('../utils/errorhandler');

router.get('/', (req, res) => {
  pokemonService.findAll()
    .then((pokemons) => {
      res.send(pokemons);
    })
    .catch(errorHandler(res));
});

router.get('/:name', (req, res) => {
  const { error, value: name } = Joi.validate(req.params.name, schemaForName);

  if (error) {
    res.status(422).send(error);
  } else {
    pokemonService.findByName(name)
      .then((pokemon) => {
        res.send(pokemon);
      })
      .catch(errorHandler(res));
  }
});

router.put('/', (req, res) => {
  const pokemonToValidate = req.body;
  const { error, value: pokemon } = Joi.validate(pokemonToValidate, schema);

  if (error) {
    res.status(422).send(error);
  } else {
    pokemonService.upsert(pokemon)
      .then((isNew) => {
        if (isNew) {
          res.location(`${req.originalUrl}/${pokemon.name}`);
        }

        res.status(isNew ? 201 : 200);
        res.send(pokemon);
      })
      .catch(errorHandler(res));
  }
});

module.exports = router;

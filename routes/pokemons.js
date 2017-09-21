const router = require('express').Router();

const pokemonController = require('../controllers/pokemon');
const errorHandler = require('../utils/errorhandler');

router.get('/', (req, res) => {
  pokemonController.getAll()
    .then(pokemons => res.send(pokemons))
    .catch(errorHandler(res));
});

router.get('/:name', (req, res) => {
  pokemonController.getByName(req.params.name)
    .then(pokemon => res.send(pokemon))
    .catch(errorHandler(res));
});

router.put('/', (req, res) => {
  const pokemon = req.body;

  // TODO: Upsert method should return if the pokemon is new and the pokemon
  pokemonController.upsert(pokemon)
    .then((isNew) => {
      if (isNew) {
        res.location(`${req.originalUrl}/${pokemon.name}`);
      }

      res.status(isNew ? 201 : 200);
      res.send(pokemon);
    })
    .catch(errorHandler(res));
});

module.exports = router;

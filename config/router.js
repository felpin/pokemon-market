const router = require('express').Router();

router.use('/market', require('../routes/market'));
router.use('/pokemons', require('../routes/pokemons'));

module.exports = router;

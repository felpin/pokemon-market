const router = require('express').Router();

const marketController = require('../controllers/market');
const errorHandler = require('../utils/errorhandler');

router.post('/buy', (req, res) => {
  marketController
    .then(pokemon => res.send(pokemon))
    .catch(errorHandler(res));
});

module.exports = router;

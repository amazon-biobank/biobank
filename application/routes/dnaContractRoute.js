var router = require('express').Router();
var DnaContractController = require('../controllers/dnaContractController')

router.get('/new/:dnaId', DnaContractController.new);
router.post('/new', DnaContractController.create);
router.get('/:dnaContract', DnaContractController.show);

module.exports = router;

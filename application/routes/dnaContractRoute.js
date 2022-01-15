var router = require('express').Router();
var DnaContractController = require('../controllers/dnaContractController')

router.get('/new/:dnaId', DnaContractController.new);
router.post('/new', DnaContractController.create);
router.get('/:dnaContract', DnaContractController.show);
router.post('/execute-contract/:dnaContract', DnaContractController.execute);
router.post('/endorse', DnaContractController.endorse);

module.exports = router;

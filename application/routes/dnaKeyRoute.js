var router = require('express').Router();
var DnaKeyController = require('./../controllers/dnaKeyController')

router.get('/:dnaId', DnaKeyController.readDnaKey);

module.exports = router;

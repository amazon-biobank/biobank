var router = require('express').Router();
var ProcessableDataController = require('./../controllers/processableDataController')

router.get('/', ProcessableDataController.index);
router.get('/:dataId', ProcessableDataController.show);
router.get('/show-data/:dataId', ProcessableDataController.showData);
router.get('/show-contract/:dnaContract', ProcessableDataController.showContract);

module.exports = router;

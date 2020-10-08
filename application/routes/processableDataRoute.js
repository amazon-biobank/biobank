var router = require('express').Router();
var ProcessableDataController = require('./../controllers/processableDataController')

router.get('/', ProcessableDataController.index);
router.get('/:dataId', ProcessableDataController.show);

module.exports = router;

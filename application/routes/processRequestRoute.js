var router = require('express').Router();
var ProcessRequestController = require('./../controllers/processRequestController')

router.get('/', ProcessRequestController.index);
router.get('/:processRequestId', ProcessRequestController.show);
router.post('/create', ProcessRequestController.create);

module.exports = router;

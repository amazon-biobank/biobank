var router = require('express').Router();
var OperationController = require('../controllers/operationController')

router.post('/create', OperationController.create);
router.get('/:operation', OperationController.show);

module.exports = router;

var router = require('express').Router();
var DataBuyController = require('../controllers/dataBuyController')

router.get('/', DataBuyController.index);

router.get('/:dataId', DataBuyController.show);
router.get('/:dataId/list-operations', DataBuyController.listOperations);

module.exports = router;

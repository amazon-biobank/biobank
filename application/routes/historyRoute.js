var router = require('express').Router();
var HistoryController = require('./../controllers/historyController')

router.get('/data', HistoryController.dataQuery);
router.post('/data', HistoryController.dataSearch);
router.get('/data/:dataId', HistoryController.dataShow);

module.exports = router;

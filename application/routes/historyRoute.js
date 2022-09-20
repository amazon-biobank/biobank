var router = require('express').Router();
var HistoryController = require('./../controllers/historyController')

router.get('/data', HistoryController.dataQuery);
router.post('/data', HistoryController.dataSearch);

router.get('/data-buy', HistoryController.dataBuyQuery);
router.post('/data-buy', HistoryController.dataBuySearch);

router.get('/data/:dataId', HistoryController.dataShow);
router.get('/data-buy/:dataId', HistoryController.dataBuyShow);

module.exports = router;

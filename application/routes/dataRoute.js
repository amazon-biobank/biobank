var router = require('express').Router();
var DataController = require('../controllers/dataController')

router.get('/', DataController.index);
router.get('/raw-data-new', DataController.newRawData);
router.get('/processed-data-new', DataController.newProcessedData);
router.post('/raw-data-create', DataController.createRawData);
router.post('/processed-data-create', DataController.createRawData);
router.get('/:dataId', DataController.show);

module.exports = router;

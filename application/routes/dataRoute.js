var router = require('express').Router();
var DataController = require('../controllers/dataController')

router.get('/', DataController.index);
router.get('/raw-data-new', DataController.newRawData);
router.get('/processed-data-new', DataController.newProcessedData);
router.get('/new',DataController.new)
router.post('/raw-data-create', DataController.createRawData);
router.post('/processed-data-create', DataController.createProcessedData);
router.get('/:dataId', DataController.show);
router.get('/:dataId/list-operations', DataController.listOperations);

module.exports = router;

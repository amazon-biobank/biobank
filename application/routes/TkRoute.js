var router = require('express').Router();
var TkController = require('../controllers/TkController')

router.get('/', TkController.index);
router.get('/tradicional-knowledge-new', TkController.newTkData) 
router.post('/tradicional-knowledge-create', TkController.createTkData) 

router.get('/:dataId', TkController.show);
router.get('/:dataId/list-operations', TkController.listOperations);


module.exports = router;

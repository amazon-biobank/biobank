var router = require('express').Router();
var ProcessorController = require('../controllers/processorController')

router.get('/', ProcessorController.index);
router.get('/new', ProcessorController.new);
router.post('/new', ProcessorController.create);
router.get('/:processor', ProcessorController.show);

module.exports = router;

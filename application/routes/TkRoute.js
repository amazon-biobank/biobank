var router = require('express').Router();
var TkController = require('../controllers/TkController')

router.get('/tradicional-knowledge-new', TkController.newTkData) 
router.post('/tradicional-knowledge-create', TkController.createTkData) 

module.exports = router;

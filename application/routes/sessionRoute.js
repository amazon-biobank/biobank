var router = require('express').Router();
var SessionController = require('../controllers/sessionController')

router.get('/new', SessionController.new);
router.post('/new', SessionController.create);
router.get('/destroy', SessionController.destroy);

module.exports = router;

var router = require('express').Router();
var HomeController = require('./../controllers/homeController')

router.get('/', HomeController.index);

module.exports = router;

var router = require('express').Router();
var LanguageController = require('../controllers/languageController')

router.get('/EN', LanguageController.backEnglish);
router.get('/PTBR', LanguageController.backPortuguese);

module.exports = router;
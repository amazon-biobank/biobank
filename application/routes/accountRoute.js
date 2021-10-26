var router = require('express').Router();
var AccountController = require('../controllers/accountController')

router.get('/show-my-account', AccountController.showMyAccount);
router.get('/transfer', AccountController.newTransfer);
router.post('/transfer', AccountController.createTransfer);
//order matters!
router.get('/:account', AccountController.show);

module.exports = router;

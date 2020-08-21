var express = require('express');
var router = express.Router();

router.use('/', require('./homeRoute'));
router.use('/data', require('./dataRoute'));
router.use('/processor', require('./processorRoute'));
router.use('/operation', require('./operationRoute'));
router.use('/history', require('./historyRoute'));

module.exports = router;

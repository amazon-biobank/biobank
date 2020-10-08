var express = require('express');
var router = express.Router();

router.use('/', require('./homeRoute'));
router.use('/data', require('./dataRoute'));
router.use('/processor', require('./processorRoute'));
router.use('/operation', require('./operationRoute'));
router.use('/history', require('./historyRoute'));
router.use('/processable-data', require('./processableDataRoute'));
router.use('/process-request', require('./processRequestRoute'));

module.exports = router;

var express = require('express');
var router = express.Router();
const InsertCertificateService = require('./../services/insertCertificateService')

router.use('/session', require('./sessionRoute'));

router.use(requireCertificate)
router.use('/', require('./homeRoute'));
router.use('/data', require('./dataRoute'));
router.use('/processor', require('./processorRoute'));
router.use('/operation', require('./operationRoute'));
router.use('/history', require('./historyRoute'));
router.use('/processable-data', require('./processableDataRoute'));
router.use('/process-request', require('./processRequestRoute'));
router.use('/account', require('./accountRoute'));
router.use('/dnaContract', require('./dnaContractRoute'));

module.exports = router;

function requireCertificate(req, res, next) {
  const insertCertificateService = new InsertCertificateService()
  if(insertCertificateService.isCertificatePresent()){
    next()
  }
  else {
    console.log("Certificate not available")
    res.redirect("/session/new")
  }
}

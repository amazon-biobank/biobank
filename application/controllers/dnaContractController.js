// const InsertCertificateService = require('./../services/insertCertificateService')
const DnaContractContract = require('../contract/dnaContractContract');
const ControllerUtil = require('./ControllerUtil.js');


exports.new = async function(req, res, next){
  res.render('dnaContract/new', { });
};

exports.create = async function(req, res, next){
  // insertCertificateService = new InsertCertificateService()
  // await insertCertificateService.insertCertificate(req)
  res.redirect("/dnaContract/" + 123)
};

exports.show = async function(req, res, next){
  const dnaContractContract = new DnaContractContract();
  console.log(req.params.dnacontract)
  const dnaContract = await dnaContractContract.readDnaContract(req.params.dnaContract)

  dnaContract.created_at = ControllerUtil.formatDate(new Date(dnaContract.created_at))
  res.render("dnaContract/show", {dnaContract})
};




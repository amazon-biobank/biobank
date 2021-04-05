// const InsertCertificateService = require('./../services/insertCertificateService')
const DnaContractContract = require('../contract/dnaContractContract');
const ControllerUtil = require('./ControllerUtil.js');


exports.new = async function(req, res, next){
  const dnaId = req.params.dnaId
  res.render('dnaContract/new', {dnaId });
};

exports.create = async function(req, res, next){
  let dnaContract = createDnaContractFromRequest(req);

  const dnaContractContract = new DnaContractContract();
  await dnaContractContract.createDnaContract(dnaContract)
  res.redirect("/dnaContract/" + dnaContract.id)
};

exports.show = async function(req, res, next){
  const dnaContractContract = new DnaContractContract();
  console.log(req.params.dnacontract)
  const dnaContract = await dnaContractContract.readDnaContract(req.params.dnaContract)

  dnaContract.created_at = ControllerUtil.formatDate(new Date(dnaContract.created_at))
  res.render("dnaContract/show", {dnaContract})
};



function createDnaContractFromRequest(req){
  return {
    dnaId: req.body.dnaId,
    parameters: { price: req.body.price},
    id: ControllerUtil.getHash(req.body.dnaId),
    created_at: new Date().toDateString()
  }
}
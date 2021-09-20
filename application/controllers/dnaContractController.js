const DnaContractContract = require('../contract/dnaContractContract');
const BiocoinContract = require('../contract/biocoinContract');
const ControllerUtil = require('./ControllerUtil.js');
const { v4: uuidv4 } = require('uuid');

exports.new = async function(req, res, next){
  const dnaId = req.params.dnaId
  res.render('dnaContract/new', {dnaId });
};

exports.create = async function(req, res, next){
  let dnaContract = createDnaContractFromRequest(req);
  console.log(dnaContract)

  const dnaContractContract = new DnaContractContract();
  await dnaContractContract.createDnaContract(dnaContract)
  res.redirect("/dnaContract/" + dnaContract.id)
};

exports.show = async function(req, res, next){
  const dnaContractContract = new DnaContractContract();
  const dnaContract = await dnaContractContract.readDnaContract(req.params.dnaContract)

  dnaContract.created_at = ControllerUtil.formatDate(new Date(dnaContract.created_at))
  dnaContract.raw_data_price = ControllerUtil.formatMoney(dnaContract.raw_data_price)
  res.render("dnaContract/show", { dnaContract })
};

exports.execute = async function(req, res, next){
  const options = {
    type: req.body.type, 
    operationId: ControllerUtil.generateId() 
  }
  const dnaContractId = req.params.dnaContract

  const dnaContractContract = new DnaContractContract();
  const biocoinContract = new BiocoinContract();
  
  const operation = await dnaContractContract.executeContract(dnaContractId, options)
  await biocoinContract.transferOperationBiocoins(operation.id)
  await dnaContractContract.executeOperation(operation.id)

  res.redirect("/operation/" + operation.id)
};



function createDnaContractFromRequest(req){
  payment_distribution = parsePaymentDistributionPercentage(req.body.payment_distribution)
  raw_data_price = req.body.raw_data_price*1e9  // converting biocoins to Sys

  return {
    id: ControllerUtil.getHash(req.body.dnaId),
    dna_id: req.body.dnaId,
    raw_data_price,
    payment_distribution: req.body.payment_distribution,
    royalty_payments: req.body.royalty_payments,
    created_at: new Date().toDateString()
  }
}

function parsePaymentDistributionPercentage(payment_distribution){
  Object.keys(payment_distribution).forEach(function(key) {
    payment_distribution[key] = ControllerUtil.parsePercentage(payment_distribution[key])
  })
  return payment_distribution
}

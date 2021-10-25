const DnaContractContract = require('../contract/dnaContractContract');
const DataContract = require('../contract/dataContract');
const BiocoinContract = require('../contract/biocoinContract');
const ControllerUtil = require('./ControllerUtil.js');
const { v4: uuidv4 } = require('uuid');
const CONFIG = require('../config.json');

exports.new = async function(req, res, next){
  const dnaId = req.params.dnaId
  const contractParameters = CONFIG.dnaContract
  res.render('dnaContract/new', { dnaId, contractParameters });
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
  dnaContract.processed_data_price = ControllerUtil.formatMoney(dnaContract.processed_data_price)
  dnaContract.royalty_payments = dnaContract.royalty_payments.map((payment) => {
    payment.type = ControllerUtil.formatRoyaltyPaymentType(payment.type)
    return payment
  })
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

exports.endorse = async function(req, res, next) {
  const dnaContractContract = new DnaContractContract();
  const dataContract = new DataContract()

  // const dnaContract = await dnaContractContract.endorseProcessRequestToRawData(req.body.process_request_id)
  // await dataContract.addDnaContractInId(dnaContract.accepted_processed_data.processed_data_id, dnaContract.id)
  const dnaContract = {id: "92a110ef73aca7d4e23b8e26322981c9e94677a3e16a8f42a36a368d8569d9c5"}

  res.redirect("/dnaContract/" + dnaContract.id)
}



function createDnaContractFromRequest(req){
  payment_distribution = parsePaymentDistributionPercentage(req.body.payment_distribution)
  raw_data_price = req.body.raw_data_price*1e9  // converting biocoins to Sys
  processed_data_price = req.body.processed_data_price*1e9  // converting biocoins to Sys

  return {
    id: ControllerUtil.getHash(req.body.dnaId),
    dna_id: req.body.dnaId,
    raw_data_price,
    processed_data_price,
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

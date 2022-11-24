const DnaContractContract = require('../contract/dnaContractContract');
const DataContract = require('../contract/dataContract');
const BiocoinContract = require('../contract/biocoinContract');
const ControllerUtil = require('./ControllerUtil.js');
const DnaContractService = require('./../services/dnaContractService')
const CONFIG = require('../config.json');

exports.new = async function(req, res, next){
  const dnaId = req.params.dnaId
  const contractParameters = CONFIG.dnaContract

  res.render('dnaContract/new', { dnaId, contractParameters });
};

exports.create = async function(req, res, next){
  try{
    const dnaContract = await DnaContractService.createDnaContract(req)
    req.flash('success', "DNA Contract was created with sucess")
    res.redirect("/dnaContract/" + dnaContract.id)
  } catch(error) {
    req.flash('error', ControllerUtil.getMessageFromError(error))
    res.redirect("back")
    return
  }
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
  res.render("dnaContract/show", { dnaContract, flash: req.flash() })
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

  req.flash('success', "DNA was bought with sucess")
  res.redirect("/operation/" + operation.id)
};

exports.endorse = async function(req, res, next) {
  const dnaContractContract = new DnaContractContract();
  const dataContract = new DataContract()
  let dnaContract

  try{
    dnaContract = await dnaContractContract.endorseProcessRequestToRawData(req.body.process_request_id)
    await dataContract.addDnaContractInId(dnaContract.accepted_processed_data.processed_data_id, dnaContract.id)
  } catch(e){
    req.flash('error', JSON.stringify(e.responses[0].response.message))
    res.redirect('back')
    return
  }

  req.flash('success', 'DNA Endorsement has succeeded');
  res.redirect("/dnaContract/" + dnaContract.id)
}




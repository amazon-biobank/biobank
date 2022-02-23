
const ControllerUtil = require('../controllers/ControllerUtil');
const DnaContractContract = require('../contract/dnaContractContract');

class DnaContractService {
  static async createDnaContract(req){
    let dnaContract = createDnaContractFromRequest(req);
    const dnaContractContract = new DnaContractContract();
    await dnaContractContract.createDnaContract(dnaContract)
    return dnaContract
  }
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





module.exports = DnaContractService;

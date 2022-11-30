const ControllerUtil = require('./ControllerUtil.js');
const ConnectService = require('./../services/connectService.js');
const BiocoinContract = require('../contract/biocoinContract.js');

exports.show = async function(req, res, next){
  res.render('account/show', { });
};

exports.showMyAccount = async function(req, res, next){
  const connectService = new ConnectService()
  const myAddress = await connectService.getMyAddress()
  res.redirect('/account/'+ myAddress)
};

exports.newTransfer = async function (req, res, next){
  res.render('account/new-transfer', { })
}

exports.createTransfer = async function (req, res, next){

  const transferData ={senderAddress: req.body.senderAddress, receiverAddress: req.body.receiverAddress, amount: req.body.amount}
  const biocoinContract = new BiocoinContract();
try {
    await biocoinContract.transferBiocoins(transferData.senderAddress, transferData.receiverAddress, (transferData.amount)*1e9)
 } catch (e){
  let message = ControllerUtil.getMessageFromError(e)
    res.render('account/transfer/transfer-error', {message} )
    return
  }
  res.render('account/transfer/transfer-sucess', {transferData} )
}


